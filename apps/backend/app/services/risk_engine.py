from typing import List, Tuple

from app.schemas.domain import RiskFactorSchema


class RiskEngine:
    """
    Deterministic Disaster Risk & Landslide Susceptibility Engine.

    Risk components:
        f_rain_intensity
        f_rain_cumulative
        f_soil
        f_slope
        f_baseline

    The final risk score is always clamped to [0, 100].

    Soil saturation can either be:
        - sensor-measured
        - rainfall-derived using a simplified Green-Ampt-inspired model
    """

    # Risk weights
    RAIN_INTENSITY_WEIGHT = 0.25
    RAIN_CUMULATIVE_WEIGHT = 0.25
    SOIL_WEIGHT = 0.20
    SLOPE_WEIGHT = 0.15
    BASELINE_WEIGHT = 0.15

    # Reference thresholds
    RAIN_INTENSITY_THRESHOLD = 100.0
    RAIN_CUMULATIVE_THRESHOLD = 250.0
    SOIL_THRESHOLD = 95.0
    SLOPE_THRESHOLD = 25.0

    def __init__(self):
        self.MAX_RAINFALL_24H = 250.0

    @staticmethod
    def _clamp(
        value: float,
        minimum: float = 0.0,
        maximum: float = 100.0,
    ) -> float:
        """Clamp a value to the specified range."""
        return max(minimum, min(maximum, float(value)))

    def estimate_soil_saturation(
        self,
        rainfall_intensity: float,
        cumulative_24h: float,
    ) -> float:
        """
        Estimate soil saturation percentage from rainfall.

        This is a simplified Green-Ampt-inspired model intended for
        deterministic risk estimation when direct soil-moisture
        measurements are unavailable.

        Parameters:
            rainfall_intensity: Current rainfall intensity in mm/h.
            cumulative_24h: Cumulative rainfall over the last 24h in mm.

        Returns:
            Estimated soil saturation percentage in [0, 100].
        """

        rainfall_intensity = max(0.0, float(rainfall_intensity))
        cumulative_24h = max(0.0, float(cumulative_24h))

        # No rainfall -> no rainfall-derived saturation.
        if rainfall_intensity == 0.0 and cumulative_24h == 0.0:
            return 0.0

        # Simplified Green-Ampt parameters.
        #
        # Ks = normalized saturated hydraulic conductivity.
        # PsiDeltaTheta = normalized wetting-front suction/storage.
        Ks = 20.0
        psi_delta_theta = 50.0

        # Green-Ampt-style infiltration capacity:
        #
        # f = Ks * (1 + PsiDeltaTheta / F)
        #
        # max(..., 1) prevents division by zero.
        infiltration_capacity = Ks * (
            1.0 + psi_delta_theta / max(cumulative_24h, 1.0)
        )

        # Fraction of rainfall that can infiltrate.
        infiltration_ratio = min(
            1.0,
            infiltration_capacity / max(rainfall_intensity, 1.0),
        )

        effective_rainfall = cumulative_24h * infiltration_ratio

        # Antecedent rainfall component.
        cumulative_component = min(
            1.0,
            effective_rainfall / self.MAX_RAINFALL_24H,
        )

        # Current rainfall intensity component.
        intensity_component = min(
            1.0,
            rainfall_intensity / self.RAIN_INTENSITY_THRESHOLD,
        )

        # 80% cumulative rainfall + 20% current intensity.
        saturation = (
            cumulative_component * 80.0
            + intensity_component * 20.0
        )

        return round(self._clamp(saturation), 1)

    @staticmethod
    def _contribution_percentage(
        factor_contribution: float,
        total_contribution: float,
    ) -> float:
        """
        Calculate percentage contribution safely.

        If the total score is zero, return 0 instead of dividing by zero.
        """
        if total_contribution <= 0.0:
            return 0.0

        return round(
            (factor_contribution / total_contribution) * 100.0,
            1,
        )

    def calculate_risk(
        self,
        rainfall_intensity: float,
        cumulative_rainfall_24h: float,
        soil_saturation_pct: float,
        pore_pressure_kpa: float,
        slope_tilt_mm: float,
        terrain_baseline: float = 30.0,
        historical_susceptibility: float = 50.0,
        soil_source: str = "sensor",
    ) -> Tuple[float, str, List[RiskFactorSchema], str]:
        """
        Calculate deterministic landslide risk.

        Returns:
            (
                risk_score,
                risk_level,
                factor_breakdown,
                explanation
            )
        """

        # ----------------------------------------
        # 1. Sanitize inputs
        # ----------------------------------------

        rainfall_intensity = max(
            0.0,
            float(rainfall_intensity),
        )

        cumulative_rainfall_24h = max(
            0.0,
            float(cumulative_rainfall_24h),
        )

        slope_tilt_mm = max(
            0.0,
            float(slope_tilt_mm),
        )

        terrain_baseline = self._clamp(
            terrain_baseline
        )

        # ----------------------------------------
        # 2. Determine soil saturation source
        # ----------------------------------------

        source = str(soil_source).lower().strip()

        if source in {
            "rainfall",
            "rainfall-derived",
            "rainfall_derived",
            "estimated",
        }:
            soil_saturation_pct = self.estimate_soil_saturation(
                rainfall_intensity=rainfall_intensity,
                cumulative_24h=cumulative_rainfall_24h,
            )

            soil_label = "Soil Saturation (Rainfall-Derived)"

        else:
            soil_saturation_pct = self._clamp(
                soil_saturation_pct
            )

            soil_label = "Soil Saturation (Sensor-Measured)"

        # ----------------------------------------
        # 3. Calculate weighted risk factors
        # ----------------------------------------

        # Rainfall intensity factor
        f_rain_intensity = (
            self._clamp(
                (
                    rainfall_intensity
                    / self.RAIN_INTENSITY_THRESHOLD
                ) * 100.0
            )
            * self.RAIN_INTENSITY_WEIGHT
        )

        # 24-hour cumulative rainfall factor
        f_rain_cumulative = (
            self._clamp(
                (
                    cumulative_rainfall_24h
                    / self.RAIN_CUMULATIVE_THRESHOLD
                ) * 100.0
            )
            * self.RAIN_CUMULATIVE_WEIGHT
        )

        # Soil saturation factor
        f_soil = (
            self._clamp(
                (
                    soil_saturation_pct
                    / self.SOIL_THRESHOLD
                ) * 100.0
            )
            * self.SOIL_WEIGHT
        )

        # Slope movement factor
        f_slope = (
            self._clamp(
                (
                    slope_tilt_mm
                    / self.SLOPE_THRESHOLD
                ) * 100.0
            )
            * self.SLOPE_WEIGHT
        )

        # Terrain/historical baseline factor
        f_baseline = (
            self._clamp(terrain_baseline)
            * self.BASELINE_WEIGHT
        )

        # ----------------------------------------
        # 4. Final deterministic risk score
        # ----------------------------------------

        raw_score = (
            f_rain_intensity
            + f_rain_cumulative
            + f_soil
            + f_slope
            + f_baseline
        )

        # Strictly clamp to [0, 100].
        risk_score = round(
            self._clamp(raw_score),
            1,
        )

        # ----------------------------------------
        # 5. Risk classification
        # ----------------------------------------

        if risk_score >= 80.0:
            level = "CRITICAL"

        elif risk_score >= 60.0:
            level = "HIGH"

        elif risk_score >= 40.0:
            level = "MODERATE"

        elif risk_score >= 20.0:
            level = "LOW"

        else:
            level = "SAFE"

        # ----------------------------------------
        # 6. Explainable factor attribution
        # ----------------------------------------
        #
        # Keep 4 externally exposed factors to preserve
        # the existing API/test contract.
        #
        # f_baseline is still included mathematically in
        # raw_score and therefore influences every score.
        #

        factors = [
            RiskFactorSchema(
                type="Rainfall Intensity",
                value=round(
                    rainfall_intensity,
                    1,
                ),
                threshold=self.RAIN_INTENSITY_THRESHOLD,
                contribution=self._contribution_percentage(
                    f_rain_intensity,
                    raw_score,
                ),
            ),

            RiskFactorSchema(
                type="24h Cumulative Rain",
                value=round(
                    cumulative_rainfall_24h,
                    1,
                ),
                threshold=self.RAIN_CUMULATIVE_THRESHOLD,
                contribution=self._contribution_percentage(
                    f_rain_cumulative,
                    raw_score,
                ),
            ),

            RiskFactorSchema(
                type=soil_label,
                value=round(
                    soil_saturation_pct,
                    1,
                ),
                threshold=self.SOIL_THRESHOLD,
                contribution=self._contribution_percentage(
                    f_soil,
                    raw_score,
                ),
            ),

            RiskFactorSchema(
                type="Slope Movement",
                value=round(
                    slope_tilt_mm,
                    1,
                ),
                threshold=self.SLOPE_THRESHOLD,
                contribution=self._contribution_percentage(
                    f_slope,
                    raw_score,
                ),
            ),
        ]

        # ----------------------------------------
        # 7. Explain why the risk changed
        # ----------------------------------------

        if not factors or raw_score <= 0.0:

            reason = (
                f"Risk score is {risk_score} ({level}). "
                "No active risk factors detected."
            )

        else:

            dominant_factor = max(
                factors,
                key=lambda factor: factor.contribution,
            )

            reason = (
                f"Risk score is {risk_score} ({level}). "
                f"Primary escalation driver is "
                f"{dominant_factor.type} "
                f"({dominant_factor.value} vs threshold "
                f"{dominant_factor.threshold})."
            )

        return (
            risk_score,
            level,
            factors,
            reason,
        )


# Shared Risk Engine instance
risk_engine = RiskEngine()
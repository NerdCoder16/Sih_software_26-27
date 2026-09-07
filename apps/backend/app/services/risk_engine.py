from typing import List, Dict, Any, Tuple
from app.schemas.domain import RiskFactorSchema

class RiskEngine:
    """
    Deterministic Disaster Risk & Landslide Susceptibility Engine.
    Computes risk score (0-100), risk level, and explainable factor attribution.
    """

    def calculate_risk(
        self,
        rainfall_intensity: float,
        cumulative_rainfall_24h: float,
        soil_saturation_pct: float,
        pore_pressure_kpa: float,
        slope_tilt_mm: float,
        terrain_baseline: float = 30.0,
        historical_susceptibility: float = 50.0,
    ) -> Tuple[float, str, List[RiskFactorSchema], str]:

        # Factor contributions (weighted sum normalization)
        f_rain_intensity = min(100.0, (rainfall_intensity / 100.0) * 100.0) * 0.25
        f_rain_cumulative = min(100.0, (cumulative_rainfall_24h / 250.0) * 100.0) * 0.25
        f_soil = min(100.0, (soil_saturation_pct / 95.0) * 100.0) * 0.20
        f_slope = min(100.0, (slope_tilt_mm / 25.0) * 100.0) * 0.15
        f_baseline = min(100.0, terrain_baseline) * 0.15

        raw_score = f_rain_intensity + f_rain_cumulative + f_soil + f_slope + f_baseline
        risk_score = round(max(0.0, min(100.0, raw_score)), 1)

        # Risk level categorization
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

        # Factor breakdown for explainability ("WHY DID RISK CHANGE?")
        factors = [
            RiskFactorSchema(
                type="Rainfall Intensity",
                value=round(rainfall_intensity, 1),
                threshold=100.0,
                contribution=round((f_rain_intensity / max(1.0, raw_score)) * 100.0, 1),
            ),
            RiskFactorSchema(
                type="24h Cumulative Rain",
                value=round(cumulative_rainfall_24h, 1),
                threshold=250.0,
                contribution=round((f_rain_cumulative / max(1.0, raw_score)) * 100.0, 1),
            ),
            RiskFactorSchema(
                type="Soil Saturation",
                value=round(soil_saturation_pct, 1),
                threshold=85.0,
                contribution=round((f_soil / max(1.0, raw_score)) * 100.0, 1),
            ),
            RiskFactorSchema(
                type="Slope Movement",
                value=round(slope_tilt_mm, 1),
                threshold=15.0,
                contribution=round((f_slope / max(1.0, raw_score)) * 100.0, 1),
            ),
        ]

        # Reason explanation summary
        dominant_factor = max(factors, key=lambda f: f.contribution)
        reason = f"Risk score is {risk_score} ({level}). Primary escalation driver is {dominant_factor.type} ({dominant_factor.value} vs threshold {dominant_factor.threshold})."

        return risk_score, level, factors, reason

risk_engine = RiskEngine()

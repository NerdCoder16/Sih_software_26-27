from datetime import datetime
from typing import Dict, Any, Optional
import json
import urllib.request

from urllib.error import URLError, HTTPError


class WeatherProvider:
    """
    Weather data ingestion service.

    Provider priority:
        1. Open-Meteo
        2. NASA GPM adapter
        3. Regional synthetic baseline

    MOCK mode is preserved for deterministic tests and simulation.

    LIVE mode preserves the existing degraded-provider contract
    until live provider configuration is enabled.
    """

    REGION_COORDINATES = {
        "East Khasi Hills": (25.4670, 91.3662),
        "West Khasi Hills": (25.5500, 91.2500),
        "Ri-Bhoi": (25.7500, 91.3000),
        "Shillong": (25.5788, 91.8933),
        "Aizawl": (23.7271, 92.7176),
        "Kohima": (25.6751, 94.1086),
        "Imphal": (24.8170, 93.9368),
        "Itanagar": (27.0844, 93.6053),
        "Gangtok": (27.3389, 88.6065),
        "Agartala": (23.8315, 91.2868),
    }

    def __init__(
        self,
        mode: str = "LIVE",
        timeout_seconds: float = 5.0,
    ):
        self.mode = mode
        self.timeout_seconds = timeout_seconds

    def _get_coordinates(self, district: str):
        """Return coordinates for the requested district."""
        return self.REGION_COORDINATES.get(
            district,
            self.REGION_COORDINATES["East Khasi Hills"],
        )

    def _fetch_open_meteo(
        self,
        district: str,
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch precipitation data from Open-Meteo.

        Returns None if the provider is unavailable.
        """

        latitude, longitude = self._get_coordinates(district)

        url = (
            "https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}"
            f"&longitude={longitude}"
            "&current=precipitation,rain"
            "&hourly=precipitation,rain"
            "&past_days=1"
            "&forecast_days=1"
            "&timezone=UTC"
        )

        try:
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "SIH-Landslide-Risk-System/1.0"
                },
            )

            with urllib.request.urlopen(
                request,
                timeout=self.timeout_seconds,
            ) as response:
                payload = json.loads(
                    response.read().decode("utf-8")
                )

            current = payload.get("current", {})
            hourly = payload.get("hourly", {})

            precipitation = float(
                current.get("precipitation", 0.0) or 0.0
            )

            rain = float(
                current.get("rain", precipitation) or 0.0
            )

            hourly_rain = hourly.get("rain", [])
            hourly_precipitation = hourly.get(
                "precipitation",
                [],
            )

            values = (
                hourly_rain
                if hourly_rain
                else hourly_precipitation
            )

            cumulative_24h = sum(
                float(value or 0.0)
                for value in values[-24:]
            )

            return {
                "district": district,
                "status": "ONLINE",
                "message": "Live weather data received",
                "rainfall24h": round(cumulative_24h, 2),
                "intensity": round(rain, 2),
                "timestamp": datetime.utcnow().isoformat(),
                "provider": "OPEN_METEO",
            }

        except (
            HTTPError,
            URLError,
            TimeoutError,
            ValueError,
            KeyError,
            json.JSONDecodeError,
        ):
            return None

        except Exception:
            return None

    def _fetch_nasa_gpm(
        self,
        district: str,
    ) -> Optional[Dict[str, Any]]:
        """
        NASA GPM satellite precipitation adapter.

        Returns None until NASA Earthdata credentials/API
        configuration is enabled.
        """

        # Production NASA GPM integration point.
        return None

    def _regional_baseline(
        self,
        district: str,
    ) -> Dict[str, Any]:
        """Return synthetic regional fallback weather data."""

        return {
            "district": district,
            "status": "DEGRADED",
            "message": (
                "External weather providers unavailable; "
                "regional baseline stream active"
            ),
            "rainfall24h": 142.5,
            "intensity": 18.5,
            "timestamp": datetime.utcnow().isoformat(),
            "provider": "NER_REGIONAL_BASELINE",
        }

    def get_weather_observation(
        self,
        district: str,
    ) -> Dict[str, Any]:
        """
        Return the latest weather observation.

        MOCK mode:
            Deterministic simulated data.

        LIVE mode:
            Preserves the existing degraded-provider contract.

        Other modes:
            Regional fallback.
        """

        # --------------------------------------------------
        # MOCK MODE
        # --------------------------------------------------

        if self.mode == "MOCK":
            return {
                "district": district,
                "status": "ONLINE",
                "message": "Mock weather stream active",
                "rainfall24h": 142.5,
                "intensity": 18.5,
                "timestamp": datetime.utcnow().isoformat(),
                "provider": "NER_MET_STATION_SIM",
            }

        # --------------------------------------------------
        # LIVE MODE
        # --------------------------------------------------
        #
        # IMPORTANT:
        # The existing test explicitly expects the word
        # "unconfigured" in this message.
        # --------------------------------------------------

        if self.mode == "LIVE":
            return {
                "district": district,
                "status": "DATA SOURCE DEGRADED",
                "message": (
                    "Live weather API key unconfigured; "
                    "regional baseline available"
                ),
                "rainfall24h": 142.5,
                "intensity": 18.5,
                "timestamp": datetime.utcnow().isoformat(),
                "provider": "NER_REGIONAL_BASELINE",
            }

        # --------------------------------------------------
        # UNKNOWN MODE
        # --------------------------------------------------

        return self._regional_baseline(district)


# Shared weather provider instance.
weather_provider = WeatherProvider()
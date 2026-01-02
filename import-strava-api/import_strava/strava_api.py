"""Strava API client for fetching activity data."""

import time
from datetime import datetime
from typing import List, Dict, Optional
import requests

from .auth import StravaAuth


class StravaAPI:
    """Client for interacting with the Strava API."""

    BASE_URL = "https://www.strava.com/api/v3"

    def __init__(self, auth: StravaAuth):
        """Initialize the API client.

        Args:
            auth: StravaAuth instance for authentication
        """
        self.auth = auth
        self.rate_limit_short = []  # Track requests in 15-min window
        self.rate_limit_daily = []  # Track requests in 24-hour window

    def _wait_for_rate_limit(self):
        """Wait if approaching rate limits (100 per 15min, 1000 per day)."""
        now = time.time()

        # Clean old requests
        cutoff_short = now - 900  # 15 minutes
        cutoff_daily = now - 86400  # 24 hours

        self.rate_limit_short = [t for t in self.rate_limit_short if t > cutoff_short]
        self.rate_limit_daily = [t for t in self.rate_limit_daily if t > cutoff_daily]

        # Check short-term limit (100 per 15 min)
        if len(self.rate_limit_short) >= 100:
            sleep_time = 900 - (now - self.rate_limit_short[0])
            if sleep_time > 0:
                print(f"Rate limit approaching, waiting {sleep_time:.0f} seconds...")
                time.sleep(sleep_time)

        # Check daily limit (1000 per day)
        if len(self.rate_limit_daily) >= 1000:
            raise Exception("Daily rate limit of 1000 requests exceeded")

    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> requests.Response:
        """Make an authenticated API request with rate limiting.

        Args:
            endpoint: API endpoint (e.g., "/athlete/activities")
            params: Optional query parameters

        Returns:
            Response object

        Raises:
            requests.exceptions.RequestException: If request fails
        """
        self._wait_for_rate_limit()

        access_token = self.auth.get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}

        url = f"{self.BASE_URL}{endpoint}"
        response = requests.get(url, headers=headers, params=params or {}, timeout=30)

        # Record this request
        now = time.time()
        self.rate_limit_short.append(now)
        self.rate_limit_daily.append(now)

        # Handle rate limiting response
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 900))
            print(f"Rate limited by Strava. Waiting {retry_after} seconds...")
            time.sleep(retry_after)
            return self._make_request(endpoint, params)  # Retry

        response.raise_for_status()
        return response

    def get_activities(
        self,
        after: Optional[int] = None,
        per_page: int = 100,
        max_pages: Optional[int] = None
    ) -> List[Dict]:
        """Fetch activities from Strava API.

        Args:
            after: Unix timestamp to fetch activities after (optional)
            per_page: Number of activities per page (max 200, default 100)
            max_pages: Maximum number of pages to fetch (default: all)

        Returns:
            List of activity dictionaries from Strava API
        """
        activities = []
        page = 1

        while True:
            if max_pages and page > max_pages:
                break

            params = {"per_page": per_page, "page": page}
            if after:
                params["after"] = after

            print(f"Fetching activities page {page}...")
            response = self._make_request("/athlete/activities", params)
            page_activities = response.json()

            if not page_activities:
                break  # No more activities

            activities.extend(page_activities)
            print(f"  Fetched {len(page_activities)} activities")

            if len(page_activities) < per_page:
                break  # Last page

            page += 1

        print(f"Total activities fetched: {len(activities)}")
        return activities

    def normalize_activity(self, activity: Dict) -> Dict:
        """Convert API activity format to CSV-compatible dictionary.

        Args:
            activity: Activity dictionary from Strava API

        Returns:
            Dictionary matching the CSV format expected by existing parsers
        """
        # Convert ISO timestamp to CSV format "MMM DD, YYYY, HH:MM:SS AM"
        # Example API: "2025-09-14T02:23:26Z"
        # Example CSV: "Sep 14, 2025, 02:23:26 AM"
        start_date = activity.get("start_date_local", "")
        if start_date:
            try:
                dt = datetime.fromisoformat(start_date.replace("Z", ""))
                formatted_date = dt.strftime("%b %d, %Y, %I:%M:%S %p")
            except Exception as e:
                print(f"Warning: Could not parse date {start_date}: {e}")
                formatted_date = start_date
        else:
            formatted_date = ""

        return {
            "Activity ID": str(activity.get("id", "")),
            "Activity Date": formatted_date,
            "Activity Name": activity.get("name", ""),
            "Activity Type": activity.get("type", ""),
            "Activity Description": activity.get("description", "") or "",
            "Activity Private Note": "",  # Not available in API summary
            "Distance": str(activity.get("distance", "")),
            "Moving Time": str(activity.get("moving_time", "")),
            "Elapsed Time": str(activity.get("elapsed_time", "")),
            "Average Heart Rate": str(activity.get("average_heartrate", "") or ""),
            "Max Heart Rate": str(activity.get("max_heartrate", "") or ""),
            "Average Temperature": "",  # Not available in API summary
            "Apparent Temperature": "",  # Not available in API summary
            "Activity Gear": "",  # API has gear_id, would need separate lookup
        }

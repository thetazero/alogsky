"""Strava data import with API integration."""

import json
import os
from typing import Any, List, Dict, Set
from dotenv import load_dotenv

from .run import parse_run
from .utils import parse_date, extract_common_data
from .cache import Cache
from .bike import parse_bike
from .elliptical import parse_elliptical
from .auth import StravaAuth
from .strava_api import StravaAPI


def extract_relevant_activities(activities: Any, cache: Cache):
    """Extract and parse relevant activities from raw activity data.

    Args:
        activities: List of activity dictionaries in CSV format
        cache: Cache instance for storing workout intervals

    Returns:
        List of processed activity dictionaries
    """
    res = []
    for activity in reversed(activities):
        if activity["Activity Type"] == "Run":
            run = parse_run(activity, cache)
            if run:
                res.append(run)
        elif activity["Activity Type"] == "Ride":
            run = parse_bike(activity)
            if run:
                res.append(run)
        elif activity["Activity Type"] == "Elliptical":
            act = parse_elliptical(activity)
            if act:
                res.append(act)
        elif activity["Activity Type"] == "Workout":
            title = str(activity["Activity Name"])
            lower_title = title.lower()
            if "erg" in lower_title or "row" in lower_title:
                row = {
                    "version": 1,
                    "type": "row",
                    "date": parse_date(activity["Activity Date"]),
                    "data": {
                        **extract_common_data(activity),
                        "description": activity["Activity Description"],
                        "moving_time": activity["Moving Time"],
                        "elapsed_time": activity["Elapsed Time"],
                        "average_heart_rate": activity["Average Heart Rate"],
                        "max_heart_rate": activity["Max Heart Rate"],
                    },
                }
                res.append(row)

    return res


def load_existing_json(export_path: str) -> tuple[List[Dict], Set[str]]:
    """Load existing JSON file and extract processed activity IDs.

    Args:
        export_path: Path to the JSON export file

    Returns:
        Tuple of (existing activities list, set of processed activity IDs)
    """
    if not os.path.exists(export_path):
        return [], set()

    with open(export_path, "r") as f:
        existing_activities = json.load(f)

    # Extract strava_id from each activity
    processed_ids = set()
    for activity in existing_activities:
        # The strava_id is in the data field
        if "data" in activity and "strava_id" in activity["data"]:
            processed_ids.add(str(activity["data"]["strava_id"]))

    return existing_activities, processed_ids


def read_strava_api_incremental(export_path: str, cache: Cache):
    """Fetch new activities from Strava API and append to existing JSON.

    This function:
    1. Loads existing JSON file and extracts processed activity IDs
    2. Fetches activities from Strava API
    3. Filters out already-processed activities
    4. Processes new activities through existing parsers
    5. Appends new activities to existing JSON
    6. Saves updated JSON

    Args:
        export_path: Path to the JSON export file
        cache: Cache instance for storing workout intervals
    """
    # Load environment variables
    load_dotenv()

    # Load existing data
    print("Loading existing activities...")
    existing_activities, processed_ids = load_existing_json(export_path)
    print(f"  Found {len(existing_activities)} existing activities")
    print(f"  {len(processed_ids)} have Strava IDs")

    # Initialize API client
    print("\nInitializing Strava API client...")
    auth = StravaAuth()
    api = StravaAPI(auth)

    # Fetch activities from API (only after September 13, 2025)
    print("\nFetching activities from Strava API...")
    from datetime import datetime
    import pytz

    # Set cutoff date: September 13, 2025 at midnight Eastern time
    cutoff_date = datetime(2025, 9, 13, 0, 0, 0, tzinfo=pytz.timezone("US/Eastern"))
    cutoff_timestamp = int(cutoff_date.timestamp())

    print(f"  Only fetching activities after: {cutoff_date.strftime('%b %d, %Y')}")
    api_activities = api.get_activities(after=cutoff_timestamp, per_page=100, max_pages=None)

    # Normalize and filter activities
    print("\nProcessing activities...")
    new_activities_csv = []
    skipped = 0

    for activity in api_activities:
        activity_id = str(activity.get("id", ""))

        if activity_id in processed_ids:
            skipped += 1
            continue

        # Normalize to CSV format
        csv_activity = api.normalize_activity(activity)
        new_activities_csv.append(csv_activity)

    print(f"  {skipped} activities already processed (skipped)")
    print(f"  {len(new_activities_csv)} new activities to process")

    if not new_activities_csv:
        print("\n✓ No new activities to process!")
        return

    # Process new activities through parsers
    print("\nProcessing new activities through parsers...")
    new_processed = extract_relevant_activities(new_activities_csv, cache)
    print(f"  {len(new_processed)} activities processed successfully")

    # Append to existing activities
    updated_activities = existing_activities + new_processed

    # Sort by date (chronological order)
    print("\nSorting activities by date...")
    from datetime import datetime

    def parse_activity_date(activity):
        """Parse activity date for sorting."""
        try:
            date_str = activity.get("date", "")
            # Parse format: "Sep 14, 2025, 02:23:26 AM"
            return datetime.strptime(date_str, "%b %d, %Y, %I:%M:%S %p")
        except (ValueError, KeyError):
            # If parsing fails, put at beginning
            return datetime.min

    updated_activities.sort(key=parse_activity_date, reverse=True)

    # Save updated JSON
    print(f"\nSaving sorted JSON to {export_path}...")
    with open(export_path, "w") as f:
        json.dump(updated_activities, f, indent=2)

    print(f"\n✓ Complete! Total activities: {len(updated_activities)}")
    print(f"  (Added {len(new_processed)} new activities)")


if __name__ == "__main__":
    # Path to cache file (in parent directory)
    cache_path = os.path.join("..", "strava_cache.json")
    cache = Cache(cache_path)

    # Path to export file (in parent directory)
    export_path = os.path.join("..", "front", "src", "data", "strava_export.json")

    # Run incremental API import
    read_strava_api_incremental(export_path, cache)

    # Save cache
    cache.save()

import pytz
from datetime import datetime
from typing import Dict, Any


def contains_keywords(text: str, keywords: list[str]) -> bool:
    for keyword in keywords:
        if keyword in text:
            return True
    return False


def parse_date(time: str) -> str:
    date_format = "%b %d, %Y, %I:%M:%S %p"
    dt_naive = datetime.strptime(time, date_format)
    dt_aware = dt_naive.replace(tzinfo=pytz.UTC)
    dt_pst = dt_aware.astimezone(pytz.timezone("US/Eastern"))
    return dt_pst.strftime(date_format)


def extract_common_data(activity: Dict[str, Any]) -> Dict[str, Any]:
    """Extract common data fields that all activities should have.

    Args:
        activity: Activity dictionary in CSV format

    Returns:
        Dictionary with common data fields including strava_id
    """
    return {
        "strava_id": int(activity["Activity ID"]),
        "title": activity["Activity Name"],
    }

from typing import Any
from .utils import contains_keywords, parse_date

def parse_run_for_workout(run: dict[str, Any]):
    assert run["type"] == "run"
    description = run["data"]["description"]
    private_note = run["data"]["private_note"]
    title = run["data"]["title"]

    keywords = ["workout", "strides", "tempo"]
    if contains_keywords(description+private_note+title, keywords):
        print(f"title: {title}")
        print(f"description: {description}")
        print(f"private_note: {private_note}")
    return run


def parse_run(activity):
    activity_id = int(activity["Activity ID"])
    if activity_id == 13220250113:
        return
    run = {
        "version": 2,
        "type": "run",
        "date": parse_date(activity["Activity Date"]),
        "data": {
            "title": activity["Activity Name"],
            "distance": activity["Distance"],
            "moving_time": activity["Moving Time"],
            "elapsed_time": activity["Elapsed Time"],
            "temperature": activity["Average Temperature"],
            "feels_like": activity["Apparent Temperature"],
            "description": activity["Activity Description"],
            "private_note": activity["Activity Private Note"],
            "shoe": activity["Activity Gear"],
            "strava_id": activity_id,
        },
    }
    run = parse_run_for_workout(run)
    return run

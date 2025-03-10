import csv
import json
from typing import Any
from .run import parse_run
from .utils import parse_date
from .cache import Cache
from .bike import parse_bike


def read_strava_export(folder_path: str, export_path: str, cache: Cache):
    with open(f"{folder_path}/activities.csv", "r") as file:
        reader = csv.DictReader(file)
        activities = list(reader)
    runs = extract_relevant_activities(activities, cache)
    with open(export_path, "w") as file:
        json.dump(runs, file, indent=2)


def extract_relevant_activities(activities: Any, cache: Cache):
    res = []
    for activity in activities:
        if activity["Activity Type"] == "Run":
            run = parse_run(activity, cache)
            if run:
                res.append(run)
        elif activity["Activity Type"] == "Ride":
            run = parse_bike(activity)
            if run:
                res.append(run)
        elif activity["Activity Type"] == "Workout":
            title = str(activity["Activity Name"])
            lower_title = title.lower()
            if "erg" in lower_title or "row" in lower_title:
                row = {
                    "version": 1,
                    "type": "row",
                    "date": parse_date(activity["Activity Date"]),
                    "data": {
                        "title": title,
                        "description": activity["Activity Description"],
                        "moving_time": activity["Moving Time"],
                        "elapsed_time": activity["Elapsed Time"],
                        "average_heart_rate": activity["Average Heart Rate"],
                        "max_heart_rate": activity["Max Heart Rate"],
                    },
                }
                res.append(row)

    return res


if __name__ == "__main__":
    # read_strava_export("neltoid", "front/src/data/strava_neltoid.json")
    cache = Cache("strava_cache.json")
    read_strava_export("data", "front/src/data/strava_export.json", cache)
    cache.save()

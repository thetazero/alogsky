import csv
import json
from typing import Any
from .run import parse_run
from .utils import parse_date


def read_strava_export(folder_path: str, export_path: str):
    with open(f"{folder_path}/activities.csv", "r") as file:
        reader = csv.DictReader(file)
        activities = list(reader)
    runs = extract_relevant_runs(activities)
    with open(export_path, "w") as file:
        json.dump(runs, file, indent=2)

def extract_relevant_runs(activities: Any):
    res = []
    for activity in activities:
        if activity["Activity Type"] == "Run":
            run = parse_run(activity)
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
    read_strava_export("data", "front/src/data/strava_export.json")

import csv
import json
from typing import Any


def read_strava_export(folder_path: str, export_path: str):
    with open(f"{folder_path}/activities.csv", "r") as file:
        reader = csv.DictReader(file)
        activities = list(reader)
    runs = extract_relevant_runs(activities)
    with open(export_path, "w") as file:
        json.dump(runs, file, indent=2)


def extract_relevant_runs(activities: Any):
    runs = []
    for activity in activities:
        if activity["Activity Type"] == "Run":
            run = {
                "version": 2,
                "type": "run",
                "date": activity["Activity Date"],
                "data": {
                    "title": activity["Activity Name"],
                    "distance": activity["Distance"],
                    "moving_time": activity["Moving Time"],
                    "elapsed_time": activity["Elapsed Time"],
                    "temperature": activity["Average Temperature"],
                    "feels_like": activity["Apparent Temperature"],
                },
            }
            runs.append(run)

    return runs


if __name__ == "__main__":
    # read_strava_export("neltoid", "front/src/data/strava_neltoid.json")
    read_strava_export("data", "front/src/data/strava_export.json")

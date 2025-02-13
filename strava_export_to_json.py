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
    res = []
    for activity in activities:
        if activity["Activity Type"] == "Run":
            activity_id = int(activity["Activity ID"])
            if activity_id == 13220250113:
                continue
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
            res.append(run)
        elif activity["Activity Type"] == "Workout":
            title = str(activity["Activity Name"])
            lower_title = title.lower()
            if 'erg' in lower_title or 'row' in lower_title:
                row = {
                    "version": 1,
                    "type": "row",
                    "date": activity["Activity Date"],
                    "data": {
                        "title": title,
                        "description": activity["Activity Description"],
                        "moving_time": activity["Moving Time"],
                        "elapsed_time": activity["Elapsed Time"],
                        "average_heart_rate": activity["Average Heart Rate"],
                        "max_heart_rate": activity["Max Heart Rate"],
                    }
                }
                res.append(row)

    return res


if __name__ == "__main__":
    # read_strava_export("neltoid", "front/src/data/strava_neltoid.json")
    read_strava_export("data", "front/src/data/strava_export.json")

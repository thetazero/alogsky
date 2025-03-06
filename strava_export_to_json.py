import csv
import json
from typing import Any
from datetime import datetime
import pytz


def read_strava_export(folder_path: str, export_path: str):
    with open(f"{folder_path}/activities.csv", "r") as file:
        reader = csv.DictReader(file)
        activities = list(reader)
    runs = extract_relevant_runs(activities)
    with open(export_path, "w") as file:
        json.dump(runs, file, indent=2)

def parse_date(time: str) -> str:
    date_format = "%b %d, %Y, %I:%M:%S %p"
    dt_naive = datetime.strptime(time, date_format)
    dt_aware = dt_naive.replace(tzinfo=pytz.UTC)
    dt_pst = dt_aware.astimezone(pytz.timezone("US/Pacific"))
    return dt_pst.strftime(date_format)



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
            res.append(run)
        elif activity["Activity Type"] == "Workout":
            title = str(activity["Activity Name"])
            lower_title = title.lower()
            if 'erg' in lower_title or 'row' in lower_title:
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
                    }
                }
                res.append(row)

    return res


if __name__ == "__main__":
    # read_strava_export("neltoid", "front/src/data/strava_neltoid.json")
    read_strava_export("data", "front/src/data/strava_export.json")

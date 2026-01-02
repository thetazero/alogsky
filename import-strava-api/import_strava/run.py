from typing import Any
from .utils import contains_keywords, parse_date
from .cache import Cache
import os

CACHE_VERSION_STRING = "runv1"
NOT_A_WORKOUT = "not_a_workout"


def input_rep():
    print("Input rep data: [distance, time]")
    res = input("> ").lower()
    if res == "":
        return None
    else:
        distance, time = res.split(",")
        distance = distance.strip()
        time = time.strip()
        return {
            "distance": distance,
            "time": time,
        }

def print_reps(reps):
    for rep in reps:
        print(f"{rep['distance']}@{rep['time']}")


def input_reps():
    print("Input reps data (including recovery)")
    result = []
    while True:
        rep = input_rep()
        if rep is None:
            break
        result.append(rep)
    print_reps(result)
    print("Confirm reps data [Y]es [N]o [C]ancel")
    confirm = input("> ").lower()
    if confirm == "y":
        return result
    elif confirm == "n":
        return input_reps()
    elif confirm == "c":
        return None
    raise ValueError("Invalid input")


def input_intervals(id: str):
    print(f"Link: https://www.strava.com/activities/{id}")
    print("Input workout data [N]ot a workout [S]kip [F]inish [Y]es")
    res = input("> ").lower()
    if res == "f":
        os.environ["NO_INPUT"] = "1"
        return None
    if res == "s" or res == "":
        print("Skipping")
        return None
    if res == "n":
        print(f"Setting {id} as not a workout")
        return NOT_A_WORKOUT
    if res == "y":
        return input_reps()
    raise ValueError("Invalid input")

def could_be_workout(run: dict[str, Any])-> bool:
    description = run["data"]["description"]
    private_note = run["data"]["private_note"]
    title = run["data"]["title"]
    keywords = ["workout", "strides", "tempo", "x(", "race", "mile", "4x4", "800m"]
    return contains_keywords((description + private_note + title).lower(), keywords) or private_note != ""


def parse_run_for_workout(run: dict[str, Any], cache: Cache):
    assert run["type"] == "run"
    description = run["data"]["description"]
    private_note = run["data"]["private_note"]
    title = run["data"]["title"]

    strava_id = run["data"]["strava_id"]
    if could_be_workout(run):
        if not os.getenv("NO_INPUT", None) and not cache.contains(
            strava_id, CACHE_VERSION_STRING
        ):
            print(f"{run['date']}: {title}")
            print(f"description: {description}")
            print(f"private_note: {private_note}")
            intervals = input_intervals(strava_id)
            if intervals == NOT_A_WORKOUT:
                cache.set(strava_id, CACHE_VERSION_STRING, None)
            elif intervals is not None:
                cache.set(strava_id, CACHE_VERSION_STRING, intervals)

    if cache.contains(strava_id, CACHE_VERSION_STRING):
        run["data"]["intervals"] = cache.get(strava_id)
    return run


def parse_run(activity, cache: Cache):
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
            "average_heartrate": activity["Average Heart Rate"],
            "strava_id": activity_id,
        },
    }
    run = parse_run_for_workout(run, cache)
    return run

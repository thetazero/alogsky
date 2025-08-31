from .utils import parse_date

def parse_elliptical(activity):
    elliptical = {
        "version": 1,
        "type": "elliptical",
        "date": parse_date(activity["Activity Date"]),
        "data": {
            "title": activity["Activity Name"],
            "description": activity["Activity Description"],
            "distance": activity["Distance"],
            "moving_time": activity["Moving Time"],
            "average_heartrate": activity["Average Heart Rate"],
        },
    }
    return elliptical

from .utils import parse_date, extract_common_data

def parse_elliptical(activity):
    elliptical = {
        "version": 1,
        "type": "elliptical",
        "date": parse_date(activity["Activity Date"]),
        "data": {
            **extract_common_data(activity),
            "description": activity["Activity Description"],
            "distance": activity["Distance"],
            "moving_time": activity["Moving Time"],
            "average_heartrate": activity["Average Heart Rate"],
        },
    }
    return elliptical

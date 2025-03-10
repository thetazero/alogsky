from .utils import parse_date

def parse_bike(activity):
    bike = {
        "version": 2,
        "type": "run",
        "date": parse_date(activity["Activity Date"]),
        "data": {
            "title": activity["Activity Name"],
            "distance": activity["Distance"],
            "moving_time": activity["Moving Time"],
            "average_heartrate": activity["Average Heart Rate"],
            "distance": activity["Distance"],
            "type": "bike",
        },
    }
    return bike

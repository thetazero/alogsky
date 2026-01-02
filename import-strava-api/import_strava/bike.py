from .utils import parse_date, extract_common_data


def parse_bike(activity):
    bike = {
        "version": 1,
        "type": "bike",
        "date": parse_date(activity["Activity Date"]),
        "data": {
            **extract_common_data(activity),
            "distance": activity["Distance"],
            "moving_time": activity["Moving Time"],
            "average_heartrate": activity["Average Heart Rate"],
        },
    }
    return bike

import pytz
from datetime import datetime


def contains_keywords(text: str, keywords: list[str]) -> bool:
    for keyword in keywords:
        if keyword in text:
            return True
    return False


def parse_date(time: str) -> str:
    date_format = "%b %d, %Y, %I:%M:%S %p"
    dt_naive = datetime.strptime(time, date_format)
    dt_aware = dt_naive.replace(tzinfo=pytz.UTC)
    dt_pst = dt_aware.astimezone(pytz.timezone("US/Eastern"))
    return dt_pst.strftime(date_format)

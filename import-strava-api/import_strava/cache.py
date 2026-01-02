import json
import os
from typing import Any


class Cache:
    cache: dict[str, dict[str, Any]]

    def __init__(self, cache_file: str):
        self.cache_file = cache_file
        if os.path.exists(cache_file):
            with open(cache_file, "r") as file:
                self.cache = json.load(file)
        else:
            self.cache = {}

    def save(self):
        with open(self.cache_file, "w") as file:
            json.dump(self.cache, file, indent=4)

    def get(self, key):
        key = str(key)
        data = self.cache[key]
        return data["value"]

    def contains(self, key: str, version: str):
        key = str(key)
        data = self.cache.get(key, None)
        if not data:
            return False
        return bool(data["version"] == version)

    def set(self, key: str, version: str, value):
        key = str(key)
        self.cache[key] = {
            "version": version,
            "value": value,
        }

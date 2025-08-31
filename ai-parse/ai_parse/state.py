import json
import os

class State:
    def __init__(self, file: str):
        if not os.path.exists(file):
            self.state = {}
        else:
            with open(file, 'r') as f:
                self.state = json.load(f)

    def save_state(self, file: str):
        with open(file, 'w') as f:
            json.dump(self.state, f)

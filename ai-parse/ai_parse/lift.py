import json
from ai_parse.interface import AiParser

def make_lift_request(context: str) -> str:
    return f"""{context}
    Convert the above context into the following format, return nothing else.
    ```json
        {{
        "version": 2,
        "type": "lift",
        "date": "May 8, 2025, 11:13:00 AM",
        "data": {{
            "duration": 40,
            "notes": "",
            "exercises": [
                "dumbbell row: 8x70, 8x90, 8x90",
                "single leg stair calf raise: 12, 17",
                "dumbbell overhead press: 8x40, 8x50, 8x60",
                "single leg glute bridge: 15, 17",
                "pull up: 6, 6, 6",
                "rdl: 6x55, 6x55, 7x55",
                "tib raise: 15x10, 15x10"
            ]
        }}
    }}
    ```
    """

def post_process_lift_request(response: str) -> dict:
    response_str = response.replace("```json", "").replace("```", "").strip()
    try: 
        return json.loads(response_str)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return {"error": str(e)}

lift_parser = AiParser(make_lift_request, post_process_lift_request)

from collections.abc import Callable
from openai import OpenAI
client = OpenAI()

class AiParser:

    def __init__(self, make_req: Callable[[str], str], post_process: Callable[[str], dict]):
        self.make_req = make_req
        self.post_process = post_process

    def parse(self, context: str) -> dict:
        request = self.make_req(context)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": request}
            ]
        )
        content = response.choices[0].message.content
        assert content is not None
        return self.post_process(content)

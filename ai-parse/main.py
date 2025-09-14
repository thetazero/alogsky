import json
from ai_parse.lift import lift_parser
from ai_parse.state import State
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys

def parse_context(index_context):
    i, context = index_context
    response = lift_parser.parse(context)
    return i, response

if __name__ == "__main__":
    progress_state = State("progress.json")

    with open("input.txt") as f:
        dataset = f.read()
    dataset = dataset.split("\n\n")
    print(len(dataset))

    # Prepare contexts to parse (skip those already done or skipped)
    to_parse = [ (i, context) for i, context in enumerate(dataset)
                if progress_state.state.get(str(i), None) not in ["done", "skip"] ]

    todo = ([i for i, _ in to_parse])
    print(len(todo))
    sys.exit(0)
    results = {}
    with ThreadPoolExecutor() as executor:
        future_to_index = {executor.submit(parse_context, ic): ic[0] for ic in to_parse}
        for future in as_completed(future_to_index):
            i, response = future.result()
            print(f"Context {i} parsed.")
            print(json.dumps(response, indent=4))
            progress_state.state[i] = "done"
            results[i] = response

    progress_state.save_state("progress.json")

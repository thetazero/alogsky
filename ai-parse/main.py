import json
from ai_parse.lift import lift_parser
from ai_parse.state import State

if __name__ == "__main__":
    progress_state = State("progress.json")

    with open("input.txt") as f:
        dataset = f.read()
    dataset = dataset.split("\n\n")
    for i, context in enumerate(dataset):
        if progress_state.state.get(str(i), None) in ["done", "skip"]:
            print(f"Skipping {i}")
            continue
        print(f"Context {i}: {context}")
        do_it = input("parse (y/n)>")
        if do_it == "y":
            response = lift_parser.parse(context)
            print(json.dumps(response, indent=4))
            progress_state.state[i] = "done"
        elif do_it == "n":
            break
        elif do_it == "s":
            progress_state.state[i] = "skip"
        else:
            print("Invalid input")
        progress_state.save_state("progress.json")
    progress_state.save_state("progress.json")

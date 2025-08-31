from ai_parse.lift import lift_parser
if __name__ == "__main__":
    context = """
5/7/25
5:04-5:14
reverse crunch: 30, 30
rush n twist: 50, 50
hollow body hold: 20s, 12s
dead bug: 20, 25
crunch: 60, 70"""
    response = lift_parser.parse(context)
    print(response)

def find_average(lst: list[int]) -> float:
    return sum(lst) / len(lst)


def find_highest(lst: list[int]) -> int:
    return max(lst)


def find_lowest(lst: list[int]) -> int:
    return min(lst)


def find_pass_rate(lst: list[int]) -> float:
    passed: int = 0
    for grade in lst:
        if grade >= 50:
            passed += 1

    return passed / len(lst) * 100


def hello_page() -> None:
    print("Welcome to the Grade Manager app!!!")
    print("Please enter your grades")

    print("""
        example:
          Didar  : 85, 23, 45, 90, 92
            ⬆              ⬆
          Name          points
    """)
    print("to quit the program just press ENTER 2 times after a data\nwrite smth ...")

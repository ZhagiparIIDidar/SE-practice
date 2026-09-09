from schemas import Student


def format_input(user_input: str) -> Student:
    name, grades = user_input.split(":", 1)
    name = name.strip()
    # print(grades)
    grades = validate_grades(grades)
    student: Student = Student(name=name, grades=grades)
    return student


def validate_grades(raw_grades: str) -> list[int]:
    # print(raw_grades)

    if not raw_grades:
        return []
    grades: list[str] = raw_grades.split(",")
    # print(grades)

    validated_grades: list[int] = []

    for grade in grades:
        # print(grade)
        try:
            grade = int(grade)
            if grade < 0 or grade > 100:
                continue
            validated_grades.append(grade)
        except ValueError:
            continue
    return validated_grades


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

from utils import *
from schemas import *


def app():
    hello_page()
    db: list[Student] = []
    while True:
        raw_user_input = input()
        if not raw_user_input:
            break
        student: Student = format_input(raw_user_input)
        db.append(student)

    for student in db:
        if not student.grades:
            print(student)
            continue

        profile: Profile = Profile(
            valid=len(student.grades),
            average=find_average(student.grades),
            highest=find_highest(student.grades),
            lowest=find_lowest(student.grades),
            pass_rate=find_pass_rate(student.grades),
        )
        student.profile = profile
        print(student)


if __name__ == "__main__":
    try:
        app()
        print("goodbye 😘")
    except Exception as e:
        print(e)
    # app()

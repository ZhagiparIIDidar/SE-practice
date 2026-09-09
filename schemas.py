class Profile:
    def __init__(
        self,
        valid,
        average,
        highest,
        lowest,
        pass_rate,
    ):
        self.valid = valid
        self.average = average
        self.highest = highest
        self.lowest = lowest
        self.pass_rate = pass_rate

    def __repr__(self):
        return (
            f"Profile:\n"
            f"valid = {self.valid}, \n"
            f"average = {self.average:.2f}, \n"
            f"highest = {self.highest}, \n"
            f"lowest = {self.lowest}, \n"
            f"pass_rate = {self.pass_rate:.1f}%, \n"
        )

    def __eq__(self, other):
        if other.__class__ is self.__class__:
            return (
                self.valid,
                self.average,
                self.highest,
                self.lowest,
                self.pass_rate,
            ) == (
                other.valid,
                other.average,
                other.highest,
                other.lowest,
                other.pass_rate,
            )
        return NotImplemented


class Student:

    def __init__(
        self,
        name: str,
        grades: list[int],
        profile: Profile | None = None,
    ):
        self.name = name
        self.grades = grades
        self.profile = profile

    def __repr__(self):
        return (
            f"Student:\n"
            f"name = {self.name}, \n"
            f"grades = {self.grades}, \n\n"
            f"{self.profile} \n"
        )

    def __eq__(self, other):
        if other.__class__ is self.__class__:
            return (
                self.name,
                self.grades,
                self.profile,
            ) == (
                other.name,
                other.grades,
                other.profile,
            )
        return NotImplemented

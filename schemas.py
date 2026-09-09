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

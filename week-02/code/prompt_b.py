def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of numeric marks.

    Args:
        marks (list): List of numbers (int/float) between 0 and 100 inclusive.
        pass_mark (int/float): Minimum mark counted as a "pass". Default 50.

    Returns:
        dict: {
            "average": float,
            "highest": float,
            "lowest": float,
            "pass_rate": float  # percentage of marks >= pass_mark
        }

    Raises:
        ValueError: if marks is empty, contains non-numeric values,
                    or contains values outside [0, 100].
    """
    if not marks:
        raise ValueError("marks list cannot be empty")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric value found: {m!r}")
        if m < 0 or m > 100:
            raise ValueError(f"mark out of range (0-100): {m!r}")

    total = sum(marks)
    count = len(marks)
    average = total / count
    highest = max(marks)
    lowest = min(marks)
    passed = sum(1 for m in marks if m >= pass_mark)
    pass_rate = (passed / count) * 100

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate,
    }
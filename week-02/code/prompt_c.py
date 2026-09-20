def analyze_marks(marks, pass_mark=50):
    """
    Analyze a list of student marks.

    Args:
        marks: list of numeric marks (each expected to be in [0, 100])
        pass_mark: the minimum mark (inclusive) considered a pass

    Returns:
        dict with keys: average, highest, lowest, pass_rate
        (average and pass_rate rounded to 2 decimal places)

    Raises:
        ValueError: if marks is empty, contains non-numeric values,
                    or contains values outside the 0-100 range
    """
    if not marks:
        raise ValueError("marks list cannot be empty")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric mark found: {m!r}")
        if m < 0 or m > 100:
            raise ValueError(f"mark out of range (0-100): {m!r}")

    total = sum(marks)
    count = len(marks)
    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": round(total / count, 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round((passed / count) * 100, 2),
    }


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
def run_tests():
    # 1. Example from spec
    result = analyze_marks([40, 60, 80], 50)
    assert result == {
        "average": 60.0,
        "highest": 80,
        "lowest": 40,
        "pass_rate": 66.67,
    }, result

    # 2. One mark
    result = analyze_marks([75])
    assert result == {
        "average": 75.0,
        "highest": 75,
        "lowest": 75,
        "pass_rate": 100.0,
    }, result

    # 3. Decimals
    result = analyze_marks([55.5, 60.25, 70.75])
    assert result["average"] == round((55.5 + 60.25 + 70.75) / 3, 2)
    assert result["highest"] == 70.75
    assert result["lowest"] == 55.5
    assert result["pass_rate"] == 100.0

    # 4. Custom pass_mark
    result = analyze_marks([30, 45, 60, 90], pass_mark=60)
    assert result == {
        "average": 56.25,
        "highest": 90,
        "lowest": 30,
        "pass_rate": 50.0,
    }, result

    # 5. Empty list -> ValueError
    try:
        analyze_marks([])
        assert False, "expected ValueError for empty list"
    except ValueError:
        pass

    # 6. Text value -> ValueError
    try:
        analyze_marks([50, "sixty", 70])
        assert False, "expected ValueError for non-numeric value"
    except ValueError:
        pass

    # 7. Mark below 0 -> ValueError
    try:
        analyze_marks([-5, 50, 60])
        assert False, "expected ValueError for mark below 0"
    except ValueError:
        pass

    # 8. Mark above 100 -> ValueError
    try:
        analyze_marks([50, 101, 60])
        assert False, "expected ValueError for mark above 100"
    except ValueError:
        pass

    print("All tests passed.")


if __name__ == "__main__":
    run_tests()
"""
analysis_marks.py

Reads student marks from an Excel file and returns basic statistics.

Requires: pandas, openpyxl  (pip install pandas openpyxl)
"""

import pandas as pd


def analysis_marks(file_path, sheet_name=0, mark_column="mark", passing_score=60):
    """
    Read a column of marks from an Excel file and compute statistics.

    Parameters
    ----------
    file_path : str
        Path to the .xlsx file.
    sheet_name : str or int, default 0
        Sheet name or index to read from.
    mark_column : str, default "mark"
        Name of the column (header) that contains the marks.
        Change this to match your file, e.g. "Grade", "Score", "Ball".
    passing_score : int or float, default 60
        Minimum mark (inclusive) counted as "passed" for pass_rate.

    Returns
    -------
    dict with keys:
        average    : float or None  - mean of valid marks
        highest    : float or None  - max of valid marks
        lowest     : float or None  - min of valid marks
        pass_rate  : float or None  - percent of valid marks >= passing_score
        valid      : str            - 'true' if stats were computed, 'false' otherwise
        message    : str            - human-readable context/explanation
    """

    result = {
        "average": None,
        "highest": None,
        "lowest": None,
        "pass_rate": None,
        "valid": "false",
        "message": "",
    }

    # --- read the file ---
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
    except FileNotFoundError:
        result["message"] = f"File not found: {file_path}"
        return result
    except Exception as e:
        result["message"] = f"Failed to read Excel file: {e}"
        return result

    if mark_column not in df.columns:
        result["message"] = (
            f"Column '{mark_column}' not found. "
            f"Available columns: {list(df.columns)}"
        )
        return result

    raw_values = df[mark_column].tolist()

    # --- empty file / empty column ---
    if len(raw_values) == 0:
        result["message"] = "No rows found in the file."
        return result

    # --- filter and validate values ---
    valid_marks = []
    skipped_empty = 0
    skipped_non_numeric = 0
    skipped_out_of_range = 0

    for v in raw_values:
        if pd.isna(v):
            skipped_empty += 1
            continue

        try:
            num = float(v)
        except (TypeError, ValueError):
            skipped_non_numeric += 1
            continue

        if num < 0 or num > 100:
            skipped_out_of_range += 1
            continue

        valid_marks.append(num)

    # --- nothing usable left ---
    if len(valid_marks) == 0:
        result["message"] = (
            "No valid numeric marks in range 0-100 were found "
            f"(empty: {skipped_empty}, non-numeric: {skipped_non_numeric}, "
            f"out of range: {skipped_out_of_range})."
        )
        return result

    # --- compute stats ---
    passed_count = sum(1 for m in valid_marks if m >= passing_score)

    result["average"] = round(sum(valid_marks) / len(valid_marks), 2)
    result["highest"] = max(valid_marks)
    result["lowest"] = min(valid_marks)
    result["pass_rate"] = round(passed_count / len(valid_marks) * 100, 2)
    result["valid"] = "true"
    result["message"] = (
        f"Processed {len(valid_marks)} valid mark(s) out of {len(raw_values)} row(s). "
        f"Skipped {skipped_empty} empty, {skipped_non_numeric} non-numeric, "
        f"{skipped_out_of_range} out-of-range (must be 0-100)."
    )

    return result


if __name__ == "__main__":
    # Example usage.
    # Excel file is expected to have a header row with a "mark" column, e.g.:
    #
    #   student   | mark
    #   ----------|------
    #   Aidos     | 85
    #   Zarina    | 92
    #   Nurlan     |      <- empty, will be skipped
    #   Dias      | "abc" <- non-numeric, will be skipped
    #   Aigerim   | 130   <- out of range, will be skipped

    stats = analysis_marks("students.xlsx", mark_column="mark")
    print(stats)
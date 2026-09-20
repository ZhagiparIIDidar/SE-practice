"""
Student Marks Analyzer
-----------------------
Analyzes student marks: computes statistics, assigns grades, ranks students,
and identifies pass/fail status. Works with sample data by default, or load
your own data from a CSV file (see `load_from_csv`).

CSV format expected (if using your own file):
    name,subject,marks
    Alice,Math,85
    Alice,Science,90
    Bob,Math,45
    ...
"""

import csv
import statistics
from collections import defaultdict


# ---------------------------------------------------------------------------
# Sample data: {student_name: {subject: marks}}
# ---------------------------------------------------------------------------
SAMPLE_DATA = {
    "Alice":   {"Math": 85, "Science": 90, "English": 78},
    "Bob":     {"Math": 45, "Science": 60, "English": 55},
    "Charlie": {"Math": 92, "Science": 88, "English": 95},
    "Diana":   {"Math": 70, "Science": 65, "English": 72},
    "Ethan":   {"Math": 30, "Science": 40, "English": 38},
}

PASS_MARK = 40  # minimum marks per subject to pass


def load_from_csv(filepath):
    """Load student marks from a CSV file with columns: name, subject, marks."""
    data = defaultdict(dict)
    with open(filepath, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data[row["name"]][row["subject"]] = float(row["marks"])
    return dict(data)


def assign_grade(percentage):
    """Convert a percentage score into a letter grade."""
    if percentage >= 90:
        return "A"
    elif percentage >= 75:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 40:
        return "D"
    else:
        return "F"


def analyze(data, pass_mark=PASS_MARK):
    """
    Returns a dict of per-student results and a dict of per-subject stats.
    """
    student_results = {}
    subject_scores = defaultdict(list)

    for name, subjects in data.items():
        scores = list(subjects.values())
        total = sum(scores)
        average = statistics.mean(scores)
        highest = max(subjects, key=subjects.get)
        lowest = min(subjects, key=subjects.get)
        failed_subjects = [s for s, m in subjects.items() if m < pass_mark]

        student_results[name] = {
            "total": total,
            "average": round(average, 2),
            "grade": assign_grade(average),
            "best_subject": highest,
            "weakest_subject": lowest,
            "status": "Pass" if not failed_subjects else "Fail",
            "failed_subjects": failed_subjects,
        }

        for subject, marks in subjects.items():
            subject_scores[subject].append(marks)

    subject_stats = {
        subject: {
            "average": round(statistics.mean(scores), 2),
            "highest": max(scores),
            "lowest": min(scores),
            "stdev": round(statistics.stdev(scores), 2) if len(scores) > 1 else 0.0,
        }
        for subject, scores in subject_scores.items()
    }

    return student_results, subject_stats


def rank_students(student_results):
    """Return students sorted by average score, highest first."""
    return sorted(student_results.items(), key=lambda kv: kv[1]["average"], reverse=True)


def print_report(student_results, subject_stats):
    print("=" * 60)
    print("STUDENT PERFORMANCE REPORT")
    print("=" * 60)

    ranked = rank_students(student_results)
    for rank, (name, r) in enumerate(ranked, start=1):
        print(f"\n#{rank} {name}")
        print(f"   Average : {r['average']}  (Grade {r['grade']})")
        print(f"   Total   : {r['total']}")
        print(f"   Best    : {r['best_subject']}   Weakest: {r['weakest_subject']}")
        print(f"   Status  : {r['status']}", end="")
        if r["failed_subjects"]:
            print(f" (failed: {', '.join(r['failed_subjects'])})")
        else:
            print()

    print("\n" + "-" * 60)
    print("SUBJECT-WISE STATISTICS")
    print("-" * 60)
    for subject, stats in subject_stats.items():
        print(f"{subject:10s} avg={stats['average']:<6} "
              f"high={stats['highest']:<5} low={stats['lowest']:<5} "
              f"stdev={stats['stdev']}")

    class_average = round(
        statistics.mean(r["average"] for r in student_results.values()), 2
    )
    pass_count = sum(1 for r in student_results.values() if r["status"] == "Pass")
    print("\n" + "-" * 60)
    print(f"Class average: {class_average}")
    print(f"Pass rate: {pass_count}/{len(student_results)} "
          f"({round(100 * pass_count / len(student_results), 1)}%)")


if __name__ == "__main__":
    # To use your own data instead of the sample set:
    #   data = load_from_csv("marks.csv")
    data = SAMPLE_DATA

    results, stats = analyze(data)
    print_report(results, stats)

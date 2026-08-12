"""
CSV export of habit history for StreakKeeper.
"""

import csv
import io

from models import Habit, Completion


def generate_csv(user_id):
    """Generate a CSV of all habit completions for a user."""
    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow(['habit_name', 'date', 'created_at'])

    habits = Habit.query.filter_by(user_id=user_id).all()
    for habit in habits:
        for completion in habit.completions:
            writer.writerow([habit.name, completion.date, completion.created_at])

    return output.getvalue()

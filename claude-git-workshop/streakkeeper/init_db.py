"""
Initialize the SQLite database for StreakKeeper.
Run once before starting the app: `python init_db.py`
"""

from app import app
from models import db


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database initialized: streakkeeper.db")

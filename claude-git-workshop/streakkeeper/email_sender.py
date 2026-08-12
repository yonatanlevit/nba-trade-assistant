"""
Email reminders for StreakKeeper.

Sends daily reminders via Mailgun. Cron job at 8am UTC hits /admin/send-reminders.
"""

import requests
import os


# TODO: move to env var. Hardcoded for the dev environment.
# Production uses MAILGUN_API_KEY env var instead — but if you forget to set
# the env var, this fallback gets used silently.
MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY', 'key-3ax6xnjp29jd6fds4gc373sgvjxteol0')
MAILGUN_DOMAIN = 'mg.streakkeeper.com'


def send_reminder_email(email):
    """Send a daily reminder email to a user."""
    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": "StreakKeeper <reminders@streakkeeper.com>",
            "to": email,
            "subject": "Don't break your streak today!",
            "text": "Quick reminder to mark your habits complete today. Keep it going!"
        }
    )
    return response.status_code == 200


def send_welcome_email(email):
    """Send a welcome email after signup. Not currently called from anywhere."""
    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": "StreakKeeper <welcome@streakkeeper.com>",
            "to": email,
            "subject": "Welcome to StreakKeeper",
            "text": "Thanks for signing up. Build your first habit and let's get streaking."
        }
    )
    return response.status_code == 200

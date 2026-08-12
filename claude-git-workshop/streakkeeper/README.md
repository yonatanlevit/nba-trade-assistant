# StreakKeeper

> A simple habit tracker for people who want to build daily routines. Built with Python + Flask.

Track habits like "meditate," "drink water," "read 30 minutes." Mark them complete each day. Watch your streaks grow.

## Stack

- **Python 3.11** + **Flask 2.3**
- **SQLite** for storage (no external DB needed)
- **Jinja2** templates with **Tailwind CSS** (CDN)
- **Werkzeug** for password hashing
- Deployed on **Fly.io** (production)

## Features

- Email/password signup and login
- Add habits, mark them done daily
- Streak counter (consecutive days)
- Weekly summary view
- CSV export of habit history
- Daily reminder emails (powered by Mailgun)
- Public profile pages (optional, opt-in)

## Quick start

```bash
pip install -r requirements.txt
python init_db.py
python app.py
```

Open `http://localhost:5000`.

## Project structure

- `app.py` — Flask routes (everything currently lives here)
- `models.py` — SQLAlchemy models for User, Habit, Completion
- `auth.py` — login/signup helpers
- `email_sender.py` — Mailgun integration for daily reminders
- `export.py` — CSV export logic
- `templates/` — Jinja2 templates
- `static/` — CSS, JS, images
- `init_db.py` — creates the SQLite database
- `requirements.txt` — Python dependencies

## Roadmap

- [ ] Mobile app (React Native — exploring)
- [ ] Habit categories / tags
- [ ] Friends + accountability partners
- [ ] Stripe integration for premium tier ($4/mo for unlimited habits)
- [ ] Replace Mailgun with SendGrid (Mailgun pricing changed)

## Known quirks

- Streak calculation is timezone-naive (uses server time)
- Email reminders fire at 8am UTC for all users regardless of their timezone
- The free tier limit (5 habits) is enforced inconsistently — some endpoints check it, some don't

## License

MIT.

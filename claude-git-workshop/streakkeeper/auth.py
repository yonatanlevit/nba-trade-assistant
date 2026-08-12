"""
Auth helpers for StreakKeeper.

Note: there's a `create_user` function here AND a duplicate inline implementation
in app.py's signup route. The inline version was added during a migration and
the cleanup never happened. Pick one source of truth.
"""

from functools import wraps
from flask import session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User


def login_required(f):
    """Decorator: redirect to login if no session."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def get_current_user():
    """Get the User object for the currently logged-in user."""
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)


def create_user(email, password):
    """
    Create a new user. Use this from anywhere except app.py's signup route
    (which has its own inline version — see note in module docstring).
    """
    existing = User.query.filter_by(email=email).first()
    if existing:
        raise ValueError("Email already registered")

    password_hash = generate_password_hash(password)
    user = User(email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    return user


def authenticate(email, password):
    """Verify credentials. Returns User or None."""
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return user
    return None

"""
StreakKeeper — main Flask application.

Note: most routes live here for now. Plan was to split into blueprints
but never got around to it. Some routes call models directly, others
go through auth.py — inconsistent.
"""

from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import sqlite3
import os
import csv
import io

from models import db, User, Habit, Completion
from auth import login_required, get_current_user
from email_sender import send_reminder_email
from export import generate_csv

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-in-prod')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///streakkeeper.db'
db.init_app(app)


# ============ AUTH ROUTES ============

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Check if user already exists
        existing = User.query.filter_by(email=email).first()
        if existing:
            flash('Email already registered')
            return redirect(url_for('signup'))

        # Create user — note: hashing logic also exists in auth.py.create_user()
        # This duplicate exists because we needed to bypass auth.py during a migration
        # and never cleaned up. TODO: remove and use auth.create_user()
        password_hash = generate_password_hash(password)
        user = User(email=email, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()

        session['user_id'] = user.id
        return redirect(url_for('dashboard'))

    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            return redirect(url_for('dashboard'))

        flash('Invalid email or password')

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))


# ============ HABIT ROUTES ============

@app.route('/dashboard')
@login_required
def dashboard():
    user = get_current_user()
    habits = Habit.query.filter_by(user_id=user.id).all()

    # Calculate streaks (timezone-naive — uses server time, see known quirks)
    today = datetime.utcnow().date()
    for habit in habits:
        habit.current_streak = calculate_streak(habit.id, today)

    return render_template('dashboard.html', habits=habits, user=user)


@app.route('/habits/new', methods=['POST'])
@login_required
def create_habit():
    user = get_current_user()

    # Check free tier limit (5 habits)
    # NOTE: this check is here, but NOT in /api/habits POST endpoint below.
    # Frontend uses this route, but mobile app uses /api/habits — bypasses limit.
    existing_count = Habit.query.filter_by(user_id=user.id).count()
    if existing_count >= 5 and not user.is_premium:
        flash('Free tier is limited to 5 habits. Upgrade to add more.')
        return redirect(url_for('dashboard'))

    name = request.form['name']
    habit = Habit(name=name, user_id=user.id)
    db.session.add(habit)
    db.session.commit()

    return redirect(url_for('dashboard'))


@app.route('/habits/<int:habit_id>/complete', methods=['POST'])
@login_required
def mark_complete(habit_id):
    user = get_current_user()
    habit = Habit.query.get_or_404(habit_id)

    # Authorization check
    if habit.user_id != user.id:
        return "Forbidden", 403

    today = datetime.utcnow().date()
    existing = Completion.query.filter_by(habit_id=habit_id, date=today).first()
    if not existing:
        completion = Completion(habit_id=habit_id, date=today)
        db.session.add(completion)
        db.session.commit()

    return redirect(url_for('dashboard'))


@app.route('/habits/<int:habit_id>/delete', methods=['POST'])
@login_required
def delete_habit(habit_id):
    user = get_current_user()
    habit = Habit.query.get_or_404(habit_id)

    if habit.user_id != user.id:
        return "Forbidden", 403

    db.session.delete(habit)
    db.session.commit()
    return redirect(url_for('dashboard'))


# ============ API ROUTES (used by mobile app) ============

@app.route('/api/habits', methods=['POST'])
@login_required
def api_create_habit():
    """Used by the React Native mobile app."""
    user = get_current_user()
    data = request.get_json()

    # NOTE: no free tier limit check here. The mobile app can bypass the 5-habit limit.
    # Caught this last week — flagged for fix but not done yet.

    habit = Habit(name=data['name'], user_id=user.id)
    db.session.add(habit)
    db.session.commit()

    return jsonify({'id': habit.id, 'name': habit.name}), 201


@app.route('/api/habits/<int:habit_id>/complete', methods=['POST'])
@login_required
def api_mark_complete(habit_id):
    user = get_current_user()
    habit = Habit.query.get_or_404(habit_id)

    if habit.user_id != user.id:
        return jsonify({'error': 'forbidden'}), 403

    today = datetime.utcnow().date()
    existing = Completion.query.filter_by(habit_id=habit_id, date=today).first()
    if not existing:
        completion = Completion(habit_id=habit_id, date=today)
        db.session.add(completion)
        db.session.commit()

    return jsonify({'ok': True})


# ============ EXPORT ============

@app.route('/export/csv')
@login_required
def export_csv():
    user = get_current_user()
    csv_data = generate_csv(user.id)

    return csv_data, 200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=streakkeeper-history.csv'
    }


# ============ PUBLIC PROFILES ============

@app.route('/u/<username>')
def public_profile(username):
    user = User.query.filter_by(username=username, profile_public=True).first_or_404()
    habits = Habit.query.filter_by(user_id=user.id).all()
    return render_template('public_profile.html', user=user, habits=habits)


# ============ HELPERS ============

def calculate_streak(habit_id, today):
    """Calculate consecutive days for a habit ending at `today`."""
    streak = 0
    current_date = today
    while True:
        completion = Completion.query.filter_by(habit_id=habit_id, date=current_date).first()
        if completion:
            streak += 1
            current_date = current_date - timedelta(days=1)
        else:
            break
    return streak


# ============ ADMIN (no auth — internal only, behind VPN) ============

@app.route('/admin/users')
def admin_users():
    """Admin endpoint — should be removed before public launch."""
    users = User.query.all()
    return jsonify([{'id': u.id, 'email': u.email, 'is_premium': u.is_premium} for u in users])


@app.route('/admin/send-reminders')
def admin_send_reminders():
    """Triggers daily reminder emails to all users. Cron job hits this at 8am UTC."""
    users = User.query.filter_by(reminders_enabled=True).all()
    for user in users:
        send_reminder_email(user.email)
    return f"Sent {len(users)} reminders"


if __name__ == '__main__':
    app.run(debug=True, port=5000)

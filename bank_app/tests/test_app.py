import pytest
from backend.main import db, User

def test_index(client):
    """Test the index page."""
    rv = client.get('/')
    assert rv.status_code == 200
    assert b'Welcome to the Bank' in rv.data

def test_register(client):
    """Test user registration."""
    rv = client.post('/register', data=dict(
        username='testuser',
        password='testpassword'
    ), follow_redirects=True)
    assert rv.status_code == 200
    assert b'Registration successful! Please log in.' in rv.data
    user = User.query.filter_by(username='testuser').first()
    assert user is not None

def test_register_existing_user(client):
    """Test registering a user that already exists."""
    client.post('/register', data=dict(username='testuser', password='testpassword'))
    rv = client.post('/register', data=dict(username='testuser', password='testpassword'), follow_redirects=True)
    assert rv.status_code == 200
    assert b'Username already exists.' in rv.data

def test_login_logout(client):
    """Test login and logout."""
    # Register user first
    client.post('/register', data=dict(username='testuser', password='testpassword'))

    # Login
    rv = client.post('/login', data=dict(
        username='testuser',
        password='testpassword'
    ), follow_redirects=True)
    assert rv.status_code == 200
    assert b'Welcome to your Dashboard, testuser!' in rv.data

    # Logout
    rv = client.get('/logout', follow_redirects=True)
    assert rv.status_code == 200
    assert b'Welcome to the Bank' in rv.data
    assert b'Go to Dashboard' not in rv.data

def test_login_invalid_password(client):
    """Test login with invalid password."""
    client.post('/register', data=dict(username='testuser', password='testpassword'))
    rv = client.post('/login', data=dict(
        username='testuser',
        password='wrongpassword'
    ), follow_redirects=True)
    assert rv.status_code == 200
    assert b'Invalid username or password.' in rv.data

def test_dashboard_unauthorized(client):
    """Test accessing dashboard without being logged in."""
    rv = client.get('/dashboard', follow_redirects=True)
    assert rv.status_code == 200
    assert b'Login' in rv.data # Should be redirected to login page

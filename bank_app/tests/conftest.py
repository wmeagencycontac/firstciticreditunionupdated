import pytest
import os
import tempfile

# Add the project root to the python path
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.main import app, db, User

@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False # Disable CSRF for testing forms

    with app.test_client() as client:
        with app.app_context():
            db.drop_all()
            db.create_all()
        yield client

    os.close(db_fd)
    os.unlink(db_path)

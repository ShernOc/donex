# Automated Donation Platform - Backend

## Overview
The backend of the Automated Donation Platform provides API services for donors, charities, and administrators. It handles user authentication, payment processing, charity approvals, and donation tracking. The backend is built with **Flask** and uses **PostgreSQL** as the database.

## Features
- User authentication (JWT-based authentication and social login via OAuth)
- Charity application and approval system
- Donation processing (one-time and recurring donations)
- Integration with third-party payment gateways (PayPal)
- Role-based access control (Donors, Charities, Admins)
- API endpoints for managing users, donations, and charities
- Email notifications via Flask-Mail
- Admin dashboard for managing donations and users
- Secure API with token-based authentication

## Tech Stack
- **Backend Framework:** Flask
- **Database:** PostgreSQL
- **Authentication:** Flask-JWT-Extended, OAuth (Google)
- **Object-Relational Mapping (ORM):** SQLAlchemy
- **Migrations:** Alembic
- **Security:** Flask-Bcrypt for password hashing, Flask-CORS for cross-origin requests
- **Task Scheduling:** Celery (for handling background tasks, if needed)
- **Testing:** Flask-Testing, Pytest
- **Deployment:** Gunicorn, Docker (optional)

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Python 3.9+
- PostgreSQL
- Virtual environment (optional but recommended)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-org/automated-donation-backend.git
   cd automated-donation-backend
   ```

2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate 
   ```

3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   SECRET_KEY=your_secret_key
   DATABASE_URL=postgresql://username:password@localhost:5432/your_db_name
   JWT_SECRET_KEY=your_jwt_secret_key
   MAIL_SERVER=smtp.example.com
   MAIL_PORT=587
   MAIL_USERNAME=your_email@example.com
   MAIL_PASSWORD=your_email_password
   ```

5. Run database migrations:
   ```sh
   flask db upgrade
   ```

6. Start the Flask server:
   ```sh
   flask run --host=0.0.0.0 --port=5000
   ```
   The backend API will be available at `https://donex-uq5f.onrender.com`.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive a JWT token
- `POST /auth/logout` - Logout user

### Donations
- `POST /donations` - Create a new donation
- `GET /donations` - Retrieve all donations
- `GET /donations/<id>` - Get a specific donation

### Charities
- `POST /charities/apply` - Apply for charity registration
- `GET /charities` - Retrieve approved charities
- `PATCH /charities/<id>` - Admin approval for charities

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/donations` - Get all donations
- `PATCH /admin/approve-charity/<id>` - Approve a charity

## Running Tests
To run tests, use:
```sh
pytest
```

## Deployment
This project can be deployed using **Gunicorn** and **Docker**.

### Deploying with Gunicorn:
```sh
pip install gunicorn
export FLASK_APP=app.py
export FLASK_ENV=production
flask db upgrade
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Deploying with Render:
1.Render: 
https://donex-uq5f.onrender.com

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

## License
This project is licensed under the **MIT License**.



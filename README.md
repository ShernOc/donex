# Automated Donation Platform

## Overview

The Automated Donation Platform is a web application designed to facilitate seamless donations to charities. It enables donors to contribute, charities to manage their funds and share impact stories, and administrators to oversee platform operations. The platform is built using a **ReactJS frontend** and a **Flask backend**, with PostgreSQL as the database.

## Features

- User authentication (JWT & OAuth integration)
- Secure API for managing donations, users, and charities
- Donor dashboard to track donations
- Charity dashboard for application approval and donation management
- Admin panel for platform oversight
- Recurring and one-time donation support
- Integration with third-party payment gateways (PayPal)
- Impact stories to showcase beneficiary experiences
- Fully responsive design

## Tech Stack

### Frontend
- **Framework:** ReactJS
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit / useContext
- **Routing:** React Router
- **Authentication:** JWT, Google OAuth
- **Deployment:** Vercel

### Backend
- **Framework:** Flask
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Authentication:** Flask-JWT-Extended, OAuth
- **Migrations:** Alembic
- **Security:** Flask-Bcrypt, Flask-CORS
- **Deployment:** Render

## Getting Started

### Prerequisites

Ensure you have installed:

- Node.js (v18+ recommended)
- Python 3.9+
- PostgreSQL

### Installation

#### Clone the repository

```sh
git clone https://github.com/your-org/automated-donation-platform.git
cd automated-donation-platform
```

### Frontend Setup

```sh
cd frontend
npm install  # or yarn install
npm run dev  # Starts the React dev server
```

Access the frontend at `http://localhost:5173`.

### Backend Setup

```sh
cd backend
python -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
flask db upgrade
flask run
```

Backend API will be available at `http://localhost:5000`.

## Deployment

The frontend is deployed on **Vercel**, and the backend is deployed on **Render** at [https://donex-uq5f.onrender.com](https://donex-uq5f.onrender.com).

### Deploying Backend on Render
The backend is automatically deployed on **Render** and is accessible at the provided URL. Any updates to the backend code will trigger a redeployment on Render.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

## License
This project is licensed under the **MIT License**.


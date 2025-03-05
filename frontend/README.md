# Automated Donation Platform - Frontend

## Overview
The Automated Donation Platform is a web application that allows donors to contribute to charities, set up recurring donations, and view impact stories. Charities can apply for approval, manage donations, and share beneficiary stories, while administrators oversee charity applications and platform operations.

This repository contains the frontend of the application, built using **ReactJS** and **Tailwind CSS** for styling. State management is handled using **useContext/Redux Toolkit**, and authentication is implemented with JWT and social authentication.

## Features
- User authentication (JWT & Social login)
- Donor dashboard to track donations
- Charity dashboard for managing donations and stories
- Admin panel for charity approvals and platform oversight
- Recurring and one-time donations via third-party payment integration
- Impact stories section to showcase beneficiary experiences
- Responsive design for mobile and desktop

## Tech Stack
- **Frontend:** ReactJS, Tailwind CSS
- **State Management:** useContext / Redux Toolkit
- **Routing:** React Router
- **Authentication:** JWT, OAuth (Google)
- **HTTP Requests:** Fetch
- **CI/CD:** GitHub Actions

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-org/automated-donation-frontend.git
   cd automated-donation-frontend
   ```
2. Install dependencies:
   ```sh
   npm install   # or yarn install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```
4. Start the development server:
   ```sh
   npm run dev   # or yarn dev
   ```
5. Open your browser and go to `http://localhost:5173`


## Available Scripts

### `npm run dev`
Starts the development server on `localhost:5173`.

### `npm run build`
Builds the project for production.



## Deployment
This project uses **GitHub Actions** for CI/CD. The frontend can be deployed using:
- **Vercel**

To deploy manually:
```sh
npm run build
# Upload the `dist` folder to your hosting service
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your branch (`git push origin feature-name`)
5. Open a Pull Request

## License
This project is licensed under the **MIT License**.


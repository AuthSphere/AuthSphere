# AuthSphere Frontend

React-based administrative dashboard for managing AuthSphere identity infrastructure.

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

<p>
  <a href="https://auth-sphere-gilt.vercel.app/">Live Demo</a> •
  <a href="#setup">Setup</a>
</p>

---

## Overview

The frontend serves as the primary visual interface for platform engineers to manage identity environments, cryptographic keys, and user data. It connects directly to the AuthSphere API Engine to orchestrate multi-tenant configurations.

## Features

- **Project Management**: Provision and manage multiple identity environments from a single authenticated session.
- **Email Editor**: Real-time email template designer with side-by-side desktop and mobile previews.
- **Security Vault**: Generate and rotate RSA key pairs and manage social provider credentials securely.
- **Live Telemetry**: WebSockets stream authentication events and diagnostics directly to the dashboard.
- **User Management**: Interface for suspending users, overriding verification status, and monitoring session geolocation.

## Setup

**Prerequisites**:

- Node.js v20+
- AuthSphere API Engine running locally (or pointing to production)

```bash
# 1. Install dependencies
npm install

# 2. Configure the environment
# Create a .env file and set VITE_API_BASE_URL (e.g., http://localhost:8000)

# 3. Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Tech Stack

| Component         | Technology          |
| ----------------- | ------------------- |
| **Framework**     | React 19, Vite      |
| **Styling**       | Tailwind CSS v4     |
| **UI Components** | Radix UI, Shadcn UI |
| **State**         | Zustand             |
| **Animations**    | Framer Motion       |
| **Routing**       | React Router 7      |

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/hassenamri005/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-yellow)](https://github.com/your-profile/your-repo/releases)

# React TS Boilerplate 🚀

A React TypeScript boilerplate integrating **Authentication**, **Docker**, and **Docker Compose** for seamless development and production environments.

---

## Features

This project combines the following technologies:

- **React TS v18**: Modern React with TypeScript for type-safe development.
- **Routing Handling**: Efficient routing with role-based authentication.
  - **Role-Based Auth Routing**: Separate routes for **User** and **Admin** roles.
- **Persistent Redux Store**: State management with Redux for a consistent user experience.
- **Ant Design (Antd)**: UI library with a custom theme for a polished look.
- **Prebuilt Pages**:
  - Landing Page
  - Login Page
  - Admin Dashboard
  - User Dashboard
- **Docker Integration**:
  - `Dockerfile.dev`: For a fast and easy development environment.
  - `Dockerfile.prod`: For an optimized production environment.
- **Docker Compose**:
  - `docker-compose.yaml`: Simplifies setup for both development and production environments. Choose between `dev` or `prod` profiles.

---

## Existing Routes

- `/`: Landing page.
- `/login`: Login page for authentication.
- `/user/dashboard`: Dashboard for authenticated users with the `user` role.
- `/admin/dashboard`: Dashboard for authenticated admins with the `admin` role.
- `*`: Fallback route for unhandled or incorrect paths.

---

## How to Create a New Route

1. **Create Your Page**:

   - Add your new page component in the `src/pages` directory.

2. **Update Routing**:

   - Open `App.tsx`.
   - Add your new route to either:
     - **Public Routes**: Accessible to all users.
     - **Private Routes**: Protected by role-based authentication.

3. **Role Guard**:
   - Ensure the route is protected by the appropriate role guard logic ( _inside admin or user routes_ ).

---

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.
- Node.js and npm/yarn installed (for local development).

### Installation

1. Clone the repository:

   ```bash
   https://github.com/Hassenamri005/nest-react-boilerplate.git

   cd your-repo
   ```

2. Start the development environment:

   ```bash
   docker-compose --profile dev up --build
   ```

3. For production:
   ```bash
   docker-compose --profile prod up --build
   ```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

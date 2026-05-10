# Manong Backend

A robust, modular backend for the Manong application. Built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Caching**: [Redis](https://redis.io/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Containerization**: [Docker](https://www.docker.com/)

---

## 🏗️ Architecture: Modular Design

The project follows a **Modular Architecture** to ensure scalability and separation of concerns. Each feature or domain is encapsulated within its own directory in `src/modules`.

### Module Structure
Each module (e.g., `user`, `auth`) typically contains:
- `*.controller.ts`: Handles HTTP requests and responses.
- `*.service.ts`: Contains business logic and database interactions.
- `*.routes.ts`: Defines API endpoints for the module.
- `*.interface.ts`: TypeScript types/interfaces specific to the domain.
- `*.schema.ts`: Validation schemas (Zod).

### Core Components
- **`src/app.ts`**: Express application setup and global middleware integration.
- **`src/server.ts`**: Bootstrap entry point for the server, Redis, and Socket.io.
- **`src/shared/`**: Common utilities, middlewares, and singletons (Prisma/Redis/Socket clients).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Redis

### Installation

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and copy the template from `.env.example` (if provided) or use the following:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:password@localhost:5432/manong_db"
    REDIS_URL="redis://localhost:6379"
    JWT_SECRET="your_secret"
    ```

### Database Setup

1.  **Generate Prisma Client**:
    ```bash
    npm run prisma:generate
    ```
2.  **Run Migrations**:
    ```bash
    npm run prisma:migrate
    ```

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with hot-reload (`ts-node-dev`). |
| `npm run build` | Compiles TypeScript to JavaScript in the `dist/` folder. |
| `npm start` | Runs the compiled production build from `dist/`. |
| `npm run prisma:generate` | Generates the Prisma client based on the schema. |
| `npm run prisma:migrate` | Runs Prisma development migrations. |
| `npm run lint` | Runs ESLint to check for code quality issues. |

---

## 🐳 Docker Support

You can spin up the entire environment (App + DB + Redis) using Docker Compose:

```bash
docker-compose up --build
```

- **API**: `http://localhost:5000`
- **Postgres**: `localhost:5432`
- **Redis**: `localhost:6379`

---

## 🛡️ Error Handling & Responses

The project uses a standardized response and error handling system:

- **Success Response**: Handled by `sendResponse` utility.
- **Async Errors**: Handled by `catchAsync` wrapper (no more manual try-catch in controllers).
- **Global Error Handler**: Catches all errors and returns a consistent JSON structure.

---

## 🤝 Contributing

1. Create a new module in `src/modules`.
2. Register the module routes in `src/routes/index.ts`.
3. Follow the established folder structure and naming conventions.

<div style="text-align:center">
    <img alt="The main logo of Taskr" width="400" src="client/public/images/logo.svg" title="Taskr 
Logo"/>
</div>

**Taskr** is a **task management** application designed to help you organize, prioritize, and collaborate on your projects seamlessly. Whether you're working solo or as part of a team, **Taskr** provides the tools you need to stay productive and efficient. This project was developed with a focus on Java Spring Boot studies. Therefore, the Front End may not be fully implemented.

## 📚 Features

- Task creation, editing, and deletion
- Project management
- Some collaboration
- Real-time notifications
- Comments and activity (project feed) tracking
- Authentication and authorization (Credentials)
- Statistics and reporting

## 🚀 Built With

### Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript
- NextAuth.js

### Backend

- Java 24
- Spring Boot
- Spring Security
- Spring Data JPA
- WebSocket
- Redis
- PostgreSQL
- H2 (for development/testing)
- Lombok

## 🛠️ Project Setup

### Prerequisites & verification (Windows cmd.exe)

Before you start, verify the tools required to run the frontend and backend. The commands below are written for Windows `cmd.exe`. If you use PowerShell or a Unix shell, replace `\` with `/` and execute the appropriate wrapper (for example `./mvnw` on macOS/Linux).

Minimum recommended versions (project was developed with these):
- Java 24 (required to build/run the backend)
- Node.js 18+ (Next.js requires a modern Node)
- pnpm (used to install frontend deps)
- Docker & Docker Compose (or Docker Desktop)
- Git

Verification commands (run in `cmd.exe`) and expected results:

- Java (runtime and compiler):
  ```bat
  java -version
  javac -version
  ```
  Expected: shows Java 24 (or compatible JDK). If `java` or `javac` is not found, install a JDK (Adoptium/Temurin, Oracle, or OpenJDK) and ensure JAVA_HOME is set.

- Maven wrapper (optional if you prefer system Maven):
  ```bat
  .\mvnw.cmd -v
  ```
  The project ships a Maven wrapper (`mvnw.cmd`) so you do not need Maven installed globally. Running the wrapper prints the Maven version used.

- Docker and Docker Compose (verify containers):
  ```bat
  docker --version
  docker compose version
  docker ps
  ```
  Expected: Docker running and `docker ps` lists active containers. On Windows, Docker Desktop with WSL2 is recommended.

- Node / npm / pnpm:
  ```bat
  node -v
  npm -v
  pnpm -v
  ```
  If `pnpm` is missing, install it with:
  ```bat
  npm install -g pnpm
  ```

- Git:
  ```bat
  git --version
  ```

Quick diagnostic (copy and paste into `cmd.exe` to run basic checks):

```bat
java -version
javac -version
.\mvnw.cmd -v
node -v
npm -v
pnpm -v || echo pnpm not found
docker --version
docker compose version
docker ps
git --version
```

Common troubleshooting tips
- Java errors: make sure JAVA_HOME points to a JDK installation and that `java`/`javac` are on PATH. On Windows you can set JAVA_HOME in System Properties → Environment Variables.
- mvnw permission or execution problems: use `mvnw.cmd` on Windows (`.\mvnw.cmd spring-boot:run`). On Unix/macOS use `./mvnw spring-boot:run`.
- Docker on Windows: install Docker Desktop and enable WSL2 backend. Ensure the Docker service is running and you have sufficient permissions.
- Port conflicts: default ports are 3000 (frontend), 8080 (backend), 5432 (Postgres), 6379 (Redis). If any port is busy, stop the occupying service or change the port in the corresponding config.
- pnpm / Node problems: ensure Node and pnpm are compatible with the Next.js version used. If builds fail, try clearing pnpm cache (`pnpm store prune`) and reinstalling (`pnpm install`).

### Frontend

1. Copy `.env.example` to `.env.local` and adjust values as needed.
2. Install dependencies and start the development server (Windows `cmd.exe`):
   ```bat
   cd client
   pnpm install
   pnpm dev
   ```

### Backend

1. Start database and Redis using Docker Compose:
   ```bat
   cd server
   docker compose up -d
   ```
2. Start the backend server (Windows):
   ```bat
   cd server
   .\mvnw.cmd spring-boot:run
   ```

   On macOS/Linux use:
   ```bash
   ./mvnw spring-boot:run
   ```

## 🗂️ Folder Structure

```
.
├── client
│   ├── node_modules
│   ├── public
│   ├── src
│   │   ├── @types
│   │   ├── actions
│   │   ├── app
│   │   ├── components
│   │   ├── helpers
│   │   ├── providers
│   │   ├── utils
│   │   ├── auth.ts
│   │   └── middleware.ts
│   ├── .env.local
│   ├── .gitignore
│   ├── .prettierignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── postcss.config.mjs
│   ├── README.md
│   └── tsconfig.json
├── server
│   ├── .idea
│   ├── .mvn
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── barataribeiro
│   │   │   │           └── taskr
│   │   │   │               ├── activity
│   │   │   │               ├── admin
│   │   │   │               ├── authentication
│   │   │   │               ├── comment
│   │   │   │               ├── config
│   │   │   │               ├── exceptions
│   │   │   │               ├── helpers
│   │   │   │               ├── membership
│   │   │   │               ├── notification
│   │   │   │               ├── project
│   │   │   │               ├── stats
│   │   │   │               ├── task
│   │   │   │               ├── user
│   │   │   │               ├── utils
│   │   │   │               └── ServerApplication.java
│   │   │   └── main.iml
│   │   ├── test
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── barataribeiro
│   │   │   │           └── taskr
│   │   │   │               ├── authentication
│   │   │   │               ├── comment
│   │   │   │               ├── config
│   │   │   │               │   └── security
│   │   │   │               ├── exceptions
│   │   │   │               ├── membership
│   │   │   │               ├── notification
│   │   │   │               ├── project
│   │   │   │               ├── stats
│   │   │   │               ├── task
│   │   │   │               ├── user
│   │   │   │               ├── utils
│   │   │   │               └── ServerApplicationTests.java
│   │   │   └── test.iml
│   ├── target
│   ├── .gitattributes
│   ├── .gitignore
│   ├── compose.yml
│   ├── HELP.md
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   └── taskr.iml
```

## 🙌 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📜 License

This project is free software available under the [GPLv3](LICENSE) license.

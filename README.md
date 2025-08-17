<div align="center">
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

### Frontend

1. Copy `.env.example` to `.env.local` and adjust values as needed.
2. Install dependencies and start the development server:
   ```bash
   cd client
   pnpm install
   pnpm dev
   ```

### Backend

1. Start database and Redis using Docker Compose:
   ```bash
   cd server
   docker compose up -d
   ```
2. Start the backend server:
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

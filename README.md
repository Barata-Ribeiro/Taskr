<div align="center">
    <img alt="The main logo of Taskr" width="400" src="client/public/images/logo.svg" title="Taskr 
Logo"/>
</div>


**Taskr** is a **task management** application designed to help you organize, prioritize, and collaborate on your projects seamlessly. Whether you're working solo or as part of a team, **Taskr** provides the tools you need to stay productive and efficient.

## 📚 Features

### Backend

- **RESTful API** 📡: Robust and scalable API built with Spring Boot.
- **Authentication & Authorization** 🔒: Secure user authentication using JWT.
- **Real-time Updates** ⚡: WebSocket support for instant notification updates.
- **Database Integration** 🗄️: Support for PostgreSQL and H2 databases.
- **API Documentation** 📄: Comprehensive API docs with Swagger.

### Frontend

- **Responsive UI** 📱: Built with Next.js and Tailwind CSS for a responsive design.
- **Real-time Communication** 💬: Integration with WebSockets for live notification updates.
- **Authentication** 🔐: Secure login and signup with NextAuth.
- **State Management** 📊: Efficient state handling with React hooks and context.
- **Iconography** 🎨: Enhanced UI with React Icons.

## 🚀 Built With

### Frontend

The frontend of MediManage is built using modern technologies to ensure a responsive and seamless user experience.

- **Next.js** (`next`): A React framework for server-rendered applications.
- **React** (`react`, `react-dom`): A JavaScript library for building user interfaces.
- **Tailwind CSS** (`tailwindcss`, `@tailwindcss/forms`, `@tailwindcss/typography`): A utility-first CSS framework for rapid UI development.
- **NextAuth.js** (`next-auth`): Authentication for Next.js applications.
- **Zod** (`zod`): A TypeScript-first schema validation library.
- **React Icons** (`react-icons`): Include popular icons in your React projects easily.

### Backend

The backend leverages the power of Spring Boot to provide a scalable and secure foundation for the application.

- **Spring Boot Starter Web** (`spring-boot-starter-web`): Build web applications, including RESTful services.
- **Spring Boot Starter Data JPA** (`spring-boot-starter-data-jpa`): Simplify data persistence with JPA.
- **Spring Boot Starter Security** (`spring-boot-starter-security`): Secure the application with Spring Security.
- **Spring Boot Starter Validation** (`spring-boot-starter-validation`): Provide validation support.
- **Spring Boot Starter Websocket** (`spring-boot-starter-websocket`): Enables real-time, bidirectional communication.
- **PostgreSQL Driver** (`postgresql`): Connect to PostgreSQL databases.
- **H2 Database** (`h2`): An in-memory database for development and testing.
- **Java JWT** (`java-jwt`): JSON Web Token (JWT) creation and verification.
- **ModelMapper** (`modelmapper`): Simplify object mapping.
- **Lombok** (`lombok`): Reduce boilerplate code with annotations.
- **SpringDoc OpenAPI** (`springdoc-openapi-starter-webmvc-ui`, `springdoc-openapi-starter-webflux-ui`): Generate API documentation.
- **Spring Boot DevTools** (`spring-boot-devtools`): Enhance the development experience with automatic restarts.

## 🛠️ Project Setup

### Prerequisites

- **Frontend**:
    - [Node.js](https://nodejs.org/) (v18 or later)
    - [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

- **Backend**:
    - [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Clone the Repository
```bash
git clone https://github.com/Barata-Ribeiro/Taskr.git
cd Taskr
```

1. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using Yarn:

   ```bash
   yarn install
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file in the `client` directory and add the necessary environment variables:

   ```env
    AUTH_SECRET=AUTO_GEN_AUTH_JS_KEY # Added by npx auth. Read more: https://cli.authjs.dev
    AUTH_URL=BACKEND_AUTH_URL
    AUTH_TRUST_HOST=TRUE_OR_URLS
    NEXT_PUBLIC_BASE_URL=FRONT_END_ORIGIN_URL
   ```

3. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

4. **Build for Production**

   ```bash
   npm run build
   npm start
   ```
### Backend Setup

1. **Navigate to the Server Directory**

   ```bash
   cd MediManage/server
   ```

2. **Adjust the `docker-compose.yml`**

   Update the file with the necessary environment variables and/or configuration changes for running the backend.

3. **Adjust `Dockerfile`**

   Update the `Dockerfile` with any necessary changes for the backend.

4. **Configure Environment Variables**

   Ensure the following environment variables are set in the `docker-compose.yml` under the `taskr-backend` service:

   ```yaml
   environment:
     DB_ORIGIN: taskr-database
     DB_PORT: 5432
     DB_NAME: taskr_db
     DB_USER: postgres
     DB_PASSWORD: postgres
     JWT_SECRET: secret
     CORS_ORIGINS: http://localhost:3000
   ```

    **Additional Environment Variables:**
    ```env
    ADMIN_DISPLAY_NAME=YOUR_DISPLAY_NAME
    ADMIN_EMAIL=contact@example.com
    ADMIN_FIRST_NAME=YOUR_FIRST_NAME
    ADMIN_LAST_NAME=YOUR_LAST_NAME
    ADMIN_PASSWORD=YOUR_PASSWORD
    ADMIN_USERNAME=YOUR_USERNAME
    ```
5. **Run the Services**

   From the `server` directory, run:

   ```bash
   docker-compose up --build
   ```

   This command will build the backend application and start both the PostgreSQL database and the backend service. The backend will be accessible at [http://localhost:8080](http://localhost:8080).

## 🗂️ Folder Structure

### Backend
```
server/
├── src/
│   ├── main/
│   │   ├── java/com/barataribeiro/taskr/
│   │   │   ├── builder/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   ├── exceptions/
│   │   │   ├── models/
│   │   │   ├── repositories/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   └── ServerSpringbootApplication.java
│   └── test/
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── mvnw
├── mvnw.cmd
├── pom.xml
└── taskr.iml
```

### Frontend
```
client/
├── public/
├── src/
│   ├── actions/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── interfaces/
│   ├── providers/
│   ├── utils/
│   ├── auth.ts
│   └── middleware.ts
├── .env.local
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🗄️ Environment Variables

### Client `.env.local` Example

```env
AUTH_SECRET=SECRET_KEY
AUTH_URL=BACKEND_AUTH_URL
AUTH_TRUST_HOST=TRUE_OR_URLS
NEXT_PUBLIC_BASE_URL=FRONT_END_ORIGIN_URL
```

### Backend Properties

#### Development (`application-dev.properties`)

```properties
spring.application.name=taskr
springdoc.api-docs.path=/api-docs
spring.threads.virtual.enabled=true
# Database Configuration
spring.datasource.url=jdbc:h2:file:~/data/taskr_db_test
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
# Security and seed
api.security.token.secret=${JWT_SECRET}
api.security.cors.origins=${CORS_ORIGINS}
api.security.seeder.admin.username=${ADMIN_USERNAME}
api.security.seeder.admin.displayName=${ADMIN_DISPLAY_NAME}
api.security.seeder.admin.firstName=${ADMIN_FIRST_NAME}
api.security.seeder.admin.lastName=${ADMIN_LAST_NAME}
api.security.seeder.admin.email=${ADMIN_EMAIL}
api.security.seeder.admin.password=${ADMIN_PASSWORD}
# Spring Docs
springdoc.swagger-ui.operationsSorter=alpha
springdoc.swagger-ui.tagsSorter=alpha
```

#### Production (`application-prod.properties`)

```properties
spring.application.name=taskr
springdoc.api-docs.path=/api-docs
spring.threads.virtual.enabled=true
# Database Configuration
spring.datasource.url=jdbc:postgresql://${DB_ORIGIN:localhost}:${DB_PORT:5432}/${DB_NAME:taskr_db}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver
# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true
# Security and seed
api.security.token.secret=${JWT_SECRET}
api.security.cors.origins=${CORS_ORIGINS}
api.security.seeder.admin.username=${ADMIN_USERNAME}
api.security.seeder.admin.displayName=${ADMIN_DISPLAY_NAME}
api.security.seeder.admin.firstName=${ADMIN_FIRST_NAME}
api.security.seeder.admin.lastName=${ADMIN_LAST_NAME}
api.security.seeder.admin.email=${ADMIN_EMAIL}
api.security.seeder.admin.password=${ADMIN_PASSWORD}
```

## 🙌 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## 📜 License

This project is free software available under the [GPLv3](LICENSE) license.

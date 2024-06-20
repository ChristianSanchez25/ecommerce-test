<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# E-commerce API Test

## Description

This is a simple e-commerce API that allows users to create, read, update, and delete products and orders. It also includes user authentication with JWT, product inventory management, and customer order processing.

### Key Features

- **User Authentication**: Secure user registration and login using JWT-based authentication and authorization.
- **CRUD Operations for Products**: Endpoints for creating, reading, updating, and deleting products.
- **Order Management**: Allow authenticated users to place orders, manage order history, and capture essential order details.
- **Clean Architecture**: The API is designed following clean architecture principles to ensure scalability and maintainability.

## ℹ️ Prerequisites

- [Node.js](https://nodejs.org/es/download/)
- [NestJS](https://docs.nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/products/docker-desktop)

## ⚙️ Installation

1. **Clone the repository:**

   ```bash
   $ git clone https://github.com/ChristianSanchez25/ecommerce-test.git
   ```

2. **Install the dependencies:**

   ```bash
   $ npm install
   ```

3. **Clone the `.env.template` file and rename it to `.env`:**

   ```bash
   $ cp .env.template .env
   ```

4. **Change the values of the environment variables in the `.env` file**

5. **Run the application:**

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev

   # production mode
   $ npm run start:prod
   ```

6. **Access the API documentation:**

   Open your browser and navigate to `http://localhost:PORT/docs` to view the API documentation.

### 🐋 Docker

This project includes a `dockerfile` and a `docker-compose.yml` file that allows you to run the application in a container.

1. **Clone the `.env.template` file and rename it to `.env`:**

   ```bash
   $ cp .env.template .env
   ```

2. **Build the containers with Docker Compose:**

   ```bash
   $ docker-compose build
   ```

3. **Run the containers in detached mode:**

   ```bash
   $ docker-compose up -d
   ```

4. **Stop the containers:**

   ```bash
   $ docker-compose down
   ```

5. **Access the API documentation:**

   Open your browser and navigate to `http://localhost:PORT/docs` to view the API documentation.

## 🧪 Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📝 API Documentation

The API documentation is generated using Swagger. You can access it by navigating to `http://localhost:PORT/docs`.

## 📚 Technologies

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Swagger](https://swagger.io/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/)

## 🛠️ Development Workflow

**Code Formatting**

To ensure consistent code formatting, this project uses Prettier. You can format your code by running:

```bash
$ npm run format
```

**GitHub Actions**

This project includes a GitHub Actions workflow that runs the tests on every push to the `main` branch. The configuration for the workflow is stored in the .github/workflows directory.

## 📧 Contact

- [Christian Sanchez](https://github.com/ChristianSanchez25)
- [Email](mailto:christianjsanchezr@gmail.com)

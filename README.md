<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# E-commerce API Test

## Description

This is a simple e-commerce API that allows users to create, read, update and delete products and categories. It also allows users to add products to a cart and checkout.

## ⚙️ Installation

1. Clone the repository:

```bash
$ git clone https://github.com/ChristianSanchez25/ecommerce-test.git
```

2. Install the dependencies:

```bash
$ npm install
```

3. Clone the `.env.template` file and rename it to `.env`

4. Change the values of the environment variables in the `.env` file

5. Run the application:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 🐋 Docker

This project has a `Dockerfile` and a `docker-compose.yml` file that allows you to run the application in a container.

1. Copy the `.env.template` file and rename it to `.env`

2. Build the image with database:

```bash
$ docker-compose up --build
```

3. Run the container:

```bash
$ docker-compose up -d
```

If you want to stop the container, run the following command:

```bash
$ docker-compose down
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

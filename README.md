![Logo](./frontend/src/assets/logo_cc.png)

## CodeCapable

This repository contains a university project for a programming practice/learning platform inspired by Leetcode. It was done for the Advanced Software course at Fontys UAS, Eindhoven.

The project features:

* A frontend built with [Vite](https://vitejs.dev/) + [React](https://react.dev/), using [Bootstrap](https://getbootstrap.com/) and [MUI](https://mui.com/material-ui/).
* A microservice-based backend consisting of 3 microservices, built with [NestJS](https://nestjs.com/), communicating with each other via [RabbitMQ](https://www.rabbitmq.com/).
* Sandboxed execution of user-provided code snippets using the [Judge0](https://judge0.com/) API.
* Kubernetes setup which works in Minikube (some adjustments are needed for cloud Kubernetes providers).
* Docker compose setup (was used primarily for development).
* A GitLab CI/CD pipeline.
* End-to-end tests setup with [Playwright](https://playwright.dev/).
* Simplistic reverse-proxy API gatewey (used only for development).
* [Sentry](https://sentry.io/welcome/) integration for error monitoring.

### How to run it?

#### Docker compose

1. Clone the repository
2. Copy the contents of `.env.compose.example` to `.env.compose` in the root of the repository.
3. Start Docker
4. `docker compose build`
5. `docker compose up` and wait up to 1 minute.
6. Frontend is available at `localhost:3333`

**NOTE:** Keep in mind that this will run the project without Judeg0, meaning user-provided code will be executed locally inside the `runner-ms` microservice. This **does not** provide any security measures against misuse and any malicious code will be executed as-is. If you want to make use of Judge0, get yourself a Judge0 API key (they offer a free tier) and include the following variables in `.env.compose`:
* `JUDGE_KEY=yourJudge0KeyHere`
* `USE_JUDGE=true`

**NOTE:** GitHub OAuth will not work, as the repository does not contain the OAuth client secret of the GitHub CodeCapable app.

**NOTE:** Sentry will not work unless `SENTRY_DSN_PROBLEM`, `SENTRY_DSN_RUNNER`, `SENTRY_DSN_USER` environment variables are included in `.env.compose`.


#### Kubernetes

Follow the instructions in the [README](/k8s/README.md) in `/k8s`.

### Sample credentials

On the first run, several problems and users will be seeded in the database. All passwords in the database are hashes of `123qwe123`.

To log in with an admin account, use the following credentials
* Username: `kiril`
* Password: `123qwe123`
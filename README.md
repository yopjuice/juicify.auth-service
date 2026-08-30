# Juicify Auth Service

## Description

**Auth Service** is the core microservice of the **Juicify** music platform, responsible for all users and RBAC.
> Part of the [Juicify](https://github.com/yopjuice/juicify) ecosystem by **yopjuice**.

---

##  Architecture

To be updated

## Project setup

```bash
$ pnpm install
# generates sql queries
$ pnpm run db:types
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js + TypeScript | Core platform |
| **Framework** | NestJS | Microservice framework |
| **Database** | PostgreSQL 16+ | Persistent storage |
| **SQL Driver** | `pg` / `postgres` | Raw SQL queries |
| **API Protocol** | gRPC (`@grpc/grpc-js`) | Inter-service communication |
| **Validation** | class-validator + class-transformer | DTO validation |
| **Logging** |  Pino | Structured logging |
| **Testing** | Vitest | Unit & integration tests |
| **Package Manager** | pnpm | Fast, disk-efficient installs |
| **Containerization** | Docker + docker-compose | Local dev & deployment |

---

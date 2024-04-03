# Tasktime Auth Service

## Description

An authorization microservice. This service handles authenticating login and access. It provides encrypting and decrypting of cookie data containing JWT tokens, and generating, verifying and revoking of JWT tokens.

## Dependancies

NAT Messaging Server

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

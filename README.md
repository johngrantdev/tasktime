# Tasktime Monorepo

This monorepo contains the following apps:

#### Back End:
- [API Gateway Service](apps/backend/api-gateway/README.md) - REST API gateway for various services. The service applies auth guards to each protected API route.
- [Authentication Service](apps/backend/auth/README.md) - This service handles authenticating login and access. It provides encrypting and decrypting of cookie data containing JWT tokens, and generating, verifying and revoking of JWT tokens.
- [Communication Service](apps/backend/communication/README.md) - This service is used for sending emails utilizing Handlebars and Nodemailer.
- [Entity Service](apps/backend/entity-service/README.md) - This service handles entities such as Tasks, Projects, Organisations, Members and Notification. The service connects to PostgreSQL using MikroORM. The service enforces CASL abilities based access control based on the authenticated user.
- [CMS Service](apps/backend/cms/README.md) - A CMS built using PayloadCMS and used for public pages on the frontend.

#### Front End:
- [Web Service](apps/frontend/web/README.md)

### Depenacies
- NATS Messaging Server - NATS is used for communication between the backend microservices.
- PostgreSQL Server - Postgres is used by both the Entity Service and the CMS.

### Old Repositories
The backend server was originally a monolithic Nest.js app with the fronend is a seperate repo. These old repos can be found at the links below
- [johngrantdev/tasktime-server](https://github.com/johngrantdev/tasktime-server)
- [johngrantdev/tasktime-client](https://github.com/johngrantdev/tasktime-client)

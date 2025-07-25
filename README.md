# LMS BE

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Initial setup

The below project initialization steps helps us to get started with the development. It is advised to use the proper Nx commands from the Nx menu item.

1. Run `npm i .`
2. Run `npm run docker`
   1. You'd require docker installed to have the setup script automatically create the postgres instance.
   2. You also need the docker service running, start docker desktop
3. Run `npm run db`
4. Run `npm run start:super-admin`
5. Run `npm run start:admin`

## VSCODE Docker Development Environment

You can use vscode dev container to easily start developing

1. set the env database_url to host.docker.internal instead of localhost.
2. after that you may `npx prisma migrate dev` as needed.
3. The password for the node user on the dev container is `LMS@2025admin`

## Notes for Production Deployment

1. We are supposed to target `prod` on the DOCKERFILE for production use cases.
2. The docker build process requires environment variables to proceed, refer `docker-compose.yaml`
3. Once you have the docker image, upload the image to a repository like Elastic Container Registry or Azure Container Repository
4. Use Kubernetes or Elastic Container Service to deploy the images.
5. There are 3 services for this project SuperAdmin, Admin and scheduler.
6. These connect to a database and have to be on the same subnet. Env variables to be provided to reach the DB
7. Maintain a .env for the build and operation - Prerably move secrets to Azure Key Store / Vault

## Nx Commands

Refer [Nx Readme](./Nx.md)

## Start the application

1. Run `npm run start` to start the development server. Happy coding!
2. You might need to run `npm run docker` before you start the application

## Build for production

Run `npx nx build lms` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

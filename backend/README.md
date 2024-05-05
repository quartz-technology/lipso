# <h1 align="center"> Backend </h1>

## Introduction

This is the backend for the `lipso` project. It is responsible for fetching the liquidity positions data from various networks and protocols and serving it to the frontend.

## Architecture

## Prerequisites

We assume that you'll run the backend using Docker. This minimizes the setup required on your local machine.
Therefore, you'll need to have the following installed on your machine:
- [Docker](https://docs.docker.com/get-docker/)

## Getting Started

### Development

To run the backend in development mode, run the following command from the repository root:
```bash
docker-compose -f docker-compose.dev.yaml up backend # Optionally add -d to run in detached mode and --build to rebuild the image.
```

This will start the backend server in development mode. The server will automatically reload when you make changes to the code.

### Production

## Authors

Made with ❤️ by the 📡 at [Quartz](https://quartz.technology).

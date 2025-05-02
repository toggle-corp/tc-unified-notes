FROM node:20-bookworm AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /code
RUN git config --global --add safe.directory /code

COPY package.json pnpm-lock.yaml /code/
RUN corepack prepare --activate

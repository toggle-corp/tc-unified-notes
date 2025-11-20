FROM node:20-bookworm AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@10.6.1 yarn@1.22.19 --force \
    && git config --global --add safe.directory /code

WORKDIR /code

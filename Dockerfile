FROM node:20-bookworm AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/* \
    # NOTE: yarn > 1.22.19 breaks yarn-install invoked by pnpm
    && npm install -g pnpm@8.6.0 yarn@1.22.19 --force

RUN npm install -g pnpm

WORKDIR /code

RUN git config --global --add safe.directory /code

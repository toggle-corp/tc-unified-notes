FROM node:20-bookworm AS dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm@10.6.1 yarn@1.22.19 --force \
    && git config --global --add safe.directory /code

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN --mount=type=bind,source=package.json,target=package.json \
    corepack install && corepack enable

WORKDIR /code

# -------------------------- Builder ----------------------------------
FROM dev AS builder

COPY package.json pnpm-lock.yaml /code/

RUN corepack prepare --activate

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    pnpm install --frozen-lockfile

COPY . /code/

# -------------------------- Web app build -----------------------------

FROM builder AS web-app-serve-build

ENV APP_TITLE=TC-Unified-Notes
ENV APP_UNIFIED_API_ENDPOINT=https://notes-api.local.togglecorp.com/


RUN WEB_APP_SERVE_ENABLED=true pnpm build

# Final image using web-app-serve
FROM ghcr.io/toggle-corp/web-app-serve:v0.1.2 AS web-app-serve

LABEL maintainer="Togglecorp"
LABEL org.opencontainers.image.source="https://github.com/toggle-corp/tc-unified-notes"

ENV APPLY_CONFIG__SOURCE_DIRECTORY=/code/build/

COPY --from=web-app-serve-build /code/build "$APPLY_CONFIG__SOURCE_DIRECTORY"

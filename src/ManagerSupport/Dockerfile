ARG ENVIRONMENT

FROM mcr.microsoft.com/playwright:v1.45.1-jammy AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Layer 1
FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Layer 2
FROM base AS build
 
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Layer 3
FROM base AS final
 
WORKDIR /app

RUN groupadd -g 2000 nodeuser \
&& useradd -m -u 2001 -g nodeuser nodeuser

RUN chown -R  nodeuser /app

COPY --chown=nodeuser:nodeuser --from=deps /app/node_modules /app/node_modules
COPY --chown=nodeuser:nodeuser --from=build /app/dist /app/dist

USER nodeuser

EXPOSE 8082

# Start the server using the production build
CMD [ "node", "dist/main.js" ]


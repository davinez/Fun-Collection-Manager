ARG ENVIRONMENT=dev

FROM mcr.microsoft.com/playwright:v1.45.1-jammy AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

##### PROD #####

FROM base AS deps-prod

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-prod
 
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build


FROM base as final-prod
 
WORKDIR /app

RUN groupadd -g 2000 nodeuser \
&& useradd -m -u 2001 -g nodeuser nodeuser

RUN chown -R  nodeuser /app

COPY --chown=nodeuser:nodeuser --from=deps-prod /app/node_modules /app/node_modules
COPY --chown=nodeuser:nodeuser --from=build-prod /app/dist /app/dist

USER nodeuser

EXPOSE 8082

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

##### END PROD #####

##### DEV #####

FROM base AS build-dev

COPY . /app

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install 


FROM base as final-dev
 
WORKDIR /app

RUN pnpm add -g @nestjs/cli

RUN groupadd -g 2000 nodeuser \
&& useradd -m -u 2001 -g nodeuser nodeuser

RUN chown -R  nodeuser /app

COPY --chown=nodeuser:nodeuser --from=build-dev /app /app 

USER nodeuser

EXPOSE 8082

# Expose debugging port
EXPOSE 9229

CMD ["pnpm","run","start:debug"]

##### END DEV #####

#### FINAL
FROM final-${ENVIRONMENT} AS final


# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine AS base
WORKDIR /app

FROM base AS cloud
RUN apk add --no-cache curl
COPY --chown=1000:1000 . .
RUN chown bun:bun /app
USER bun
RUN bun install
# RUN chown bun:bun -R /app/apps/cloud

# Run the cloud service
EXPOSE 8787/tcp
ENTRYPOINT ["bun", "run", "--filter", "mindwtr-cloud", "dev", "--", "--host", "0.0.0.0", "--port", "8787"]
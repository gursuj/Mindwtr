# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine AS base
WORKDIR /app

FROM base AS app
COPY --chown=1000:1000 . .
RUN chown bun:bun /app
USER bun
RUN bun install
# RUN chown bun:bun -R /app/apps/desktop

# Run the PWA
EXPOSE 5173/tcp
ENTRYPOINT ["bun", "desktop:web", "--host", "0.0.0.0", "--port", "5173"]
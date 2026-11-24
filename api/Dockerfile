FROM oven/bun:1

# The image's built-in "bun" user (uid/gid 1000) is used instead of root so
# that files written into the bind-mounted project (bun.lock, migrations)
# keep the host user's ownership instead of root's.
WORKDIR /app
RUN chown bun:bun /app
USER bun

COPY --chown=bun:bun package.json bun.lock ./
RUN bun install

COPY --chown=bun:bun . .

EXPOSE 3000

CMD ["bun", "run", "dev"]

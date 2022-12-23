FROM node:16.19.0-bullseye-slim as base
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
WORKDIR /full-stack-webrtc
# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml .pnpmfile.cjs ./
RUN pnpm install --frozen-lockfile --prod
COPY . .

FROM base as production
CMD ["pnpm", "run", "build"]

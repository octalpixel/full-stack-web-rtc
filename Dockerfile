FROM node:16.19.0-bullseye-slim as base
WORKDIR /full-stack-webrtc
# Update npm | Install pnpm | Set PNPM_HOME | Install global packages
RUN npm i -g npm@latest; \
 npm install -g pnpm; \
 pnpm setup; \
 mkdir -p /usr/local/share/pnpm &&\
 export PNPM_HOME="/usr/local/share/pnpm" &&\
 export PATH="$PNPM_HOME:$PATH"; \
 pnpm bin -g
COPY ./package.json .

FROM base as development
RUN pnpm install
COPY . .
EXPOSE 6969
CMD ["pnpm", "run", "dev"]

FROM base as production
RUN pnpm install --frozen-lockfile --prod
COPY . .
EXPOSE 6969
CMD ["pnpm", "run", "build", "&&", "pnpm", "run", "start"]

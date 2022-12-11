FROM node:16.14.1
WORKDIR /app
COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["pnpm", "start"]
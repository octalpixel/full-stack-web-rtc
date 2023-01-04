# SQUAD

Squad is a peer to peer group text chatting, audio / video calling and file sharing progressive web application (PWA).  No communications flow through the server, so there are no records or logs of communications that anyone other than you and peers you have engaged with have access to.  Communication history between two clients is stored on each client's device.  The server is only responsible for registering users, authenticating them, and facilitating requested peer to peer connections.  Once a connection has been established, the server receives no further data from either client unless and until renegotiation of connectivity is needed.

We value privacy and free speech.  We will never censor, modify, clarify, delete, promote, sell, monetize or distribute any content you share because, other than your login credentials which we do store securely in a database (encrypted / hashed) so that other users can have confidence that they are conversing with you, your content never reaches our servers.

## Built With

- Docker (https://docs.docker.com/)
-	Fastify (https://www.fastify.io/docs/latest/)
-	JSONWebTokens (https://jwt.io/introduction)
-	Material UI (https://mui.com/material-ui/getting-started/overview/)
-	MongoDB (https://www.mongodb.com/docs/)
-	NodeJS (https://nodejs.org/en/docs/)
-	React (https://beta.reactjs.org/)
-	React Router (https://reactrouter.com/en/main)
-	Socket.io (https://socket.io/docs/v4/)
-	TanStack React Query (https://tanstack.com/query/v4/docs/overview)
-	tRPC (https://trpc.io/docs)
-	Vite (https://vitejs.dev/guide/)
-	WebRTC (https://webrtc.org/)
-	Zod (https://zod.dev/)

## Getting Started

Open a terminal and navigate to where you would like the project directory to live (perhaps ~/Git or ~/projects; something like that).  Then clone the repository with:

```
git clone https://github.com/theMostCuriousHomunculus/full-stack-web-rtc.git
```

Navigate into the newly created subdirectory with:

```
cd full-stack-web-rtc
```

The simplest way to get up and running is to download and install Docker Desktop on your machine if you don't have it already (follow the instructions in the Docker documentation linked above).  Then in your terminal:

```
docker-compose up -d
```

And when you're done:

```
docker-compose down
```

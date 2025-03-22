import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { PrismaClient } from "@prisma/client";
import { jwtConfig } from "./config/jwt";
import { authRoutes } from "./routes/auth";
import { profileRoutes } from "./routes/profile";

const prisma = new PrismaClient();

const app = new Elysia()
  .use(swagger())
  .use(jwt(jwtConfig))
  .use(cookie())
  .decorate("db", prisma)
  .use(authRoutes)
  .use(profileRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

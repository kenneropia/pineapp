import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { PrismaClient } from "@prisma/client";
import profileRoutes from "./routes/profile";

const prisma = new PrismaClient();

import authMiddleware from "./middleware/auth";
import authRoutes from "./routes/auth";

const app = new Elysia()
  .use(
    swagger({
      swaggerOptions: { persistAuthorization: true },
      documentation: {
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  )
  .use(authRoutes)
  .use(profileRoutes)

  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}\n📚 API Documentation available at ${app.server?.hostname}:${app.server?.port}/swagger`
);

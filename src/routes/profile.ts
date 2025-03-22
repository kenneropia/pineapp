import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/jwt";
import authMiddleware from "../middleware/auth";

const prisma = new PrismaClient();

const profileRoutes = new Elysia()
  .use(authMiddleware)
  .use(jwt(jwtConfig))
  .decorate("db", prisma)
  .get(
    "/profile",
    async ({ db, headers, auth }) => {
      const payload = await auth();
      if (typeof payload === "string") return payload;

      return db.user.findUnique({
        where: { id: Number(payload.id) },
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
        },
      });
    },
    {
      detail: {
        summary: "Get user profile",
        description: "Retrieve authenticated user profile information",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  .put(
    "/profile",
    async ({ body, db, auth }) => {
      const payload = await auth();
      if (typeof payload === "string") return payload;

      return db.user.update({
        where: { id: Number(payload.id) },
        data: body || {},
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatar: true,
        },
      });
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        bio: t.Optional(t.String()),
        avatar: t.Optional(t.String()),
      }),
      detail: {
        summary: "Update user profile",
        description: "Update authenticated user profile information",
        security: [{ bearerAuth: [] }],
      },
    }
  );

export default profileRoutes;

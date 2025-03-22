import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";

import { PrismaClient } from "@prisma/client";

type RouteContext = {
  jwt: {
    sign(payload: JWTPayload): Promise<string>;
    verify(token: string): Promise<JWTPayload | null>;
  };
  db: PrismaClient;
  headers: {
    authorization: string;
  };
  body?: {
    name?: string;
    bio?: string;
    avatar?: string;
  };
};

export const profileRoutes = new Elysia()
  .use(authMiddleware)
  .get("/profile", async ({ db, headers }: RouteContext) => {
    const payload = await authMiddleware.handle({ headers });
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
  })
  .put(
    "/profile",
    async ({ body, db, headers }: RouteContext) => {
      const payload = await authMiddleware.handle({ headers });
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
    }
  );

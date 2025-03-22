import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { jwtConfig } from "../config/jwt";
import jwt from "@elysiajs/jwt";

const prisma = new PrismaClient();

type JWTPayload = {
  id: number;
};

export const authMiddleware = new Elysia()
  .use(jwt(jwtConfig))
  .derive(({ jwt }) => ({
    signJWT: async (payload: JWTPayload) => {
      return await jwt.sign(payload);
    },
  }))
  .guard({
    beforeHandle: async ({ headers, jwt, set }) => {
      const authHeader = headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        set.status = 401;
        return "Unauthorized";
      }
      const token = authHeader.split(" ")[1];
      const payload = await jwt.verify(token);
      if (!payload) {
        set.status = 401;
        return "Unauthorized";
      }
      return payload as JWTPayload;
    },
  });

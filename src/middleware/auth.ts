import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { jwtConfig } from "../config/jwt";

type JWTPayload = {
  id: number;
};

const authMiddleware = new Elysia()
  .use(jwt(jwtConfig))
  .derive(({ jwt }) => ({
    signJWT: async (payload: JWTPayload) => {
      return await jwt.sign(payload);
    },
  }))
  .derive(({ headers, jwt, set }) => {
    return {
      auth: async () => {
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
    };
  });

export default authMiddleware;

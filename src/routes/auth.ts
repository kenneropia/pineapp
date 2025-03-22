import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { jwt } from "@elysiajs/jwt";

const prisma = new PrismaClient();

const jwtConfig = {
  name: "jwt",
  secret: "your-secret-key",
};

const authRoutes = new Elysia()
  .use(jwt(jwtConfig))
  .decorate("db", prisma)
  .post(
    "/auth/register",
    async ({ body, db }) => {
      const existingUser = await db.user.findUnique({
        where: { email: body.email },
      });

      if (existingUser) {
        return { error: "Email already registered" };
      }

      const hashedPassword = await Bun.password.hash(body.password);

      const user = await db.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      return user;
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String({ minLength: 6 }),
        name: t.String(),
      }),
    }
  )
  .post(
    "/auth/login",
    async ({ body, db, jwt }) => {
      const user = await db.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        return { error: "Invalid credentials" };
      }

      const validPassword = await Bun.password.verify(
        body.password,
        user.password
      );

      if (!validPassword) {
        return { error: "Invalid credentials" };
      }

      const token = await jwt.sign({ id: user.id });

      return {
        token,
        user: { id: user.id, email: user.email, name: user.name },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post(
    "/auth/reset-password",
    async ({ body, db }) => {
      const user = await db.user.findUnique({
        where: { email: body.email },
      });

      if (!user) {
        return { error: "User not found" };
      }

      const otp = "123456"; // Fixed dummy OTP
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await db.user.update({
        where: { id: user.id },
        data: { otp, otpExpiry },
      });

      return { message: "OTP sent successfully" };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
      }),
    }
  )
  .post(
    "/auth/verify-otp",
    async ({ body, db }) => {
      const user = await db.user.findUnique({
        where: { email: body.email },
      });

      if (!user || !user.otp || !user.otpExpiry) {
        return { error: "Invalid or expired OTP" };
      }

      if (user.otp !== body.otp || user.otpExpiry < new Date()) {
        return { error: "Invalid or expired OTP" };
      }

      const hashedPassword = await Bun.password.hash(body.newPassword);

      await db.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          otp: null,
          otpExpiry: null,
        },
      });

      return { message: "Password reset successfully" };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        otp: t.String(),
        newPassword: t.String({ minLength: 6 }),
      }),
    }
  );

export default authRoutes;

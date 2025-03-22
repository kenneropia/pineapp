import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Authentication Endpoints", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  let app: Elysia;
  let authToken: string;

  beforeAll(async () => {
    const { default: authRoutes } = await import("../routes/auth");
    app = new Elysia().use(authRoutes);

    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testUser),
        })
      )
      .then((res) => res.json());

    expect(response.error).toBeUndefined();
    expect(response.email).toBe(testUser.email);
    expect(response.name).toBe(testUser.name);
  });

  it("should not register a duplicate user", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:3000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testUser),
        })
      )
      .then((res) => res.json());

    expect(response.error).toBe("Email already registered");
  });

  it("should login with valid credentials", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password,
          }),
        })
      )
      .then((res) => res.json());

    expect(response.error).toBeUndefined();
    expect(response.token).toBeDefined();
    expect(response.user.email).toBe(testUser.email);
    authToken = response.token;
  });

  it("should not login with invalid credentials", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testUser.email,
            password: "wrongpassword",
          }),
        })
      )
      .then((res) => res.json());

    expect(response.error).toBe("Invalid credentials");
  });

  it("should send OTP for password reset", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:3000/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: testUser.email }),
        })
      )
      .then((res) => res.json());

    expect(response.message).toBe("OTP sent successfully");
  });

  it("should verify OTP and reset password", async () => {
    const response = await app
      .handle(
        new Request("http://localhost:3000/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testUser.email,
            otp: "123456", // Using the fixed dummy OTP
            newPassword: "newpassword123",
          }),
        })
      )
      .then((res) => res.json());

    expect(response.message).toBe("Password reset successfully");
  });
});

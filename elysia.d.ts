// elysia.d.ts
import "elysia"; // Import the original Elysia types
import { PrismaClient } from "@prisma/client";

// Augment the existing Context interface
declare module "elysia" {
  interface ElysiaContext {
    db: PrismaClient; // Add the `db` property to the Context
  }
}

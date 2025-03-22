export const jwtConfig = {
  name: process.env.JWT_NAME || "jwt",
  secret: process.env.JWT_SECRET || "your-secret-key",
};

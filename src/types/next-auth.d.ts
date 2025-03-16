import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
  }
} 
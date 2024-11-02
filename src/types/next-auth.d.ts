import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    canManageUsers: boolean;
    canManageVendors: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      canManageUsers: boolean;
      canManageVendors: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    canManageUsers: boolean;
    canManageVendors: boolean;
  }
}

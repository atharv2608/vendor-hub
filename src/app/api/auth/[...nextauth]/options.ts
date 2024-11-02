import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user) throw new Error("No user found");
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure that the redirect URL is only to your base domain or the sign-in page.
      if (url.startsWith(baseUrl) || url === "/sign-in") {
        return url;
      }
      // Otherwise, fallback to the baseUrl
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user?._id?.toString();
        token.canManageUsers = user?.canManageUsers;
        token.canManageVendors = user?.canManageVendors;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token?._id?.toString();
        session.user.canManageUsers = token.canManageUsers;
        session.user.canManageVendors = token.canManageVendors;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_AUTH_SECRET,
};

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./db";
import User from "@/models/User";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          } else {
            // Update image or name if needed, but not strictly necessary
            if (existingUser.image !== user.image) {
              existingUser.image = user.image;
              await existingUser.save();
            }
          }
          return true;
        } catch (error) {
          console.error("Error during Google signIn", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      // Useful for updating session
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
  },
});

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth Error: Missing email or password");
          return null;
        }

        try {
          const { db } = await connectToDatabase();
          const usersCollection = db.collection("users");

          // Find user by email (case-insensitive)
          const user = await usersCollection.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (!user) {
            console.log(
              `Auth Error: No user found for email: ${credentials.email}`
            );
            return null; // User not found
          }

          // Compare password with stored hash
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log(
              `Auth Error: Invalid password for email: ${credentials.email}`
            );
            return null; // Password invalid
          }

          console.log(`Auth Success: User authenticated: ${user.email}`);
          // If credentials are valid, return the user object (without the password)
          // The user object will be encoded in the JWT session token.
          return {
            id: user._id.toString(), // Convert ObjectId to string
            email: user.email,
            // Add other user properties like name or role if needed
            // name: user.name,
            // role: user.role || 'user'
          };
        } catch (error) {
          console.error("Database error during authorization:", error);
          return null; // Return null on database or bcrypt error
        }
      },
    }),
    // ...add more providers here if needed (e.g., Google, GitHub)
  ],
  session: {
    // Use JSON Web Tokens for session strategy (stateless)
    // Database strategy requires the MongoDB adapter which had version conflicts
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // Use the secret from .env.local
  pages: {
    signIn: "/auth/signin", // Redirect users to our custom sign-in page
    // error: '/auth/error', // Optional: Custom error page
    // newUser: '/auth/signup' // Optional: Redirect new users (e.g. from OAuth) to signup or profile page
  },
  // Optional callbacks
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id and role (if any) to the token right after signin
      if (user) {
        token.id = user.id;
        // token.role = user.role; // Add role if you implement it
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like user id and role.
      if (token) {
        session.user.id = token.id;
        // session.user.role = token.role; // Add role if you implement it
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

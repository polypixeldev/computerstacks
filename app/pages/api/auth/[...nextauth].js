import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password"}
        },
        async authorize(credentials, req){
          const client = await clientPromise;
          const db = client.db("project");
          const users = db.collection("users");

          const user = await users.findOne({ username: credentials.username });
          if(!user) return null;
          const auth = bcrypt.compareSync(credentials.password, user.password);

          console.log(auth)
          if(!auth){
            return null;
          } else {
            delete user.password;
            return user;
          }
        }
      }),
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM
      })
    ],
    adapter: MongoDBAdapter({
      db: (await clientPromise).db("project")
    }),
    session: {
      jwt: true
    },
    pages: {
      signIn: "/login"
    },
    jwt: {
      signingKey: process.env.JWT_SIGNING_PRIVATE_KEY
    },
    debug: false
  });
}

export default handler;
import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google'
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';

import { SessionInterface, UserProfile  } from "@/common.types";
import { getUser, createUser } from "./actions";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    jwt: {
        encode: ({ secret, token}) => {
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: "grafbase",
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                secret
              );
            return encodedToken;

        },
        decode: async ({ secret, token}) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        }
    },
    theme: {
        colorScheme: 'light',
        logo: '/logo.png',
    },
    callbacks: {
        async session({ session }) {
            const email = session?.user?.email as string;
            try {
                const userData = await getUser(email) as { user?: UserProfile };
                //connect the two
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...userData?.user,
                    }
                }
                return newSession

            } catch (error) {
                // console.log('Error retrieving user data', error)
                return session
            }

        },
        async signIn({ user }:  {user : AdapterUser | User }) {
            try {
                //get user if exist
                const userExists = await getUser(user?.email as string) as { user? : UserProfile  }

                //if dont create them
                if(!userExists.user) {
                    await createUser(user.name as string, user.email as string, user.image as string)
                }
                return true
            } catch (error : any) {
                // console.log(error)
                return false
            }
        }
    }
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions) as SessionInterface;
  
    return session;
}

//we dont want to return just our google user
//we want to hook up our google user to our users data in graph ql
//google user has name, email, avatarUrl ->
// hook it up with the users projects, links, descriptions

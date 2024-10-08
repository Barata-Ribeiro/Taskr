import { ApiResponse } from "@/interfaces/actions"
import { LoginResponse } from "@/interfaces/auth"
import { AUTH_LOGIN, AUTH_REFRESH_TOKEN } from "@/utils/api-urls"
import Credentials from "@auth/core/providers/credentials"
import NextAuth, { NextAuthConfig } from "next-auth"
import { JWT } from "next-auth/jwt"
import { cookies } from "next/headers"

/* eslint-disable @typescript-eslint/no-unused-vars */
async function refreshToken(token: JWT) {
    const URL = AUTH_REFRESH_TOKEN()
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Refresh-Token": token.refreshToken as string,
        },
        body: JSON.stringify({}),
    })

    const json = await response.json()

    if (!response.ok) {
        return { ...token, error: "RefreshAccessTokenError" }
    }

    const responseData = json as ApiResponse
    const loginResponse = responseData.data as LoginResponse

    return {
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        accessTokenExpiresAt: loginResponse.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        error: null,
    }
}

export const config = {
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    pages: {
        newUser: "/auth/register",
        signIn: "/auth/login",
    },
    providers: [
        Credentials({
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "johndoe/janedoe",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
                rememberMe: {
                    label: "Remember me",
                    type: "checkbox",
                    defaultValue: "false",
                },
            },
            async authorize(credentials, req) {
                const payload = {
                    email: credentials.username,
                    password: credentials.password,
                    rememberMe: credentials.rememberMe,
                }

                const URL = AUTH_LOGIN()

                const response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })

                const json = await response.json()

                if (!response.ok) {
                    throw new Error(json.message)
                }

                const responseData = json as ApiResponse
                const loginResponse = responseData.data as LoginResponse

                if (responseData && loginResponse) {
                    cookies().set("auth_rt", loginResponse.refreshToken!, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "lax",
                        expires: new Date(loginResponse.refreshTokenExpiresAt!),
                    })

                    return loginResponse
                }

                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user: context, account }) {
            if (account && context) {
                token.user = context.user
                token.accessToken = context.accessToken
                token.accessTokenExpiresAt = context.accessTokenExpiresAt
                token.refreshToken = context.refreshToken
                token.refreshTokenExpiresAt = context.refreshTokenExpiresAt
            }

            if (
                (token.accessTokenExpiresAt && Date.now() > new Date(token.accessTokenExpiresAt).getTime()) ||
                token.error === "RefreshAccessTokenError"
            ) {
                const { refreshToken, ...rest } = token

                return rest
            }

            return refreshToken(token)
        },
        async session({ session, token }) {
            session.user = { ...session.user, ...token.user }
            session.accessToken = token.accessToken
            session.accessTokenExpiresAt = token.accessTokenExpiresAt
            session.refreshToken = token.refreshToken
            session.refreshTokenExpiresAt = token.refreshTokenExpiresAt

            return session
        },
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl
            const searchTerm = pathname.split("/").slice(0, 2).join("/")

            if (searchTerm.includes("/dashboard")) return !!auth
            else if (pathname.includes("/auth")) {
                const isLoggedIn = !!auth
                if (isLoggedIn) return Response.redirect(new URL("/", request.nextUrl))
                else return true
            } else return true
        },
    },
} satisfies NextAuthConfig
export const { auth, handlers } = NextAuth(config)

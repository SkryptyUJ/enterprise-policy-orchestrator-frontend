import { Auth0Client } from "@auth0/nextjs-auth0/server";

const AUTH0_NAMESPACE = process.env.AUTH0_NAMESPACE;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

if (!AUTH0_NAMESPACE) {
    throw new Error("Missing AUTH0_NAMESPACE environment variable")
}

if (!AUTH0_AUDIENCE) {
    throw new Error("Missing AUTH0_AUDIENCE environment variable")
}

export const auth0 = new Auth0Client({
    authorizationParameters: {
        audience: AUTH0_AUDIENCE,
        scope: "openid profile email",
    },
    beforeSessionSaved: async (session) => {
        return {
            ...session,
            user: {
                ...session.user,
                [`${AUTH0_NAMESPACE}/roles`]:
                    session.user?.[`${AUTH0_NAMESPACE}/roles`] ?? [],
            },
        };
    },
});

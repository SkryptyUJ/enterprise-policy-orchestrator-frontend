import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
    authorizationParameters: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: "openid profile email",
    },
    beforeSessionSaved: async (session) => {
        const AUTH0_NAMESPACE = process.env.AUTH0_NAMESPACE;

        if (!AUTH0_NAMESPACE) {
            throw new Error("Missing AUTH0_NAMESPACE environment variable");
        }

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

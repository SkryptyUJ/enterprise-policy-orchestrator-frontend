import { Auth0Client } from "@auth0/nextjs-auth0/server";

const AUTH0_NAMESPACE = "https://policy-orchestrator.com";
const AUTH0_AUDIENCE = "https://enterprise-policy-orchestrator-api";

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

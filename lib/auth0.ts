import { Auth0Client } from "@auth0/nextjs-auth0/server";

const audience =
    process.env.AUTH0_AUDIENCE?.trim() ||
    process.env.NEXT_PUBLIC_AUTH0_AUDIENCE?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim()

export const auth0 = new Auth0Client({
	authorizationParameters: audience
		? {
			audience,
		}
		: undefined,
});

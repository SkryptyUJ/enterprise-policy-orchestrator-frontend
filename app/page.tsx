import { AuthenticatedView } from "@/features/auth/views/AuthenticatedView";
import { LoginView } from "@/features/auth/views/LoginView"
import { auth0 } from "@/lib/auth0";

export const metadata = {
    title: "Logowanie — Policy Orchestrator",
}

export default async function LoginPage() {
    const session = await auth0.getSession();

    if (!session) {
        return <LoginView />
    } else {
        return (
            <AuthenticatedView />
        )
    }
}

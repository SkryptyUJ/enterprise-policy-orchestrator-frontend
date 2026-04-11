import { EditPolicyView } from "@/features/policy/views/EditPolicyView"

export const metadata = {
    title: "Edycja polityki — Policy Orchestrator",
}

interface EditPolicyPageProps {
    params: {
        policyId: string
    }
}

export default async function EditPolicyPage({ params }: EditPolicyPageProps) {
    const { policyId } = await params;

    return <EditPolicyView policyId={policyId} />
}

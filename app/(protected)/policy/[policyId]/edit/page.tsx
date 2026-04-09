import { EditPolicyView } from "@/features/policy/views/EditPolicyView"

export const metadata = {
    title: "Edycja polityki — Policy Orchestrator",
}

interface EditPolicyPageProps {
    params: {
        policyId: string
    }
}

export default function EditPolicyPage({ params }: EditPolicyPageProps) {
    const policyId = parseInt(params.policyId, 10)

    return <EditPolicyView policyId={policyId} />
}

import "@testing-library/jest-dom/vitest"

process.env.AUTH0_NAMESPACE ??= "https://policy-orchestrator.com"
process.env.NEXT_PUBLIC_AUTH0_NAMESPACE ??= "https://policy-orchestrator.com"
process.env.AUTH0_AUDIENCE ??= "https://enterprise-policy-orchestrator-api"

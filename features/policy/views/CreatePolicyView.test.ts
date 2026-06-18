import { describe, expect, it } from "vitest"
import { getCreatedPolicyHistoryPath } from "./CreatePolicyView"

describe("getCreatedPolicyHistoryPath", () => {
    it("buduje ścieżkę do szczegółów polityki z otwartą historią", () => {
        expect(getCreatedPolicyHistoryPath({ id: 42 })).toBe("/policy/42?history=true")
    })
})

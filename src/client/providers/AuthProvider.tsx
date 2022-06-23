import trpc from "@client/trpc";
import React from "react"
export const AuthProvider = () => {
    const utils = trpc.useContext()
    console.log("should be in client");
    utils.queryClient.setDefaultOptions({
        queries: {
            retry(failureCount, error: any) {
                if ((error.data?.code === "UNAUTHORIZED"
                    && error.message.includes("NO_SESSION")) || failureCount > 1) {
                    utils.queryClient.invalidateQueries(["next-auth.get_session"], { refetchInactive: true })
                    return false
                }
                return true
            },
        }

    })
    // if (typeof window !== "undefined") {
    return <React.Fragment></React.Fragment>
    // }
}
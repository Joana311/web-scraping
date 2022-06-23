import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';
import trpc from '@client/trpc';

/**
 * Isomorphic redirect to another page.
 * Optionally takes `children` to display a client-side loading state whilst doing the redirect.
 */
export const Redirect: React.FC<any> = (props: { pathname: string; children?: ReactNode }) => {
    const path = props.pathname as string;
    const router = useRouter();
    const utils = trpc.useContext();

    if (!props.pathname.startsWith('/')) {
        throw new Error(
            `"pathname" needs to be a relative path that starts with "/" - got "${props.pathname}"`,
        );
    }

    // Server - side redirect
    if (utils.ssrContext) {
        // This `redirectTo` will be picked up in `_app.tsx`'s `responseMeta` function
        // utils.ssrContext.redirectTo = props.pathname;
    }

    // Client-side redirect
    useEffect(() => {
        console.log("hello from redirect")
        console.log(router, path)
        router.reload();
    }, [router, path]);

    return <>{props.children}</>;
};
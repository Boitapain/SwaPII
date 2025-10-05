import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { waitLocale, setLocale } from '$lib/i18n'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
    /**
     * Declare a dependency so the layout can be invalidated, for example, on
     * session refresh.
     */
    depends('supabase:auth')

    const supabase = isBrowser()
        ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
            global: {
                fetch,
            },
        })
        : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
            global: {
                fetch,
            },
            cookies: {
                getAll() {
                    return data.cookies
                },
            },
        })

    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Apply preferred locale early so UI renders with correct language
    const preferredLocale = (data as any)?.preferredLocale as string | undefined
    if (preferredLocale) {
        try {
            setLocale(preferredLocale)
        } catch (e) {
            console.warn('Failed to set preferred locale early', e)
        }
    }
    // Wait for i18n to be loaded (ensures messages are registered)
    await waitLocale()

    console.log('📱 Layout Client: Returning data');
    console.log('📱 Layout Client: Session exists:', !!session?.user);
    console.log('📱 Layout Client: UserProfile from server:', data.userProfile);

    return { session, supabase, user, userProfile: data.userProfile }
}
import { getUserProfile } from '$lib/server/db/repositories/profile';
import type { LayoutServerLoad } from './$types'


export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
    console.log('📋 Layout Server: Load function called');
    const { session } = await safeGetSession()
    console.log('📋 Layout Server: Session exists:', !!session?.user);
    
    let userProfile = null;
    let preferredLocale: string | null = null;
    
    if (session?.user) {
        try {
            console.log('📋 Layout Server: Fetching user profile for:', session.user.id);
            const profileResult = await getUserProfile(session.user.id);
            userProfile = profileResult[0];
            console.log('📋 Layout Server: User profile loaded:', userProfile);
            console.log('📋 Layout Server: Profile language:', userProfile?.ui_language);
            preferredLocale = userProfile?.ui_language ?? null;
        } catch (error) {
            console.error('📋 Layout Server: Failed to load user profile:', error);
        }
    } else {
        console.log('📋 Layout Server: No session, skipping profile load');
    }

    // Fallback to cookie if no profile language
    const cookieLocale = cookies.get('preferred-language') ?? null;
    if (!preferredLocale && cookieLocale) {
        preferredLocale = cookieLocale;
    }
    // Ensure we always have a locale
    if (!preferredLocale) preferredLocale = 'en';

    // Sync cookie for SSR and future requests
    if (cookieLocale !== preferredLocale) {
        cookies.set('preferred-language', preferredLocale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax'
        });
    }
    
    console.log('📋 Layout Server: Returning data with userProfile:', !!userProfile, 'and preferredLocale:', preferredLocale);
    return {
        session,
        cookies: cookies.getAll(),
        userProfile,
        preferredLocale
    }
}
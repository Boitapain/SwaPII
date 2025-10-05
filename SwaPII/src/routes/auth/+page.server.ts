import { redirect, fail, error } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_EDGE_CREATE_PROFILE } from '$env/static/public'

import type { Actions } from './$types'
import { getUserProfile } from '$lib/server/db/repositories/profile'

export const actions: Actions = {
    signup: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            console.error(error)
            return fail(400, {
                error: error.message || 'Failed to create account',
                email
            })
        } else {
            redirect(303, '/')
        }
    },
    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            console.error(error)
            return fail(400, {
                error: error.message || 'Failed to sign in',
                email
            })
        }

        // Get authenticated user data securely
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) {
            console.error("Erreur récupération utilisateur:", userError)
            return fail(400, {
                error: 'Failed to retrieve user data',
                email
            })
        }

        // Récupère le JWT de la session
        const access_token = data.session?.access_token
        if (!access_token) {
            console.error("Pas de token après login")
            return fail(400, {
                error: 'Authentication token missing',
                email
            })
        }
        // Check if profile already exists to avoid overwriting ui_language on every login
        let profileExists = false;
        try {
            const existing = await getUserProfile(userData.user.id);
            profileExists = Array.isArray(existing) ? existing.length > 0 : !!existing;
            console.log('🔐 Login: Profile exists:', profileExists);
        } catch (e) {
            console.warn('🔐 Login: Failed to check existing profile, will attempt creation once', e);
        }

        if (!profileExists) {
            console.log('🔐 Login: No profile found, calling edge function to create');
            const response = await fetch(
                PUBLIC_SUPABASE_EDGE_CREATE_PROFILE,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: JSON.stringify({
                        email,
                        user_id: userData.user.id
                    })
                }
            )

            if (!response.ok) {
                console.error("Erreur edge function:", await response.text())
                return fail(400, {
                    error: 'Failed to create user profile',
                    email
                })
            }
        } else {
            console.log('🔐 Login: Profile already exists, skip edge creation (preserve ui_language)');
        }

        // Load user profile after successful login and profile creation
        try {
            console.log('🔐 Login: Fetching user profile for:', userData.user.id);
            const profileResult = await getUserProfile(userData.user.id);
            const userProfile = profileResult[0]
            console.log('🔐 Login: Profile loaded:', userProfile);
            
            if (userProfile?.ui_language) {
                console.log('🔐 Login: User preferred language:', userProfile.ui_language)
            } else {
                console.log('🔐 Login: No ui_language in profile');
            }
        } catch (profileError) {
            console.error('🔐 Login: Failed to load user profile after login:', profileError)
            // Don't fail the login if profile loading fails
        }

        console.log('🔐 Login: Redirecting to /profile');
        // Use throw redirect to ensure proper invalidation
        throw redirect(303, '/profile')
    },
}
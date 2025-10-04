import { redirect, fail } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_EDGE_CREATE_PROFILE } from '$env/static/public'

import type { Actions } from './$types'

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
        
        redirect(303, '/profile')
    },
}
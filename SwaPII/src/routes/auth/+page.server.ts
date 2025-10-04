import { redirect } from '@sveltejs/kit'
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
            redirect(303, '/auth/error')
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
            redirect(303, '/auth/error')
        } 

        // Get authenticated user data securely
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) {
            console.error("Erreur récupération utilisateur:", userError)
            throw redirect(303, '/auth/error')
        }

        // Récupère le JWT de la session
        const access_token = data.session?.access_token
        if (!access_token) {
            console.error("Pas de token après login")
            throw redirect(303, '/auth/error')
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
            throw redirect(303, '/auth/error')
        }
        
        redirect(303, '/profile')
    },
}
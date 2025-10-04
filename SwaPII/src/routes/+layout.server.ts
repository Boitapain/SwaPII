import type { LayoutServerLoad } from './$types'
import type { Actions } from './$types'
import { redirect } from '@sveltejs/kit'

export const _actions: Actions = {
    logout: async ({ locals: { supabase } }) => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error(error)
            // Even if logout fails, redirect to home page
        }
        redirect(303, '/')
    },
}

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
    const { session } = await safeGetSession()
    return {
        session,
        cookies: cookies.getAll(),
    }
}
<script>
    let { data } = $props();
    
    // Derive user info from data
    let session = $derived(data.session);
    // userProfile is an array, so get the first item
    let userProfile = $derived(data.userProfile?.[0]);
    let user = $derived(session?.user);
    
    // Any local state should use $state
    let isEditing = $state(false);
    
    // Use $derived for form state that depends on userProfile
    let profileForm = $derived({
        ui_language: userProfile?.ui_language || 'en'
    });
</script>

<div class="container mx-auto p-4">
    <h1>Profile</h1>
    
    {#if user}
        <p>Welcome, {user.email}!</p>
        
        {#if userProfile}
            <div class="mt-4">
                <p>Language: {userProfile.ui_language}</p>
                <p>Role: {userProfile.role}</p>
                <p>Created: {new Date(userProfile.created_at).toLocaleDateString()}</p>
            </div>
        {/if}
    {/if}
    
    <form method="POST" action="?/logout" class="mt-8">
        <button type="submit" class="btn btn-error">Logout</button>
    </form>
</div>
<script>
// @ts-nocheck
    import { setLocale, locale, availableLanguages } from '$lib/i18n';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let currentLocale = $state('en');
    
    console.log('🔵 LanguageSwitcher: Component initialized');
    
    // Always sync currentLocale with the actual locale store
    $effect(() => {
        console.log('🟡 LanguageSwitcher: Locale effect triggered');
        const unsubscribe = locale.subscribe(value => {
            console.log('🟢 LanguageSwitcher: Locale store changed to:', value, 'Current state:', currentLocale);
            if (value) {
                currentLocale = value;
                console.log('🟢 LanguageSwitcher: Updated currentLocale to:', currentLocale);
            }
        });
        return unsubscribe;
    });
    
    // Handle profile language updates
    $effect(() => {
        console.log('🟠 LanguageSwitcher: Profile effect triggered');
        console.log('🟠 Page data session:', !!$page.data.session);
        console.log('🟠 Page data userProfile:', $page.data.userProfile);
        
        const profileLanguage = $page.data.userProfile?.ui_language;
        
        if (profileLanguage) {
            console.log('🔴 Profile language detected:', profileLanguage, 'Current locale:', currentLocale);
            if (profileLanguage !== currentLocale) {
                console.log('🔴 Setting language from profile:', profileLanguage);
                setLocale(profileLanguage);
                console.log('🔴 setLocale called with:', profileLanguage);
            } else {
                console.log('🔴 Profile language matches current locale, no change needed');
            }
        } else {
            console.log('🔴 No profile language found');
        }
    });
    
    onMount(() => {
        console.log('🟣 LanguageSwitcher: OnMount triggered');
        console.log('🟣 Session exists:', !!$page.data.session?.user);
        console.log('🟣 UserProfile on mount:', $page.data.userProfile);
        
        // If no user session, try localStorage
        if (!$page.data.session?.user && typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('preferred-language');
            console.log('🟣 Saved language from localStorage:', savedLanguage);
            if (savedLanguage && savedLanguage !== currentLocale) {
                console.log('🟣 OnMount: Setting language from localStorage:', savedLanguage);
                setLocale(savedLanguage);
            }
        } else {
            console.log('🟣 User session exists, skipping localStorage check');
        }
    });

    async function handleLanguageChange(event) {
        const newLocale = event.target.value;
        
        console.log('User changed language to:', newLocale);
        setLocale(newLocale);
        currentLocale = newLocale;
        
        if ($page.data.session?.user) {
            try {
                const response = await fetch('/api/language', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ language: newLocale })
                });
                
                if (response.ok) {
                    localStorage.setItem('preferred-language', newLocale);
                    console.log('Language updated in database');
                } else {
                    console.error('Failed to update language in database');
                }
            } catch (error) {
                console.error('Failed to update language:', error);
            }
        } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('preferred-language', newLocale);
            }
        }
    }
</script>

<select 
    class="select select-bordered select-sm" 
    value={currentLocale}
    onchange={handleLanguageChange}
    aria-label="Select language"
>
    {#each availableLanguages as lang (lang.code)}
        <option value={lang.code}>
            {lang.flag} {lang.name}
        </option>
    {/each}
</select>

<style>
    .select {
        min-width: 140px;
    }
</style>
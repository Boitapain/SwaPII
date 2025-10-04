<script>
// @ts-nocheck

	import { setLocale, locale, availableLanguages } from '$lib/i18n';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let currentLocale = 'en';
	
	// Subscribe to locale changes to update the UI
	locale.subscribe(value => {
		if (value) {
			currentLocale = value;
		}
	});

	function handleLanguageChange(event) {
		const target = event.target;
		const newLocale = target.value;
		
		// Update the locale immediately for UI
		setLocale(newLocale);
		
		// If user is authenticated, save to database
		if ($page.data.session?.user) {
			// Submit form to update user preference in database
			const form = document.getElementById('language-form');
			if (form) {
				const languageInput = form.querySelector('input[name="language"]');
				if (languageInput) {
					languageInput.value = newLocale;
				}
				// Use submit() instead of requestSubmit() for better compatibility
				form.submit();
			}
		} else {
			// For non-authenticated users, save to localStorage as fallback
			if (typeof window !== 'undefined') {
				localStorage.setItem('preferred-language', newLocale);
			}
		}
	}
</script>

<!-- Language form for authenticated users -->
{#if $page.data.session?.user}
	<form 
		id="language-form" 
		method="POST" 
		action="?/updateLanguage"
		style="display: none;"
		use:enhance={() => {
			return async ({ result }) => {
				// Handle form result if needed
				if (result.type === 'success') {
					console.log('Language preference updated successfully');
				}
			};
		}}
	>
		<input type="hidden" name="language" value={currentLocale} />
	</form>
{/if}

<!-- Language selector -->
<select 
	class="select select-bordered select-sm" 
	value={currentLocale}
	on:change={handleLanguageChange}
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

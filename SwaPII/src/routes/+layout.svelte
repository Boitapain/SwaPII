<script>
	import { invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import "../app.css";

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_missing_attribute -->
<div class="navbar bg-base-100 shadow-sm">
	<div class="flex mr-5">
		<a href="/" class="btn-link decoration-transparent font-bold text-xl">SwaPII</a>
	</div>
	<div class="flex-2">
		<ul class="menu menu-horizontal px-1">
			<li>
				<a href="/dashboard">Dashboard</a>
			</li>
			<li>
				<a href="/projects">Projects</a>
			</li>
			<li>
				<a href="/datasets">Datasets</a>
			</li>
			<li>
				<a href="/models">Models</a>
			</li>
		</ul>
	</div>
	<div class="flex-none">
		<!-- Profile dropdown -->
		<div class="dropdown dropdown-end">
			<div
				tabindex="0"
				role="button"
				class="btn btn-ghost btn-circle avatar"
			>
				<div class="w-10 rounded-full items-center justify-center" style="display: flex;">
					<svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 text-zinc-400"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                    </svg>
				</div>
			</div>

			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
			>
				<li>
					<a href="/profile" class="justify-between">
						Profile
					</a>
				</li>
				<li>
					<form method="POST" action="?/logout">
						<button type="submit" class="btn-link w-full text-left">
							Logout
						</button>
					</form>
				</li>
			</ul>
		</div>
	</div>
</div>

{@render children()}

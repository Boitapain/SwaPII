<!-- Auth Section -->
<div class="hero min-h-screen bg-gradient-to-br from-base-100 to-base-200 relative overflow-hidden">
    <div class="hero-content flex-col lg:flex-row-reverse max-w-6xl w-full">
        <!-- Left side - Welcome content -->
        <div class="text-center lg:text-left lg:w-1/2">
            <h1 class="text-5xl font-bold text-base-content mb-4">
                Welcome to <span style="color:var(--kh-cyan)">SwaPII</span>
            </h1>
            <p class="text-xl opacity-90 mb-6 max-w-lg">
                The ultimate platform for <span style="color:var(--kh-cyan)" class="font-semibold">secure data sharing</span> and privacy protection. 
                Join thousands of companies protecting their sensitive data.
            </p>
            
            <!-- Features highlight -->
            <div class="space-y-4 text-left">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4" style="color:var(--kh-emerald)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="text-base-content">Advanced PII Detection</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4" style="color:var(--kh-crimson)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <span class="text-base-content">Enterprise Security</span>
                </div>
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4" style="color:var(--kh-amber)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <span class="text-base-content">Lightning Fast Processing</span>
                </div>
            </div>
        </div>

        <!-- Right side - Auth form -->
        <div class="card w-full max-w-md bg-white shadow-2xl border border-gray-200 lg:w-1/2">
            <div class="card-body">
                <h2 class="card-title text-2xl font-bold text-center text-black mb-6">
                    Get Started
                </h2>
                
                <form method="POST" action="?/login" class="space-y-4">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-black font-medium">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            class="input input-bordered bg-white text-black border-gray-300 focus:border-black focus:outline-none w-full"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div class="form-control">
                        <label class="label">
                            <span class="label-text text-black font-medium">Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            class="input input-bordered bg-white text-black border-gray-300 focus:border-black focus:outline-none w-full"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div class="form-control mt-6">
                        <div class="flex gap-3">
                            <button type="submit" class="btn btn-lg bg-black text-white border-black hover:bg-gray-800 font-semibold flex-1">
                                Sign In
                            </button>
                            <button
                                type="submit"
                                formaction="?/signup"
                                class="btn btn-outline btn-lg border-black text-black hover:bg-black hover:text-white flex-1"
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                </form>

                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600">
                        By signing up, you agree to our 
                        <a href="#" class="link text-black underline">Terms of Service</a> and 
                        <a href="#" class="link text-black underline">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

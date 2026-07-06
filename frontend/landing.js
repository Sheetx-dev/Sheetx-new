
function hexToHslDaisy(hex) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if(max == min) { h = s = 0; }
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return Math.round(h * 360) + ' ' + Math.round(s * 100) + '% ' + Math.round(l * 100) + '%';
}

/**
 * Landing Page Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });

    // Check if logged in
    try {
        const user = await auth.getCurrentUser();
        const loginBtn = document.getElementById('nav-login');
        const signupBtn = document.getElementById('nav-signup');
        const adminBtn = document.getElementById('nav-admin-login');
        const portalBtn = document.getElementById('nav-portal');
        
        if (user) {
            if(loginBtn) loginBtn.style.display = 'none';
            if(signupBtn) signupBtn.style.display = 'none';
            if(adminBtn) adminBtn.style.display = 'none';
            if(portalBtn) {
                portalBtn.style.display = 'inline-block';
                portalBtn.href = user.role === 'admin' ? '/admin/' : '/client/';
            }
        } else {
            if(loginBtn) loginBtn.style.display = 'inline-block';
            if(signupBtn) signupBtn.style.display = 'inline-block';
            if(adminBtn) adminBtn.style.display = 'inline-block';
            
            const handleAuth = (e) => { e.preventDefault(); auth.login(); };
            if(loginBtn) loginBtn.addEventListener('click', handleAuth);
            if(signupBtn) signupBtn.addEventListener('click', handleAuth);
            if(adminBtn) adminBtn.addEventListener('click', handleAuth);
        }
    } catch(e) {
        console.error("Auth check failed:", e);
    }

    // Load Dynamic Settings (Steps, FAQ, Footer)
    try {
        const settings = await api.get('/public/settings');
        
        let stepsData = null;
        let faqData = null;
        let footerData = null;
        let reviewsData = null;

        
        if (settings.LANDING_COLOR_PRIMARY) {
            document.documentElement.style.setProperty('--tw-primary', settings.LANDING_COLOR_PRIMARY);
            document.documentElement.style.setProperty('--p', hexToHslDaisy(settings.LANDING_COLOR_PRIMARY));
        }
        if (settings.LANDING_COLOR_SECONDARY) {
            document.documentElement.style.setProperty('--tw-secondary', settings.LANDING_COLOR_SECONDARY);
            document.documentElement.style.setProperty('--s', hexToHslDaisy(settings.LANDING_COLOR_SECONDARY));
        }

        if (settings.LANDING_STEPS) stepsData = JSON.parse(settings.LANDING_STEPS);
        if (settings.LANDING_FAQ) faqData = JSON.parse(settings.LANDING_FAQ);
        if (settings.LANDING_REVIEWS) reviewsData = JSON.parse(settings.LANDING_REVIEWS);
        
        if (settings.LANDING_HOW_IT_WORKS_TITLE) {
            const el = document.getElementById('landing-how-it-works-title');
            if (el) el.textContent = settings.LANDING_HOW_IT_WORKS_TITLE;
        }
        if (settings.LANDING_HOW_IT_WORKS_SUBTITLE) {
            const el = document.getElementById('landing-how-it-works-subtitle');
            if (el) el.textContent = settings.LANDING_HOW_IT_WORKS_SUBTITLE;
        }

        // Fallbacks removed to ensure deleted settings do not reappear.
        if (!stepsData) stepsData = [];
        if (!faqData) faqData = [];
        if (!reviewsData) reviewsData = [];
        if (!footerData) footerData = {
            "Product": [],
            "Company": [],
            "Enterprise": [],
            "Resources": []
        };

        // Render Steps
        const stepsContainer = document.getElementById('landing-steps-container');
        if(stepsContainer && stepsData) {
            stepsContainer.innerHTML = '';
            stepsData.forEach(step => {
                stepsContainer.innerHTML += `
                    <div class="card bg-base-200 border border-white/5 shadow-lg p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 hover:border-primary/30 transition-colors">
                        <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-dark/50 border border-white/10 flex items-center justify-center font-mono font-bold text-primary">
                            ${step.step_num}
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-2">?{step.title}</h3>
                            <p class="text-gray-400 text-sm">?{step.description}</p>
                        </div>
                    </div>
                `;
            });
        }

        // Render FAQ
        const faqContainer = document.getElementById('landing-faq-container');
        if(faqContainer && faqData) {
            faqContainer.innerHTML = '';
            faqData.forEach(faq => {
                faqContainer.innerHTML += `
                    <div class="collapse collapse-plus bg-base-200 border border-white/5 mb-4 hover:border-primary/30 transition-colors rounded-2xl">
                        <input type="radio" name="my-accordion-3" /> 
                        <div class="collapse-title text-xl font-medium px-6 py-4">
                            ${faq.question}
                        </div>
                        <div class="collapse-content px-6 text-gray-400"> 
                            <p>?{faq.answer}</p>
                        </div>
                    </div>
                `;
            });
        }

        // Render Testimonials
        const testimonialsContainer = document.getElementById('landing-testimonials-container');
        if(testimonialsContainer && reviewsData) {
            testimonialsContainer.innerHTML = '';
            reviewsData.forEach(review => {
                testimonialsContainer.innerHTML += `
                    <div class="bg-base-200/50 p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all shadow-xl flex flex-col h-full">
                        <div class="flex text-amber-400 mb-6 space-x-1">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </div>
                        <p class="text-gray-300 text-lg flex-grow mb-8 font-medium">"${review.quote}"</p>
                        <div class="flex items-center gap-4 mt-auto">
                            <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/30">
                                ${review.initials || review.name.charAt(0)}
                            </div>
                            <div>
                                <h4 class="font-bold text-white">?{review.name}</h4>
                                <p class="text-xs text-gray-400">?{review.role}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Render Footer
        const footerGrid = document.getElementById('landing-footer-grid');
        if(footerGrid && footerData) {
            footerGrid.innerHTML = '';
            Object.keys(footerData).forEach(colName => {
                const links = footerData[colName];
                const linksHtml = links.map(l => {
                    let url = l.url;
                    if (url === "#" && l.name.toLowerCase().includes("policy")) url = "/legal.html?policy=" + l.name.toLowerCase().replace(/\s+/g, '-');
                    if (url === "#" && l.name.toLowerCase().includes("terms")) url = "/legal.html?policy=" + l.name.toLowerCase().replace(/\s+/g, '-');
                    return `<li><a href="${url}" class="text-gray-400 hover:text-white text-sm transition-colors">?{l.name}</a></li>`;
                }).join('');
                footerGrid.innerHTML += `
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">?{colName}</h4>
                        <ul class="space-y-3">
                            ${linksHtml}
                        </ul>
                    </div>
                `;
            });
        }

        // Fetch and Render CMS Policies
        try {
            const policies = await api.get('/public/policies');
            const policiesContainer = document.getElementById('footer-policies');
            if(policiesContainer && policies.length > 0) {
                const links = policies.map(p => `<a href="/legal.html?policy=${p.slug}" class="hover:text-white transition-colors ml-4">?{p.title}</a>`);
                policiesContainer.innerHTML = links.join('');
            }
        } catch(e) {
            console.error("Failed to load policies", e);
        }

    } catch (e) {
        console.error("Failed to load landing settings", e);
    }

    // Load Plans
    try {
        const plans = await api.get('/public/plans');
        let currentCycle = 'monthly';
        
        function renderLandingPlans() {
            const grid = document.getElementById('public-plans');
            if(!grid) return;
            grid.innerHTML = '';
            
            plans.forEach(plan => {
                let features = [];
                try { features = JSON.parse(plan.features_json); } catch(e){}
                
                let featureHtml = features.map(f => `<li class="flex items-center gap-2"><svg class="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ${f}</li>`).join('');
                
                let displayPrice = plan.price_monthly;
                let totalBilled = '<div class="text-xs text-gray-400 font-medium mb-4">Billed monthly</div>';
                
                if (currentCycle === 'half_yearly') {
                    let totalAmount = Math.round((plan.price_monthly * 6) * 0.85);
                    displayPrice = Math.round(totalAmount / 6);
                    totalBilled = '<div class="text-xs text-green-400 font-medium mb-4">Billed ?' + totalAmount + ' every 6 months</div>';
                } else if (currentCycle === 'yearly') {
                    let totalAmount = Math.round((plan.price_monthly * 12) * 0.75);
                    displayPrice = Math.round(totalAmount / 12);
                    totalBilled = '<div class="text-xs text-green-400 font-medium mb-4">Billed ?' + totalAmount + ' yearly</div>';
                }

                grid.innerHTML += `
                    <div class="card bg-base-200 border border-white/5 hover:border-white/20 transition-all ${plan.is_featured ? 'shadow-primary/20 shadow-2xl scale-105' : ''}">
                        <div class="card-body">
                            ${plan.is_featured ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>' : ''}
                            <h3 class="text-xl font-bold">?{plan.name}</h3>
                            <div><span class="text-4xl font-extrabold">?${displayPrice}</span><span class="text-gray-400 text-sm">/mo</span></div>
                            ${totalBilled}
                            <ul class="text-sm text-gray-300 space-y-3 mb-8 flex-1 mt-4">
                                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> <b>?{plan.email_limit_daily}</b> Messages (Email/WA) per day</li>
                                ${featureHtml}
                            </ul>
                            <button class="btn btn-primary w-full text-white" onclick="document.getElementById('register-modal').showModal()">Get Started</button>
                        </div>
                    </div>
                `;
            });
        }
        
        renderLandingPlans();

        const toggleContainer = document.getElementById('landing-billing-toggle');
        if (toggleContainer) {
            const buttons = toggleContainer.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => {
                        b.classList.remove('bg-primary', 'text-white');
                        b.classList.add('text-gray-400');
                    });
                    btn.classList.add('bg-primary', 'text-white');
                    btn.classList.remove('text-gray-400');
                    
                    currentCycle = btn.dataset.cycle;
                    renderLandingPlans();
                });
            });
        }

    } catch (e) {
        console.error("Failed to load plans", e);
    }
});


// --- Demo / Request Info Form ---
const formDemo = document.getElementById('form-demo-request');
if (formDemo) {
    formDemo.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-demo-submit');
        btn.innerHTML = '<span class="loading loading-spinner loading-sm"></span> Submitting...';
        btn.disabled = true;

        const data = {
            name: document.getElementById('demo-name').value,
            email: document.getElementById('demo-email').value,
            phone: document.getElementById('demo-phone').value,
            company: document.getElementById('demo-company').value,
            inquiry_type: document.getElementById('demo-type').value,
            message: document.getElementById('demo-message').value
        };

        try {
            await api.post('/public/demo-request', data);
            // Redirect to Google OAuth to let them enter the workspace automatically
            window.location.href = "/api/auth/google";
        } catch (err) {
            if(window.showToast) window.showToast(err.message || "Failed to submit request", "error");
        } finally {
            btn.innerHTML = 'Submit Request';
            btn.disabled = false;
        }
    });
}


// Removed unauthorized signup error handler

import { getStoredTheme, setTheme } from './theme.js';

const FEATURES = [
  {
    title: 'Fast by default',
    description:
      'Built with Vite for instant dev feedback and lean production bundles.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    title: 'Contract-driven',
    description:
      'UI states map directly to planner contracts so agents ship predictable screens.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8M8 8h8M8 16h5"/></svg>`,
  },
  {
    title: 'Theme-aware',
    description:
      'Primary and secondary color tokens adapt cleanly between light and dark modes.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
  },
];

const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-secondary-500"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591Z"/></svg>`;

const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-primary-200"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd"/></svg>`;

/**
 * Mount the minimalist landing page into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountLandingPage(el) {
  const isDark = getStoredTheme() === 'dark';

  el.innerHTML = `
    <div class="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div class="pointer-events-none absolute inset-0 hero-glow" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl dark:bg-primary-600/10" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-secondary-400/10 blur-3xl dark:bg-secondary-500/10" aria-hidden="true"></div>

      <header class="sticky top-0 z-10 border-b border-slate-200/60 bg-white/70 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/70">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-sm shadow-primary-500/25">
              AI
            </span>
            <span class="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Agent Frontend
            </span>
          </div>

          <label class="inline-flex cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
            <span class="text-xs font-medium text-slate-500 dark:text-slate-400" id="theme-label">
              ${isDark ? 'Dark' : 'Light'}
            </span>
            <button
              type="button"
              id="theme-toggle"
              role="switch"
              aria-checked="${isDark}"
              aria-labelledby="theme-label"
              class="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                isDark ? 'bg-primary-600' : 'bg-slate-200'
              }"
            >
              <span class="absolute inset-0 flex items-center justify-between px-1.5" aria-hidden="true">
                ${SUN_ICON}
                ${MOON_ICON}
              </span>
              <span
                class="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }"
                aria-hidden="true"
              ></span>
            </button>
          </label>
        </div>
      </header>

      <main class="relative mx-auto max-w-5xl px-6 pb-20">
        <section class="py-20 text-center sm:py-28">
          <p class="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-secondary-700 dark:border-secondary-800 dark:bg-secondary-950/50 dark:text-secondary-300">
            <span class="h-1.5 w-1.5 rounded-full bg-secondary-500"></span>
            Vanilla JS + Vite
          </p>

          <h1 class="animate-fade-up text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl dark:text-white [animation-delay:80ms]">
            Build agent-ready UIs
            <span class="mt-2 block bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent dark:from-primary-400 dark:via-primary-300 dark:to-secondary-400">
              with clarity and speed
            </span>
          </h1>

          <p class="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400 [animation-delay:160ms]">
            A refined landing page showcasing custom Tailwind color tokens and a persistent dark/light theme toggle.
          </p>

          <div class="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:240ms]">
            <a
              href="#features"
              class="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition hover:bg-primary-700 hover:shadow-primary-600/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              Explore features
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4 transition group-hover:translate-x-0.5"><path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 0 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd"/></svg>
            </a>
            <span class="inline-flex items-center rounded-xl border border-secondary-300/80 bg-white/60 px-6 py-3 text-sm font-semibold text-secondary-800 backdrop-blur-sm dark:border-secondary-700/60 dark:bg-slate-900/60 dark:text-secondary-300">
              Primary &amp; secondary tokens
            </span>
          </div>
        </section>

        <section id="features" class="scroll-mt-24 border-t border-slate-200/80 pt-16 dark:border-slate-800/80">
          <div class="text-center">
            <p class="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
              Capabilities
            </p>
            <h2 class="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
              Everything you need to ship
            </h2>
          </div>

          <ul class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            ${FEATURES.map(
              (feature, index) => `
              <li
                class="group rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-500/5 dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-primary-700 dark:hover:shadow-primary-900/20"
                style="animation: fade-up 0.6s ease-out ${300 + index * 80}ms both"
              >
                <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-700 transition group-hover:from-primary-100 group-hover:to-primary-200 group-hover:text-primary-700 dark:from-secondary-900/60 dark:to-secondary-800/40 dark:text-secondary-300 dark:group-hover:from-primary-900/50 dark:group-hover:to-primary-800/40 dark:group-hover:text-primary-300">
                  ${feature.icon}
                </span>
                <h3 class="mt-5 text-lg font-semibold text-slate-900 dark:text-white">${feature.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">${feature.description}</p>
              </li>
            `,
            ).join('')}
          </ul>
        </section>
      </main>

      <footer class="relative border-t border-slate-200/80 py-8 text-center dark:border-slate-800/80">
        <p class="text-sm text-slate-500 dark:text-slate-500">
          testing-ai-agent frontend sandbox
        </p>
      </footer>
    </div>
  `;

  const toggleBtn = el.querySelector('#theme-toggle');
  const labelEl = el.querySelector('#theme-label');
  const knob = toggleBtn.querySelector('span:last-child');

  toggleBtn.addEventListener('click', () => {
    const nextTheme = getStoredTheme() === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    const dark = nextTheme === 'dark';
    toggleBtn.setAttribute('aria-checked', String(dark));
    toggleBtn.classList.toggle('bg-primary-600', dark);
    toggleBtn.classList.toggle('bg-slate-200', !dark);
    knob.classList.toggle('translate-x-5', dark);
    knob.classList.toggle('translate-x-0', !dark);
    labelEl.textContent = dark ? 'Dark' : 'Light';
  });
}

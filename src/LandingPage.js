import { getStoredTheme, setTheme } from './theme.js';

const FEATURES = [
  {
    title: 'Fast by default',
    description:
      'Built with Vite for instant dev feedback and lean production bundles.',
  },
  {
    title: 'Contract-driven',
    description:
      'UI states map directly to planner contracts so agents ship predictable screens.',
  },
  {
    title: 'Theme-aware',
    description:
      'Primary and secondary color tokens adapt cleanly between light and dark modes.',
  },
];

/**
 * Mount the minimalist landing page into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountLandingPage(el) {
  const isDark = getStoredTheme() === 'dark';

  el.innerHTML = `
    <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <header class="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span class="text-lg font-semibold tracking-tight text-primary-700 dark:text-primary-300">
          AI Agent Frontend
        </span>
        <label class="inline-flex cursor-pointer items-center gap-3">
          <span class="text-sm font-medium text-slate-600 dark:text-slate-300" id="theme-label">
            ${isDark ? 'Dark mode' : 'Light mode'}
          </span>
          <button
            type="button"
            id="theme-toggle"
            role="switch"
            aria-checked="${isDark}"
            aria-labelledby="theme-label"
            class="relative h-8 w-14 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
              isDark ? 'bg-primary-600' : 'bg-slate-300'
            }"
          >
            <span
              class="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }"
              aria-hidden="true"
            ></span>
          </button>
        </label>
      </header>

      <main class="mx-auto max-w-5xl px-6 pb-16">
        <section class="py-16 text-center sm:py-24">
          <p class="mb-4 text-sm font-semibold uppercase tracking-widest text-secondary-600 dark:text-secondary-400">
            Vanilla JS + Vite
          </p>
          <h1 class="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Build agent-ready UIs
            <span class="block text-primary-600 dark:text-primary-400">with clarity and speed</span>
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            A minimalist landing page showcasing custom Tailwind color tokens and a persistent dark/light theme toggle.
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#features"
              class="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              Explore features
            </a>
            <span class="rounded-lg border border-secondary-300 px-6 py-3 text-sm font-semibold text-secondary-700 dark:border-secondary-600 dark:text-secondary-300">
              Primary &amp; secondary tokens
            </span>
          </div>
        </section>

        <section id="features" class="border-t border-slate-200 pt-16 dark:border-slate-800">
          <h2 class="text-center text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            ${FEATURES.map(
              (feature, index) => `
              <li class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-primary-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-800">
                <span class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-300">
                  ${index + 1}
                </span>
                <h3 class="mt-4 text-lg font-semibold text-slate-900 dark:text-white">${feature.title}</h3>
                <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">${feature.description}</p>
              </li>
            `,
            ).join('')}
          </ul>
        </section>
      </main>

      <footer class="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        testing-ai-agent frontend sandbox
      </footer>
    </div>
  `;

  const toggleBtn = el.querySelector('#theme-toggle');
  const labelEl = el.querySelector('#theme-label');

  toggleBtn.addEventListener('click', () => {
    const nextTheme = getStoredTheme() === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    const dark = nextTheme === 'dark';
    toggleBtn.setAttribute('aria-checked', String(dark));
    toggleBtn.classList.toggle('bg-primary-600', dark);
    toggleBtn.classList.toggle('bg-slate-300', !dark);

    const knob = toggleBtn.querySelector('span');
    knob.classList.toggle('translate-x-6', dark);
    knob.classList.toggle('translate-x-0', !dark);

    labelEl.textContent = dark ? 'Dark mode' : 'Light mode';
  });
}

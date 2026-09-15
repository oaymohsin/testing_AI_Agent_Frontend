import { mountUserList } from './UserListPage.js';
import { mountPlusCalculator } from './PlusCalculator.js';
import { mountMinusCalculator } from './MinusCalculator.js';
import { mountMultiplyCalculator } from './MultiplyCalculator.js';
import { mountDivideCalculator } from './DivideCalculator.js';
import { mountFactorialCalculator } from './FactorialCalculator.js';
import { mountCountCharactersPage } from './CountCharactersPage.js';
import { mountTodayDateTimePage } from './TodayDateTimePage.js';
import { mountPowerCalculator } from './PowerCalculator.js';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

const app = document.querySelector('#app');

/**
 * HealthStatus component.
 *
 * On mount, fetches GET /health and renders the `status` field. Shows a
 * loading placeholder while the request is in flight, the status value on
 * success, and an error message if the request fails.
 */
async function mountHealthStatus(el) {
  el.insertAdjacentHTML(
    'beforeend',
    `
    <main id="health-status">
      <h1>Health check</h1>
      <div id="health-result" aria-live="polite"></div>
    </main>
  `,
  );

  const resultEl = el.querySelector('#health-result');

  // Loading state while the request is in flight.
  resultEl.textContent = 'Checking health...';

  try {
    const res = await fetch(`${API_BASE}/health`);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (typeof data.status !== 'string') {
      throw new Error('Unexpected response shape');
    }

    // Render the raw status field value as text.
    resultEl.textContent = `Status: ${data.status}`;
  } catch (err) {
    // Visible error message; do not render the status value on failure.
    console.error('Health check failed:', err);
    resultEl.textContent =
      'Error: could not complete the health check. Is the backend reachable?';
  }
}

function mountHomePage() {
  app.innerHTML = '';

  app.insertAdjacentHTML(
    'afterbegin',
    `
    <nav class="home-nav" aria-label="App navigation">
      <a href="#/todaydatetime" class="home-nav-link">Today Date Time</a>
    </nav>
    <style>
      .home-nav {
        max-width: 36rem;
        margin: 1.5rem auto 0;
        padding: 0 1rem;
        font-family: system-ui, sans-serif;
      }

      .home-nav-link {
        display: inline-block;
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        background: #2563eb;
        color: #fff;
        font-weight: 600;
        text-decoration: none;
      }

      .home-nav-link:hover {
        background: #1d4ed8;
      }
    </style>
  `,
  );

  mountHealthStatus(app);

  // User list page: fetches GET /api/users and renders each user name.
  mountUserList(app);

  // Homepage addition calculator: POST /plus and render the sum.
  mountPlusCalculator(app);

  // Homepage subtraction calculator: POST /minus and render the difference.
  mountMinusCalculator(app);

  // Homepage multiplication calculator: POST /multiply and render the product.
  mountMultiplyCalculator(app);

  // Homepage division calculator: POST /divide and render the quotient.
  mountDivideCalculator(app);

  // Homepage factorial calculator: POST /factorial and render the result.
  mountFactorialCalculator(app);
}

/**
 * Resolve the current hash route.
 * Supports `#/count-characters` (and `#count-characters` as a fallback),
 * and `#/todaydatetime` (and `#todaydatetime` as a fallback).
 * @returns {'count-characters' | 'todaydatetime' | 'power' | 'home'}
 */
function getRoute() {
  const hash = window.location.hash.slice(1).replace(/^\//, '');
  if (hash === 'count-characters') {
    return 'count-characters';
  }
  if (hash === 'todaydatetime') {
    return 'todaydatetime';
  }
  if (hash === 'power') {
    return 'power';
  }
  return 'home';
}

function renderRoute() {
  const route = getRoute();

  if (route === 'count-characters') {
    app.innerHTML = '';
    mountCountCharactersPage(app);
    return;
  }

  if (route === 'todaydatetime') {
    app.innerHTML = '';
    mountTodayDateTimePage(app);
    return;
  }

  if (route === 'power') {
    app.innerHTML = '';
    mountPowerCalculator(app);
    return;
  }

  mountHomePage();
}

window.addEventListener('hashchange', renderRoute);
renderRoute();

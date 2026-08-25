const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

const app = document.querySelector('#app');

/**
 * HealthStatus component.
 *
 * On mount, fetches GET /health and renders the `status` field. Shows a
 * loading placeholder while the request is in flight, the status value on
 * success, and an error message if the request fails.
 */
async function mountHealthStatus() {
  // Replace the shell with the targeted component view.
  app.innerHTML = `
    <main>
      <h1>Health check</h1>
      <div id="health-result" aria-live="polite"></div>
    </main>
  `;

  const resultEl = document.querySelector('#health-result');

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

mountHealthStatus();

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Today Date Time page.
 *
 * Renders a button that lazily fetches GET /todaydatetime and displays the
 * `datetime` field from the JSON response in an aria-live region.
 *
 * Backend contract: GET /todaydatetime -> { datetime: string } (ISO-8601 UTC).
 */

/**
 * Mount the Today Date Time page into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountTodayDateTimePage(el) {
  el.innerHTML = `
    <main id="todaydatetime-page" class="todaydatetime">
      <h1>Today Date Time</h1>
      <button
        type="button"
        id="todaydatetime-fetch"
        class="todaydatetime-fetch"
      >
        Get Date time
      </button>
      <div
        id="todaydatetime-result"
        class="todaydatetime-result"
        aria-live="polite"
      ></div>
    </main>
    <style>
      .todaydatetime {
        max-width: 36rem;
        margin: 2rem auto;
        padding: 0 1rem;
        font-family: system-ui, sans-serif;
      }

      .todaydatetime-fetch {
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        background: #2563eb;
        color: #fff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .todaydatetime-fetch:hover:not(:disabled) {
        background: #1d4ed8;
      }

      .todaydatetime-fetch:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .todaydatetime-result {
        margin-top: 1.5rem;
        min-height: 1.5rem;
      }

      .todaydatetime-datetime {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #0f172a;
      }

      .todaydatetime-error {
        margin: 0;
        color: #dc2626;
        font-weight: 600;
      }
    </style>
  `;

  const fetchBtn = el.querySelector('#todaydatetime-fetch');
  const resultEl = el.querySelector('#todaydatetime-result');

  fetchBtn.addEventListener('click', async () => {
    fetchBtn.disabled = true;
    resultEl.textContent = '';

    try {
      const res = await fetch(`${API_BASE}/todaydatetime`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (typeof data.datetime !== 'string' || data.datetime.trim() === '') {
        throw new Error('Unexpected response shape: expected a datetime string');
      }

      resultEl.textContent = '';
      const datetimeEl = document.createElement('p');
      datetimeEl.className = 'todaydatetime-datetime';
      datetimeEl.textContent = data.datetime;
      resultEl.appendChild(datetimeEl);
    } catch (err) {
      console.error('Today datetime fetch failed:', err);
      resultEl.textContent = '';
      const errorEl = document.createElement('p');
      errorEl.className = 'todaydatetime-error';
      errorEl.textContent =
        'Could not fetch date and time. Is the backend reachable?';
      resultEl.appendChild(errorEl);
    } finally {
      fetchBtn.disabled = false;
    }
  });
}

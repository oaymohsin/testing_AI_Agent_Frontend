const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Count Characters page.
 *
 * Renders a textarea for text input, a submit button, and a structured result
 * panel. On submit, sends POST /count-characters and shows either the `count`
 * field from the JSON response or a validation `error` from a 400 response.
 *
 * Backend contract: POST /count-characters with body { text: string } ->
 *   { count: number }.
 */

/**
 * Mount the Count Characters page into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountCountCharactersPage(el) {
  el.innerHTML = `
    <main id="count-characters-page" class="count-characters">
      <h1>Count Characters</h1>
      <form id="count-characters-form" class="count-characters-form">
        <label for="count-characters-text" class="count-characters-label">
          Text
          <textarea
            id="count-characters-text"
            name="text"
            rows="6"
            placeholder="Enter text to count characters…"
            class="count-characters-text"
          ></textarea>
        </label>
        <button type="submit" id="count-characters-submit" class="count-characters-submit">
          Count Characters
        </button>
      </form>
      <section
        id="count-characters-result"
        class="count-characters-result"
        aria-live="polite"
        hidden
      >
        <h2 class="count-characters-result-heading">Result</h2>
        <p id="count-characters-count" class="count-characters-count" hidden></p>
        <p id="count-characters-error" class="count-characters-error" hidden></p>
      </section>
    </main>
    <style>
      .count-characters {
        max-width: 36rem;
        margin: 2rem auto;
        padding: 0 1rem;
        font-family: system-ui, sans-serif;
      }

      .count-characters-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .count-characters-label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-weight: 600;
      }

      .count-characters-text {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        font: inherit;
        resize: vertical;
        box-sizing: border-box;
      }

      .count-characters-text:focus {
        outline: 2px solid #3b82f6;
        border-color: #3b82f6;
      }

      .count-characters-submit {
        align-self: flex-start;
        padding: 0.625rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        background: #2563eb;
        color: #fff;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .count-characters-submit:hover:not(:disabled) {
        background: #1d4ed8;
      }

      .count-characters-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .count-characters-result {
        margin-top: 1.5rem;
        padding: 1rem 1.25rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        background: #f8fafc;
      }

      .count-characters-result-heading {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        font-weight: 600;
      }

      .count-characters-count {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #0f172a;
      }

      .count-characters-error {
        margin: 0;
        color: #dc2626;
        font-weight: 600;
      }
    </style>
  `;

  const form = el.querySelector('#count-characters-form');
  const textInput = el.querySelector('#count-characters-text');
  const submitBtn = el.querySelector('#count-characters-submit');
  const resultPanel = el.querySelector('#count-characters-result');
  const countEl = el.querySelector('#count-characters-count');
  const errorEl = el.querySelector('#count-characters-error');

  function showIdle() {
    resultPanel.hidden = true;
    countEl.hidden = true;
    errorEl.hidden = true;
    countEl.textContent = '';
    errorEl.textContent = '';
  }

  function showSubmitting() {
    submitBtn.disabled = true;
    resultPanel.hidden = true;
    countEl.hidden = true;
    errorEl.hidden = true;
  }

  function showSuccess(count) {
    submitBtn.disabled = false;
    resultPanel.hidden = false;
    countEl.hidden = false;
    errorEl.hidden = true;
    errorEl.textContent = '';
    countEl.textContent = `Character count: ${count}`;
  }

  function showValidationError(message) {
    submitBtn.disabled = false;
    resultPanel.hidden = false;
    countEl.hidden = true;
    errorEl.hidden = false;
    countEl.textContent = '';
    errorEl.textContent = message;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const text = textInput.value;

    showSubmitting();

    try {
      const res = await fetch(`${API_BASE}/count-characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (res.status === 400) {
        let message = 'Validation error.';
        try {
          const errData = await res.json();
          if (typeof errData.error === 'string' && errData.error.trim() !== '') {
            message = errData.error;
          }
        } catch {
          // Non-JSON 400 body; fall back to the generic message.
        }
        showValidationError(message);
        return;
      }

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (typeof data.count !== 'number' || !Number.isFinite(data.count)) {
        throw new Error('Unexpected response shape: expected a numeric count');
      }

      showSuccess(data.count);
    } catch (err) {
      console.error('Count characters failed:', err);
      showValidationError(
        'Could not count characters. Is the backend reachable?',
      );
    }
  });

  showIdle();
}

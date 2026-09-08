const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Homepage factorial calculator.
 *
 * Initially shows a "Calculate Factorial" button; clicking it reveals a form
 * with a single n input and a "Calculate" submit control. On submit, sends
 * POST /factorial and shows either the `result` field in bold or an `error`
 * message from a 400 response.
 *
 * Backend contract: POST /factorial with body { n: number } -> { result: number }.
 */

/**
 * Mount the calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountFactorialCalculator(el) {
  el.insertAdjacentHTML(
    'beforeend',
    `
    <section id="factorial-calculator" aria-label="Factorial calculator">
      <h2>Factorial Calculator</h2>
      <button id="factorial-reveal-btn" type="button">Calculate Factorial</button>
      <form id="factorial-form" hidden>
        <label>
          n
          <input id="factorial-n" name="n" type="number" step="1" inputmode="numeric" required />
        </label>
        <button type="submit">Calculate</button>
      </form>
      <div id="factorial-result" aria-live="polite"></div>
      <style>
        #factorial-result .factorial-result-value {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #0f172a;
        }

        #factorial-result .factorial-result-error {
          margin: 0;
          color: #dc2626;
          font-weight: 600;
        }
      </style>
    </section>
  `,
  );

  const revealBtn = el.querySelector('#factorial-reveal-btn');
  const form = el.querySelector('#factorial-form');
  const inputN = el.querySelector('#factorial-n');
  const resultEl = el.querySelector('#factorial-result');

  revealBtn.addEventListener('click', () => {
    revealBtn.hidden = true;
    form.hidden = false;
    inputN.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const n = Number(inputN.value);

    resultEl.innerHTML = '<p>Calculating...</p>';

    try {
      const res = await fetch(`${API_BASE}/factorial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ n }),
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
        resultEl.innerHTML = `<p class="factorial-result-error">${escapeHtml(message)}</p>`;
        return;
      }

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (typeof data.result !== 'number') {
        throw new Error('Unexpected response shape: expected a numeric result');
      }

      resultEl.innerHTML = `<p class="factorial-result-value">${escapeHtml(String(data.result))}</p>`;
    } catch (err) {
      console.error('Factorial calculation failed:', err);
      resultEl.innerHTML =
        '<p class="factorial-result-error">Could not calculate factorial. Is the backend reachable?</p>';
    }
  });
}

/**
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

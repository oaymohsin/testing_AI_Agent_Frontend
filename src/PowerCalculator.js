const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Power calculator page.
 *
 * Renders two inputs (a, b), a submit button, and a result area. On submit,
 * sends POST /power and shows either the `result` field or an `error` message.
 *
 * Backend contract: POST /power with body { a: number, b: number } ->
 *   { result: number } or { error: string } on validation failure.
 */

/**
 * Mount the power calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountPowerCalculator(el) {
  el.innerHTML = `
    <main id="power-page" class="power-calculator">
      <h1>Power Calculator</h1>
      <form id="power-form">
        <label>
          a
          <input id="power-a" name="a" type="number" step="any" inputmode="decimal" required />
        </label>
        <label>
          b
          <input id="power-b" name="b" type="number" step="any" inputmode="decimal" required />
        </label>
        <button type="submit">Calculate Power</button>
      </form>
      <div id="power-result" aria-live="polite"></div>
    </main>
    <style>
      .power-calculator {
        max-width: 36rem;
        margin: 2rem auto;
        padding: 0 1rem;
        font-family: system-ui, sans-serif;
      }

      .power-calculator form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .power-calculator label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-weight: 600;
      }

      .power-calculator input {
        padding: 0.5rem 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        font: inherit;
      }

      .power-calculator button[type="submit"] {
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

      .power-calculator button[type="submit"]:hover {
        background: #1d4ed8;
      }
    </style>
  `;

  const form = el.querySelector('#power-form');
  const inputA = el.querySelector('#power-a');
  const inputB = el.querySelector('#power-b');
  const resultEl = el.querySelector('#power-result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const a = Number(inputA.value);
    const b = Number(inputB.value);

    if (inputA.value.trim() === '' || inputB.value.trim() === '') {
      resultEl.textContent = 'Error: please enter values for both a and b.';
      return;
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      resultEl.textContent = 'Error: a and b must be valid numbers.';
      return;
    }

    resultEl.textContent = 'Calculating...';

    try {
      const res = await fetch(`${API_BASE}/power`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b }),
      });

      if (res.status === 400) {
        let message = 'Error: invalid input.';
        try {
          const errData = await res.json();
          if (typeof errData.error === 'string' && errData.error.trim() !== '') {
            message = `Error: ${errData.error}`;
          }
        } catch {
          // Non-JSON 400 body; fall back to the generic message.
        }
        resultEl.textContent = message;
        return;
      }

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      if (typeof data.result !== 'number' || !Number.isFinite(data.result)) {
        throw new Error('Unexpected response shape: expected a numeric result');
      }

      resultEl.textContent = `Result: ${data.result}`;
    } catch (err) {
      console.error('Power calculation failed:', err);
      resultEl.textContent =
        'Error: could not calculate power. Is the backend reachable?';
    }
  });
}

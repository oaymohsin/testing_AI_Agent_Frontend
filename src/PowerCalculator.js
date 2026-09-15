const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Power calculator page.
 *
 * Renders inputs for base (a) and exponent (b), a submit control, and a result
 * area. On submit, validates the inputs, sends POST /power, and shows either
 * the `result` field from the JSON response or the backend `error` field.
 *
 * Backend contract: POST /power with body { a: number, b: number } ->
 *   { result: number } (a ** b).
 */

/**
 * Mount the calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountPowerCalculator(el) {
  el.innerHTML = `
    <main id="power-calculator" aria-label="Power calculator">
      <h1>Power Calculator</h1>
      <form id="power-form">
        <label>
          Base
          <input id="power-a" name="a" type="number" step="any" inputmode="decimal" required />
        </label>
        <label>
          Exponent
          <input id="power-b" name="b" type="number" step="any" inputmode="decimal" required />
        </label>
        <button type="submit">Calculate power</button>
      </form>
      <div id="power-result" aria-live="polite"></div>
    </main>
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
      resultEl.textContent = 'Error: please enter values for both base and exponent.';
      return;
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      resultEl.textContent = 'Error: base and exponent must be valid numbers.';
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
        let message = 'a and b must be finite numbers';
        try {
          const errData = await res.json();
          if (typeof errData.error === 'string' && errData.error.trim() !== '') {
            message = errData.error;
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
        throw new Error('Unexpected response shape: expected a finite numeric result');
      }

      resultEl.textContent = String(data.result);
    } catch (err) {
      console.error('Power calculation failed:', err);
      resultEl.textContent =
        'Error: could not calculate the power. Is the backend reachable?';
    }
  });
}

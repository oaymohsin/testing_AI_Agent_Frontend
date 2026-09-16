const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Homepage modulo calculator.
 *
 * Renders two number inputs labeled A and B, a "Compute" button, and a result
 * area. On submit, validates the inputs (including that B is non-zero), sends
 * POST /modulo, and shows either the `result` field from the JSON response or
 * an error message.
 *
 * Backend contract: POST /modulo with body { a: number, b: number } ->
 *   { result: number } (JavaScript remainder a % b).
 */

/**
 * Mount the calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountModuloCalculator(el) {
  el.insertAdjacentHTML(
    'beforeend',
    `
    <section id="modulo-calculator" aria-label="Modulo calculator">
      <h2>Modulo Calculator</h2>
      <form id="modulo-form">
        <label>
          A
          <input id="modulo-a" name="a" type="number" step="any" inputmode="decimal" required />
        </label>
        <label>
          B
          <input id="modulo-b" name="b" type="number" step="any" inputmode="decimal" required />
        </label>
        <button type="submit">Compute</button>
      </form>
      <div id="modulo-result" aria-live="polite"></div>
    </section>
  `,
  );

  const form = el.querySelector('#modulo-form');
  const inputA = el.querySelector('#modulo-a');
  const inputB = el.querySelector('#modulo-b');
  const resultEl = el.querySelector('#modulo-result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const a = Number(inputA.value);
    const b = Number(inputB.value);

    if (inputA.value.trim() === '' || inputB.value.trim() === '') {
      resultEl.textContent = 'Error: please enter values for both A and B.';
      return;
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      resultEl.textContent = 'Error: A and B must be valid numbers.';
      return;
    }
    if (b === 0) {
      resultEl.textContent = 'Error: B must not be zero.';
      return;
    }

    resultEl.textContent = 'Calculating...';

    try {
      const res = await fetch(`${API_BASE}/modulo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b }),
      });

      if (res.status === 400) {
        let message = 'Error: invalid input. Both A and B must be numbers.';
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
      console.error('Modulo calculation failed:', err);
      resultEl.textContent =
        'Error: could not calculate the remainder. Is the backend reachable?';
    }
  });
}

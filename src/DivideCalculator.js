const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Homepage division calculator.
 *
 * Renders two text inputs labeled A and B, a "Divide" button, and a result
 * area. On click, validates the inputs (including that B is non-zero), sends
 * POST /divide, and shows either the `result` field from the JSON response or
 * an error message.
 *
 * Backend contract: POST /divide with body { a: number, b: number } ->
 *   { result: number } (the quotient a / b).
 */

/**
 * Mount the calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountDivideCalculator(el) {
  el.innerHTML = `
    <section id="divide-calculator" aria-label="Division calculator">
      <h2>Division Calculator</h2>
      <form id="divide-form">
        <label>
          A
          <input id="divide-a" name="a" type="number" step="any" inputmode="decimal" required />
        </label>
        <label>
          B
          <input id="divide-b" name="b" type="number" step="any" inputmode="decimal" required />
        </label>
        <button type="submit">Divide</button>
      </form>
      <div id="divide-result" aria-live="polite"></div>
    </section>
  `;

  const form = el.querySelector('#divide-form');
  const inputA = el.querySelector('#divide-a');
  const inputB = el.querySelector('#divide-b');
  const resultEl = el.querySelector('#divide-result');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const a = Number(inputA.value);
    const b = Number(inputB.value);

    // Validate inputs: reject empty or non-numeric values.
    if (inputA.value.trim() === '' || inputB.value.trim() === '') {
      resultEl.textContent = 'Error: please enter values for both A and B.';
      return;
    }
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      resultEl.textContent = 'Error: A and B must be valid numbers.';
      return;
    }
    // Division by zero is undefined; reject before sending a request.
    if (b === 0) {
      resultEl.textContent = 'Error: B must not be zero.';
      return;
    }

    resultEl.textContent = 'Calculating...';

    try {
      const res = await fetch(`${API_BASE}/divide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b }),
      });

      if (res.status === 400) {
        // Backend rejected the operands; surface its error field if present.
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
      console.error('Division failed:', err);
      resultEl.textContent =
        'Error: could not calculate the quotient. Is the backend reachable?';
    }
  });
}

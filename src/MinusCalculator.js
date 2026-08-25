const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Homepage subtraction calculator.
 *
 * Renders two text inputs labeled A and B, a "Minus" button, and a result
 * area. On click, validates the inputs, sends POST /minus, and shows either
 * the `result` field from the JSON response or an error message.
 *
 * Backend contract: POST /minus with body { a: number, b: number } ->
 *   { result: number } (the difference a - b).
 */

/**
 * Mount the calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountMinusCalculator(el) {
  el.innerHTML = `
    <section id="minus-calculator" aria-label="Subtraction calculator">
      <h2>Subtraction Calculator</h2>
      <form id="minus-form">
        <label>
          A
          <input id="minus-a" name="a" type="number" step="any" inputmode="decimal" required />
        </label>
        <label>
          B
          <input id="minus-b" name="b" type="number" step="any" inputmode="decimal" required />
        </label>
        <button type="submit">Minus</button>
      </form>
      <div id="minus-result" aria-live="polite"></div>
    </section>
  `;

  const form = el.querySelector('#minus-form');
  const inputA = el.querySelector('#minus-a');
  const inputB = el.querySelector('#minus-b');
  const resultEl = el.querySelector('#minus-result');

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

    resultEl.textContent = 'Calculating...';

    try {
      const res = await fetch(`${API_BASE}/minus`, {
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
      console.error('Subtraction failed:', err);
      resultEl.textContent =
        'Error: could not calculate the difference. Is the backend reachable?';
    }
  });
}

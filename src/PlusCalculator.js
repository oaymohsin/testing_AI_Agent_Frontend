const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * Homepage addition calculator.
 *
 * Renders two text inputs labeled A and B, a "Calculate Sum" button, and a
 * result area. On click, validates the inputs, sends POST /plus, and shows
 * either the `result` field from the JSON response or an error message.
 *
 * Backend contract: POST /plus with body { a: number, b: number } ->
 *   { result: number }.
 */

/**
 * Mount the calculator into the given element.
 * @param {HTMLElement} el mount point
 */
export function mountPlusCalculator(el) {
  el.innerHTML = `
    <section id="plus-calculator" aria-label="Addition calculator">
      <h2>Addition Calculator</h2>
      <form id="plus-form">
        <label>
          A
          <input id="plus-a" name="a" type="number" step="any" inputmode="decimal" required />
        </label>
        <label>
          B
          <input id="plus-b" name="b" type="number" step="any" inputmode="decimal" required />
        </label>
        <button type="submit">Calculate Sum</button>
      </form>
      <div id="plus-result" aria-live="polite"></div>
    </section>
  `;

  const form = el.querySelector('#plus-form');
  const inputA = el.querySelector('#plus-a');
  const inputB = el.querySelector('#plus-b');
  const resultEl = el.querySelector('#plus-result');

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
      const res = await fetch(`${API_BASE}/plus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b }),
      });

      if (res.status === 400) {
        resultEl.textContent = 'Error: invalid input. Both A and B must be numbers.';
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
      console.error('Addition failed:', err);
      resultEl.textContent =
        'Error: could not calculate the sum. Is the backend reachable?';
    }
  });
}

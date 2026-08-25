const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

/**
 * UserListPage component.
 *
 * On mount, fetches GET /api/users and renders the `name` field of each user.
 * Shows a loading placeholder while the request is in flight, a list item per
 * user on success, and an error message if the request fails.
 *
 * Backend contract: GET /api/users -> array of { id: number, name: string }.
 */

/**
 * Render the user list into the given element.
 * @param {HTMLElement} el mount point
 * @param {AbortSignal} signal abort signal for the in-flight request
 */
export async function mountUserList(el, signal) {
  el.innerHTML = `
    <section>
      <h1>Users</h1>
      <ul id="user-list" aria-live="polite"></ul>
    </section>
  `;

  const listEl = el.querySelector('#user-list');

  // Loading state while the request is in flight; do not render names yet.
  const loadingEl = document.createElement('li');
  loadingEl.textContent = 'Loading users...';
  listEl.appendChild(loadingEl);

  try {
    const res = await fetch(`${API_BASE}/api/users`, { signal });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const users = await res.json();

    if (!Array.isArray(users)) {
      throw new Error('Unexpected response shape: expected an array');
    }

    // Replace the loading placeholder with the user list.
    listEl.innerHTML = '';

    if (users.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.textContent = 'No users found.';
      listEl.appendChild(emptyLi);
      return;
    }

    for (const user of users) {
      const li = document.createElement('li');
      li.textContent = String(user.name);
      listEl.appendChild(li);
    }
  } catch (err) {
    // Visible error message; do not render any user names on failure.
    console.error('Failed to load users:', err);
    listEl.innerHTML = '';
    const errLi = document.createElement('li');
    errLi.textContent = 'Failed to load users. Is the backend reachable?';
    listEl.appendChild(errLi);
  }
}

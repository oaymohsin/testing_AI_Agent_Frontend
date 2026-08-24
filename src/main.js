const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3008';

const app = document.querySelector('#app');

app.innerHTML = `
  <main>
    <h1>testing-ai-agent frontend</h1>
    <p>API base: <code>${API_BASE}</code></p>
    <p>Call backend JSON endpoints with <code>fetch</code> and render fields from the frozen contract.</p>
  </main>
`;

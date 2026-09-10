import './index.css';
import { mountLandingPage } from './LandingPage.js';
import { initTheme } from './theme.js';
import { mountCountCharactersPage } from './CountCharactersPage.js';
import { mountTodayDateTimePage } from './TodayDateTimePage.js';

const app = document.querySelector('#app');

function mountHomePage() {
  app.innerHTML = '';
  mountLandingPage(app);
}

/**
 * Resolve the current hash route.
 * Supports `#/count-characters` (and `#count-characters` as a fallback),
 * and `#/todaydatetime` (and `#todaydatetime` as a fallback).
 * @returns {'count-characters' | 'todaydatetime' | 'home'}
 */
function getRoute() {
  const hash = window.location.hash.slice(1).replace(/^\//, '');
  if (hash === 'count-characters') {
    return 'count-characters';
  }
  if (hash === 'todaydatetime') {
    return 'todaydatetime';
  }
  return 'home';
}

function renderRoute() {
  const route = getRoute();

  if (route === 'count-characters') {
    app.innerHTML = '';
    mountCountCharactersPage(app);
    return;
  }

  if (route === 'todaydatetime') {
    app.innerHTML = '';
    mountTodayDateTimePage(app);
    return;
  }

  mountHomePage();
}

initTheme();

window.addEventListener('hashchange', renderRoute);
renderRoute();

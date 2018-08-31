/*
 * This is the entrypoint of all the JavaScript files.
 */

import Routes from './routes';
import { Store } from 'svelte/store.umd.js';

document.addEventListener('DOMContentLoaded', main);

function main () {
  window['allowedLanguages'] = ['en-US', 'pt-BR'];
  const allowedLanguages = window['allowedLanguages'];
  let language = localStorage.getItem('ppc-user-language') || navigator.language || 'en-US';

  if (!allowedLanguages.includes(language)) {
    language = 'en-US';
  }

  fetch(`/locales/${language}.json`)
  .then(res => res.json())
  .then((dictionary) => {
    document.title = dictionary.index.title;
    localStorage.setItem('ppc-user-language', language);
    window.Routes = new Routes();
    window.store = new Store({
      wallets: [],
      numberOfWallets: 1,
      dictionary 
    });
  });
}
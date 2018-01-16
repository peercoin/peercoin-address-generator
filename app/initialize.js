/*
 * This is the entrypoint of all the JavaScript files.
 */

import Routes from './routes';
import { Store } from 'svelte/store.umd.js';

document.addEventListener('DOMContentLoaded', main);

function main () {
  window.Routes = new Routes();
  window.store = new Store({
    publicAddress: '',
    privateKey: ''
  });
}
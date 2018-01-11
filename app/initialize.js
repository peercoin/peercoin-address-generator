/*
 * This is the entrypoint of all the JavaScript files.
 */

import Routes from './routes';
import buffer from 'buffer';

// Mimic Node.js Buffer from Browser's Uint8Array
// This is needed for easier Peercoin address generation
window.Buffer = buffer.Buffer;
Error.captureStackTrace = err => console.log;

document.addEventListener('DOMContentLoaded', main);

function main () {
  window.Routes = new Routes();
}
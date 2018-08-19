import roadtrip from 'roadtrip';
import Wallet from './wallet.page.svelte';

export default class WalletHandler {
  get route() {
    return {
      enter(current, previous) {
        const pubAddr = window.store.get('publicAddress');
        const privKey = window.store.get('privateKey');

        // If no address generated, redirect to home
        if (!pubAddr || !privKey) {
          roadtrip.goto('/');
        } else {
          // Else, load view
          this.component = new Wallet({
            target: document.getElementById('app')
          });
        }
      },
      leave(current, previous) {
        if(this.component) {
          this.component.destroy();
        }
      }
    }
  }
}
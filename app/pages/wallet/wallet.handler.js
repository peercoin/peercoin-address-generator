import roadtrip from 'roadtrip';
import Wallet from './wallet.page.svelte';

export default class WalletHandler {
  get route() {
    return {
      enter(current, previous) {
        const wallets = window.store.get('wallets') || [];

        // If no address generated, redirect to home
        if (wallets.length < 1) {
          roadtrip.goto('/');
        } else {
          // Else, load view
          this.component = new Wallet({
            target: document.getElementById('app'),
            store: window.store
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
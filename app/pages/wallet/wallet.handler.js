import Wallet from './wallet.page.svelte';

export default class WalletHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new Wallet({
          target: document.getElementById('app')
        });
        document.body.style.overflow = 'hidden';
      },
      leave(current, previous) {
        this.component.destroy();
      }
    }
  }
}
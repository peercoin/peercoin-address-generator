import About from './about.page.svelte';

export default class AboutHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new About({
          target: document.getElementById('app'),
          store: window.store
        });
        document.body.style.overflow = 'hidden';
      },
      leave(current, previous) {
        this.component.destroy();
      }
    }
  }
}
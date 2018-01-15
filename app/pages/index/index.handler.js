import Index from './index.page.svelte';

export default class IndexHandler {
  get route() {
    return {
      enter(current, previous) {
        window.scrollTo(0, 1);
        this.component = new Index({
          target: document.getElementById('app')
        });
      },
      leave(current, previous) {
        this.component.destroy();
      }
    }
  }
}
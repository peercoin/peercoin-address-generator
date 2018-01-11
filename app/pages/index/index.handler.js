import Index from './index.page.svelte';

export default class IndexHandler {
  get route() {
    return {
      enter(current, previous) {
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
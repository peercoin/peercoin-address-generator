import Generator from './generator.page.svelte';

export default class GeneratorHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new Generator({
          target: document.getElementById('app')
        });
      },
      leave(current, previous) {
        this.component.destroy();
      }
    }
  }
}
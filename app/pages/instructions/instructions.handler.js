import UserDetails from './instructions.page.svelte';

export default class UserDetailsHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new UserDetails({
          target: document.getElementById('app')
        });
      },
      leave(current, previous) {
        this.component.destroy();
      }
    }
  }
}
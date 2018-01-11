import UserDetails from './about.page.svelte';

export default class UserDetailsHandler {
  get route() {
    return {
      enter(current, previous) {
        this.component = new UserDetails({
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
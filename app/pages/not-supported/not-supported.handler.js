import roadtrip from 'roadtrip';
import NotSupported from './not-supported.page.svelte';
import { isCompatible } from '../../helpers/checkCompatibility';

export default class NotSupportedHandler {
  get route() {
    return {
      enter(current, previous) {
        // If a compatible browser enters this page by mistake,
        // redirect it to home
        if (isCompatible()) {
          roadtrip.goto('/');
          return;
        }

        // Otherwise, render the "Not Supported" view
        this.component = new NotSupported({
          target: document.getElementById('app')
        });
      },
      leave(current, previous) {
        if (this.component) {
          this.component.destroy();
        }
      }
    }
  }
}
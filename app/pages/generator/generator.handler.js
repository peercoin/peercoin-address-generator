import roadtrip from 'roadtrip';
import Generator from './generator.page.svelte';
import { isCompatible } from '../../helpers/checkCompatibility';

export default class GeneratorHandler {
  get route() {
    return {
      enter(current, previous) {
        // If the browser using this app is not compatible,
        // send it to "Not Supported" page. 
        if (!isCompatible()) {
          roadtrip.goto('/not-supported');
          return;
        }
        this.component = new Generator({
          target: document.getElementById('app')
        });

        // Disable overflow to prevent scrolling
        // while giving seed by touch
        document.body.style.overflow = 'hidden';
      },
      leave(current, previous) {
        if (this.component) {
          this.component.destroy();
        }

        // Enable overflow for other views
        document.body.style.overflow = '';
      }
    }
  }
}
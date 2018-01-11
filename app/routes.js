import roadtrip from 'roadtrip';
import IndexHandler from './pages/index/index.handler';
import InstructionsHandler from './pages/instructions/instructions.handler';
import AboutHandler from './pages/about/about.handler';

export default class Routes {
  constructor() {
    this.router = roadtrip;
    this.init();
  }

  init() {
    this.index_handler = new IndexHandler();
    this.instructions_handler = new InstructionsHandler();
    this.about_handler = new AboutHandler();

    this.router
    .add('/', this.index_handler.route)
    .add('/instructions', this.instructions_handler.route)
    .add('/about', this.about_handler.route)
      .start({
        fallback: '/'
      });
  }
}
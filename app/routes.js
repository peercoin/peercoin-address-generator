import roadtrip from 'roadtrip';
import IndexHandler from './pages/index/index.handler';
import GeneratorHandler from './pages/generator/generator.handler';
import AboutHandler from './pages/about/about.handler';

export default class Routes {
  constructor() {
    this.router = roadtrip;
    this.init();
  }

  init() {
    this.index_handler = new IndexHandler();
    this.about_handler = new AboutHandler();
    this.generator_handler = new GeneratorHandler();

    this.router
    .add('/', this.index_handler.route)
    .add('/about', this.about_handler.route)
    .add('/generator', this.generator_handler.route)
      .start({
        fallback: '/'
      });
  }
}
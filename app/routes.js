import roadtrip from 'roadtrip';
import IndexHandler from './pages/index/index.handler';
import GeneratorHandler from './pages/generator/generator.handler';
import AboutHandler from './pages/about/about.handler';
import WalletHandler from './pages/wallet/wallet.handler';
import NotSupportedHandler from './pages/not-supported/not-supported.handler';

export default class Routes {
  constructor() {
    this.router = roadtrip;
    this.init();
  }

  init() {
    this.index_handler = new IndexHandler();
    this.about_handler = new AboutHandler();
    this.generator_handler = new GeneratorHandler();
    this.wallet_handler = new WalletHandler();
    this.not_supported_handler = new NotSupportedHandler();

    this.router
    .add('/', this.index_handler.route)
    .add('/about', this.about_handler.route)
    .add('/generator', this.generator_handler.route)
    .add('/wallet', this.wallet_handler.route)
    .add('/not-supported', this.not_supported_handler.route)
    .start({
      fallback: '/'
    });
  }
}
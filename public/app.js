(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};

require.register("qrious/dist/qrious.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "qrious");
  (function() {
    /*
 * QRious v4.0.2
 * Copyright (C) 2017 Alasdair Mercer
 * Copyright (C) 2010 Tom Zerucha
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.QRious = factory());
}(this, (function () { 'use strict';

  /*
   * Copyright (C) 2017 Alasdair Mercer, !ninja
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  /**
   * A bare-bones constructor for surrogate prototype swapping.
   *
   * @private
   * @constructor
   */
  var Constructor = /* istanbul ignore next */ function() {};
  /**
   * A reference to <code>Object.prototype.hasOwnProperty</code>.
   *
   * @private
   * @type {Function}
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * A reference to <code>Array.prototype.slice</code>.
   *
   * @private
   * @type {Function}
   */
  var slice = Array.prototype.slice;

  /**
   * Creates an object which inherits the given <code>prototype</code>.
   *
   * Optionally, the created object can be extended further with the specified <code>properties</code>.
   *
   * @param {Object} prototype - the prototype to be inherited by the created object
   * @param {Object} [properties] - the optional properties to be extended by the created object
   * @return {Object} The newly created object.
   * @private
   */
  function createObject(prototype, properties) {
    var result;
    /* istanbul ignore next */
    if (typeof Object.create === 'function') {
      result = Object.create(prototype);
    } else {
      Constructor.prototype = prototype;
      result = new Constructor();
      Constructor.prototype = null;
    }

    if (properties) {
      extendObject(true, result, properties);
    }

    return result;
  }

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
   * instead. The class name may also be used string representation for instances of the child constructor (via
   * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name=this.class_] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   */
  function extend(name, constructor, prototype, statics) {
    var superConstructor = this;

    if (typeof name !== 'string') {
      statics = prototype;
      prototype = constructor;
      constructor = name;
      name = null;
    }

    if (typeof constructor !== 'function') {
      statics = prototype;
      prototype = constructor;
      constructor = function() {
        return superConstructor.apply(this, arguments);
      };
    }

    extendObject(false, constructor, superConstructor, statics);

    constructor.prototype = createObject(superConstructor.prototype, prototype);
    constructor.prototype.constructor = constructor;

    constructor.class_ = name || superConstructor.class_;
    constructor.super_ = superConstructor;

    return constructor;
  }

  /**
   * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
   *
   * if any source is <code>null</code> it will be ignored.
   *
   * @param {boolean} own - <code>true</code> to only copy <b>own</b> properties from <code>sources</code> onto
   * <code>target</code>; otherwise <code>false</code>
   * @param {Object} target - the target object which should be extended
   * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
   * @return {void}
   * @private
   */
  function extendObject(own, target, sources) {
    sources = slice.call(arguments, 2);

    var property;
    var source;

    for (var i = 0, length = sources.length; i < length; i++) {
      source = sources[i];

      for (property in source) {
        if (!own || hasOwnProperty.call(source, property)) {
          target[property] = source[property];
        }
      }
    }
  }

  var extend_1 = extend;

  /**
   * The base class from which all others should extend.
   *
   * @public
   * @constructor
   */
  function Nevis() {}
  Nevis.class_ = 'Nevis';
  Nevis.super_ = Object;

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
   * instead. The class name may also be used string representation for instances of the child constructor (via
   * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name=this.class_] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   * @memberof Nevis
   */
  Nevis.extend = extend_1;

  var nevis = Nevis;

  var lite = nevis;

  /**
   * Responsible for rendering a QR code {@link Frame} on a specific type of element.
   *
   * A renderer may be dependant on the rendering of another element, so the ordering of their execution is important.
   *
   * The rendering of a element can be deferred by disabling the renderer initially, however, any attempt get the element
   * from the renderer will result in it being immediately enabled and the element being rendered.
   *
   * @param {QRious} qrious - the {@link QRious} instance to be used
   * @param {*} element - the element onto which the QR code is to be rendered
   * @param {boolean} [enabled] - <code>true</code> this {@link Renderer} is enabled; otherwise <code>false</code>.
   * @public
   * @class
   * @extends Nevis
   */
  var Renderer = lite.extend(function(qrious, element, enabled) {
    /**
     * The {@link QRious} instance.
     *
     * @protected
     * @type {QRious}
     * @memberof Renderer#
     */
    this.qrious = qrious;

    /**
     * The element onto which this {@link Renderer} is rendering the QR code.
     *
     * @protected
     * @type {*}
     * @memberof Renderer#
     */
    this.element = element;
    this.element.qrious = qrious;

    /**
     * Whether this {@link Renderer} is enabled.
     *
     * @protected
     * @type {boolean}
     * @memberof Renderer#
     */
    this.enabled = Boolean(enabled);
  }, {

    /**
     * Draws the specified QR code <code>frame</code> on the underlying element.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @param {Frame} frame - the {@link Frame} to be drawn
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    draw: function(frame) {},

    /**
     * Returns the element onto which this {@link Renderer} is rendering the QR code.
     *
     * If this method is called while this {@link Renderer} is disabled, it will be immediately enabled and rendered
     * before the element is returned.
     *
     * @return {*} The element.
     * @public
     * @memberof Renderer#
     */
    getElement: function() {
      if (!this.enabled) {
        this.enabled = true;
        this.render();
      }

      return this.element;
    },

    /**
     * Calculates the size (in pixel units) to represent an individual module within the QR code based on the
     * <code>frame</code> provided.
     *
     * Any configured padding will be excluded from the returned size.
     *
     * The returned value will be at least one, even in cases where the size of the QR code does not fit its contents.
     * This is done so that the inevitable clipping is handled more gracefully since this way at least something is
     * displayed instead of just a blank space filled by the background color.
     *
     * @param {Frame} frame - the {@link Frame} from which the module size is to be derived
     * @return {number} The pixel size for each module in the QR code which will be no less than one.
     * @protected
     * @memberof Renderer#
     */
    getModuleSize: function(frame) {
      var qrious = this.qrious;
      var padding = qrious.padding || 0;
      var pixels = Math.floor((qrious.size - (padding * 2)) / frame.width);

      return Math.max(1, pixels);
    },

    /**
     * Calculates the offset/padding (in pixel units) to be inserted before the QR code based on the <code>frame</code>
     * provided.
     *
     * The returned value will be zero if there is no available offset or if the size of the QR code does not fit its
     * contents. It will never be a negative value. This is done so that the inevitable clipping appears more naturally
     * and it is not clipped from all directions.
     *
     * @param {Frame} frame - the {@link Frame} from which the offset is to be derived
     * @return {number} The pixel offset for the QR code which will be no less than zero.
     * @protected
     * @memberof Renderer#
     */
    getOffset: function(frame) {
      var qrious = this.qrious;
      var padding = qrious.padding;

      if (padding != null) {
        return padding;
      }

      var moduleSize = this.getModuleSize(frame);
      var offset = Math.floor((qrious.size - (moduleSize * frame.width)) / 2);

      return Math.max(0, offset);
    },

    /**
     * Renders a QR code on the underlying element based on the <code>frame</code> provided.
     *
     * @param {Frame} frame - the {@link Frame} to be rendered
     * @return {void}
     * @public
     * @memberof Renderer#
     */
    render: function(frame) {
      if (this.enabled) {
        this.resize();
        this.reset();
        this.draw(frame);
      }
    },

    /**
     * Resets the underlying element, effectively clearing any previously rendered QR code.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    reset: function() {},

    /**
     * Ensures that the size of the underlying element matches that defined on the associated {@link QRious} instance.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    resize: function() {}

  });

  var Renderer_1 = Renderer;

  /**
   * An implementation of {@link Renderer} for working with <code>canvas</code> elements.
   *
   * @public
   * @class
   * @extends Renderer
   */
  var CanvasRenderer = Renderer_1.extend({

    /**
     * @override
     */
    draw: function(frame) {
      var i, j;
      var qrious = this.qrious;
      var moduleSize = this.getModuleSize(frame);
      var offset = this.getOffset(frame);
      var context = this.element.getContext('2d');

      context.fillStyle = qrious.foreground;
      context.globalAlpha = qrious.foregroundAlpha;

      for (i = 0; i < frame.width; i++) {
        for (j = 0; j < frame.width; j++) {
          if (frame.buffer[(j * frame.width) + i]) {
            context.fillRect((moduleSize * i) + offset, (moduleSize * j) + offset, moduleSize, moduleSize);
          }
        }
      }
    },

    /**
     * @override
     */
    reset: function() {
      var qrious = this.qrious;
      var context = this.element.getContext('2d');
      var size = qrious.size;

      context.lineWidth = 1;
      context.clearRect(0, 0, size, size);
      context.fillStyle = qrious.background;
      context.globalAlpha = qrious.backgroundAlpha;
      context.fillRect(0, 0, size, size);
    },

    /**
     * @override
     */
    resize: function() {
      var element = this.element;

      element.width = element.height = this.qrious.size;
    }

  });

  var CanvasRenderer_1 = CanvasRenderer;

  /* eslint no-multi-spaces: "off" */



  /**
   * Contains alignment pattern information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Alignment = lite.extend(null, {

    /**
     * The alignment pattern block.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Alignment
     */
    BLOCK: [
      0,  11, 15, 19, 23, 27, 31,
      16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
      26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
    ]

  });

  var Alignment_1 = Alignment;

  /* eslint no-multi-spaces: "off" */



  /**
   * Contains error correction information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var ErrorCorrection = lite.extend(null, {

    /**
     * The error correction blocks.
     *
     * There are four elements per version. The first two indicate the number of blocks, then the data width, and finally
     * the ECC width.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof ErrorCorrection
     */
    BLOCKS: [
      1,  0,  19,  7,     1,  0,  16,  10,    1,  0,  13,  13,    1,  0,  9,   17,
      1,  0,  34,  10,    1,  0,  28,  16,    1,  0,  22,  22,    1,  0,  16,  28,
      1,  0,  55,  15,    1,  0,  44,  26,    2,  0,  17,  18,    2,  0,  13,  22,
      1,  0,  80,  20,    2,  0,  32,  18,    2,  0,  24,  26,    4,  0,  9,   16,
      1,  0,  108, 26,    2,  0,  43,  24,    2,  2,  15,  18,    2,  2,  11,  22,
      2,  0,  68,  18,    4,  0,  27,  16,    4,  0,  19,  24,    4,  0,  15,  28,
      2,  0,  78,  20,    4,  0,  31,  18,    2,  4,  14,  18,    4,  1,  13,  26,
      2,  0,  97,  24,    2,  2,  38,  22,    4,  2,  18,  22,    4,  2,  14,  26,
      2,  0,  116, 30,    3,  2,  36,  22,    4,  4,  16,  20,    4,  4,  12,  24,
      2,  2,  68,  18,    4,  1,  43,  26,    6,  2,  19,  24,    6,  2,  15,  28,
      4,  0,  81,  20,    1,  4,  50,  30,    4,  4,  22,  28,    3,  8,  12,  24,
      2,  2,  92,  24,    6,  2,  36,  22,    4,  6,  20,  26,    7,  4,  14,  28,
      4,  0,  107, 26,    8,  1,  37,  22,    8,  4,  20,  24,    12, 4,  11,  22,
      3,  1,  115, 30,    4,  5,  40,  24,    11, 5,  16,  20,    11, 5,  12,  24,
      5,  1,  87,  22,    5,  5,  41,  24,    5,  7,  24,  30,    11, 7,  12,  24,
      5,  1,  98,  24,    7,  3,  45,  28,    15, 2,  19,  24,    3,  13, 15,  30,
      1,  5,  107, 28,    10, 1,  46,  28,    1,  15, 22,  28,    2,  17, 14,  28,
      5,  1,  120, 30,    9,  4,  43,  26,    17, 1,  22,  28,    2,  19, 14,  28,
      3,  4,  113, 28,    3,  11, 44,  26,    17, 4,  21,  26,    9,  16, 13,  26,
      3,  5,  107, 28,    3,  13, 41,  26,    15, 5,  24,  30,    15, 10, 15,  28,
      4,  4,  116, 28,    17, 0,  42,  26,    17, 6,  22,  28,    19, 6,  16,  30,
      2,  7,  111, 28,    17, 0,  46,  28,    7,  16, 24,  30,    34, 0,  13,  24,
      4,  5,  121, 30,    4,  14, 47,  28,    11, 14, 24,  30,    16, 14, 15,  30,
      6,  4,  117, 30,    6,  14, 45,  28,    11, 16, 24,  30,    30, 2,  16,  30,
      8,  4,  106, 26,    8,  13, 47,  28,    7,  22, 24,  30,    22, 13, 15,  30,
      10, 2,  114, 28,    19, 4,  46,  28,    28, 6,  22,  28,    33, 4,  16,  30,
      8,  4,  122, 30,    22, 3,  45,  28,    8,  26, 23,  30,    12, 28, 15,  30,
      3,  10, 117, 30,    3,  23, 45,  28,    4,  31, 24,  30,    11, 31, 15,  30,
      7,  7,  116, 30,    21, 7,  45,  28,    1,  37, 23,  30,    19, 26, 15,  30,
      5,  10, 115, 30,    19, 10, 47,  28,    15, 25, 24,  30,    23, 25, 15,  30,
      13, 3,  115, 30,    2,  29, 46,  28,    42, 1,  24,  30,    23, 28, 15,  30,
      17, 0,  115, 30,    10, 23, 46,  28,    10, 35, 24,  30,    19, 35, 15,  30,
      17, 1,  115, 30,    14, 21, 46,  28,    29, 19, 24,  30,    11, 46, 15,  30,
      13, 6,  115, 30,    14, 23, 46,  28,    44, 7,  24,  30,    59, 1,  16,  30,
      12, 7,  121, 30,    12, 26, 47,  28,    39, 14, 24,  30,    22, 41, 15,  30,
      6,  14, 121, 30,    6,  34, 47,  28,    46, 10, 24,  30,    2,  64, 15,  30,
      17, 4,  122, 30,    29, 14, 46,  28,    49, 10, 24,  30,    24, 46, 15,  30,
      4,  18, 122, 30,    13, 32, 46,  28,    48, 14, 24,  30,    42, 32, 15,  30,
      20, 4,  117, 30,    40, 7,  47,  28,    43, 22, 24,  30,    10, 67, 15,  30,
      19, 6,  118, 30,    18, 31, 47,  28,    34, 34, 24,  30,    20, 61, 15,  30
    ],

    /**
     * The final format bits with mask (level << 3 | mask).
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof ErrorCorrection
     */
    FINAL_FORMAT: [
      // L
      0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
      // M
      0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
      // Q
      0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
      // H
      0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b
    ],

    /**
     * A map of human-readable ECC levels.
     *
     * @public
     * @static
     * @type {Object.<string, number>}
     * @memberof ErrorCorrection
     */
    LEVELS: {
      L: 1,
      M: 2,
      Q: 3,
      H: 4
    }

  });

  var ErrorCorrection_1 = ErrorCorrection;

  /**
   * Contains Galois field information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Galois = lite.extend(null, {

    /**
     * The Galois field exponent table.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Galois
     */
    EXPONENT: [
      0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
      0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
      0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
      0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
      0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
      0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
      0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
      0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
      0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
      0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
      0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
      0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
      0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
      0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
      0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
      0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
    ],

    /**
     * The Galois field log table.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Galois
     */
    LOG: [
      0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
      0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
      0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
      0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
      0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
      0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
      0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
      0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
      0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
      0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
      0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
      0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
      0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
      0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
      0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
      0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
    ]

  });

  var Galois_1 = Galois;

  /**
   * Contains version pattern information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Version = lite.extend(null, {

    /**
     * The version pattern block.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Version
     */
    BLOCK: [
      0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532,
      0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5,
      0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69
    ]

  });

  var Version_1 = Version;

  /**
   * Generates information for a QR code frame based on a specific value to be encoded.
   *
   * @param {Frame~Options} options - the options to be used
   * @public
   * @class
   * @extends Nevis
   */
  var Frame = lite.extend(function(options) {
    var dataBlock, eccBlock, index, neccBlock1, neccBlock2;
    var valueLength = options.value.length;

    this._badness = [];
    this._level = ErrorCorrection_1.LEVELS[options.level];
    this._polynomial = [];
    this._value = options.value;
    this._version = 0;
    this._stringBuffer = [];

    while (this._version < 40) {
      this._version++;

      index = ((this._level - 1) * 4) + ((this._version - 1) * 16);

      neccBlock1 = ErrorCorrection_1.BLOCKS[index++];
      neccBlock2 = ErrorCorrection_1.BLOCKS[index++];
      dataBlock = ErrorCorrection_1.BLOCKS[index++];
      eccBlock = ErrorCorrection_1.BLOCKS[index];

      index = (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2 - 3 + (this._version <= 9);

      if (valueLength <= index) {
        break;
      }
    }

    this._dataBlock = dataBlock;
    this._eccBlock = eccBlock;
    this._neccBlock1 = neccBlock1;
    this._neccBlock2 = neccBlock2;

    /**
     * The data width is based on version.
     *
     * @public
     * @type {number}
     * @memberof Frame#
     */
    // FIXME: Ensure that it fits instead of being truncated.
    var width = this.width = 17 + (4 * this._version);

    /**
     * The image buffer.
     *
     * @public
     * @type {number[]}
     * @memberof Frame#
     */
    this.buffer = Frame._createArray(width * width);

    this._ecc = Frame._createArray(dataBlock + ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2);
    this._mask = Frame._createArray(((width * (width + 1)) + 1) / 2);

    this._insertFinders();
    this._insertAlignments();

    // Insert single foreground cell.
    this.buffer[8 + (width * (width - 8))] = 1;

    this._insertTimingGap();
    this._reverseMask();
    this._insertTimingRowAndColumn();
    this._insertVersion();
    this._syncMask();
    this._convertBitStream(valueLength);
    this._calculatePolynomial();
    this._appendEccToData();
    this._interleaveBlocks();
    this._pack();
    this._finish();
  }, {

    _addAlignment: function(x, y) {
      var i;
      var buffer = this.buffer;
      var width = this.width;

      buffer[x + (width * y)] = 1;

      for (i = -2; i < 2; i++) {
        buffer[x + i + (width * (y - 2))] = 1;
        buffer[x - 2 + (width * (y + i + 1))] = 1;
        buffer[x + 2 + (width * (y + i))] = 1;
        buffer[x + i + 1 + (width * (y + 2))] = 1;
      }

      for (i = 0; i < 2; i++) {
        this._setMask(x - 1, y + i);
        this._setMask(x + 1, y - i);
        this._setMask(x - i, y - 1);
        this._setMask(x + i, y + 1);
      }
    },

    _appendData: function(data, dataLength, ecc, eccLength) {
      var bit, i, j;
      var polynomial = this._polynomial;
      var stringBuffer = this._stringBuffer;

      for (i = 0; i < eccLength; i++) {
        stringBuffer[ecc + i] = 0;
      }

      for (i = 0; i < dataLength; i++) {
        bit = Galois_1.LOG[stringBuffer[data + i] ^ stringBuffer[ecc]];

        if (bit !== 255) {
          for (j = 1; j < eccLength; j++) {
            stringBuffer[ecc + j - 1] = stringBuffer[ecc + j] ^
              Galois_1.EXPONENT[Frame._modN(bit + polynomial[eccLength - j])];
          }
        } else {
          for (j = ecc; j < ecc + eccLength; j++) {
            stringBuffer[j] = stringBuffer[j + 1];
          }
        }

        stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois_1.EXPONENT[Frame._modN(bit + polynomial[0])];
      }
    },

    _appendEccToData: function() {
      var i;
      var data = 0;
      var dataBlock = this._dataBlock;
      var ecc = this._calculateMaxLength();
      var eccBlock = this._eccBlock;

      for (i = 0; i < this._neccBlock1; i++) {
        this._appendData(data, dataBlock, ecc, eccBlock);

        data += dataBlock;
        ecc += eccBlock;
      }

      for (i = 0; i < this._neccBlock2; i++) {
        this._appendData(data, dataBlock + 1, ecc, eccBlock);

        data += dataBlock + 1;
        ecc += eccBlock;
      }
    },

    _applyMask: function(mask) {
      var r3x, r3y, x, y;
      var buffer = this.buffer;
      var width = this.width;

      switch (mask) {
      case 0:
        for (y = 0; y < width; y++) {
          for (x = 0; x < width; x++) {
            if (!((x + y) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 1:
        for (y = 0; y < width; y++) {
          for (x = 0; x < width; x++) {
            if (!(y & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 2:
        for (y = 0; y < width; y++) {
          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!r3x && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 3:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = r3y, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!r3x && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 4:
        for (y = 0; y < width; y++) {
          for (r3x = 0, r3y = (y >> 1) & 1, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
              r3y = !r3y;
            }

            if (!r3y && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 5:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((x & y & 1) + !(!r3x | !r3y)) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 6:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((x & y & 1) + (r3x && r3x === r3y) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 7:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((r3x && r3x === r3y) + (x + y & 1) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      }
    },

    _calculateMaxLength: function() {
      return (this._dataBlock * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
    },

    _calculatePolynomial: function() {
      var i, j;
      var eccBlock = this._eccBlock;
      var polynomial = this._polynomial;

      polynomial[0] = 1;

      for (i = 0; i < eccBlock; i++) {
        polynomial[i + 1] = 1;

        for (j = i; j > 0; j--) {
          polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
            Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[j]] + i)] : polynomial[j - 1];
        }

        polynomial[0] = Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[0]] + i)];
      }

      // Use logs for generator polynomial to save calculation step.
      for (i = 0; i <= eccBlock; i++) {
        polynomial[i] = Galois_1.LOG[polynomial[i]];
      }
    },

    _checkBadness: function() {
      var b, b1, h, x, y;
      var bad = 0;
      var badness = this._badness;
      var buffer = this.buffer;
      var width = this.width;

      // Blocks of same colour.
      for (y = 0; y < width - 1; y++) {
        for (x = 0; x < width - 1; x++) {
          // All foreground colour.
          if ((buffer[x + (width * y)] &&
            buffer[x + 1 + (width * y)] &&
            buffer[x + (width * (y + 1))] &&
            buffer[x + 1 + (width * (y + 1))]) ||
            // All background colour.
            !(buffer[x + (width * y)] ||
            buffer[x + 1 + (width * y)] ||
            buffer[x + (width * (y + 1))] ||
            buffer[x + 1 + (width * (y + 1))])) {
            bad += Frame.N2;
          }
        }
      }

      var bw = 0;

      // X runs.
      for (y = 0; y < width; y++) {
        h = 0;

        badness[0] = 0;

        for (b = 0, x = 0; x < width; x++) {
          b1 = buffer[x + (width * y)];

          if (b === b1) {
            badness[h]++;
          } else {
            badness[++h] = 1;
          }

          b = b1;
          bw += b ? 1 : -1;
        }

        bad += this._getBadness(h);
      }

      if (bw < 0) {
        bw = -bw;
      }

      var count = 0;
      var big = bw;
      big += big << 2;
      big <<= 1;

      while (big > width * width) {
        big -= width * width;
        count++;
      }

      bad += count * Frame.N4;

      // Y runs.
      for (x = 0; x < width; x++) {
        h = 0;

        badness[0] = 0;

        for (b = 0, y = 0; y < width; y++) {
          b1 = buffer[x + (width * y)];

          if (b === b1) {
            badness[h]++;
          } else {
            badness[++h] = 1;
          }

          b = b1;
        }

        bad += this._getBadness(h);
      }

      return bad;
    },

    _convertBitStream: function(length) {
      var bit, i;
      var ecc = this._ecc;
      var version = this._version;

      // Convert string to bit stream. 8-bit data to QR-coded 8-bit data (numeric, alphanumeric, or kanji not supported).
      for (i = 0; i < length; i++) {
        ecc[i] = this._value.charCodeAt(i);
      }

      var stringBuffer = this._stringBuffer = ecc.slice();
      var maxLength = this._calculateMaxLength();

      if (length >= maxLength - 2) {
        length = maxLength - 2;

        if (version > 9) {
          length--;
        }
      }

      // Shift and re-pack to insert length prefix.
      var index = length;

      if (version > 9) {
        stringBuffer[index + 2] = 0;
        stringBuffer[index + 3] = 0;

        while (index--) {
          bit = stringBuffer[index];

          stringBuffer[index + 3] |= 255 & (bit << 4);
          stringBuffer[index + 2] = bit >> 4;
        }

        stringBuffer[2] |= 255 & (length << 4);
        stringBuffer[1] = length >> 4;
        stringBuffer[0] = 0x40 | (length >> 12);
      } else {
        stringBuffer[index + 1] = 0;
        stringBuffer[index + 2] = 0;

        while (index--) {
          bit = stringBuffer[index];

          stringBuffer[index + 2] |= 255 & (bit << 4);
          stringBuffer[index + 1] = bit >> 4;
        }

        stringBuffer[1] |= 255 & (length << 4);
        stringBuffer[0] = 0x40 | (length >> 4);
      }

      // Fill to end with pad pattern.
      index = length + 3 - (version < 10);

      while (index < maxLength) {
        stringBuffer[index++] = 0xec;
        stringBuffer[index++] = 0x11;
      }
    },

    _getBadness: function(length) {
      var i;
      var badRuns = 0;
      var badness = this._badness;

      for (i = 0; i <= length; i++) {
        if (badness[i] >= 5) {
          badRuns += Frame.N1 + badness[i] - 5;
        }
      }

      // FBFFFBF as in finder.
      for (i = 3; i < length - 1; i += 2) {
        if (badness[i - 2] === badness[i + 2] &&
          badness[i + 2] === badness[i - 1] &&
          badness[i - 1] === badness[i + 1] &&
          badness[i - 1] * 3 === badness[i] &&
          // Background around the foreground pattern? Not part of the specs.
          (badness[i - 3] === 0 || i + 3 > length ||
          badness[i - 3] * 3 >= badness[i] * 4 ||
          badness[i + 3] * 3 >= badness[i] * 4)) {
          badRuns += Frame.N3;
        }
      }

      return badRuns;
    },

    _finish: function() {
      // Save pre-mask copy of frame.
      this._stringBuffer = this.buffer.slice();

      var currentMask, i;
      var bit = 0;
      var mask = 30000;

      /*
       * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
       * a better one since they get more complex and take longer.
       */
      for (i = 0; i < 8; i++) {
        // Returns foreground-background imbalance.
        this._applyMask(i);

        currentMask = this._checkBadness();

        // Is current mask better than previous best?
        if (currentMask < mask) {
          mask = currentMask;
          bit = i;
        }

        // Don't increment "i" to a void redoing mask.
        if (bit === 7) {
          break;
        }

        // Reset for next pass.
        this.buffer = this._stringBuffer.slice();
      }

      // Redo best mask as none were "good enough" (i.e. last wasn't bit).
      if (bit !== i) {
        this._applyMask(bit);
      }

      // Add in final mask/ECC level bytes.
      mask = ErrorCorrection_1.FINAL_FORMAT[bit + (this._level - 1 << 3)];

      var buffer = this.buffer;
      var width = this.width;

      // Low byte.
      for (i = 0; i < 8; i++, mask >>= 1) {
        if (mask & 1) {
          buffer[width - 1 - i + (width * 8)] = 1;

          if (i < 6) {
            buffer[8 + (width * i)] = 1;
          } else {
            buffer[8 + (width * (i + 1))] = 1;
          }
        }
      }

      // High byte.
      for (i = 0; i < 7; i++, mask >>= 1) {
        if (mask & 1) {
          buffer[8 + (width * (width - 7 + i))] = 1;

          if (i) {
            buffer[6 - i + (width * 8)] = 1;
          } else {
            buffer[7 + (width * 8)] = 1;
          }
        }
      }
    },

    _interleaveBlocks: function() {
      var i, j;
      var dataBlock = this._dataBlock;
      var ecc = this._ecc;
      var eccBlock = this._eccBlock;
      var k = 0;
      var maxLength = this._calculateMaxLength();
      var neccBlock1 = this._neccBlock1;
      var neccBlock2 = this._neccBlock2;
      var stringBuffer = this._stringBuffer;

      for (i = 0; i < dataBlock; i++) {
        for (j = 0; j < neccBlock1; j++) {
          ecc[k++] = stringBuffer[i + (j * dataBlock)];
        }

        for (j = 0; j < neccBlock2; j++) {
          ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
        }
      }

      for (j = 0; j < neccBlock2; j++) {
        ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
      }

      for (i = 0; i < eccBlock; i++) {
        for (j = 0; j < neccBlock1 + neccBlock2; j++) {
          ecc[k++] = stringBuffer[maxLength + i + (j * eccBlock)];
        }
      }

      this._stringBuffer = ecc;
    },

    _insertAlignments: function() {
      var i, x, y;
      var version = this._version;
      var width = this.width;

      if (version > 1) {
        i = Alignment_1.BLOCK[version];
        y = width - 7;

        for (;;) {
          x = width - 7;

          while (x > i - 3) {
            this._addAlignment(x, y);

            if (x < i) {
              break;
            }

            x -= i;
          }

          if (y <= i + 9) {
            break;
          }

          y -= i;

          this._addAlignment(6, y);
          this._addAlignment(y, 6);
        }
      }
    },

    _insertFinders: function() {
      var i, j, x, y;
      var buffer = this.buffer;
      var width = this.width;

      for (i = 0; i < 3; i++) {
        j = 0;
        y = 0;

        if (i === 1) {
          j = width - 7;
        }
        if (i === 2) {
          y = width - 7;
        }

        buffer[y + 3 + (width * (j + 3))] = 1;

        for (x = 0; x < 6; x++) {
          buffer[y + x + (width * j)] = 1;
          buffer[y + (width * (j + x + 1))] = 1;
          buffer[y + 6 + (width * (j + x))] = 1;
          buffer[y + x + 1 + (width * (j + 6))] = 1;
        }

        for (x = 1; x < 5; x++) {
          this._setMask(y + x, j + 1);
          this._setMask(y + 1, j + x + 1);
          this._setMask(y + 5, j + x);
          this._setMask(y + x + 1, j + 5);
        }

        for (x = 2; x < 4; x++) {
          buffer[y + x + (width * (j + 2))] = 1;
          buffer[y + 2 + (width * (j + x + 1))] = 1;
          buffer[y + 4 + (width * (j + x))] = 1;
          buffer[y + x + 1 + (width * (j + 4))] = 1;
        }
      }
    },

    _insertTimingGap: function() {
      var x, y;
      var width = this.width;

      for (y = 0; y < 7; y++) {
        this._setMask(7, y);
        this._setMask(width - 8, y);
        this._setMask(7, y + width - 7);
      }

      for (x = 0; x < 8; x++) {
        this._setMask(x, 7);
        this._setMask(x + width - 8, 7);
        this._setMask(x, width - 8);
      }
    },

    _insertTimingRowAndColumn: function() {
      var x;
      var buffer = this.buffer;
      var width = this.width;

      for (x = 0; x < width - 14; x++) {
        if (x & 1) {
          this._setMask(8 + x, 6);
          this._setMask(6, 8 + x);
        } else {
          buffer[8 + x + (width * 6)] = 1;
          buffer[6 + (width * (8 + x))] = 1;
        }
      }
    },

    _insertVersion: function() {
      var i, j, x, y;
      var buffer = this.buffer;
      var version = this._version;
      var width = this.width;

      if (version > 6) {
        i = Version_1.BLOCK[version - 7];
        j = 17;

        for (x = 0; x < 6; x++) {
          for (y = 0; y < 3; y++, j--) {
            if (1 & (j > 11 ? version >> j - 12 : i >> j)) {
              buffer[5 - x + (width * (2 - y + width - 11))] = 1;
              buffer[2 - y + width - 11 + (width * (5 - x))] = 1;
            } else {
              this._setMask(5 - x, 2 - y + width - 11);
              this._setMask(2 - y + width - 11, 5 - x);
            }
          }
        }
      }
    },

    _isMasked: function(x, y) {
      var bit = Frame._getMaskBit(x, y);

      return this._mask[bit] === 1;
    },

    _pack: function() {
      var bit, i, j;
      var k = 1;
      var v = 1;
      var width = this.width;
      var x = width - 1;
      var y = width - 1;

      // Interleaved data and ECC codes.
      var length = ((this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;

      for (i = 0; i < length; i++) {
        bit = this._stringBuffer[i];

        for (j = 0; j < 8; j++, bit <<= 1) {
          if (0x80 & bit) {
            this.buffer[x + (width * y)] = 1;
          }

          // Find next fill position.
          do {
            if (v) {
              x--;
            } else {
              x++;

              if (k) {
                if (y !== 0) {
                  y--;
                } else {
                  x -= 2;
                  k = !k;

                  if (x === 6) {
                    x--;
                    y = 9;
                  }
                }
              } else if (y !== width - 1) {
                y++;
              } else {
                x -= 2;
                k = !k;

                if (x === 6) {
                  x--;
                  y -= 8;
                }
              }
            }

            v = !v;
          } while (this._isMasked(x, y));
        }
      }
    },

    _reverseMask: function() {
      var x, y;
      var width = this.width;

      for (x = 0; x < 9; x++) {
        this._setMask(x, 8);
      }

      for (x = 0; x < 8; x++) {
        this._setMask(x + width - 8, 8);
        this._setMask(8, x);
      }

      for (y = 0; y < 7; y++) {
        this._setMask(8, y + width - 7);
      }
    },

    _setMask: function(x, y) {
      var bit = Frame._getMaskBit(x, y);

      this._mask[bit] = 1;
    },

    _syncMask: function() {
      var x, y;
      var width = this.width;

      for (y = 0; y < width; y++) {
        for (x = 0; x <= y; x++) {
          if (this.buffer[x + (width * y)]) {
            this._setMask(x, y);
          }
        }
      }
    }

  }, {

    _createArray: function(length) {
      var i;
      var array = [];

      for (i = 0; i < length; i++) {
        array[i] = 0;
      }

      return array;
    },

    _getMaskBit: function(x, y) {
      var bit;

      if (x > y) {
        bit = x;
        x = y;
        y = bit;
      }

      bit = y;
      bit += y * y;
      bit >>= 1;
      bit += x;

      return bit;
    },

    _modN: function(x) {
      while (x >= 255) {
        x -= 255;
        x = (x >> 8) + (x & 255);
      }

      return x;
    },

    // *Badness* coefficients.
    N1: 3,
    N2: 3,
    N3: 40,
    N4: 10

  });

  var Frame_1 = Frame;

  /**
   * The options used by {@link Frame}.
   *
   * @typedef {Object} Frame~Options
   * @property {string} level - The ECC level to be used.
   * @property {string} value - The value to be encoded.
   */

  /**
   * An implementation of {@link Renderer} for working with <code>img</code> elements.
   *
   * This depends on {@link CanvasRenderer} being executed first as this implementation simply applies the data URL from
   * the rendered <code>canvas</code> element as the <code>src</code> for the <code>img</code> element being rendered.
   *
   * @public
   * @class
   * @extends Renderer
   */
  var ImageRenderer = Renderer_1.extend({

    /**
     * @override
     */
    draw: function() {
      this.element.src = this.qrious.toDataURL();
    },

    /**
     * @override
     */
    reset: function() {
      this.element.src = '';
    },

    /**
     * @override
     */
    resize: function() {
      var element = this.element;

      element.width = element.height = this.qrious.size;
    }

  });

  var ImageRenderer_1 = ImageRenderer;

  /**
   * Defines an available option while also configuring how values are applied to the target object.
   *
   * Optionally, a default value can be specified as well a value transformer for greater control over how the option
   * value is applied.
   *
   * If no value transformer is specified, then any specified option will be applied directly. All values are maintained
   * on the target object itself as a field using the option name prefixed with a single underscore.
   *
   * When an option is specified as modifiable, the {@link OptionManager} will be required to include a setter for the
   * property that is defined on the target object that uses the option name.
   *
   * @param {string} name - the name to be used
   * @param {boolean} [modifiable] - <code>true</code> if the property defined on target objects should include a setter;
   * otherwise <code>false</code>
   * @param {*} [defaultValue] - the default value to be used
   * @param {Option~ValueTransformer} [valueTransformer] - the value transformer to be used
   * @public
   * @class
   * @extends Nevis
   */
  var Option = lite.extend(function(name, modifiable, defaultValue, valueTransformer) {
    /**
     * The name for this {@link Option}.
     *
     * @public
     * @type {string}
     * @memberof Option#
     */
    this.name = name;

    /**
     * Whether a setter should be included on the property defined on target objects for this {@link Option}.
     *
     * @public
     * @type {boolean}
     * @memberof Option#
     */
    this.modifiable = Boolean(modifiable);

    /**
     * The default value for this {@link Option}.
     *
     * @public
     * @type {*}
     * @memberof Option#
     */
    this.defaultValue = defaultValue;

    this._valueTransformer = valueTransformer;
  }, {

    /**
     * Transforms the specified <code>value</code> so that it can be applied for this {@link Option}.
     *
     * If a value transformer has been specified for this {@link Option}, it will be called upon to transform
     * <code>value</code>. Otherwise, <code>value</code> will be returned directly.
     *
     * @param {*} value - the value to be transformed
     * @return {*} The transformed value or <code>value</code> if no value transformer is specified.
     * @public
     * @memberof Option#
     */
    transform: function(value) {
      var transformer = this._valueTransformer;
      if (typeof transformer === 'function') {
        return transformer(value, this);
      }

      return value;
    }

  });

  var Option_1 = Option;

  /**
   * Returns a transformed value for the specified <code>value</code> to be applied for the <code>option</code> provided.
   *
   * @callback Option~ValueTransformer
   * @param {*} value - the value to be transformed
   * @param {Option} option - the {@link Option} for which <code>value</code> is being transformed
   * @return {*} The transform value.
   */

  /**
   * Contains utility methods that are useful throughout the library.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Utilities = lite.extend(null, {

    /**
     * Returns the absolute value of a given number.
     *
     * This method is simply a convenient shorthand for <code>Math.abs</code> while ensuring that nulls are returned as
     * <code>null</code> instead of zero.
     *
     * @param {number} value - the number whose absolute value is to be returned
     * @return {number} The absolute value of <code>value</code> or <code>null</code> if <code>value</code> is
     * <code>null</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    abs: function(value) {
      return value != null ? Math.abs(value) : null;
    },

    /**
     * Returns whether the specified <code>object</code> has a property with the specified <code>name</code> as an own
     * (not inherited) property.
     *
     * @param {Object} object - the object on which the property is to be checked
     * @param {string} name - the name of the property to be checked
     * @return {boolean} <code>true</code> if <code>object</code> has an own property with <code>name</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    hasOwn: function(object, name) {
      return Object.prototype.hasOwnProperty.call(object, name);
    },

    /**
     * A non-operation method that does absolutely nothing.
     *
     * @return {void}
     * @public
     * @static
     * @memberof Utilities
     */
    noop: function() {},

    /**
     * Transforms the specified <code>string</code> to upper case while remaining null-safe.
     *
     * @param {string} string - the string to be transformed to upper case
     * @return {string} <code>string</code> transformed to upper case if <code>string</code> is not <code>null</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    toUpperCase: function(string) {
      return string != null ? string.toUpperCase() : null;
    }

  });

  var Utilities_1 = Utilities;

  /**
   * Manages multiple {@link Option} instances that are intended to be used by multiple implementations.
   *
   * Although the option definitions are shared between targets, the values are maintained on the targets themselves.
   *
   * @param {Option[]} options - the options to be used
   * @public
   * @class
   * @extends Nevis
   */
  var OptionManager = lite.extend(function(options) {
    /**
     * The available options for this {@link OptionManager}.
     *
     * @public
     * @type {Object.<string, Option>}
     * @memberof OptionManager#
     */
    this.options = {};

    options.forEach(function(option) {
      this.options[option.name] = option;
    }, this);
  }, {

    /**
     * Returns whether an option with the specified <code>name</code> is available.
     *
     * @param {string} name - the name of the {@link Option} whose existence is to be checked
     * @return {boolean} <code>true</code> if an {@link Option} exists with <code>name</code>; otherwise
     * <code>false</code>.
     * @public
     * @memberof OptionManager#
     */
    exists: function(name) {
      return this.options[name] != null;
    },

    /**
     * Returns the value of the option with the specified <code>name</code> on the <code>target</code> object provided.
     *
     * @param {string} name - the name of the {@link Option} whose value on <code>target</code> is to be returned
     * @param {Object} target - the object from which the value of the named {@link Option} is to be returned
     * @return {*} The value of the {@link Option} with <code>name</code> on <code>target</code>.
     * @public
     * @memberof OptionManager#
     */
    get: function(name, target) {
      return OptionManager._get(this.options[name], target);
    },

    /**
     * Returns a copy of all of the available options on the <code>target</code> object provided.
     *
     * @param {Object} target - the object from which the option name/value pairs are to be returned
     * @return {Object.<string, *>} A hash containing the name/value pairs of all options on <code>target</code>.
     * @public
     * @memberof OptionManager#
     */
    getAll: function(target) {
      var name;
      var options = this.options;
      var result = {};

      for (name in options) {
        if (Utilities_1.hasOwn(options, name)) {
          result[name] = OptionManager._get(options[name], target);
        }
      }

      return result;
    },

    /**
     * Initializes the available options for the <code>target</code> object provided and then applies the initial values
     * within the speciifed <code>options</code>.
     *
     * This method will throw an error if any of the names within <code>options</code> does not match an available option.
     *
     * This involves setting the default values and defining properties for all of the available options on
     * <code>target</code> before finally calling {@link OptionMananger#setAll} with <code>options</code> and
     * <code>target</code>. Any options that are configured to be modifiable will have a setter included in their defined
     * property that will allow its corresponding value to be modified.
     *
     * If a change handler is specified, it will be called whenever the value changes on <code>target</code> for a
     * modifiable option, but only when done so via the defined property's setter.
     *
     * @param {Object.<string, *>} options - the name/value pairs of the initial options to be set
     * @param {Object} target - the object on which the options are to be initialized
     * @param {Function} [changeHandler] - the function to be called whenever the value of an modifiable option changes on
     * <code>target</code>
     * @return {void}
     * @throws {Error} If <code>options</code> contains an invalid option name.
     * @public
     * @memberof OptionManager#
     */
    init: function(options, target, changeHandler) {
      if (typeof changeHandler !== 'function') {
        changeHandler = Utilities_1.noop;
      }

      var name, option;

      for (name in this.options) {
        if (Utilities_1.hasOwn(this.options, name)) {
          option = this.options[name];

          OptionManager._set(option, option.defaultValue, target);
          OptionManager._createAccessor(option, target, changeHandler);
        }
      }

      this._setAll(options, target, true);
    },

    /**
     * Sets the value of the option with the specified <code>name</code> on the <code>target</code> object provided to
     * <code>value</code>.
     *
     * This method will throw an error if <code>name</code> does not match an available option or matches an option that
     * cannot be modified.
     *
     * If <code>value</code> is <code>null</code> and the {@link Option} has a default value configured, then that default
     * value will be used instead. If the {@link Option} also has a value transformer configured, it will be used to
     * transform whichever value was determined to be used.
     *
     * This method returns whether the value of the underlying field on <code>target</code> was changed as a result.
     *
     * @param {string} name - the name of the {@link Option} whose value is to be set
     * @param {*} value - the value to be set for the named {@link Option} on <code>target</code>
     * @param {Object} target - the object on which <code>value</code> is to be set for the named {@link Option}
     * @return {boolean} <code>true</code> if the underlying field on <code>target</code> was changed; otherwise
     * <code>false</code>.
     * @throws {Error} If <code>name</code> is invalid or is for an option that cannot be modified.
     * @public
     * @memberof OptionManager#
     */
    set: function(name, value, target) {
      return this._set(name, value, target);
    },

    /**
     * Sets all of the specified <code>options</code> on the <code>target</code> object provided to their corresponding
     * values.
     *
     * This method will throw an error if any of the names within <code>options</code> does not match an available option
     * or matches an option that cannot be modified.
     *
     * If any value within <code>options</code> is <code>null</code> and the corresponding {@link Option} has a default
     * value configured, then that default value will be used instead. If an {@link Option} also has a value transformer
     * configured, it will be used to transform whichever value was determined to be used.
     *
     * This method returns whether the value for any of the underlying fields on <code>target</code> were changed as a
     * result.
     *
     * @param {Object.<string, *>} options - the name/value pairs of options to be set
     * @param {Object} target - the object on which the options are to be set
     * @return {boolean} <code>true</code> if any of the underlying fields on <code>target</code> were changed; otherwise
     * <code>false</code>.
     * @throws {Error} If <code>options</code> contains an invalid option name or an option that cannot be modiifed.
     * @public
     * @memberof OptionManager#
     */
    setAll: function(options, target) {
      return this._setAll(options, target);
    },

    _set: function(name, value, target, allowUnmodifiable) {
      var option = this.options[name];
      if (!option) {
        throw new Error('Invalid option: ' + name);
      }
      if (!option.modifiable && !allowUnmodifiable) {
        throw new Error('Option cannot be modified: ' + name);
      }

      return OptionManager._set(option, value, target);
    },

    _setAll: function(options, target, allowUnmodifiable) {
      if (!options) {
        return false;
      }

      var name;
      var changed = false;

      for (name in options) {
        if (Utilities_1.hasOwn(options, name) && this._set(name, options[name], target, allowUnmodifiable)) {
          changed = true;
        }
      }

      return changed;
    }

  }, {

    _createAccessor: function(option, target, changeHandler) {
      var descriptor = {
        get: function() {
          return OptionManager._get(option, target);
        }
      };

      if (option.modifiable) {
        descriptor.set = function(value) {
          if (OptionManager._set(option, value, target)) {
            changeHandler(value, option);
          }
        };
      }

      Object.defineProperty(target, option.name, descriptor);
    },

    _get: function(option, target) {
      return target['_' + option.name];
    },

    _set: function(option, value, target) {
      var fieldName = '_' + option.name;
      var oldValue = target[fieldName];
      var newValue = option.transform(value != null ? value : option.defaultValue);

      target[fieldName] = newValue;

      return newValue !== oldValue;
    }

  });

  var OptionManager_1 = OptionManager;

  /**
   * Called whenever the value of a modifiable {@link Option} is changed on a target object via the defined property's
   * setter.
   *
   * @callback OptionManager~ChangeHandler
   * @param {*} value - the new value for <code>option</code> on the target object
   * @param {Option} option - the modifable {@link Option} whose value has changed on the target object.
   * @return {void}
   */

  /**
   * A basic manager for {@link Service} implementations that are mapped to simple names.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var ServiceManager = lite.extend(function() {
    this._services = {};
  }, {

    /**
     * Returns the {@link Service} being managed with the specified <code>name</code>.
     *
     * @param {string} name - the name of the {@link Service} to be returned
     * @return {Service} The {@link Service} is being managed with <code>name</code>.
     * @throws {Error} If no {@link Service} is being managed with <code>name</code>.
     * @public
     * @memberof ServiceManager#
     */
    getService: function(name) {
      var service = this._services[name];
      if (!service) {
        throw new Error('Service is not being managed with name: ' + name);
      }

      return service;
    },

    /**
     * Sets the {@link Service} implementation to be managed for the specified <code>name</code> to the
     * <code>service</code> provided.
     *
     * @param {string} name - the name of the {@link Service} to be managed with <code>name</code>
     * @param {Service} service - the {@link Service} implementation to be managed
     * @return {void}
     * @throws {Error} If a {@link Service} is already being managed with the same <code>name</code>.
     * @public
     * @memberof ServiceManager#
     */
    setService: function(name, service) {
      if (this._services[name]) {
        throw new Error('Service is already managed with name: ' + name);
      }

      if (service) {
        this._services[name] = service;
      }
    }

  });

  var ServiceManager_1 = ServiceManager;

  var optionManager = new OptionManager_1([
    new Option_1('background', true, 'white'),
    new Option_1('backgroundAlpha', true, 1, Utilities_1.abs),
    new Option_1('element'),
    new Option_1('foreground', true, 'black'),
    new Option_1('foregroundAlpha', true, 1, Utilities_1.abs),
    new Option_1('level', true, 'L', Utilities_1.toUpperCase),
    new Option_1('mime', true, 'image/png'),
    new Option_1('padding', true, null, Utilities_1.abs),
    new Option_1('size', true, 100, Utilities_1.abs),
    new Option_1('value', true, '')
  ]);
  var serviceManager = new ServiceManager_1();

  /**
   * Enables configuration of a QR code generator which uses HTML5 <code>canvas</code> for rendering.
   *
   * @param {QRious~Options} [options] - the options to be used
   * @throws {Error} If any <code>options</code> are invalid.
   * @public
   * @class
   * @extends Nevis
   */
  var QRious = lite.extend(function(options) {
    optionManager.init(options, this, this.update.bind(this));

    var element = optionManager.get('element', this);
    var elementService = serviceManager.getService('element');
    var canvas = element && elementService.isCanvas(element) ? element : elementService.createCanvas();
    var image = element && elementService.isImage(element) ? element : elementService.createImage();

    this._canvasRenderer = new CanvasRenderer_1(this, canvas, true);
    this._imageRenderer = new ImageRenderer_1(this, image, image === element);

    this.update();
  }, {

    /**
     * Returns all of the options configured for this {@link QRious}.
     *
     * Any changes made to the returned object will not be reflected in the options themselves or their corresponding
     * underlying fields.
     *
     * @return {Object.<string, *>} A copy of the applied options.
     * @public
     * @memberof QRious#
     */
    get: function() {
      return optionManager.getAll(this);
    },

    /**
     * Sets all of the specified <code>options</code> and automatically updates this {@link QRious} if any of the
     * underlying fields are changed as a result.
     *
     * This is the preferred method for updating multiple options at one time to avoid unnecessary updates between
     * changes.
     *
     * @param {QRious~Options} options - the options to be set
     * @return {void}
     * @throws {Error} If any <code>options</code> are invalid or cannot be modified.
     * @public
     * @memberof QRious#
     */
    set: function(options) {
      if (optionManager.setAll(options, this)) {
        this.update();
      }
    },

    /**
     * Returns the image data URI for the generated QR code using the <code>mime</code> provided.
     *
     * @param {string} [mime] - the MIME type for the image
     * @return {string} The image data URI for the QR code.
     * @public
     * @memberof QRious#
     */
    toDataURL: function(mime) {
      return this.canvas.toDataURL(mime || this.mime);
    },

    /**
     * Updates this {@link QRious} by generating a new {@link Frame} and re-rendering the QR code.
     *
     * @return {void}
     * @protected
     * @memberof QRious#
     */
    update: function() {
      var frame = new Frame_1({
        level: this.level,
        value: this.value
      });

      this._canvasRenderer.render(frame);
      this._imageRenderer.render(frame);
    }

  }, {

    /**
     * Configures the <code>service</code> provided to be used by all {@link QRious} instances.
     *
     * @param {Service} service - the {@link Service} to be configured
     * @return {void}
     * @throws {Error} If a {@link Service} has already been configured with the same name.
     * @public
     * @static
     * @memberof QRious
     */
    use: function(service) {
      serviceManager.setService(service.getName(), service);
    }

  });

  Object.defineProperties(QRious.prototype, {

    canvas: {
      /**
       * Returns the <code>canvas</code> element being used to render the QR code for this {@link QRious}.
       *
       * @return {*} The <code>canvas</code> element.
       * @public
       * @memberof QRious#
       * @alias canvas
       */
      get: function() {
        return this._canvasRenderer.getElement();
      }
    },

    image: {
      /**
       * Returns the <code>img</code> element being used to render the QR code for this {@link QRious}.
       *
       * @return {*} The <code>img</code> element.
       * @public
       * @memberof QRious#
       * @alias image
       */
      get: function() {
        return this._imageRenderer.getElement();
      }
    }

  });

  var QRious_1$2 = QRious;

  /**
   * The options used by {@link QRious}.
   *
   * @typedef {Object} QRious~Options
   * @property {string} [background="white"] - The background color to be applied to the QR code.
   * @property {number} [backgroundAlpha=1] - The background alpha to be applied to the QR code.
   * @property {*} [element] - The element to be used to render the QR code which may either be an <code>canvas</code> or
   * <code>img</code>. The element(s) will be created if needed.
   * @property {string} [foreground="black"] - The foreground color to be applied to the QR code.
   * @property {number} [foregroundAlpha=1] - The foreground alpha to be applied to the QR code.
   * @property {string} [level="L"] - The error correction level to be applied to the QR code.
   * @property {string} [mime="image/png"] - The MIME type to be used to render the image for the QR code.
   * @property {number} [padding] - The padding for the QR code in pixels.
   * @property {number} [size=100] - The size of the QR code in pixels.
   * @property {string} [value=""] - The value to be encoded within the QR code.
   */

  var index = QRious_1$2;

  /**
   * Defines a service contract that must be met by all implementations.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Service = lite.extend({

    /**
     * Returns the name of this {@link Service}.
     *
     * @return {string} The service name.
     * @public
     * @abstract
     * @memberof Service#
     */
    getName: function() {}

  });

  var Service_1 = Service;

  /**
   * A service for working with elements.
   *
   * @public
   * @class
   * @extends Service
   */
  var ElementService = Service_1.extend({

    /**
     * Creates an instance of a canvas element.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @return {*} The newly created canvas element.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    createCanvas: function() {},

    /**
     * Creates an instance of a image element.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @return {*} The newly created image element.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    createImage: function() {},

    /**
     * @override
     */
    getName: function() {
      return 'element';
    },

    /**
     * Returns whether the specified <code>element</code> is a canvas.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @param {*} element - the element to be checked
     * @return {boolean} <code>true</code> if <code>element</code> is a canvas; otherwise <code>false</code>.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    isCanvas: function(element) {},

    /**
     * Returns whether the specified <code>element</code> is an image.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @param {*} element - the element to be checked
     * @return {boolean} <code>true</code> if <code>element</code> is an image; otherwise <code>false</code>.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    isImage: function(element) {}

  });

  var ElementService_1 = ElementService;

  /**
   * An implementation of {@link ElementService} intended for use within a browser environment.
   *
   * @public
   * @class
   * @extends ElementService
   */
  var BrowserElementService = ElementService_1.extend({

    /**
     * @override
     */
    createCanvas: function() {
      return document.createElement('canvas');
    },

    /**
     * @override
     */
    createImage: function() {
      return document.createElement('img');
    },

    /**
     * @override
     */
    isCanvas: function(element) {
      return element instanceof HTMLCanvasElement;
    },

    /**
     * @override
     */
    isImage: function(element) {
      return element instanceof HTMLImageElement;
    }

  });

  var BrowserElementService_1 = BrowserElementService;

  index.use(new BrowserElementService_1());

  var QRious_1 = index;

  return QRious_1;

})));

//# sourceMappingURL=qrious.js.map
  })();
});

require.register("roadtrip/dist/roadtrip.umd.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "roadtrip");
  (function() {
    (function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.roadtrip = factory());
}(this, (function () { 'use strict';

var a = typeof document !== 'undefined' && document.createElement( 'a' );
var QUERYPAIR_REGEX = /^([\w\-]+)(?:=([^&]*))?$/;
var HANDLERS = [ 'beforeenter', 'enter', 'leave', 'update' ];

var isInitial = true;

function RouteData (ref) {
	var route = ref.route;
	var pathname = ref.pathname;
	var params = ref.params;
	var query = ref.query;
	var hash = ref.hash;
	var scrollX = ref.scrollX;
	var scrollY = ref.scrollY;

	this.pathname = pathname;
	this.params = params;
	this.query = query;
	this.hash = hash;
	this.isInitial = isInitial;
	this.scrollX = scrollX;
	this.scrollY = scrollY;

	this._route = route;

	isInitial = false;
}

RouteData.prototype = {
	matches: function matches ( href ) {
		return this._route.matches( href );
	}
};

function Route ( path, options ) {
	var this$1 = this;

	// strip leading slash
	if ( path[0] === '/' ) {
		path = path.slice( 1 );
	}

	this.path = path;
	this.segments = path.split( '/' );

	if ( typeof options === 'function' ) {
		options = {
			enter: options
		};
	}

	this.updateable = typeof options.update === 'function';

	HANDLERS.forEach( function (handler) {
		this$1[ handler ] = function ( route, other ) {
			var value;

			if ( options[ handler ] ) {
				value = options[ handler ]( route, other );
			}

			return roadtrip.Promise.resolve( value );
		};
	});
}

Route.prototype = {
	matches: function matches$1 ( href ) {
		a.href = href;

		var pathname = a.pathname.slice( 1 );
		var segments = pathname.split( '/' );

		return segmentsMatch( segments, this.segments );
	},

	exec: function exec ( target ) {
		var this$1 = this;

		a.href = target.href;

		var pathname = a.pathname.slice( 1 );
		var search = a.search.slice( 1 );

		var segments = pathname.split( '/' );

		if ( segments.length !== this.segments.length ) {
			return false;
		}

		var params = {};

		for ( var i = 0; i < segments.length; i += 1 ) {
			var segment = segments[i];
			var toMatch = this$1.segments[i];

			if ( toMatch[0] === ':' ) {
				params[ toMatch.slice( 1 ) ] = segment;
			}

			else if ( segment !== toMatch ) {
				return false;
			}
		}

		var query = {};
		var queryPairs = search.split( '&' );

		for ( var i$1 = 0; i$1 < queryPairs.length; i$1 += 1 ) {
			var match = QUERYPAIR_REGEX.exec( queryPairs[i$1] );

			if ( match ) {
				var key = match[1];
				var value = decodeURIComponent( match[2] );

				if ( query.hasOwnProperty( key ) ) {
					if ( typeof query[ key ] !== 'object' ) {
						query[ key ] = [ query[ key ] ];
					}

					query[ key ].push( value );
				}

				else {
					query[ key ] = value;
				}
			}
		}

		return new RouteData({
			route: this,
			pathname: pathname,
			params: params,
			query: query,
			hash: a.hash.slice( 1 ),
			scrollX: target.scrollX,
			scrollY: target.scrollY
		});
	}
};

function segmentsMatch ( a, b ) {
	if ( a.length !== b.length ) { return; }

	var i = a.length;
	while ( i-- ) {
		if ( ( a[i] !== b[i] ) && ( b[i][0] !== ':' ) ) {
			return false;
		}
	}

	return true;
}

var window$1 = ( typeof window !== 'undefined' ? window : null );

var routes = [];

// Adapted from https://github.com/visionmedia/page.js
// MIT license https://github.com/visionmedia/page.js#license

function watchLinks ( callback ) {
	window$1.addEventListener( 'click', handler, false );
	window$1.addEventListener( 'touchstart', handler, false );

	function handler ( event ) {
		if ( which( event ) !== 1 ) { return; }
		if ( event.metaKey || event.ctrlKey || event.shiftKey ) { return; }
		if ( event.defaultPrevented ) { return; }

		// ensure target is a link
		var el = event.target;
		while ( el && el.nodeName !== 'A' ) {
			el = el.parentNode;
		}

		if ( !el || el.nodeName !== 'A' ) { return; }

		// Ignore if tag has
		// 1. 'download' attribute
		// 2. rel='external' attribute
		if ( el.hasAttribute( 'download' ) || el.getAttribute( 'rel' ) === 'external' ) { return; }

		// ensure non-hash for the same path

		// Check for mailto: in the href
		if ( ~el.href.indexOf( 'mailto:' ) ) { return; }

		// check target
		if ( el.target ) { return; }

		// x-origin
		if ( !sameOrigin( el.href ) ) { return; }

		// rebuild path
		var path = el.pathname + el.search + ( el.hash || '' );

		// strip leading '/[drive letter]:' on NW.js on Windows
		if ( typeof process !== 'undefined' && path.match( /^\/[a-zA-Z]:\// ) ) {
			path = path.replace( /^\/[a-zA-Z]:\//, '/' );
		}

		// same page
		var orig = path;

		if ( path.indexOf( roadtrip.base ) === 0 ) {
			path = path.substr( roadtrip.base.length );
		}

		if ( roadtrip.base && orig === path ) { return; }

		// no match? allow navigation
		if ( !routes.some( function (route) { return route.matches( orig ); } ) ) { return; }

		event.preventDefault();
		callback( orig );
	}
}

function which ( event ) {
	event = event || window$1.event;
	return event.which === null ? event.button : event.which;
}

function sameOrigin ( href ) {
	var origin = location.protocol + '//' + location.hostname;
	if ( location.port ) { origin += ':' + location.port; }

	return ( href && ( href.indexOf( origin ) === 0 ) );
}

function isSameRoute ( routeA, routeB, dataA, dataB ) {
	if ( routeA !== routeB ) {
		return false;
	}

	return (
		dataA.hash === dataB.hash &&
		deepEqual( dataA.params, dataB.params ) &&
		deepEqual( dataA.query, dataB.query )
	);
}

function deepEqual ( a, b ) {
	if ( a === null && b === null ) {
		return true;
	}

	if ( isArray( a ) && isArray( b ) ) {
		var i = a.length;

		if ( b.length !== i ) { return false; }

		while ( i-- ) {
			if ( !deepEqual( a[i], b[i] ) ) {
				return false;
			}
		}

		return true;
	}

	else if ( typeof a === 'object' && typeof b === 'object' ) {
		var aKeys = Object.keys( a );
		var bKeys = Object.keys( b );

		var i$1 = aKeys.length;

		if ( bKeys.length !== i$1 ) { return false; }

		while ( i$1-- ) {
			var key = aKeys[i$1];

			if ( !b.hasOwnProperty( key ) || !deepEqual( b[ key ], a[ key ] ) ) {
				return false;
			}
		}

		return true;
	}

	return a === b;
}

var toString = Object.prototype.toString;

function isArray ( thing ) {
	return toString.call( thing ) === '[object Array]';
}

// Enables HTML5-History-API polyfill: https://github.com/devote/HTML5-History-API
var location$1 = window$1 && ( window$1.history.location || window$1.location );

function noop () {}

var currentData = {};
var currentRoute = {
	enter: function () { return roadtrip.Promise.resolve(); },
	leave: function () { return roadtrip.Promise.resolve(); }
};

var _target;
var isTransitioning = false;

var scrollHistory = {};
var uniqueID = 1;
var currentID = uniqueID;

var roadtrip = {
	base: '',
	Promise: Promise,

	add: function add ( path, options ) {
		routes.push( new Route( path, options ) );
		return roadtrip;
	},

	start: function start ( options ) {
		if ( options === void 0 ) options = {};

		var href = routes.some( function (route) { return route.matches( location$1.href ); } ) ?
			location$1.href :
			options.fallback;

		return roadtrip.goto( href, {
			replaceState: true,
			scrollX: window$1.scrollX,
			scrollY: window$1.scrollY
		});
	},

	goto: function goto ( href, options ) {
		if ( options === void 0 ) options = {};

		scrollHistory[ currentID ] = {
			x: window$1.scrollX,
			y: window$1.scrollY
		};

		var target;
		var promise = new roadtrip.Promise( function ( fulfil, reject ) {
			target = _target = {
				href: href,
				scrollX: options.scrollX || 0,
				scrollY: options.scrollY || 0,
				options: options,
				fulfil: fulfil,
				reject: reject
			};
		});

		_target.promise = promise;

		if ( isTransitioning ) {
			return promise;
		}

		_goto( target );
		return promise;
	}
};

if ( window$1 ) {
	watchLinks( function (href) { return roadtrip.goto( href ); } );

	// watch history
	window$1.addEventListener( 'popstate', function (event) {
		if ( !event.state ) { return; } // hashchange, or otherwise outside roadtrip's control
		var scroll = scrollHistory[ event.state.uid ];

		_target = {
			href: location$1.href,
			scrollX: scroll.x,
			scrollY: scroll.y,
			popstate: true, // so we know not to manipulate the history
			fulfil: noop,
			reject: noop
		};

		_goto( _target );
		currentID = event.state.uid;
	}, false );
}

function _goto ( target ) {
	var newRoute;
	var newData;

	for ( var i = 0; i < routes.length; i += 1 ) {
		var route = routes[i];
		newData = route.exec( target );

		if ( newData ) {
			newRoute = route;
			break;
		}
	}

	if ( !newRoute || isSameRoute( newRoute, currentRoute, newData, currentData ) ) {
		target.fulfil();
		return;
	}

	scrollHistory[ currentID ] = {
		x: ( currentData.scrollX = window$1.scrollX ),
		y: ( currentData.scrollY = window$1.scrollY )
	};

	isTransitioning = true;

	var promise;

	if ( ( newRoute === currentRoute ) && newRoute.updateable ) {
		promise = newRoute.update( newData );
	} else {
		promise = roadtrip.Promise.all([
			currentRoute.leave( currentData, newData ),
			newRoute.beforeenter( newData, currentData )
		]).then( function () { return newRoute.enter( newData, currentData ); } );
	}

	promise
		.then( function () {
			currentRoute = newRoute;
			currentData = newData;

			isTransitioning = false;

			// if the user navigated while the transition was taking
			// place, we need to do it all again
			if ( _target !== target ) {
				_goto( _target );
				_target.promise.then( target.fulfil, target.reject );
			} else {
				target.fulfil();
			}
		})
		.catch( target.reject );

	if ( target.popstate ) { return; }

	var ref = target.options;
	var replaceState = ref.replaceState;
	var invisible = ref.invisible;
	if ( invisible ) { return; }

	var uid = replaceState ? currentID : ++uniqueID;
	history[ replaceState ? 'replaceState' : 'pushState' ]( { uid: uid }, '', target.href );

	currentID = uid;
	scrollHistory[ currentID ] = {
		x: target.scrollX,
		y: target.scrollY
	};
}

return roadtrip;

})));
  })();
});

require.register("svelte/store.umd.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "svelte");
  (function() {
    (function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.svelte = global.svelte || {})));
}(this, (function (exports) { 'use strict';

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function blankObject() {
	return Object.create(null);
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function _differsImmutable(a, b) {
	return a != a ? b == b : a !== b;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function Store(state, options) {
	this._observers = { pre: blankObject(), post: blankObject() };
	this._handlers = {};
	this._dependents = [];

	this._computed = blankObject();
	this._sortedComputedProperties = [];

	this._state = assign({}, state);
	this._differs = options && options.immutable ? _differsImmutable : _differs;
}

assign(Store.prototype, {
	_add: function(component, props) {
		this._dependents.push({
			component: component,
			props: props
		});
	},

	_init: function(props) {
		var state = {};
		for (var i = 0; i < props.length; i += 1) {
			var prop = props[i];
			state['$' + prop] = this._state[prop];
		}
		return state;
	},

	_remove: function(component) {
		var i = this._dependents.length;
		while (i--) {
			if (this._dependents[i].component === component) {
				this._dependents.splice(i, 1);
				return;
			}
		}
	},

	_sortComputedProperties: function() {
		var computed = this._computed;
		var sorted = this._sortedComputedProperties = [];
		var cycles;
		var visited = blankObject();

		function visit(key) {
			if (cycles[key]) {
				throw new Error('Cyclical dependency detected');
			}

			if (visited[key]) return;
			visited[key] = true;

			var c = computed[key];

			if (c) {
				cycles[key] = true;
				c.deps.forEach(visit);
				sorted.push(c);
			}
		}

		for (var key in this._computed) {
			cycles = blankObject();
			visit(key);
		}
	},

	compute: function(key, deps, fn) {
		var store = this;
		var value;

		var c = {
			deps: deps,
			update: function(state, changed, dirty) {
				var values = deps.map(function(dep) {
					if (dep in changed) dirty = true;
					return state[dep];
				});

				if (dirty) {
					var newValue = fn.apply(null, values);
					if (store._differs(newValue, value)) {
						value = newValue;
						changed[key] = true;
						state[key] = value;
					}
				}
			}
		};

		c.update(this._state, {}, true);

		this._computed[key] = c;
		this._sortComputedProperties();
	},

	fire: fire,

	get: get,

	// TODO remove this method
	observe: observe,

	on: on,

	onchange: function(callback) {
		// TODO remove this method
		console.warn("store.onchange is deprecated in favour of store.on('state', event => {...})");

		return this.on('state', function(event) {
			callback(event.current, event.changed);
		});
	},

	set: function(newState) {
		var oldState = this._state,
			changed = this._changed = {},
			dirty = false;

		for (var key in newState) {
			if (this._computed[key]) throw new Error("'" + key + "' is a read-only property");
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);

		for (var i = 0; i < this._sortedComputedProperties.length; i += 1) {
			this._sortedComputedProperties[i].update(this._state, changed);
		}

		this.fire('state', {
			changed: changed,
			current: this._state,
			previous: oldState
		});

		var dependents = this._dependents.slice(); // guard against mutations
		for (var i = 0; i < dependents.length; i += 1) {
			var dependent = dependents[i];
			var componentState = {};
			dirty = false;

			for (var j = 0; j < dependent.props.length; j += 1) {
				var prop = dependent.props[j];
				if (prop in changed) {
					componentState['$' + prop] = this._state[prop];
					dirty = true;
				}
			}

			if (dirty) dependent.component.set(componentState);
		}

		this.fire('update', {
			changed: changed,
			current: this._state,
			previous: oldState
		});
	}
});

exports.Store = Store;

Object.defineProperty(exports, '__esModule', { value: true });

})));
  })();
});
require.register("components/icon/icon.component.svelte.html", function(exports, require, module) {
/* app/components/icon/icon.component.svelte.html generated by Svelte v1.64.1 */
"use strict";

function create_main_fragment(component, state) {
	var text, text_1, text_2, if_block_3_anchor;

	var if_block = (state.name === 'check') && create_if_block(component, state);

	var if_block_1 = (state.name === 'hand') && create_if_block_1(component, state);

	var if_block_2 = (state.name === 'logo') && create_if_block_2(component, state);

	var if_block_3 = (state.name === 'share') && create_if_block_3(component, state);

	return {
		c: function create() {
			if (if_block) if_block.c();
			text = createText("\n\n");
			if (if_block_1) if_block_1.c();
			text_1 = createText("\n\n");
			if (if_block_2) if_block_2.c();
			text_2 = createText("\n\n");
			if (if_block_3) if_block_3.c();
			if_block_3_anchor = createComment();
		},

		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insertNode(text, target, anchor);
			if (if_block_1) if_block_1.m(target, anchor);
			insertNode(text_1, target, anchor);
			if (if_block_2) if_block_2.m(target, anchor);
			insertNode(text_2, target, anchor);
			if (if_block_3) if_block_3.m(target, anchor);
			insertNode(if_block_3_anchor, target, anchor);
		},

		p: function update(changed, state) {
			if (state.name === 'check') {
				if (!if_block) {
					if_block = create_if_block(component, state);
					if_block.c();
					if_block.m(text.parentNode, text);
				}
			} else if (if_block) {
				if_block.u();
				if_block.d();
				if_block = null;
			}

			if (state.name === 'hand') {
				if (!if_block_1) {
					if_block_1 = create_if_block_1(component, state);
					if_block_1.c();
					if_block_1.m(text_1.parentNode, text_1);
				}
			} else if (if_block_1) {
				if_block_1.u();
				if_block_1.d();
				if_block_1 = null;
			}

			if (state.name === 'logo') {
				if (!if_block_2) {
					if_block_2 = create_if_block_2(component, state);
					if_block_2.c();
					if_block_2.m(text_2.parentNode, text_2);
				}
			} else if (if_block_2) {
				if_block_2.u();
				if_block_2.d();
				if_block_2 = null;
			}

			if (state.name === 'share') {
				if (!if_block_3) {
					if_block_3 = create_if_block_3(component, state);
					if_block_3.c();
					if_block_3.m(if_block_3_anchor.parentNode, if_block_3_anchor);
				}
			} else if (if_block_3) {
				if_block_3.u();
				if_block_3.d();
				if_block_3 = null;
			}
		},

		u: function unmount() {
			if (if_block) if_block.u();
			detachNode(text);
			if (if_block_1) if_block_1.u();
			detachNode(text_1);
			if (if_block_2) if_block_2.u();
			detachNode(text_2);
			if (if_block_3) if_block_3.u();
			detachNode(if_block_3_anchor);
		},

		d: function destroy() {
			if (if_block) if_block.d();
			if (if_block_1) if_block_1.d();
			if (if_block_2) if_block_2.d();
			if (if_block_3) if_block_3.d();
		}
	};
}

// (1:0) {{#if name === 'check'}}
function create_if_block(component, state) {
	var img;

	return {
		c: function create() {
			img = createElement("img");
			this.h();
		},

		h: function hydrate() {
			img.src = "/img/check.svg";
			img.width = "17";
		},

		m: function mount(target, anchor) {
			insertNode(img, target, anchor);
		},

		u: function unmount() {
			detachNode(img);
		},

		d: noop
	};
}

// (6:0) {{#if name === 'hand'}}
function create_if_block_1(component, state) {
	var img;

	return {
		c: function create() {
			img = createElement("img");
			this.h();
		},

		h: function hydrate() {
			img.src = "/img/hand.svg";
			img.className = "icon instruction-hand";
		},

		m: function mount(target, anchor) {
			insertNode(img, target, anchor);
		},

		u: function unmount() {
			detachNode(img);
		},

		d: noop
	};
}

// (39:0) {{#if name === 'logo'}}
function create_if_block_2(component, state) {
	var img;

	return {
		c: function create() {
			img = createElement("img");
			this.h();
		},

		h: function hydrate() {
			img.src = "/img/logo.svg";
			img.className = "icon logo";
		},

		m: function mount(target, anchor) {
			insertNode(img, target, anchor);
		},

		u: function unmount() {
			detachNode(img);
		},

		d: noop
	};
}

// (72:0) {{#if name === 'share'}}
function create_if_block_3(component, state) {
	var img;

	return {
		c: function create() {
			img = createElement("img");
			this.h();
		},

		h: function hydrate() {
			img.src = "/img/share.svg";
			img.className = "icon";
			img.width = "16";
		},

		m: function mount(target, anchor) {
			insertNode(img, target, anchor);
		},

		u: function unmount() {
			detachNode(img);
		},

		d: noop
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });

Multiple_wallets_component_svelte.prototype._recompute = noop;

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function noop() {}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function blankObject() {
	return Object.create(null);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("components/multiple-wallets/multiple-wallets.component.svelte.html", function(exports, require, module) {
/* app/components/multiple-wallets/multiple-wallets.component.svelte.html generated by Svelte v1.64.1 */
"use strict";
var PaperWallet = require("../paperwallet/paperwallet.component.svelte");
PaperWallet = (PaperWallet && PaperWallet.__esModule) ? PaperWallet["default"] : PaperWallet;

var methods = {
  actionPaperWallet() {
    window.print();
  }
};

function create_main_fragment(component, state) {
	var h1, text_value = state.$dictionary.wallet.multipleWallets.titlePrint, text, text_1, text_2, div, button, text_3_value = state.$dictionary.wallet.multipleWallets.printBtn, text_3, text_4;

	var each_value = state.wallets;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, assign(assign({}, state), {
			each_value: each_value,
			wallet: each_value[i],
			i: i
		}));
	}

	function click_handler(event) {
		component.actionPaperWallet();
	}

	var each_value_1 = state.wallets;

	var each_1_blocks = [];

	for (var i = 0; i < each_value_1.length; i += 1) {
		each_1_blocks[i] = create_each_block_1(component, assign(assign({}, state), {
			each_value_1: each_value_1,
			wallet: each_value_1[i],
			i: i
		}));
	}

	return {
		c: function create() {
			h1 = createElement("h1");
			text = createText(text_value);
			text_1 = createText("\n\n");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text_2 = createText("\n\n");
			div = createElement("div");
			button = createElement("button");
			text_3 = createText(text_3_value);
			text_4 = createText("\n  ");

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].c();
			}
			this.h();
		},

		h: function hydrate() {
			h1.className = "print-only print-title";
			addListener(button, "click", click_handler);
			button.className = "btn";
			div.className = "MultipleWalletsComp";
		},

		m: function mount(target, anchor) {
			insertNode(h1, target, anchor);
			appendNode(text, h1);
			insertNode(text_1, target, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insertNode(text_2, target, anchor);
			insertNode(div, target, anchor);
			appendNode(button, div);
			appendNode(text_3, button);
			appendNode(text_4, div);

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].m(div, null);
			}
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_value !== (text_value = state.$dictionary.wallet.multipleWallets.titlePrint)) {
				text.data = text_value;
			}

			var each_value = state.wallets;

			if (changed.wallets) {
				for (var i = 0; i < each_value.length; i += 1) {
					var each_context = assign(assign({}, state), {
						each_value: each_value,
						wallet: each_value[i],
						i: i
					});

					if (each_blocks[i]) {
						each_blocks[i].p(changed, each_context);
					} else {
						each_blocks[i] = create_each_block(component, each_context);
						each_blocks[i].c();
						each_blocks[i].m(text_2.parentNode, text_2);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.$dictionary) && text_3_value !== (text_3_value = state.$dictionary.wallet.multipleWallets.printBtn)) {
				text_3.data = text_3_value;
			}

			var each_value_1 = state.wallets;

			if (changed.$dictionary || changed.wallets) {
				for (var i = 0; i < each_value_1.length; i += 1) {
					var each_1_context = assign(assign({}, state), {
						each_value_1: each_value_1,
						wallet: each_value_1[i],
						i: i
					});

					if (each_1_blocks[i]) {
						each_1_blocks[i].p(changed, each_1_context);
					} else {
						each_1_blocks[i] = create_each_block_1(component, each_1_context);
						each_1_blocks[i].c();
						each_1_blocks[i].m(div, null);
					}
				}

				for (; i < each_1_blocks.length; i += 1) {
					each_1_blocks[i].u();
					each_1_blocks[i].d();
				}
				each_1_blocks.length = each_value_1.length;
			}
		},

		u: function unmount() {
			detachNode(h1);
			detachNode(text_1);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}

			detachNode(text_2);
			detachNode(div);

			for (var i = 0; i < each_1_blocks.length; i += 1) {
				each_1_blocks[i].u();
			}
		},

		d: function destroy() {
			destroyEach(each_blocks);

			removeListener(button, "click", click_handler);

			destroyEach(each_1_blocks);
		}
	};
}

// (3:0) {{#each wallets as wallet, i}}
function create_each_block(component, state) {
	var wallet = state.wallet, each_value = state.each_value, i = state.i;

	var paperwallet_initial_data = {
	 	publicAddress: wallet.publicAddress,
	 	privateKey: wallet.privateKey,
	 	publicQRCode: wallet.publicQRCode,
	 	privateQRCode: wallet.privateQRCode
	 };
	var paperwallet = new PaperWallet({
		root: component.root,
		data: paperwallet_initial_data
	});

	return {
		c: function create() {
			paperwallet._fragment.c();
		},

		m: function mount(target, anchor) {
			paperwallet._mount(target, anchor);
		},

		p: function update(changed, state) {
			wallet = state.wallet;
			each_value = state.each_value;
			i = state.i;
			var paperwallet_changes = {};
			if (changed.wallets) paperwallet_changes.publicAddress = wallet.publicAddress;
			if (changed.wallets) paperwallet_changes.privateKey = wallet.privateKey;
			if (changed.wallets) paperwallet_changes.publicQRCode = wallet.publicQRCode;
			if (changed.wallets) paperwallet_changes.privateQRCode = wallet.privateQRCode;
			paperwallet._set(paperwallet_changes);
		},

		u: function unmount() {
			paperwallet._unmount();
		},

		d: function destroy() {
			paperwallet.destroy(false);
		}
	};
}

// (9:2) {{#each wallets as wallet, i}}
function create_each_block_1(component, state) {
	var wallet = state.wallet, each_value_1 = state.each_value_1, i = state.i;
	var div, h2, text, text_1_value = i + 1, text_1, text_2, div_1, div_2, text_3_value = state.$dictionary.wallet.multipleWallets.publicAddress, text_3, text_4, div_3, text_5_value = wallet.publicAddress, text_5, text_7, div_4, div_5, text_8_value = state.$dictionary.wallet.multipleWallets.privateKey, text_8, text_9, div_6, text_10_value = wallet.privateKey, text_10;

	return {
		c: function create() {
			div = createElement("div");
			h2 = createElement("h2");
			text = createText("Wallet #");
			text_1 = createText(text_1_value);
			text_2 = createText("\n      ");
			div_1 = createElement("div");
			div_2 = createElement("div");
			text_3 = createText(text_3_value);
			text_4 = createText("\n        ");
			div_3 = createElement("div");
			text_5 = createText(text_5_value);
			text_7 = createText("\n      ");
			div_4 = createElement("div");
			div_5 = createElement("div");
			text_8 = createText(text_8_value);
			text_9 = createText("\n        ");
			div_6 = createElement("div");
			text_10 = createText(text_10_value);
			this.h();
		},

		h: function hydrate() {
			div_2.className = "wallet-title";
			div_3.className = "wallet-value";
			div_1.className = "wallet-public-address";
			div_5.className = "wallet-title";
			div_6.className = "wallet-value";
			div_4.className = "wallet-private-key";
			div.className = "wallet";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(h2, div);
			appendNode(text, h2);
			appendNode(text_1, h2);
			appendNode(text_2, div);
			appendNode(div_1, div);
			appendNode(div_2, div_1);
			appendNode(text_3, div_2);
			appendNode(text_4, div_1);
			appendNode(div_3, div_1);
			appendNode(text_5, div_3);
			appendNode(text_7, div);
			appendNode(div_4, div);
			appendNode(div_5, div_4);
			appendNode(text_8, div_5);
			appendNode(text_9, div_4);
			appendNode(div_6, div_4);
			appendNode(text_10, div_6);
		},

		p: function update(changed, state) {
			wallet = state.wallet;
			each_value_1 = state.each_value_1;
			i = state.i;
			if ((changed.$dictionary) && text_3_value !== (text_3_value = state.$dictionary.wallet.multipleWallets.publicAddress)) {
				text_3.data = text_3_value;
			}

			if ((changed.wallets) && text_5_value !== (text_5_value = wallet.publicAddress)) {
				text_5.data = text_5_value;
			}

			if ((changed.$dictionary) && text_8_value !== (text_8_value = state.$dictionary.wallet.multipleWallets.privateKey)) {
				text_8.data = text_8_value;
			}

			if ((changed.wallets) && text_10_value !== (text_10_value = wallet.privateKey)) {
				text_10.data = text_10_value;
			}
		},

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this._state = assign(this.store._init(["dictionary"]), options.data);
	this.store._add(this, ["dictionary"]);

	this._handlers.destroy = [removeFromStore];

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });
assign(Multiple_wallets_component_svelte.prototype, methods);

Multiple_wallets_component_svelte.prototype._recompute = noop;

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function noop() {}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function removeFromStore() {
	this.store._remove(this);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function blankObject() {
	return Object.create(null);
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("components/paperwallet/paperwallet.component.svelte.html", function(exports, require, module) {
/* app/components/paperwallet/paperwallet.component.svelte.html generated by Svelte v1.64.1 */
"use strict";

function create_main_fragment(component, state) {
	var svg, defs, style, text, linearGradient, stop, stop_1, clipPath, rect, linearGradient_1, stop_2, stop_3, stop_4, stop_5, stop_6, stop_7, stop_8, stop_9, stop_10, g, rect_1, g_1, g_2, g_3, path, path_1, g_4, g_5, path_2, path_3, g_6, g_7, path_4, path_5, g_8, g_9, path_6, path_7, g_10, g_11, path_8, path_9, g_12, g_13, path_10, path_11, g_14, g_15, path_12, path_13, g_16, g_17, path_14, path_15, g_18, g_19, path_16, path_17, g_20, g_21, path_18, path_19, g_22, g_23, path_20, path_21, g_24, g_25, path_22, path_23, g_26, g_27, path_24, path_25, g_28, g_29, path_26, path_27, g_30, g_31, path_28, path_29, g_32, g_33, path_30, path_31, g_34, g_35, path_32, path_33, g_36, g_37, path_34, path_35, g_38, g_39, path_36, path_37, g_40, g_41, path_38, path_39, g_42, g_43, path_40, path_41, g_44, g_45, path_42, path_43, g_46, g_47, path_44, path_45, g_48, g_49, path_46, path_47, g_50, g_51, path_48, path_49, g_52, g_53, path_50, path_51, g_54, g_55, path_52, path_53, g_56, g_57, path_54, path_55, g_58, g_59, path_56, path_57, g_60, g_61, path_58, path_59, g_62, g_63, path_60, path_61, g_64, g_65, path_62, path_63, g_66, g_67, path_64, path_65, g_68, g_69, path_66, path_67, g_70, g_71, path_68, path_69, g_72, g_73, path_70, path_71, g_74, g_75, path_72, path_73, g_76, g_77, path_74, path_75, g_78, g_79, path_76, path_77, g_80, g_81, path_78, path_79, g_82, g_83, path_80, path_81, g_84, g_85, path_82, path_83, g_86, g_87, path_84, path_85, g_88, g_89, path_86, path_87, g_90, g_91, path_88, path_89, g_92, g_93, path_90, path_91, g_94, g_95, path_92, path_93, g_96, g_97, path_94, path_95, g_98, g_99, path_96, path_97, g_100, g_101, path_98, path_99, g_102, g_103, path_100, path_101, g_104, g_105, path_102, path_103, g_106, g_107, path_104, path_105, g_108, g_109, path_106, path_107, g_110, g_111, path_108, path_109, g_112, g_113, path_110, path_111, g_114, g_115, path_112, path_113, g_116, g_117, path_114, path_115, g_118, g_119, path_116, path_117, g_120, g_121, path_118, path_119, g_122, g_123, path_120, path_121, g_124, g_125, path_122, path_123, g_126, g_127, path_124, path_125, g_128, g_129, path_126, path_127, g_130, g_131, path_128, path_129, g_132, g_133, path_130, path_131, g_134, g_135, path_132, path_133, g_136, g_137, path_134, path_135, g_138, g_139, path_136, path_137, g_140, g_141, path_138, path_139, g_142, g_143, path_140, path_141, g_144, g_145, path_142, path_143, g_146, g_147, path_144, path_145, g_148, g_149, path_146, path_147, g_150, g_151, path_148, path_149, g_152, g_153, path_150, path_151, g_154, g_155, path_152, path_153, g_156, g_157, path_154, path_155, g_158, g_159, path_156, path_157, g_160, g_161, path_158, path_159, g_162, g_163, path_160, path_161, g_164, g_165, path_162, path_163, g_166, g_167, path_164, path_165, g_168, g_169, path_166, path_167, g_170, g_171, path_168, path_169, g_172, g_173, path_170, path_171, g_174, g_175, path_172, path_173, g_176, g_177, path_174, path_175, g_178, g_179, path_176, path_177, g_180, g_181, path_178, path_179, g_182, g_183, path_180, path_181, g_184, g_185, path_182, path_183, g_186, g_187, path_184, path_185, g_188, g_189, path_186, path_187, g_190, g_191, path_188, path_189, g_192, g_193, path_190, path_191, g_194, g_195, path_192, path_193, g_196, g_197, path_194, path_195, g_198, g_199, path_196, path_197, g_200, g_201, path_198, path_199, g_202, g_203, path_200, path_201, g_204, g_205, path_202, path_203, g_206, g_207, path_204, path_205, g_208, g_209, path_206, path_207, g_210, g_211, path_208, path_209, g_212, g_213, path_210, path_211, g_214, g_215, path_212, path_213, g_216, g_217, path_214, path_215, g_218, g_219, path_216, path_217, g_220, g_221, path_218, path_219, g_222, g_223, path_220, path_221, g_224, g_225, path_222, path_223, g_226, g_227, path_224, path_225, g_228, g_229, path_226, path_227, g_230, g_231, path_228, path_229, g_232, g_233, path_230, path_231, g_234, g_235, path_232, path_233, g_236, g_237, path_234, path_235, g_238, g_239, path_236, path_237, g_240, g_241, path_238, path_239, g_242, g_243, path_240, path_241, g_244, g_245, path_242, path_243, g_246, g_247, path_244, path_245, g_248, g_249, path_246, path_247, g_250, g_251, path_248, path_249, g_252, g_253, path_250, path_251, g_254, g_255, path_252, path_253, g_256, g_257, path_254, path_255, g_258, g_259, path_256, path_257, g_260, g_261, path_258, path_259, g_262, g_263, path_260, path_261, g_264, g_265, path_262, path_263, g_266, g_267, path_264, path_265, g_268, g_269, path_266, path_267, g_270, g_271, path_268, path_269, g_272, g_273, path_270, path_271, g_274, g_275, path_272, path_273, g_276, g_277, path_274, path_275, g_278, g_279, path_276, path_277, g_280, g_281, path_278, path_279, g_282, g_283, path_280, path_281, g_284, g_285, path_282, path_283, g_286, g_287, path_284, path_285, g_288, g_289, path_286, path_287, g_290, g_291, path_288, path_289, g_292, g_293, path_290, path_291, g_294, g_295, path_292, path_293, g_296, g_297, path_294, path_295, g_298, g_299, path_296, path_297, g_300, g_301, path_298, path_299, g_302, g_303, path_300, path_301, g_304, g_305, path_302, path_303, g_306, g_307, path_304, path_305, g_308, g_309, path_306, path_307, g_310, g_311, path_308, path_309, g_312, g_313, path_310, path_311, g_314, g_315, path_312, path_313, g_316, g_317, path_314, path_315, g_318, g_319, path_316, path_317, g_320, g_321, path_318, path_319, g_322, g_323, path_320, path_321, g_324, g_325, path_322, path_323, g_326, g_327, path_324, path_325, g_328, g_329, path_326, path_327, g_330, g_331, path_328, path_329, g_332, g_333, path_330, path_331, g_334, g_335, path_332, path_333, g_336, g_337, path_334, path_335, g_338, g_339, path_336, path_337, g_340, g_341, path_338, path_339, g_342, path_340, path_341, rect_2, rect_3, g_343, path_342, path_343, g_344, path_344, path_345, rect_4, text_1, tspan, text_2, text_3, tspan_1, text_4, g_345, rect_5, rect_6, text_5, tspan_2, text_6, text_7, tspan_3, text_8, rect_7, g_346, path_346, path_347, g_347, path_348, path_349, text_9, tspan_4, text_10, text_11, tspan_5, text_12, g_348, rect_8, rect_9, text_13, tspan_6, text_14, text_15, tspan_7, text_16, rect_10, g_349, g_350, path_350, path_351, text_17, tspan_8, text_18, rect_11, g_351, g_352, path_352, path_353, text_19, tspan_9, text_20, rect_12, rect_13, rect_14, rect_15, text_21, tspan_10, text_22, text_23, tspan_11, text_24, text_25, tspan_12, text_26, text_27, tspan_13, text_28, text_29, tspan_14, text_30, rect_16, text_31, tspan_15, text_32, text_33, tspan_16, text_34, text_35, tspan_17, text_36, image, image_1;

	return {
		c: function create() {
			svg = createSvgElement("svg");
			defs = createSvgElement("defs");
			style = createSvgElement("style");
			text = createText(".cls-1, .cls-8 {\n        fill: none;\n      }\n\n      .cls-2 {\n        fill: url(#linear-gradient);\n      }\n\n      .cls-3 {\n        clip-path: url(#clip-path);\n      }\n\n      .cls-4 {\n        fill: #1fa343;\n      }\n\n      .cls-12, .cls-13, .cls-14, .cls-15, .cls-5 {\n        fill: #fff;\n      }\n\n      .cls-6 {\n        fill: rgba(0,0,0,0.2);\n      }\n\n      .cls-10, .cls-7 {\n        font-size: 13px;\n      }\n\n      .cls-10, .cls-12, .cls-13, .cls-14, .cls-15, .cls-7 {\n        font-family: Roboto-Bold, Roboto;\n        font-weight: 700;\n      }\n\n      .cls-8 {\n        stroke: #000;\n      }\n\n      .cls-10, .cls-9 {\n        fill: #fff500;\n      }\n\n      .cls-11 {\n        fill: url(#linear-gradient-2);\n      }\n\n      .cls-12 {\n        font-size: 23px;\n      }\n\n      .cls-13 {\n        font-size: 17px;\n      }\n\n      .cls-14, .cls-15 {\n        font-size: 14px;\n      }\n\n      .cls-15 {\n        opacity: 0.996;\n      }\n\n      .cls-16 {\n        stroke: none;\n      }");
			linearGradient = createSvgElement("linearGradient");
			stop = createSvgElement("stop");
			stop_1 = createSvgElement("stop");
			clipPath = createSvgElement("clipPath");
			rect = createSvgElement("rect");
			linearGradient_1 = createSvgElement("linearGradient");
			stop_2 = createSvgElement("stop");
			stop_3 = createSvgElement("stop");
			stop_4 = createSvgElement("stop");
			stop_5 = createSvgElement("stop");
			stop_6 = createSvgElement("stop");
			stop_7 = createSvgElement("stop");
			stop_8 = createSvgElement("stop");
			stop_9 = createSvgElement("stop");
			stop_10 = createSvgElement("stop");
			g = createSvgElement("g");
			rect_1 = createSvgElement("rect");
			g_1 = createSvgElement("g");
			g_2 = createSvgElement("g");
			g_3 = createSvgElement("g");
			path = createSvgElement("path");
			path_1 = createSvgElement("path");
			g_4 = createSvgElement("g");
			g_5 = createSvgElement("g");
			path_2 = createSvgElement("path");
			path_3 = createSvgElement("path");
			g_6 = createSvgElement("g");
			g_7 = createSvgElement("g");
			path_4 = createSvgElement("path");
			path_5 = createSvgElement("path");
			g_8 = createSvgElement("g");
			g_9 = createSvgElement("g");
			path_6 = createSvgElement("path");
			path_7 = createSvgElement("path");
			g_10 = createSvgElement("g");
			g_11 = createSvgElement("g");
			path_8 = createSvgElement("path");
			path_9 = createSvgElement("path");
			g_12 = createSvgElement("g");
			g_13 = createSvgElement("g");
			path_10 = createSvgElement("path");
			path_11 = createSvgElement("path");
			g_14 = createSvgElement("g");
			g_15 = createSvgElement("g");
			path_12 = createSvgElement("path");
			path_13 = createSvgElement("path");
			g_16 = createSvgElement("g");
			g_17 = createSvgElement("g");
			path_14 = createSvgElement("path");
			path_15 = createSvgElement("path");
			g_18 = createSvgElement("g");
			g_19 = createSvgElement("g");
			path_16 = createSvgElement("path");
			path_17 = createSvgElement("path");
			g_20 = createSvgElement("g");
			g_21 = createSvgElement("g");
			path_18 = createSvgElement("path");
			path_19 = createSvgElement("path");
			g_22 = createSvgElement("g");
			g_23 = createSvgElement("g");
			path_20 = createSvgElement("path");
			path_21 = createSvgElement("path");
			g_24 = createSvgElement("g");
			g_25 = createSvgElement("g");
			path_22 = createSvgElement("path");
			path_23 = createSvgElement("path");
			g_26 = createSvgElement("g");
			g_27 = createSvgElement("g");
			path_24 = createSvgElement("path");
			path_25 = createSvgElement("path");
			g_28 = createSvgElement("g");
			g_29 = createSvgElement("g");
			path_26 = createSvgElement("path");
			path_27 = createSvgElement("path");
			g_30 = createSvgElement("g");
			g_31 = createSvgElement("g");
			path_28 = createSvgElement("path");
			path_29 = createSvgElement("path");
			g_32 = createSvgElement("g");
			g_33 = createSvgElement("g");
			path_30 = createSvgElement("path");
			path_31 = createSvgElement("path");
			g_34 = createSvgElement("g");
			g_35 = createSvgElement("g");
			path_32 = createSvgElement("path");
			path_33 = createSvgElement("path");
			g_36 = createSvgElement("g");
			g_37 = createSvgElement("g");
			path_34 = createSvgElement("path");
			path_35 = createSvgElement("path");
			g_38 = createSvgElement("g");
			g_39 = createSvgElement("g");
			path_36 = createSvgElement("path");
			path_37 = createSvgElement("path");
			g_40 = createSvgElement("g");
			g_41 = createSvgElement("g");
			path_38 = createSvgElement("path");
			path_39 = createSvgElement("path");
			g_42 = createSvgElement("g");
			g_43 = createSvgElement("g");
			path_40 = createSvgElement("path");
			path_41 = createSvgElement("path");
			g_44 = createSvgElement("g");
			g_45 = createSvgElement("g");
			path_42 = createSvgElement("path");
			path_43 = createSvgElement("path");
			g_46 = createSvgElement("g");
			g_47 = createSvgElement("g");
			path_44 = createSvgElement("path");
			path_45 = createSvgElement("path");
			g_48 = createSvgElement("g");
			g_49 = createSvgElement("g");
			path_46 = createSvgElement("path");
			path_47 = createSvgElement("path");
			g_50 = createSvgElement("g");
			g_51 = createSvgElement("g");
			path_48 = createSvgElement("path");
			path_49 = createSvgElement("path");
			g_52 = createSvgElement("g");
			g_53 = createSvgElement("g");
			path_50 = createSvgElement("path");
			path_51 = createSvgElement("path");
			g_54 = createSvgElement("g");
			g_55 = createSvgElement("g");
			path_52 = createSvgElement("path");
			path_53 = createSvgElement("path");
			g_56 = createSvgElement("g");
			g_57 = createSvgElement("g");
			path_54 = createSvgElement("path");
			path_55 = createSvgElement("path");
			g_58 = createSvgElement("g");
			g_59 = createSvgElement("g");
			path_56 = createSvgElement("path");
			path_57 = createSvgElement("path");
			g_60 = createSvgElement("g");
			g_61 = createSvgElement("g");
			path_58 = createSvgElement("path");
			path_59 = createSvgElement("path");
			g_62 = createSvgElement("g");
			g_63 = createSvgElement("g");
			path_60 = createSvgElement("path");
			path_61 = createSvgElement("path");
			g_64 = createSvgElement("g");
			g_65 = createSvgElement("g");
			path_62 = createSvgElement("path");
			path_63 = createSvgElement("path");
			g_66 = createSvgElement("g");
			g_67 = createSvgElement("g");
			path_64 = createSvgElement("path");
			path_65 = createSvgElement("path");
			g_68 = createSvgElement("g");
			g_69 = createSvgElement("g");
			path_66 = createSvgElement("path");
			path_67 = createSvgElement("path");
			g_70 = createSvgElement("g");
			g_71 = createSvgElement("g");
			path_68 = createSvgElement("path");
			path_69 = createSvgElement("path");
			g_72 = createSvgElement("g");
			g_73 = createSvgElement("g");
			path_70 = createSvgElement("path");
			path_71 = createSvgElement("path");
			g_74 = createSvgElement("g");
			g_75 = createSvgElement("g");
			path_72 = createSvgElement("path");
			path_73 = createSvgElement("path");
			g_76 = createSvgElement("g");
			g_77 = createSvgElement("g");
			path_74 = createSvgElement("path");
			path_75 = createSvgElement("path");
			g_78 = createSvgElement("g");
			g_79 = createSvgElement("g");
			path_76 = createSvgElement("path");
			path_77 = createSvgElement("path");
			g_80 = createSvgElement("g");
			g_81 = createSvgElement("g");
			path_78 = createSvgElement("path");
			path_79 = createSvgElement("path");
			g_82 = createSvgElement("g");
			g_83 = createSvgElement("g");
			path_80 = createSvgElement("path");
			path_81 = createSvgElement("path");
			g_84 = createSvgElement("g");
			g_85 = createSvgElement("g");
			path_82 = createSvgElement("path");
			path_83 = createSvgElement("path");
			g_86 = createSvgElement("g");
			g_87 = createSvgElement("g");
			path_84 = createSvgElement("path");
			path_85 = createSvgElement("path");
			g_88 = createSvgElement("g");
			g_89 = createSvgElement("g");
			path_86 = createSvgElement("path");
			path_87 = createSvgElement("path");
			g_90 = createSvgElement("g");
			g_91 = createSvgElement("g");
			path_88 = createSvgElement("path");
			path_89 = createSvgElement("path");
			g_92 = createSvgElement("g");
			g_93 = createSvgElement("g");
			path_90 = createSvgElement("path");
			path_91 = createSvgElement("path");
			g_94 = createSvgElement("g");
			g_95 = createSvgElement("g");
			path_92 = createSvgElement("path");
			path_93 = createSvgElement("path");
			g_96 = createSvgElement("g");
			g_97 = createSvgElement("g");
			path_94 = createSvgElement("path");
			path_95 = createSvgElement("path");
			g_98 = createSvgElement("g");
			g_99 = createSvgElement("g");
			path_96 = createSvgElement("path");
			path_97 = createSvgElement("path");
			g_100 = createSvgElement("g");
			g_101 = createSvgElement("g");
			path_98 = createSvgElement("path");
			path_99 = createSvgElement("path");
			g_102 = createSvgElement("g");
			g_103 = createSvgElement("g");
			path_100 = createSvgElement("path");
			path_101 = createSvgElement("path");
			g_104 = createSvgElement("g");
			g_105 = createSvgElement("g");
			path_102 = createSvgElement("path");
			path_103 = createSvgElement("path");
			g_106 = createSvgElement("g");
			g_107 = createSvgElement("g");
			path_104 = createSvgElement("path");
			path_105 = createSvgElement("path");
			g_108 = createSvgElement("g");
			g_109 = createSvgElement("g");
			path_106 = createSvgElement("path");
			path_107 = createSvgElement("path");
			g_110 = createSvgElement("g");
			g_111 = createSvgElement("g");
			path_108 = createSvgElement("path");
			path_109 = createSvgElement("path");
			g_112 = createSvgElement("g");
			g_113 = createSvgElement("g");
			path_110 = createSvgElement("path");
			path_111 = createSvgElement("path");
			g_114 = createSvgElement("g");
			g_115 = createSvgElement("g");
			path_112 = createSvgElement("path");
			path_113 = createSvgElement("path");
			g_116 = createSvgElement("g");
			g_117 = createSvgElement("g");
			path_114 = createSvgElement("path");
			path_115 = createSvgElement("path");
			g_118 = createSvgElement("g");
			g_119 = createSvgElement("g");
			path_116 = createSvgElement("path");
			path_117 = createSvgElement("path");
			g_120 = createSvgElement("g");
			g_121 = createSvgElement("g");
			path_118 = createSvgElement("path");
			path_119 = createSvgElement("path");
			g_122 = createSvgElement("g");
			g_123 = createSvgElement("g");
			path_120 = createSvgElement("path");
			path_121 = createSvgElement("path");
			g_124 = createSvgElement("g");
			g_125 = createSvgElement("g");
			path_122 = createSvgElement("path");
			path_123 = createSvgElement("path");
			g_126 = createSvgElement("g");
			g_127 = createSvgElement("g");
			path_124 = createSvgElement("path");
			path_125 = createSvgElement("path");
			g_128 = createSvgElement("g");
			g_129 = createSvgElement("g");
			path_126 = createSvgElement("path");
			path_127 = createSvgElement("path");
			g_130 = createSvgElement("g");
			g_131 = createSvgElement("g");
			path_128 = createSvgElement("path");
			path_129 = createSvgElement("path");
			g_132 = createSvgElement("g");
			g_133 = createSvgElement("g");
			path_130 = createSvgElement("path");
			path_131 = createSvgElement("path");
			g_134 = createSvgElement("g");
			g_135 = createSvgElement("g");
			path_132 = createSvgElement("path");
			path_133 = createSvgElement("path");
			g_136 = createSvgElement("g");
			g_137 = createSvgElement("g");
			path_134 = createSvgElement("path");
			path_135 = createSvgElement("path");
			g_138 = createSvgElement("g");
			g_139 = createSvgElement("g");
			path_136 = createSvgElement("path");
			path_137 = createSvgElement("path");
			g_140 = createSvgElement("g");
			g_141 = createSvgElement("g");
			path_138 = createSvgElement("path");
			path_139 = createSvgElement("path");
			g_142 = createSvgElement("g");
			g_143 = createSvgElement("g");
			path_140 = createSvgElement("path");
			path_141 = createSvgElement("path");
			g_144 = createSvgElement("g");
			g_145 = createSvgElement("g");
			path_142 = createSvgElement("path");
			path_143 = createSvgElement("path");
			g_146 = createSvgElement("g");
			g_147 = createSvgElement("g");
			path_144 = createSvgElement("path");
			path_145 = createSvgElement("path");
			g_148 = createSvgElement("g");
			g_149 = createSvgElement("g");
			path_146 = createSvgElement("path");
			path_147 = createSvgElement("path");
			g_150 = createSvgElement("g");
			g_151 = createSvgElement("g");
			path_148 = createSvgElement("path");
			path_149 = createSvgElement("path");
			g_152 = createSvgElement("g");
			g_153 = createSvgElement("g");
			path_150 = createSvgElement("path");
			path_151 = createSvgElement("path");
			g_154 = createSvgElement("g");
			g_155 = createSvgElement("g");
			path_152 = createSvgElement("path");
			path_153 = createSvgElement("path");
			g_156 = createSvgElement("g");
			g_157 = createSvgElement("g");
			path_154 = createSvgElement("path");
			path_155 = createSvgElement("path");
			g_158 = createSvgElement("g");
			g_159 = createSvgElement("g");
			path_156 = createSvgElement("path");
			path_157 = createSvgElement("path");
			g_160 = createSvgElement("g");
			g_161 = createSvgElement("g");
			path_158 = createSvgElement("path");
			path_159 = createSvgElement("path");
			g_162 = createSvgElement("g");
			g_163 = createSvgElement("g");
			path_160 = createSvgElement("path");
			path_161 = createSvgElement("path");
			g_164 = createSvgElement("g");
			g_165 = createSvgElement("g");
			path_162 = createSvgElement("path");
			path_163 = createSvgElement("path");
			g_166 = createSvgElement("g");
			g_167 = createSvgElement("g");
			path_164 = createSvgElement("path");
			path_165 = createSvgElement("path");
			g_168 = createSvgElement("g");
			g_169 = createSvgElement("g");
			path_166 = createSvgElement("path");
			path_167 = createSvgElement("path");
			g_170 = createSvgElement("g");
			g_171 = createSvgElement("g");
			path_168 = createSvgElement("path");
			path_169 = createSvgElement("path");
			g_172 = createSvgElement("g");
			g_173 = createSvgElement("g");
			path_170 = createSvgElement("path");
			path_171 = createSvgElement("path");
			g_174 = createSvgElement("g");
			g_175 = createSvgElement("g");
			path_172 = createSvgElement("path");
			path_173 = createSvgElement("path");
			g_176 = createSvgElement("g");
			g_177 = createSvgElement("g");
			path_174 = createSvgElement("path");
			path_175 = createSvgElement("path");
			g_178 = createSvgElement("g");
			g_179 = createSvgElement("g");
			path_176 = createSvgElement("path");
			path_177 = createSvgElement("path");
			g_180 = createSvgElement("g");
			g_181 = createSvgElement("g");
			path_178 = createSvgElement("path");
			path_179 = createSvgElement("path");
			g_182 = createSvgElement("g");
			g_183 = createSvgElement("g");
			path_180 = createSvgElement("path");
			path_181 = createSvgElement("path");
			g_184 = createSvgElement("g");
			g_185 = createSvgElement("g");
			path_182 = createSvgElement("path");
			path_183 = createSvgElement("path");
			g_186 = createSvgElement("g");
			g_187 = createSvgElement("g");
			path_184 = createSvgElement("path");
			path_185 = createSvgElement("path");
			g_188 = createSvgElement("g");
			g_189 = createSvgElement("g");
			path_186 = createSvgElement("path");
			path_187 = createSvgElement("path");
			g_190 = createSvgElement("g");
			g_191 = createSvgElement("g");
			path_188 = createSvgElement("path");
			path_189 = createSvgElement("path");
			g_192 = createSvgElement("g");
			g_193 = createSvgElement("g");
			path_190 = createSvgElement("path");
			path_191 = createSvgElement("path");
			g_194 = createSvgElement("g");
			g_195 = createSvgElement("g");
			path_192 = createSvgElement("path");
			path_193 = createSvgElement("path");
			g_196 = createSvgElement("g");
			g_197 = createSvgElement("g");
			path_194 = createSvgElement("path");
			path_195 = createSvgElement("path");
			g_198 = createSvgElement("g");
			g_199 = createSvgElement("g");
			path_196 = createSvgElement("path");
			path_197 = createSvgElement("path");
			g_200 = createSvgElement("g");
			g_201 = createSvgElement("g");
			path_198 = createSvgElement("path");
			path_199 = createSvgElement("path");
			g_202 = createSvgElement("g");
			g_203 = createSvgElement("g");
			path_200 = createSvgElement("path");
			path_201 = createSvgElement("path");
			g_204 = createSvgElement("g");
			g_205 = createSvgElement("g");
			path_202 = createSvgElement("path");
			path_203 = createSvgElement("path");
			g_206 = createSvgElement("g");
			g_207 = createSvgElement("g");
			path_204 = createSvgElement("path");
			path_205 = createSvgElement("path");
			g_208 = createSvgElement("g");
			g_209 = createSvgElement("g");
			path_206 = createSvgElement("path");
			path_207 = createSvgElement("path");
			g_210 = createSvgElement("g");
			g_211 = createSvgElement("g");
			path_208 = createSvgElement("path");
			path_209 = createSvgElement("path");
			g_212 = createSvgElement("g");
			g_213 = createSvgElement("g");
			path_210 = createSvgElement("path");
			path_211 = createSvgElement("path");
			g_214 = createSvgElement("g");
			g_215 = createSvgElement("g");
			path_212 = createSvgElement("path");
			path_213 = createSvgElement("path");
			g_216 = createSvgElement("g");
			g_217 = createSvgElement("g");
			path_214 = createSvgElement("path");
			path_215 = createSvgElement("path");
			g_218 = createSvgElement("g");
			g_219 = createSvgElement("g");
			path_216 = createSvgElement("path");
			path_217 = createSvgElement("path");
			g_220 = createSvgElement("g");
			g_221 = createSvgElement("g");
			path_218 = createSvgElement("path");
			path_219 = createSvgElement("path");
			g_222 = createSvgElement("g");
			g_223 = createSvgElement("g");
			path_220 = createSvgElement("path");
			path_221 = createSvgElement("path");
			g_224 = createSvgElement("g");
			g_225 = createSvgElement("g");
			path_222 = createSvgElement("path");
			path_223 = createSvgElement("path");
			g_226 = createSvgElement("g");
			g_227 = createSvgElement("g");
			path_224 = createSvgElement("path");
			path_225 = createSvgElement("path");
			g_228 = createSvgElement("g");
			g_229 = createSvgElement("g");
			path_226 = createSvgElement("path");
			path_227 = createSvgElement("path");
			g_230 = createSvgElement("g");
			g_231 = createSvgElement("g");
			path_228 = createSvgElement("path");
			path_229 = createSvgElement("path");
			g_232 = createSvgElement("g");
			g_233 = createSvgElement("g");
			path_230 = createSvgElement("path");
			path_231 = createSvgElement("path");
			g_234 = createSvgElement("g");
			g_235 = createSvgElement("g");
			path_232 = createSvgElement("path");
			path_233 = createSvgElement("path");
			g_236 = createSvgElement("g");
			g_237 = createSvgElement("g");
			path_234 = createSvgElement("path");
			path_235 = createSvgElement("path");
			g_238 = createSvgElement("g");
			g_239 = createSvgElement("g");
			path_236 = createSvgElement("path");
			path_237 = createSvgElement("path");
			g_240 = createSvgElement("g");
			g_241 = createSvgElement("g");
			path_238 = createSvgElement("path");
			path_239 = createSvgElement("path");
			g_242 = createSvgElement("g");
			g_243 = createSvgElement("g");
			path_240 = createSvgElement("path");
			path_241 = createSvgElement("path");
			g_244 = createSvgElement("g");
			g_245 = createSvgElement("g");
			path_242 = createSvgElement("path");
			path_243 = createSvgElement("path");
			g_246 = createSvgElement("g");
			g_247 = createSvgElement("g");
			path_244 = createSvgElement("path");
			path_245 = createSvgElement("path");
			g_248 = createSvgElement("g");
			g_249 = createSvgElement("g");
			path_246 = createSvgElement("path");
			path_247 = createSvgElement("path");
			g_250 = createSvgElement("g");
			g_251 = createSvgElement("g");
			path_248 = createSvgElement("path");
			path_249 = createSvgElement("path");
			g_252 = createSvgElement("g");
			g_253 = createSvgElement("g");
			path_250 = createSvgElement("path");
			path_251 = createSvgElement("path");
			g_254 = createSvgElement("g");
			g_255 = createSvgElement("g");
			path_252 = createSvgElement("path");
			path_253 = createSvgElement("path");
			g_256 = createSvgElement("g");
			g_257 = createSvgElement("g");
			path_254 = createSvgElement("path");
			path_255 = createSvgElement("path");
			g_258 = createSvgElement("g");
			g_259 = createSvgElement("g");
			path_256 = createSvgElement("path");
			path_257 = createSvgElement("path");
			g_260 = createSvgElement("g");
			g_261 = createSvgElement("g");
			path_258 = createSvgElement("path");
			path_259 = createSvgElement("path");
			g_262 = createSvgElement("g");
			g_263 = createSvgElement("g");
			path_260 = createSvgElement("path");
			path_261 = createSvgElement("path");
			g_264 = createSvgElement("g");
			g_265 = createSvgElement("g");
			path_262 = createSvgElement("path");
			path_263 = createSvgElement("path");
			g_266 = createSvgElement("g");
			g_267 = createSvgElement("g");
			path_264 = createSvgElement("path");
			path_265 = createSvgElement("path");
			g_268 = createSvgElement("g");
			g_269 = createSvgElement("g");
			path_266 = createSvgElement("path");
			path_267 = createSvgElement("path");
			g_270 = createSvgElement("g");
			g_271 = createSvgElement("g");
			path_268 = createSvgElement("path");
			path_269 = createSvgElement("path");
			g_272 = createSvgElement("g");
			g_273 = createSvgElement("g");
			path_270 = createSvgElement("path");
			path_271 = createSvgElement("path");
			g_274 = createSvgElement("g");
			g_275 = createSvgElement("g");
			path_272 = createSvgElement("path");
			path_273 = createSvgElement("path");
			g_276 = createSvgElement("g");
			g_277 = createSvgElement("g");
			path_274 = createSvgElement("path");
			path_275 = createSvgElement("path");
			g_278 = createSvgElement("g");
			g_279 = createSvgElement("g");
			path_276 = createSvgElement("path");
			path_277 = createSvgElement("path");
			g_280 = createSvgElement("g");
			g_281 = createSvgElement("g");
			path_278 = createSvgElement("path");
			path_279 = createSvgElement("path");
			g_282 = createSvgElement("g");
			g_283 = createSvgElement("g");
			path_280 = createSvgElement("path");
			path_281 = createSvgElement("path");
			g_284 = createSvgElement("g");
			g_285 = createSvgElement("g");
			path_282 = createSvgElement("path");
			path_283 = createSvgElement("path");
			g_286 = createSvgElement("g");
			g_287 = createSvgElement("g");
			path_284 = createSvgElement("path");
			path_285 = createSvgElement("path");
			g_288 = createSvgElement("g");
			g_289 = createSvgElement("g");
			path_286 = createSvgElement("path");
			path_287 = createSvgElement("path");
			g_290 = createSvgElement("g");
			g_291 = createSvgElement("g");
			path_288 = createSvgElement("path");
			path_289 = createSvgElement("path");
			g_292 = createSvgElement("g");
			g_293 = createSvgElement("g");
			path_290 = createSvgElement("path");
			path_291 = createSvgElement("path");
			g_294 = createSvgElement("g");
			g_295 = createSvgElement("g");
			path_292 = createSvgElement("path");
			path_293 = createSvgElement("path");
			g_296 = createSvgElement("g");
			g_297 = createSvgElement("g");
			path_294 = createSvgElement("path");
			path_295 = createSvgElement("path");
			g_298 = createSvgElement("g");
			g_299 = createSvgElement("g");
			path_296 = createSvgElement("path");
			path_297 = createSvgElement("path");
			g_300 = createSvgElement("g");
			g_301 = createSvgElement("g");
			path_298 = createSvgElement("path");
			path_299 = createSvgElement("path");
			g_302 = createSvgElement("g");
			g_303 = createSvgElement("g");
			path_300 = createSvgElement("path");
			path_301 = createSvgElement("path");
			g_304 = createSvgElement("g");
			g_305 = createSvgElement("g");
			path_302 = createSvgElement("path");
			path_303 = createSvgElement("path");
			g_306 = createSvgElement("g");
			g_307 = createSvgElement("g");
			path_304 = createSvgElement("path");
			path_305 = createSvgElement("path");
			g_308 = createSvgElement("g");
			g_309 = createSvgElement("g");
			path_306 = createSvgElement("path");
			path_307 = createSvgElement("path");
			g_310 = createSvgElement("g");
			g_311 = createSvgElement("g");
			path_308 = createSvgElement("path");
			path_309 = createSvgElement("path");
			g_312 = createSvgElement("g");
			g_313 = createSvgElement("g");
			path_310 = createSvgElement("path");
			path_311 = createSvgElement("path");
			g_314 = createSvgElement("g");
			g_315 = createSvgElement("g");
			path_312 = createSvgElement("path");
			path_313 = createSvgElement("path");
			g_316 = createSvgElement("g");
			g_317 = createSvgElement("g");
			path_314 = createSvgElement("path");
			path_315 = createSvgElement("path");
			g_318 = createSvgElement("g");
			g_319 = createSvgElement("g");
			path_316 = createSvgElement("path");
			path_317 = createSvgElement("path");
			g_320 = createSvgElement("g");
			g_321 = createSvgElement("g");
			path_318 = createSvgElement("path");
			path_319 = createSvgElement("path");
			g_322 = createSvgElement("g");
			g_323 = createSvgElement("g");
			path_320 = createSvgElement("path");
			path_321 = createSvgElement("path");
			g_324 = createSvgElement("g");
			g_325 = createSvgElement("g");
			path_322 = createSvgElement("path");
			path_323 = createSvgElement("path");
			g_326 = createSvgElement("g");
			g_327 = createSvgElement("g");
			path_324 = createSvgElement("path");
			path_325 = createSvgElement("path");
			g_328 = createSvgElement("g");
			g_329 = createSvgElement("g");
			path_326 = createSvgElement("path");
			path_327 = createSvgElement("path");
			g_330 = createSvgElement("g");
			g_331 = createSvgElement("g");
			path_328 = createSvgElement("path");
			path_329 = createSvgElement("path");
			g_332 = createSvgElement("g");
			g_333 = createSvgElement("g");
			path_330 = createSvgElement("path");
			path_331 = createSvgElement("path");
			g_334 = createSvgElement("g");
			g_335 = createSvgElement("g");
			path_332 = createSvgElement("path");
			path_333 = createSvgElement("path");
			g_336 = createSvgElement("g");
			g_337 = createSvgElement("g");
			path_334 = createSvgElement("path");
			path_335 = createSvgElement("path");
			g_338 = createSvgElement("g");
			g_339 = createSvgElement("g");
			path_336 = createSvgElement("path");
			path_337 = createSvgElement("path");
			g_340 = createSvgElement("g");
			g_341 = createSvgElement("g");
			path_338 = createSvgElement("path");
			path_339 = createSvgElement("path");
			g_342 = createSvgElement("g");
			path_340 = createSvgElement("path");
			path_341 = createSvgElement("path");
			rect_2 = createSvgElement("rect");
			rect_3 = createSvgElement("rect");
			g_343 = createSvgElement("g");
			path_342 = createSvgElement("path");
			path_343 = createSvgElement("path");
			g_344 = createSvgElement("g");
			path_344 = createSvgElement("path");
			path_345 = createSvgElement("path");
			rect_4 = createSvgElement("rect");
			text_1 = createSvgElement("text");
			tspan = createSvgElement("tspan");
			text_2 = createText("PUBLIC ADDRESS");
			text_3 = createSvgElement("text");
			tspan_1 = createSvgElement("tspan");
			text_4 = createText("PUBLIC ADDRESS");
			g_345 = createSvgElement("g");
			rect_5 = createSvgElement("rect");
			rect_6 = createSvgElement("rect");
			text_5 = createSvgElement("text");
			tspan_2 = createSvgElement("tspan");
			text_6 = createText("PUBLIC ADDRESS");
			text_7 = createSvgElement("text");
			tspan_3 = createSvgElement("tspan");
			text_8 = createText("PUBLIC ADDRESS");
			rect_7 = createSvgElement("rect");
			g_346 = createSvgElement("g");
			path_346 = createSvgElement("path");
			path_347 = createSvgElement("path");
			g_347 = createSvgElement("g");
			path_348 = createSvgElement("path");
			path_349 = createSvgElement("path");
			text_9 = createSvgElement("text");
			tspan_4 = createSvgElement("tspan");
			text_10 = createText("PRIVATE KEY");
			text_11 = createSvgElement("text");
			tspan_5 = createSvgElement("tspan");
			text_12 = createText("PRIVATE KEY");
			g_348 = createSvgElement("g");
			rect_8 = createSvgElement("rect");
			rect_9 = createSvgElement("rect");
			text_13 = createSvgElement("text");
			tspan_6 = createSvgElement("tspan");
			text_14 = createText("PRIVATE KEY");
			text_15 = createSvgElement("text");
			tspan_7 = createSvgElement("tspan");
			text_16 = createText("PRIVATE KEY");
			rect_10 = createSvgElement("rect");
			g_349 = createSvgElement("g");
			g_350 = createSvgElement("g");
			path_350 = createSvgElement("path");
			path_351 = createSvgElement("path");
			text_17 = createSvgElement("text");
			tspan_8 = createSvgElement("tspan");
			text_18 = createText("HIDE THIS SIDE");
			rect_11 = createSvgElement("rect");
			g_351 = createSvgElement("g");
			g_352 = createSvgElement("g");
			path_352 = createSvgElement("path");
			path_353 = createSvgElement("path");
			text_19 = createSvgElement("text");
			tspan_9 = createSvgElement("tspan");
			text_20 = createText("HIDE THIS SIDE");
			rect_12 = createSvgElement("rect");
			rect_13 = createSvgElement("rect");
			rect_14 = createSvgElement("rect");
			rect_15 = createSvgElement("rect");
			text_21 = createSvgElement("text");
			tspan_10 = createSvgElement("tspan");
			text_22 = createText("Paper Wallet");
			text_23 = createSvgElement("text");
			tspan_11 = createSvgElement("tspan");
			text_24 = createText("peercoin.net");
			text_25 = createSvgElement("text");
			tspan_12 = createSvgElement("tspan");
			text_26 = createText("paperwallet.peercoin.net");
			text_27 = createSvgElement("text");
			tspan_13 = createSvgElement("tspan");
			text_28 = createText("Generate your wallet at:");
			text_29 = createSvgElement("text");
			tspan_14 = createSvgElement("tspan");
			text_30 = createText("Learn more about Peercoin at:");
			rect_16 = createSvgElement("rect");
			text_31 = createSvgElement("text");
			tspan_15 = createSvgElement("tspan");
			text_32 = createText("USE THIS SPACE TO WRITE ANYTHING:");
			text_33 = createSvgElement("text");
			tspan_16 = createSvgElement("tspan");
			text_34 = createText(state.publicAddress);
			text_35 = createSvgElement("text");
			tspan_17 = createSvgElement("tspan");
			text_36 = createText(state.privateKey);
			image = createSvgElement("image");
			image_1 = createSvgElement("image");
			this.h();
		},

		h: function hydrate() {
			setAttribute(stop, "offset", "0");
			setAttribute(stop, "stop-color", "#3cb054");
			setAttribute(stop_1, "offset", "1");
			setAttribute(stop_1, "stop-color", "#82c341");
			setAttribute(linearGradient, "id", "linear-gradient");
			setAttribute(linearGradient, "x1", "0.5");
			setAttribute(linearGradient, "x2", "0.5");
			setAttribute(linearGradient, "y2", "1");
			setAttribute(linearGradient, "gradientUnits", "objectBoundingBox");
			setAttribute(rect, "id", "Rectangle_14");
			setAttribute(rect, "data-name", "Rectangle 14");
			setAttribute(rect, "class", "cls-1");
			setAttribute(rect, "width", "949.986");
			setAttribute(rect, "height", "506.701");
			setAttribute(clipPath, "id", "clip-path");
			setAttribute(stop_2, "offset", "0");
			setAttribute(stop_2, "stop-color", "#fff");
			setAttribute(stop_3, "offset", "0.108");
			setAttribute(stop_3, "stop-color", "#454545");
			setAttribute(stop_4, "offset", "0.305");
			setAttribute(stop_4, "stop-color", "#fff");
			setAttribute(stop_5, "offset", "0.586");
			setAttribute(stop_5, "stop-color", "#959595");
			setAttribute(stop_6, "offset", "0.64");
			setAttribute(stop_6, "stop-color", "#d9d9d9");
			setAttribute(stop_7, "offset", "0.764");
			setAttribute(stop_7, "stop-color", "#6e6e6e");
			setAttribute(stop_8, "offset", "0.847");
			setAttribute(stop_8, "stop-color", "#fff");
			setAttribute(stop_9, "offset", "0.916");
			setAttribute(stop_9, "stop-color", "#888");
			setAttribute(stop_10, "offset", "1");
			setAttribute(stop_10, "stop-color", "#fff");
			setAttribute(linearGradient_1, "id", "linear-gradient-2");
			setAttribute(linearGradient_1, "y1", "0.5");
			setAttribute(linearGradient_1, "x2", "1");
			setAttribute(linearGradient_1, "y2", "0.5");
			setAttribute(linearGradient_1, "gradientUnits", "objectBoundingBox");
			setAttribute(rect_1, "id", "Rectangle_1");
			setAttribute(rect_1, "data-name", "Rectangle 1");
			setAttribute(rect_1, "class", "cls-2");
			setAttribute(rect_1, "width", "950");
			setAttribute(rect_1, "height", "507");
			setAttribute(rect_1, "transform", "translate(125.554 147)");
			setAttribute(path, "id", "Path_6");
			setAttribute(path, "data-name", "Path 6");
			setAttribute(path, "class", "cls-1");
			setAttribute(path, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_1, "id", "Path_7");
			setAttribute(path_1, "data-name", "Path 7");
			setAttribute(path_1, "class", "cls-4");
			setAttribute(path_1, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_3, "id", "Path_3");
			setAttribute(g_3, "data-name", "Path 3");
			setAttribute(g_3, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_2, "id", "Group_10");
			setAttribute(g_2, "data-name", "Group 10");
			setAttribute(g_2, "transform", "translate(-124.723 -619.815)");
			setAttribute(path_2, "id", "Path_8");
			setAttribute(path_2, "data-name", "Path 8");
			setAttribute(path_2, "class", "cls-1");
			setAttribute(path_2, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_3, "id", "Path_9");
			setAttribute(path_3, "data-name", "Path 9");
			setAttribute(path_3, "class", "cls-4");
			setAttribute(path_3, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_5, "id", "Path_3-2");
			setAttribute(g_5, "data-name", "Path 3");
			setAttribute(g_5, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_4, "id", "Group_11");
			setAttribute(g_4, "data-name", "Group 11");
			setAttribute(g_4, "transform", "translate(-65.723 -619.815)");
			setAttribute(path_4, "id", "Path_10");
			setAttribute(path_4, "data-name", "Path 10");
			setAttribute(path_4, "class", "cls-1");
			setAttribute(path_4, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_5, "id", "Path_11");
			setAttribute(path_5, "data-name", "Path 11");
			setAttribute(path_5, "class", "cls-4");
			setAttribute(path_5, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_7, "id", "Path_3-3");
			setAttribute(g_7, "data-name", "Path 3");
			setAttribute(g_7, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_6, "id", "Group_12");
			setAttribute(g_6, "data-name", "Group 12");
			setAttribute(g_6, "transform", "translate(-6.723 -619.815)");
			setAttribute(path_6, "id", "Path_12");
			setAttribute(path_6, "data-name", "Path 12");
			setAttribute(path_6, "class", "cls-1");
			setAttribute(path_6, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_7, "id", "Path_13");
			setAttribute(path_7, "data-name", "Path 13");
			setAttribute(path_7, "class", "cls-4");
			setAttribute(path_7, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_9, "id", "Path_3-4");
			setAttribute(g_9, "data-name", "Path 3");
			setAttribute(g_9, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_8, "id", "Group_13");
			setAttribute(g_8, "data-name", "Group 13");
			setAttribute(g_8, "transform", "translate(52.277 -619.815)");
			setAttribute(path_8, "id", "Path_14");
			setAttribute(path_8, "data-name", "Path 14");
			setAttribute(path_8, "class", "cls-1");
			setAttribute(path_8, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_9, "id", "Path_15");
			setAttribute(path_9, "data-name", "Path 15");
			setAttribute(path_9, "class", "cls-4");
			setAttribute(path_9, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_11, "id", "Path_3-5");
			setAttribute(g_11, "data-name", "Path 3");
			setAttribute(g_11, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_10, "id", "Group_14");
			setAttribute(g_10, "data-name", "Group 14");
			setAttribute(g_10, "transform", "translate(111.277 -619.815)");
			setAttribute(path_10, "id", "Path_16");
			setAttribute(path_10, "data-name", "Path 16");
			setAttribute(path_10, "class", "cls-1");
			setAttribute(path_10, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_11, "id", "Path_17");
			setAttribute(path_11, "data-name", "Path 17");
			setAttribute(path_11, "class", "cls-4");
			setAttribute(path_11, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_13, "id", "Path_3-6");
			setAttribute(g_13, "data-name", "Path 3");
			setAttribute(g_13, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_12, "id", "Group_15");
			setAttribute(g_12, "data-name", "Group 15");
			setAttribute(g_12, "transform", "translate(170.277 -619.815)");
			setAttribute(path_12, "id", "Path_18");
			setAttribute(path_12, "data-name", "Path 18");
			setAttribute(path_12, "class", "cls-1");
			setAttribute(path_12, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_13, "id", "Path_19");
			setAttribute(path_13, "data-name", "Path 19");
			setAttribute(path_13, "class", "cls-4");
			setAttribute(path_13, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_15, "id", "Path_3-7");
			setAttribute(g_15, "data-name", "Path 3");
			setAttribute(g_15, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_14, "id", "Group_16");
			setAttribute(g_14, "data-name", "Group 16");
			setAttribute(g_14, "transform", "translate(229.277 -619.815)");
			setAttribute(path_14, "id", "Path_20");
			setAttribute(path_14, "data-name", "Path 20");
			setAttribute(path_14, "class", "cls-1");
			setAttribute(path_14, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_15, "id", "Path_21");
			setAttribute(path_15, "data-name", "Path 21");
			setAttribute(path_15, "class", "cls-4");
			setAttribute(path_15, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_17, "id", "Path_3-8");
			setAttribute(g_17, "data-name", "Path 3");
			setAttribute(g_17, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_16, "id", "Group_17");
			setAttribute(g_16, "data-name", "Group 17");
			setAttribute(g_16, "transform", "translate(288.277 -619.815)");
			setAttribute(path_16, "id", "Path_22");
			setAttribute(path_16, "data-name", "Path 22");
			setAttribute(path_16, "class", "cls-1");
			setAttribute(path_16, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_17, "id", "Path_23");
			setAttribute(path_17, "data-name", "Path 23");
			setAttribute(path_17, "class", "cls-4");
			setAttribute(path_17, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_19, "id", "Path_3-9");
			setAttribute(g_19, "data-name", "Path 3");
			setAttribute(g_19, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_18, "id", "Group_18");
			setAttribute(g_18, "data-name", "Group 18");
			setAttribute(g_18, "transform", "translate(347.277 -619.815)");
			setAttribute(path_18, "id", "Path_24");
			setAttribute(path_18, "data-name", "Path 24");
			setAttribute(path_18, "class", "cls-1");
			setAttribute(path_18, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_19, "id", "Path_25");
			setAttribute(path_19, "data-name", "Path 25");
			setAttribute(path_19, "class", "cls-4");
			setAttribute(path_19, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_21, "id", "Path_3-10");
			setAttribute(g_21, "data-name", "Path 3");
			setAttribute(g_21, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_20, "id", "Group_19");
			setAttribute(g_20, "data-name", "Group 19");
			setAttribute(g_20, "transform", "translate(406.277 -619.815)");
			setAttribute(path_20, "id", "Path_26");
			setAttribute(path_20, "data-name", "Path 26");
			setAttribute(path_20, "class", "cls-1");
			setAttribute(path_20, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_21, "id", "Path_27");
			setAttribute(path_21, "data-name", "Path 27");
			setAttribute(path_21, "class", "cls-4");
			setAttribute(path_21, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_23, "id", "Path_3-11");
			setAttribute(g_23, "data-name", "Path 3");
			setAttribute(g_23, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_22, "id", "Group_20");
			setAttribute(g_22, "data-name", "Group 20");
			setAttribute(g_22, "transform", "translate(465.277 -619.815)");
			setAttribute(path_22, "id", "Path_28");
			setAttribute(path_22, "data-name", "Path 28");
			setAttribute(path_22, "class", "cls-1");
			setAttribute(path_22, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_23, "id", "Path_29");
			setAttribute(path_23, "data-name", "Path 29");
			setAttribute(path_23, "class", "cls-4");
			setAttribute(path_23, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_25, "id", "Path_3-12");
			setAttribute(g_25, "data-name", "Path 3");
			setAttribute(g_25, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_24, "id", "Group_21");
			setAttribute(g_24, "data-name", "Group 21");
			setAttribute(g_24, "transform", "translate(524.277 -619.815)");
			setAttribute(path_24, "id", "Path_30");
			setAttribute(path_24, "data-name", "Path 30");
			setAttribute(path_24, "class", "cls-1");
			setAttribute(path_24, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_25, "id", "Path_31");
			setAttribute(path_25, "data-name", "Path 31");
			setAttribute(path_25, "class", "cls-4");
			setAttribute(path_25, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_27, "id", "Path_3-13");
			setAttribute(g_27, "data-name", "Path 3");
			setAttribute(g_27, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_26, "id", "Group_22");
			setAttribute(g_26, "data-name", "Group 22");
			setAttribute(g_26, "transform", "translate(583.277 -619.815)");
			setAttribute(path_26, "id", "Path_32");
			setAttribute(path_26, "data-name", "Path 32");
			setAttribute(path_26, "class", "cls-1");
			setAttribute(path_26, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_27, "id", "Path_33");
			setAttribute(path_27, "data-name", "Path 33");
			setAttribute(path_27, "class", "cls-4");
			setAttribute(path_27, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_29, "id", "Path_3-14");
			setAttribute(g_29, "data-name", "Path 3");
			setAttribute(g_29, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_28, "id", "Group_23");
			setAttribute(g_28, "data-name", "Group 23");
			setAttribute(g_28, "transform", "translate(642.277 -619.815)");
			setAttribute(path_28, "id", "Path_34");
			setAttribute(path_28, "data-name", "Path 34");
			setAttribute(path_28, "class", "cls-1");
			setAttribute(path_28, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_29, "id", "Path_35");
			setAttribute(path_29, "data-name", "Path 35");
			setAttribute(path_29, "class", "cls-4");
			setAttribute(path_29, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_31, "id", "Path_3-15");
			setAttribute(g_31, "data-name", "Path 3");
			setAttribute(g_31, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_30, "id", "Group_24");
			setAttribute(g_30, "data-name", "Group 24");
			setAttribute(g_30, "transform", "translate(701.277 -619.815)");
			setAttribute(path_30, "id", "Path_36");
			setAttribute(path_30, "data-name", "Path 36");
			setAttribute(path_30, "class", "cls-1");
			setAttribute(path_30, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_31, "id", "Path_37");
			setAttribute(path_31, "data-name", "Path 37");
			setAttribute(path_31, "class", "cls-4");
			setAttribute(path_31, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_33, "id", "Path_3-16");
			setAttribute(g_33, "data-name", "Path 3");
			setAttribute(g_33, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_32, "id", "Group_25");
			setAttribute(g_32, "data-name", "Group 25");
			setAttribute(g_32, "transform", "translate(760.277 -619.815)");
			setAttribute(path_32, "id", "Path_38");
			setAttribute(path_32, "data-name", "Path 38");
			setAttribute(path_32, "class", "cls-1");
			setAttribute(path_32, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_33, "id", "Path_39");
			setAttribute(path_33, "data-name", "Path 39");
			setAttribute(path_33, "class", "cls-4");
			setAttribute(path_33, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_35, "id", "Path_3-17");
			setAttribute(g_35, "data-name", "Path 3");
			setAttribute(g_35, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_34, "id", "Group_26");
			setAttribute(g_34, "data-name", "Group 26");
			setAttribute(g_34, "transform", "translate(819.277 -619.815)");
			setAttribute(path_34, "id", "Path_40");
			setAttribute(path_34, "data-name", "Path 40");
			setAttribute(path_34, "class", "cls-1");
			setAttribute(path_34, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_35, "id", "Path_41");
			setAttribute(path_35, "data-name", "Path 41");
			setAttribute(path_35, "class", "cls-4");
			setAttribute(path_35, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_37, "id", "Path_3-18");
			setAttribute(g_37, "data-name", "Path 3");
			setAttribute(g_37, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_36, "id", "Group_27");
			setAttribute(g_36, "data-name", "Group 27");
			setAttribute(g_36, "transform", "translate(-124.723 -565.815)");
			setAttribute(path_36, "id", "Path_42");
			setAttribute(path_36, "data-name", "Path 42");
			setAttribute(path_36, "class", "cls-1");
			setAttribute(path_36, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_37, "id", "Path_43");
			setAttribute(path_37, "data-name", "Path 43");
			setAttribute(path_37, "class", "cls-4");
			setAttribute(path_37, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_39, "id", "Path_3-19");
			setAttribute(g_39, "data-name", "Path 3");
			setAttribute(g_39, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_38, "id", "Group_28");
			setAttribute(g_38, "data-name", "Group 28");
			setAttribute(g_38, "transform", "translate(-65.723 -565.815)");
			setAttribute(path_38, "id", "Path_44");
			setAttribute(path_38, "data-name", "Path 44");
			setAttribute(path_38, "class", "cls-1");
			setAttribute(path_38, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_39, "id", "Path_45");
			setAttribute(path_39, "data-name", "Path 45");
			setAttribute(path_39, "class", "cls-4");
			setAttribute(path_39, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_41, "id", "Path_3-20");
			setAttribute(g_41, "data-name", "Path 3");
			setAttribute(g_41, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_40, "id", "Group_29");
			setAttribute(g_40, "data-name", "Group 29");
			setAttribute(g_40, "transform", "translate(-6.723 -565.815)");
			setAttribute(path_40, "id", "Path_46");
			setAttribute(path_40, "data-name", "Path 46");
			setAttribute(path_40, "class", "cls-1");
			setAttribute(path_40, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_41, "id", "Path_47");
			setAttribute(path_41, "data-name", "Path 47");
			setAttribute(path_41, "class", "cls-4");
			setAttribute(path_41, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_43, "id", "Path_3-21");
			setAttribute(g_43, "data-name", "Path 3");
			setAttribute(g_43, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_42, "id", "Group_30");
			setAttribute(g_42, "data-name", "Group 30");
			setAttribute(g_42, "transform", "translate(52.277 -565.815)");
			setAttribute(path_42, "id", "Path_48");
			setAttribute(path_42, "data-name", "Path 48");
			setAttribute(path_42, "class", "cls-1");
			setAttribute(path_42, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_43, "id", "Path_49");
			setAttribute(path_43, "data-name", "Path 49");
			setAttribute(path_43, "class", "cls-4");
			setAttribute(path_43, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_45, "id", "Path_3-22");
			setAttribute(g_45, "data-name", "Path 3");
			setAttribute(g_45, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_44, "id", "Group_31");
			setAttribute(g_44, "data-name", "Group 31");
			setAttribute(g_44, "transform", "translate(111.277 -565.815)");
			setAttribute(path_44, "id", "Path_50");
			setAttribute(path_44, "data-name", "Path 50");
			setAttribute(path_44, "class", "cls-1");
			setAttribute(path_44, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_45, "id", "Path_51");
			setAttribute(path_45, "data-name", "Path 51");
			setAttribute(path_45, "class", "cls-4");
			setAttribute(path_45, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_47, "id", "Path_3-23");
			setAttribute(g_47, "data-name", "Path 3");
			setAttribute(g_47, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_46, "id", "Group_32");
			setAttribute(g_46, "data-name", "Group 32");
			setAttribute(g_46, "transform", "translate(170.277 -565.815)");
			setAttribute(path_46, "id", "Path_52");
			setAttribute(path_46, "data-name", "Path 52");
			setAttribute(path_46, "class", "cls-1");
			setAttribute(path_46, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_47, "id", "Path_53");
			setAttribute(path_47, "data-name", "Path 53");
			setAttribute(path_47, "class", "cls-4");
			setAttribute(path_47, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_49, "id", "Path_3-24");
			setAttribute(g_49, "data-name", "Path 3");
			setAttribute(g_49, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_48, "id", "Group_33");
			setAttribute(g_48, "data-name", "Group 33");
			setAttribute(g_48, "transform", "translate(229.277 -565.815)");
			setAttribute(path_48, "id", "Path_54");
			setAttribute(path_48, "data-name", "Path 54");
			setAttribute(path_48, "class", "cls-1");
			setAttribute(path_48, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_49, "id", "Path_55");
			setAttribute(path_49, "data-name", "Path 55");
			setAttribute(path_49, "class", "cls-4");
			setAttribute(path_49, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_51, "id", "Path_3-25");
			setAttribute(g_51, "data-name", "Path 3");
			setAttribute(g_51, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_50, "id", "Group_34");
			setAttribute(g_50, "data-name", "Group 34");
			setAttribute(g_50, "transform", "translate(288.277 -565.815)");
			setAttribute(path_50, "id", "Path_56");
			setAttribute(path_50, "data-name", "Path 56");
			setAttribute(path_50, "class", "cls-1");
			setAttribute(path_50, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_51, "id", "Path_57");
			setAttribute(path_51, "data-name", "Path 57");
			setAttribute(path_51, "class", "cls-4");
			setAttribute(path_51, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_53, "id", "Path_3-26");
			setAttribute(g_53, "data-name", "Path 3");
			setAttribute(g_53, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_52, "id", "Group_35");
			setAttribute(g_52, "data-name", "Group 35");
			setAttribute(g_52, "transform", "translate(347.277 -565.815)");
			setAttribute(path_52, "id", "Path_58");
			setAttribute(path_52, "data-name", "Path 58");
			setAttribute(path_52, "class", "cls-1");
			setAttribute(path_52, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_53, "id", "Path_59");
			setAttribute(path_53, "data-name", "Path 59");
			setAttribute(path_53, "class", "cls-4");
			setAttribute(path_53, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_55, "id", "Path_3-27");
			setAttribute(g_55, "data-name", "Path 3");
			setAttribute(g_55, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_54, "id", "Group_36");
			setAttribute(g_54, "data-name", "Group 36");
			setAttribute(g_54, "transform", "translate(406.277 -565.815)");
			setAttribute(path_54, "id", "Path_60");
			setAttribute(path_54, "data-name", "Path 60");
			setAttribute(path_54, "class", "cls-1");
			setAttribute(path_54, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_55, "id", "Path_61");
			setAttribute(path_55, "data-name", "Path 61");
			setAttribute(path_55, "class", "cls-4");
			setAttribute(path_55, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_57, "id", "Path_3-28");
			setAttribute(g_57, "data-name", "Path 3");
			setAttribute(g_57, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_56, "id", "Group_37");
			setAttribute(g_56, "data-name", "Group 37");
			setAttribute(g_56, "transform", "translate(465.277 -565.815)");
			setAttribute(path_56, "id", "Path_62");
			setAttribute(path_56, "data-name", "Path 62");
			setAttribute(path_56, "class", "cls-1");
			setAttribute(path_56, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_57, "id", "Path_63");
			setAttribute(path_57, "data-name", "Path 63");
			setAttribute(path_57, "class", "cls-4");
			setAttribute(path_57, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_59, "id", "Path_3-29");
			setAttribute(g_59, "data-name", "Path 3");
			setAttribute(g_59, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_58, "id", "Group_38");
			setAttribute(g_58, "data-name", "Group 38");
			setAttribute(g_58, "transform", "translate(524.277 -565.815)");
			setAttribute(path_58, "id", "Path_64");
			setAttribute(path_58, "data-name", "Path 64");
			setAttribute(path_58, "class", "cls-1");
			setAttribute(path_58, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_59, "id", "Path_65");
			setAttribute(path_59, "data-name", "Path 65");
			setAttribute(path_59, "class", "cls-4");
			setAttribute(path_59, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_61, "id", "Path_3-30");
			setAttribute(g_61, "data-name", "Path 3");
			setAttribute(g_61, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_60, "id", "Group_39");
			setAttribute(g_60, "data-name", "Group 39");
			setAttribute(g_60, "transform", "translate(583.277 -565.815)");
			setAttribute(path_60, "id", "Path_66");
			setAttribute(path_60, "data-name", "Path 66");
			setAttribute(path_60, "class", "cls-1");
			setAttribute(path_60, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_61, "id", "Path_67");
			setAttribute(path_61, "data-name", "Path 67");
			setAttribute(path_61, "class", "cls-4");
			setAttribute(path_61, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_63, "id", "Path_3-31");
			setAttribute(g_63, "data-name", "Path 3");
			setAttribute(g_63, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_62, "id", "Group_40");
			setAttribute(g_62, "data-name", "Group 40");
			setAttribute(g_62, "transform", "translate(642.277 -565.815)");
			setAttribute(path_62, "id", "Path_68");
			setAttribute(path_62, "data-name", "Path 68");
			setAttribute(path_62, "class", "cls-1");
			setAttribute(path_62, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_63, "id", "Path_69");
			setAttribute(path_63, "data-name", "Path 69");
			setAttribute(path_63, "class", "cls-4");
			setAttribute(path_63, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_65, "id", "Path_3-32");
			setAttribute(g_65, "data-name", "Path 3");
			setAttribute(g_65, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_64, "id", "Group_41");
			setAttribute(g_64, "data-name", "Group 41");
			setAttribute(g_64, "transform", "translate(701.277 -565.815)");
			setAttribute(path_64, "id", "Path_70");
			setAttribute(path_64, "data-name", "Path 70");
			setAttribute(path_64, "class", "cls-1");
			setAttribute(path_64, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_65, "id", "Path_71");
			setAttribute(path_65, "data-name", "Path 71");
			setAttribute(path_65, "class", "cls-4");
			setAttribute(path_65, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_67, "id", "Path_3-33");
			setAttribute(g_67, "data-name", "Path 3");
			setAttribute(g_67, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_66, "id", "Group_42");
			setAttribute(g_66, "data-name", "Group 42");
			setAttribute(g_66, "transform", "translate(760.277 -565.815)");
			setAttribute(path_66, "id", "Path_72");
			setAttribute(path_66, "data-name", "Path 72");
			setAttribute(path_66, "class", "cls-1");
			setAttribute(path_66, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_67, "id", "Path_73");
			setAttribute(path_67, "data-name", "Path 73");
			setAttribute(path_67, "class", "cls-4");
			setAttribute(path_67, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_69, "id", "Path_3-34");
			setAttribute(g_69, "data-name", "Path 3");
			setAttribute(g_69, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_68, "id", "Group_43");
			setAttribute(g_68, "data-name", "Group 43");
			setAttribute(g_68, "transform", "translate(819.277 -565.815)");
			setAttribute(path_68, "id", "Path_74");
			setAttribute(path_68, "data-name", "Path 74");
			setAttribute(path_68, "class", "cls-1");
			setAttribute(path_68, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_69, "id", "Path_75");
			setAttribute(path_69, "data-name", "Path 75");
			setAttribute(path_69, "class", "cls-4");
			setAttribute(path_69, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_71, "id", "Path_3-35");
			setAttribute(g_71, "data-name", "Path 3");
			setAttribute(g_71, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_70, "id", "Group_44");
			setAttribute(g_70, "data-name", "Group 44");
			setAttribute(g_70, "transform", "translate(-124.723 -511.815)");
			setAttribute(path_70, "id", "Path_76");
			setAttribute(path_70, "data-name", "Path 76");
			setAttribute(path_70, "class", "cls-1");
			setAttribute(path_70, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_71, "id", "Path_77");
			setAttribute(path_71, "data-name", "Path 77");
			setAttribute(path_71, "class", "cls-4");
			setAttribute(path_71, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_73, "id", "Path_3-36");
			setAttribute(g_73, "data-name", "Path 3");
			setAttribute(g_73, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_72, "id", "Group_45");
			setAttribute(g_72, "data-name", "Group 45");
			setAttribute(g_72, "transform", "translate(-65.723 -511.815)");
			setAttribute(path_72, "id", "Path_78");
			setAttribute(path_72, "data-name", "Path 78");
			setAttribute(path_72, "class", "cls-1");
			setAttribute(path_72, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_73, "id", "Path_79");
			setAttribute(path_73, "data-name", "Path 79");
			setAttribute(path_73, "class", "cls-4");
			setAttribute(path_73, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_75, "id", "Path_3-37");
			setAttribute(g_75, "data-name", "Path 3");
			setAttribute(g_75, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_74, "id", "Group_46");
			setAttribute(g_74, "data-name", "Group 46");
			setAttribute(g_74, "transform", "translate(-6.723 -511.815)");
			setAttribute(path_74, "id", "Path_80");
			setAttribute(path_74, "data-name", "Path 80");
			setAttribute(path_74, "class", "cls-1");
			setAttribute(path_74, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_75, "id", "Path_81");
			setAttribute(path_75, "data-name", "Path 81");
			setAttribute(path_75, "class", "cls-4");
			setAttribute(path_75, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_77, "id", "Path_3-38");
			setAttribute(g_77, "data-name", "Path 3");
			setAttribute(g_77, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_76, "id", "Group_47");
			setAttribute(g_76, "data-name", "Group 47");
			setAttribute(g_76, "transform", "translate(52.277 -511.815)");
			setAttribute(path_76, "id", "Path_82");
			setAttribute(path_76, "data-name", "Path 82");
			setAttribute(path_76, "class", "cls-1");
			setAttribute(path_76, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_77, "id", "Path_83");
			setAttribute(path_77, "data-name", "Path 83");
			setAttribute(path_77, "class", "cls-4");
			setAttribute(path_77, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_79, "id", "Path_3-39");
			setAttribute(g_79, "data-name", "Path 3");
			setAttribute(g_79, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_78, "id", "Group_48");
			setAttribute(g_78, "data-name", "Group 48");
			setAttribute(g_78, "transform", "translate(111.277 -511.815)");
			setAttribute(path_78, "id", "Path_84");
			setAttribute(path_78, "data-name", "Path 84");
			setAttribute(path_78, "class", "cls-1");
			setAttribute(path_78, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_79, "id", "Path_85");
			setAttribute(path_79, "data-name", "Path 85");
			setAttribute(path_79, "class", "cls-4");
			setAttribute(path_79, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_81, "id", "Path_3-40");
			setAttribute(g_81, "data-name", "Path 3");
			setAttribute(g_81, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_80, "id", "Group_49");
			setAttribute(g_80, "data-name", "Group 49");
			setAttribute(g_80, "transform", "translate(170.277 -511.815)");
			setAttribute(path_80, "id", "Path_86");
			setAttribute(path_80, "data-name", "Path 86");
			setAttribute(path_80, "class", "cls-1");
			setAttribute(path_80, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_81, "id", "Path_87");
			setAttribute(path_81, "data-name", "Path 87");
			setAttribute(path_81, "class", "cls-4");
			setAttribute(path_81, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_83, "id", "Path_3-41");
			setAttribute(g_83, "data-name", "Path 3");
			setAttribute(g_83, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_82, "id", "Group_50");
			setAttribute(g_82, "data-name", "Group 50");
			setAttribute(g_82, "transform", "translate(229.277 -511.815)");
			setAttribute(path_82, "id", "Path_88");
			setAttribute(path_82, "data-name", "Path 88");
			setAttribute(path_82, "class", "cls-1");
			setAttribute(path_82, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_83, "id", "Path_89");
			setAttribute(path_83, "data-name", "Path 89");
			setAttribute(path_83, "class", "cls-4");
			setAttribute(path_83, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_85, "id", "Path_3-42");
			setAttribute(g_85, "data-name", "Path 3");
			setAttribute(g_85, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_84, "id", "Group_51");
			setAttribute(g_84, "data-name", "Group 51");
			setAttribute(g_84, "transform", "translate(288.277 -511.815)");
			setAttribute(path_84, "id", "Path_90");
			setAttribute(path_84, "data-name", "Path 90");
			setAttribute(path_84, "class", "cls-1");
			setAttribute(path_84, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_85, "id", "Path_91");
			setAttribute(path_85, "data-name", "Path 91");
			setAttribute(path_85, "class", "cls-4");
			setAttribute(path_85, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_87, "id", "Path_3-43");
			setAttribute(g_87, "data-name", "Path 3");
			setAttribute(g_87, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_86, "id", "Group_52");
			setAttribute(g_86, "data-name", "Group 52");
			setAttribute(g_86, "transform", "translate(347.277 -511.815)");
			setAttribute(path_86, "id", "Path_92");
			setAttribute(path_86, "data-name", "Path 92");
			setAttribute(path_86, "class", "cls-1");
			setAttribute(path_86, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_87, "id", "Path_93");
			setAttribute(path_87, "data-name", "Path 93");
			setAttribute(path_87, "class", "cls-4");
			setAttribute(path_87, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_89, "id", "Path_3-44");
			setAttribute(g_89, "data-name", "Path 3");
			setAttribute(g_89, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_88, "id", "Group_53");
			setAttribute(g_88, "data-name", "Group 53");
			setAttribute(g_88, "transform", "translate(406.277 -511.815)");
			setAttribute(path_88, "id", "Path_94");
			setAttribute(path_88, "data-name", "Path 94");
			setAttribute(path_88, "class", "cls-1");
			setAttribute(path_88, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_89, "id", "Path_95");
			setAttribute(path_89, "data-name", "Path 95");
			setAttribute(path_89, "class", "cls-4");
			setAttribute(path_89, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_91, "id", "Path_3-45");
			setAttribute(g_91, "data-name", "Path 3");
			setAttribute(g_91, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_90, "id", "Group_54");
			setAttribute(g_90, "data-name", "Group 54");
			setAttribute(g_90, "transform", "translate(465.277 -511.815)");
			setAttribute(path_90, "id", "Path_96");
			setAttribute(path_90, "data-name", "Path 96");
			setAttribute(path_90, "class", "cls-1");
			setAttribute(path_90, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_91, "id", "Path_97");
			setAttribute(path_91, "data-name", "Path 97");
			setAttribute(path_91, "class", "cls-4");
			setAttribute(path_91, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_93, "id", "Path_3-46");
			setAttribute(g_93, "data-name", "Path 3");
			setAttribute(g_93, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_92, "id", "Group_55");
			setAttribute(g_92, "data-name", "Group 55");
			setAttribute(g_92, "transform", "translate(524.277 -511.815)");
			setAttribute(path_92, "id", "Path_98");
			setAttribute(path_92, "data-name", "Path 98");
			setAttribute(path_92, "class", "cls-1");
			setAttribute(path_92, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_93, "id", "Path_99");
			setAttribute(path_93, "data-name", "Path 99");
			setAttribute(path_93, "class", "cls-4");
			setAttribute(path_93, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_95, "id", "Path_3-47");
			setAttribute(g_95, "data-name", "Path 3");
			setAttribute(g_95, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_94, "id", "Group_56");
			setAttribute(g_94, "data-name", "Group 56");
			setAttribute(g_94, "transform", "translate(583.277 -511.815)");
			setAttribute(path_94, "id", "Path_100");
			setAttribute(path_94, "data-name", "Path 100");
			setAttribute(path_94, "class", "cls-1");
			setAttribute(path_94, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_95, "id", "Path_101");
			setAttribute(path_95, "data-name", "Path 101");
			setAttribute(path_95, "class", "cls-4");
			setAttribute(path_95, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_97, "id", "Path_3-48");
			setAttribute(g_97, "data-name", "Path 3");
			setAttribute(g_97, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_96, "id", "Group_57");
			setAttribute(g_96, "data-name", "Group 57");
			setAttribute(g_96, "transform", "translate(642.277 -511.815)");
			setAttribute(path_96, "id", "Path_102");
			setAttribute(path_96, "data-name", "Path 102");
			setAttribute(path_96, "class", "cls-1");
			setAttribute(path_96, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_97, "id", "Path_103");
			setAttribute(path_97, "data-name", "Path 103");
			setAttribute(path_97, "class", "cls-4");
			setAttribute(path_97, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_99, "id", "Path_3-49");
			setAttribute(g_99, "data-name", "Path 3");
			setAttribute(g_99, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_98, "id", "Group_58");
			setAttribute(g_98, "data-name", "Group 58");
			setAttribute(g_98, "transform", "translate(701.277 -511.815)");
			setAttribute(path_98, "id", "Path_104");
			setAttribute(path_98, "data-name", "Path 104");
			setAttribute(path_98, "class", "cls-1");
			setAttribute(path_98, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_99, "id", "Path_105");
			setAttribute(path_99, "data-name", "Path 105");
			setAttribute(path_99, "class", "cls-4");
			setAttribute(path_99, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_101, "id", "Path_3-50");
			setAttribute(g_101, "data-name", "Path 3");
			setAttribute(g_101, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_100, "id", "Group_59");
			setAttribute(g_100, "data-name", "Group 59");
			setAttribute(g_100, "transform", "translate(760.277 -511.815)");
			setAttribute(path_100, "id", "Path_106");
			setAttribute(path_100, "data-name", "Path 106");
			setAttribute(path_100, "class", "cls-1");
			setAttribute(path_100, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_101, "id", "Path_107");
			setAttribute(path_101, "data-name", "Path 107");
			setAttribute(path_101, "class", "cls-4");
			setAttribute(path_101, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_103, "id", "Path_3-51");
			setAttribute(g_103, "data-name", "Path 3");
			setAttribute(g_103, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_102, "id", "Group_60");
			setAttribute(g_102, "data-name", "Group 60");
			setAttribute(g_102, "transform", "translate(819.277 -511.815)");
			setAttribute(path_102, "id", "Path_108");
			setAttribute(path_102, "data-name", "Path 108");
			setAttribute(path_102, "class", "cls-1");
			setAttribute(path_102, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_103, "id", "Path_109");
			setAttribute(path_103, "data-name", "Path 109");
			setAttribute(path_103, "class", "cls-4");
			setAttribute(path_103, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_105, "id", "Path_3-52");
			setAttribute(g_105, "data-name", "Path 3");
			setAttribute(g_105, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_104, "id", "Group_61");
			setAttribute(g_104, "data-name", "Group 61");
			setAttribute(g_104, "transform", "translate(-124.723 -457.815)");
			setAttribute(path_104, "id", "Path_110");
			setAttribute(path_104, "data-name", "Path 110");
			setAttribute(path_104, "class", "cls-1");
			setAttribute(path_104, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_105, "id", "Path_111");
			setAttribute(path_105, "data-name", "Path 111");
			setAttribute(path_105, "class", "cls-4");
			setAttribute(path_105, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_107, "id", "Path_3-53");
			setAttribute(g_107, "data-name", "Path 3");
			setAttribute(g_107, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_106, "id", "Group_62");
			setAttribute(g_106, "data-name", "Group 62");
			setAttribute(g_106, "transform", "translate(-65.723 -457.815)");
			setAttribute(path_106, "id", "Path_112");
			setAttribute(path_106, "data-name", "Path 112");
			setAttribute(path_106, "class", "cls-1");
			setAttribute(path_106, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_107, "id", "Path_113");
			setAttribute(path_107, "data-name", "Path 113");
			setAttribute(path_107, "class", "cls-4");
			setAttribute(path_107, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_109, "id", "Path_3-54");
			setAttribute(g_109, "data-name", "Path 3");
			setAttribute(g_109, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_108, "id", "Group_63");
			setAttribute(g_108, "data-name", "Group 63");
			setAttribute(g_108, "transform", "translate(-6.723 -457.815)");
			setAttribute(path_108, "id", "Path_114");
			setAttribute(path_108, "data-name", "Path 114");
			setAttribute(path_108, "class", "cls-1");
			setAttribute(path_108, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_109, "id", "Path_115");
			setAttribute(path_109, "data-name", "Path 115");
			setAttribute(path_109, "class", "cls-4");
			setAttribute(path_109, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_111, "id", "Path_3-55");
			setAttribute(g_111, "data-name", "Path 3");
			setAttribute(g_111, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_110, "id", "Group_64");
			setAttribute(g_110, "data-name", "Group 64");
			setAttribute(g_110, "transform", "translate(52.277 -457.815)");
			setAttribute(path_110, "id", "Path_116");
			setAttribute(path_110, "data-name", "Path 116");
			setAttribute(path_110, "class", "cls-1");
			setAttribute(path_110, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_111, "id", "Path_117");
			setAttribute(path_111, "data-name", "Path 117");
			setAttribute(path_111, "class", "cls-4");
			setAttribute(path_111, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_113, "id", "Path_3-56");
			setAttribute(g_113, "data-name", "Path 3");
			setAttribute(g_113, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_112, "id", "Group_65");
			setAttribute(g_112, "data-name", "Group 65");
			setAttribute(g_112, "transform", "translate(111.277 -457.815)");
			setAttribute(path_112, "id", "Path_118");
			setAttribute(path_112, "data-name", "Path 118");
			setAttribute(path_112, "class", "cls-1");
			setAttribute(path_112, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_113, "id", "Path_119");
			setAttribute(path_113, "data-name", "Path 119");
			setAttribute(path_113, "class", "cls-4");
			setAttribute(path_113, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_115, "id", "Path_3-57");
			setAttribute(g_115, "data-name", "Path 3");
			setAttribute(g_115, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_114, "id", "Group_66");
			setAttribute(g_114, "data-name", "Group 66");
			setAttribute(g_114, "transform", "translate(170.277 -457.815)");
			setAttribute(path_114, "id", "Path_120");
			setAttribute(path_114, "data-name", "Path 120");
			setAttribute(path_114, "class", "cls-1");
			setAttribute(path_114, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_115, "id", "Path_121");
			setAttribute(path_115, "data-name", "Path 121");
			setAttribute(path_115, "class", "cls-4");
			setAttribute(path_115, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_117, "id", "Path_3-58");
			setAttribute(g_117, "data-name", "Path 3");
			setAttribute(g_117, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_116, "id", "Group_67");
			setAttribute(g_116, "data-name", "Group 67");
			setAttribute(g_116, "transform", "translate(229.277 -457.815)");
			setAttribute(path_116, "id", "Path_122");
			setAttribute(path_116, "data-name", "Path 122");
			setAttribute(path_116, "class", "cls-1");
			setAttribute(path_116, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_117, "id", "Path_123");
			setAttribute(path_117, "data-name", "Path 123");
			setAttribute(path_117, "class", "cls-4");
			setAttribute(path_117, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_119, "id", "Path_3-59");
			setAttribute(g_119, "data-name", "Path 3");
			setAttribute(g_119, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_118, "id", "Group_68");
			setAttribute(g_118, "data-name", "Group 68");
			setAttribute(g_118, "transform", "translate(288.277 -457.815)");
			setAttribute(path_118, "id", "Path_124");
			setAttribute(path_118, "data-name", "Path 124");
			setAttribute(path_118, "class", "cls-1");
			setAttribute(path_118, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_119, "id", "Path_125");
			setAttribute(path_119, "data-name", "Path 125");
			setAttribute(path_119, "class", "cls-4");
			setAttribute(path_119, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_121, "id", "Path_3-60");
			setAttribute(g_121, "data-name", "Path 3");
			setAttribute(g_121, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_120, "id", "Group_69");
			setAttribute(g_120, "data-name", "Group 69");
			setAttribute(g_120, "transform", "translate(347.277 -457.815)");
			setAttribute(path_120, "id", "Path_126");
			setAttribute(path_120, "data-name", "Path 126");
			setAttribute(path_120, "class", "cls-1");
			setAttribute(path_120, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_121, "id", "Path_127");
			setAttribute(path_121, "data-name", "Path 127");
			setAttribute(path_121, "class", "cls-4");
			setAttribute(path_121, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_123, "id", "Path_3-61");
			setAttribute(g_123, "data-name", "Path 3");
			setAttribute(g_123, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_122, "id", "Group_70");
			setAttribute(g_122, "data-name", "Group 70");
			setAttribute(g_122, "transform", "translate(406.277 -457.815)");
			setAttribute(path_122, "id", "Path_128");
			setAttribute(path_122, "data-name", "Path 128");
			setAttribute(path_122, "class", "cls-1");
			setAttribute(path_122, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_123, "id", "Path_129");
			setAttribute(path_123, "data-name", "Path 129");
			setAttribute(path_123, "class", "cls-4");
			setAttribute(path_123, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_125, "id", "Path_3-62");
			setAttribute(g_125, "data-name", "Path 3");
			setAttribute(g_125, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_124, "id", "Group_71");
			setAttribute(g_124, "data-name", "Group 71");
			setAttribute(g_124, "transform", "translate(465.277 -457.815)");
			setAttribute(path_124, "id", "Path_130");
			setAttribute(path_124, "data-name", "Path 130");
			setAttribute(path_124, "class", "cls-1");
			setAttribute(path_124, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_125, "id", "Path_131");
			setAttribute(path_125, "data-name", "Path 131");
			setAttribute(path_125, "class", "cls-4");
			setAttribute(path_125, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_127, "id", "Path_3-63");
			setAttribute(g_127, "data-name", "Path 3");
			setAttribute(g_127, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_126, "id", "Group_72");
			setAttribute(g_126, "data-name", "Group 72");
			setAttribute(g_126, "transform", "translate(524.277 -457.815)");
			setAttribute(path_126, "id", "Path_132");
			setAttribute(path_126, "data-name", "Path 132");
			setAttribute(path_126, "class", "cls-1");
			setAttribute(path_126, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_127, "id", "Path_133");
			setAttribute(path_127, "data-name", "Path 133");
			setAttribute(path_127, "class", "cls-4");
			setAttribute(path_127, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_129, "id", "Path_3-64");
			setAttribute(g_129, "data-name", "Path 3");
			setAttribute(g_129, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_128, "id", "Group_73");
			setAttribute(g_128, "data-name", "Group 73");
			setAttribute(g_128, "transform", "translate(583.277 -457.815)");
			setAttribute(path_128, "id", "Path_134");
			setAttribute(path_128, "data-name", "Path 134");
			setAttribute(path_128, "class", "cls-1");
			setAttribute(path_128, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_129, "id", "Path_135");
			setAttribute(path_129, "data-name", "Path 135");
			setAttribute(path_129, "class", "cls-4");
			setAttribute(path_129, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_131, "id", "Path_3-65");
			setAttribute(g_131, "data-name", "Path 3");
			setAttribute(g_131, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_130, "id", "Group_74");
			setAttribute(g_130, "data-name", "Group 74");
			setAttribute(g_130, "transform", "translate(642.277 -457.815)");
			setAttribute(path_130, "id", "Path_136");
			setAttribute(path_130, "data-name", "Path 136");
			setAttribute(path_130, "class", "cls-1");
			setAttribute(path_130, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_131, "id", "Path_137");
			setAttribute(path_131, "data-name", "Path 137");
			setAttribute(path_131, "class", "cls-4");
			setAttribute(path_131, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_133, "id", "Path_3-66");
			setAttribute(g_133, "data-name", "Path 3");
			setAttribute(g_133, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_132, "id", "Group_75");
			setAttribute(g_132, "data-name", "Group 75");
			setAttribute(g_132, "transform", "translate(701.277 -457.815)");
			setAttribute(path_132, "id", "Path_138");
			setAttribute(path_132, "data-name", "Path 138");
			setAttribute(path_132, "class", "cls-1");
			setAttribute(path_132, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_133, "id", "Path_139");
			setAttribute(path_133, "data-name", "Path 139");
			setAttribute(path_133, "class", "cls-4");
			setAttribute(path_133, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_135, "id", "Path_3-67");
			setAttribute(g_135, "data-name", "Path 3");
			setAttribute(g_135, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_134, "id", "Group_76");
			setAttribute(g_134, "data-name", "Group 76");
			setAttribute(g_134, "transform", "translate(760.277 -457.815)");
			setAttribute(path_134, "id", "Path_140");
			setAttribute(path_134, "data-name", "Path 140");
			setAttribute(path_134, "class", "cls-1");
			setAttribute(path_134, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_135, "id", "Path_141");
			setAttribute(path_135, "data-name", "Path 141");
			setAttribute(path_135, "class", "cls-4");
			setAttribute(path_135, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_137, "id", "Path_3-68");
			setAttribute(g_137, "data-name", "Path 3");
			setAttribute(g_137, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_136, "id", "Group_77");
			setAttribute(g_136, "data-name", "Group 77");
			setAttribute(g_136, "transform", "translate(819.277 -457.815)");
			setAttribute(path_136, "id", "Path_142");
			setAttribute(path_136, "data-name", "Path 142");
			setAttribute(path_136, "class", "cls-1");
			setAttribute(path_136, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_137, "id", "Path_143");
			setAttribute(path_137, "data-name", "Path 143");
			setAttribute(path_137, "class", "cls-4");
			setAttribute(path_137, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_139, "id", "Path_3-69");
			setAttribute(g_139, "data-name", "Path 3");
			setAttribute(g_139, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_138, "id", "Group_78");
			setAttribute(g_138, "data-name", "Group 78");
			setAttribute(g_138, "transform", "translate(-124.723 -403.815)");
			setAttribute(path_138, "id", "Path_144");
			setAttribute(path_138, "data-name", "Path 144");
			setAttribute(path_138, "class", "cls-1");
			setAttribute(path_138, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_139, "id", "Path_145");
			setAttribute(path_139, "data-name", "Path 145");
			setAttribute(path_139, "class", "cls-4");
			setAttribute(path_139, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_141, "id", "Path_3-70");
			setAttribute(g_141, "data-name", "Path 3");
			setAttribute(g_141, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_140, "id", "Group_79");
			setAttribute(g_140, "data-name", "Group 79");
			setAttribute(g_140, "transform", "translate(-65.723 -403.815)");
			setAttribute(path_140, "id", "Path_146");
			setAttribute(path_140, "data-name", "Path 146");
			setAttribute(path_140, "class", "cls-1");
			setAttribute(path_140, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_141, "id", "Path_147");
			setAttribute(path_141, "data-name", "Path 147");
			setAttribute(path_141, "class", "cls-4");
			setAttribute(path_141, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_143, "id", "Path_3-71");
			setAttribute(g_143, "data-name", "Path 3");
			setAttribute(g_143, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_142, "id", "Group_80");
			setAttribute(g_142, "data-name", "Group 80");
			setAttribute(g_142, "transform", "translate(-6.723 -403.815)");
			setAttribute(path_142, "id", "Path_148");
			setAttribute(path_142, "data-name", "Path 148");
			setAttribute(path_142, "class", "cls-1");
			setAttribute(path_142, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_143, "id", "Path_149");
			setAttribute(path_143, "data-name", "Path 149");
			setAttribute(path_143, "class", "cls-4");
			setAttribute(path_143, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_145, "id", "Path_3-72");
			setAttribute(g_145, "data-name", "Path 3");
			setAttribute(g_145, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_144, "id", "Group_81");
			setAttribute(g_144, "data-name", "Group 81");
			setAttribute(g_144, "transform", "translate(52.277 -403.815)");
			setAttribute(path_144, "id", "Path_150");
			setAttribute(path_144, "data-name", "Path 150");
			setAttribute(path_144, "class", "cls-1");
			setAttribute(path_144, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_145, "id", "Path_151");
			setAttribute(path_145, "data-name", "Path 151");
			setAttribute(path_145, "class", "cls-4");
			setAttribute(path_145, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_147, "id", "Path_3-73");
			setAttribute(g_147, "data-name", "Path 3");
			setAttribute(g_147, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_146, "id", "Group_82");
			setAttribute(g_146, "data-name", "Group 82");
			setAttribute(g_146, "transform", "translate(111.277 -403.815)");
			setAttribute(path_146, "id", "Path_152");
			setAttribute(path_146, "data-name", "Path 152");
			setAttribute(path_146, "class", "cls-1");
			setAttribute(path_146, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_147, "id", "Path_153");
			setAttribute(path_147, "data-name", "Path 153");
			setAttribute(path_147, "class", "cls-4");
			setAttribute(path_147, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_149, "id", "Path_3-74");
			setAttribute(g_149, "data-name", "Path 3");
			setAttribute(g_149, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_148, "id", "Group_83");
			setAttribute(g_148, "data-name", "Group 83");
			setAttribute(g_148, "transform", "translate(170.277 -403.815)");
			setAttribute(path_148, "id", "Path_154");
			setAttribute(path_148, "data-name", "Path 154");
			setAttribute(path_148, "class", "cls-1");
			setAttribute(path_148, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_149, "id", "Path_155");
			setAttribute(path_149, "data-name", "Path 155");
			setAttribute(path_149, "class", "cls-4");
			setAttribute(path_149, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_151, "id", "Path_3-75");
			setAttribute(g_151, "data-name", "Path 3");
			setAttribute(g_151, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_150, "id", "Group_84");
			setAttribute(g_150, "data-name", "Group 84");
			setAttribute(g_150, "transform", "translate(229.277 -403.815)");
			setAttribute(path_150, "id", "Path_156");
			setAttribute(path_150, "data-name", "Path 156");
			setAttribute(path_150, "class", "cls-1");
			setAttribute(path_150, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_151, "id", "Path_157");
			setAttribute(path_151, "data-name", "Path 157");
			setAttribute(path_151, "class", "cls-4");
			setAttribute(path_151, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_153, "id", "Path_3-76");
			setAttribute(g_153, "data-name", "Path 3");
			setAttribute(g_153, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_152, "id", "Group_85");
			setAttribute(g_152, "data-name", "Group 85");
			setAttribute(g_152, "transform", "translate(288.277 -403.815)");
			setAttribute(path_152, "id", "Path_158");
			setAttribute(path_152, "data-name", "Path 158");
			setAttribute(path_152, "class", "cls-1");
			setAttribute(path_152, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_153, "id", "Path_159");
			setAttribute(path_153, "data-name", "Path 159");
			setAttribute(path_153, "class", "cls-4");
			setAttribute(path_153, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_155, "id", "Path_3-77");
			setAttribute(g_155, "data-name", "Path 3");
			setAttribute(g_155, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_154, "id", "Group_86");
			setAttribute(g_154, "data-name", "Group 86");
			setAttribute(g_154, "transform", "translate(347.277 -403.815)");
			setAttribute(path_154, "id", "Path_160");
			setAttribute(path_154, "data-name", "Path 160");
			setAttribute(path_154, "class", "cls-1");
			setAttribute(path_154, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_155, "id", "Path_161");
			setAttribute(path_155, "data-name", "Path 161");
			setAttribute(path_155, "class", "cls-4");
			setAttribute(path_155, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_157, "id", "Path_3-78");
			setAttribute(g_157, "data-name", "Path 3");
			setAttribute(g_157, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_156, "id", "Group_87");
			setAttribute(g_156, "data-name", "Group 87");
			setAttribute(g_156, "transform", "translate(406.277 -403.815)");
			setAttribute(path_156, "id", "Path_162");
			setAttribute(path_156, "data-name", "Path 162");
			setAttribute(path_156, "class", "cls-1");
			setAttribute(path_156, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_157, "id", "Path_163");
			setAttribute(path_157, "data-name", "Path 163");
			setAttribute(path_157, "class", "cls-4");
			setAttribute(path_157, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_159, "id", "Path_3-79");
			setAttribute(g_159, "data-name", "Path 3");
			setAttribute(g_159, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_158, "id", "Group_88");
			setAttribute(g_158, "data-name", "Group 88");
			setAttribute(g_158, "transform", "translate(465.277 -403.815)");
			setAttribute(path_158, "id", "Path_164");
			setAttribute(path_158, "data-name", "Path 164");
			setAttribute(path_158, "class", "cls-1");
			setAttribute(path_158, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_159, "id", "Path_165");
			setAttribute(path_159, "data-name", "Path 165");
			setAttribute(path_159, "class", "cls-4");
			setAttribute(path_159, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_161, "id", "Path_3-80");
			setAttribute(g_161, "data-name", "Path 3");
			setAttribute(g_161, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_160, "id", "Group_89");
			setAttribute(g_160, "data-name", "Group 89");
			setAttribute(g_160, "transform", "translate(524.277 -403.815)");
			setAttribute(path_160, "id", "Path_166");
			setAttribute(path_160, "data-name", "Path 166");
			setAttribute(path_160, "class", "cls-1");
			setAttribute(path_160, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_161, "id", "Path_167");
			setAttribute(path_161, "data-name", "Path 167");
			setAttribute(path_161, "class", "cls-4");
			setAttribute(path_161, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_163, "id", "Path_3-81");
			setAttribute(g_163, "data-name", "Path 3");
			setAttribute(g_163, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_162, "id", "Group_90");
			setAttribute(g_162, "data-name", "Group 90");
			setAttribute(g_162, "transform", "translate(583.277 -403.815)");
			setAttribute(path_162, "id", "Path_168");
			setAttribute(path_162, "data-name", "Path 168");
			setAttribute(path_162, "class", "cls-1");
			setAttribute(path_162, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_163, "id", "Path_169");
			setAttribute(path_163, "data-name", "Path 169");
			setAttribute(path_163, "class", "cls-4");
			setAttribute(path_163, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_165, "id", "Path_3-82");
			setAttribute(g_165, "data-name", "Path 3");
			setAttribute(g_165, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_164, "id", "Group_91");
			setAttribute(g_164, "data-name", "Group 91");
			setAttribute(g_164, "transform", "translate(642.277 -403.815)");
			setAttribute(path_164, "id", "Path_170");
			setAttribute(path_164, "data-name", "Path 170");
			setAttribute(path_164, "class", "cls-1");
			setAttribute(path_164, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_165, "id", "Path_171");
			setAttribute(path_165, "data-name", "Path 171");
			setAttribute(path_165, "class", "cls-4");
			setAttribute(path_165, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_167, "id", "Path_3-83");
			setAttribute(g_167, "data-name", "Path 3");
			setAttribute(g_167, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_166, "id", "Group_92");
			setAttribute(g_166, "data-name", "Group 92");
			setAttribute(g_166, "transform", "translate(701.277 -403.815)");
			setAttribute(path_166, "id", "Path_172");
			setAttribute(path_166, "data-name", "Path 172");
			setAttribute(path_166, "class", "cls-1");
			setAttribute(path_166, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_167, "id", "Path_173");
			setAttribute(path_167, "data-name", "Path 173");
			setAttribute(path_167, "class", "cls-4");
			setAttribute(path_167, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_169, "id", "Path_3-84");
			setAttribute(g_169, "data-name", "Path 3");
			setAttribute(g_169, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_168, "id", "Group_93");
			setAttribute(g_168, "data-name", "Group 93");
			setAttribute(g_168, "transform", "translate(760.277 -403.815)");
			setAttribute(path_168, "id", "Path_174");
			setAttribute(path_168, "data-name", "Path 174");
			setAttribute(path_168, "class", "cls-1");
			setAttribute(path_168, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_169, "id", "Path_175");
			setAttribute(path_169, "data-name", "Path 175");
			setAttribute(path_169, "class", "cls-4");
			setAttribute(path_169, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_171, "id", "Path_3-85");
			setAttribute(g_171, "data-name", "Path 3");
			setAttribute(g_171, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_170, "id", "Group_94");
			setAttribute(g_170, "data-name", "Group 94");
			setAttribute(g_170, "transform", "translate(819.277 -403.815)");
			setAttribute(path_170, "id", "Path_176");
			setAttribute(path_170, "data-name", "Path 176");
			setAttribute(path_170, "class", "cls-1");
			setAttribute(path_170, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_171, "id", "Path_177");
			setAttribute(path_171, "data-name", "Path 177");
			setAttribute(path_171, "class", "cls-4");
			setAttribute(path_171, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_173, "id", "Path_3-86");
			setAttribute(g_173, "data-name", "Path 3");
			setAttribute(g_173, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_172, "id", "Group_95");
			setAttribute(g_172, "data-name", "Group 95");
			setAttribute(g_172, "transform", "translate(-124.723 -349.815)");
			setAttribute(path_172, "id", "Path_178");
			setAttribute(path_172, "data-name", "Path 178");
			setAttribute(path_172, "class", "cls-1");
			setAttribute(path_172, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_173, "id", "Path_179");
			setAttribute(path_173, "data-name", "Path 179");
			setAttribute(path_173, "class", "cls-4");
			setAttribute(path_173, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_175, "id", "Path_3-87");
			setAttribute(g_175, "data-name", "Path 3");
			setAttribute(g_175, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_174, "id", "Group_96");
			setAttribute(g_174, "data-name", "Group 96");
			setAttribute(g_174, "transform", "translate(-65.723 -349.815)");
			setAttribute(path_174, "id", "Path_180");
			setAttribute(path_174, "data-name", "Path 180");
			setAttribute(path_174, "class", "cls-1");
			setAttribute(path_174, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_175, "id", "Path_181");
			setAttribute(path_175, "data-name", "Path 181");
			setAttribute(path_175, "class", "cls-4");
			setAttribute(path_175, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_177, "id", "Path_3-88");
			setAttribute(g_177, "data-name", "Path 3");
			setAttribute(g_177, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_176, "id", "Group_97");
			setAttribute(g_176, "data-name", "Group 97");
			setAttribute(g_176, "transform", "translate(-6.723 -349.815)");
			setAttribute(path_176, "id", "Path_182");
			setAttribute(path_176, "data-name", "Path 182");
			setAttribute(path_176, "class", "cls-1");
			setAttribute(path_176, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_177, "id", "Path_183");
			setAttribute(path_177, "data-name", "Path 183");
			setAttribute(path_177, "class", "cls-4");
			setAttribute(path_177, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_179, "id", "Path_3-89");
			setAttribute(g_179, "data-name", "Path 3");
			setAttribute(g_179, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_178, "id", "Group_98");
			setAttribute(g_178, "data-name", "Group 98");
			setAttribute(g_178, "transform", "translate(52.277 -349.815)");
			setAttribute(path_178, "id", "Path_184");
			setAttribute(path_178, "data-name", "Path 184");
			setAttribute(path_178, "class", "cls-1");
			setAttribute(path_178, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_179, "id", "Path_185");
			setAttribute(path_179, "data-name", "Path 185");
			setAttribute(path_179, "class", "cls-4");
			setAttribute(path_179, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_181, "id", "Path_3-90");
			setAttribute(g_181, "data-name", "Path 3");
			setAttribute(g_181, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_180, "id", "Group_99");
			setAttribute(g_180, "data-name", "Group 99");
			setAttribute(g_180, "transform", "translate(111.277 -349.815)");
			setAttribute(path_180, "id", "Path_186");
			setAttribute(path_180, "data-name", "Path 186");
			setAttribute(path_180, "class", "cls-1");
			setAttribute(path_180, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_181, "id", "Path_187");
			setAttribute(path_181, "data-name", "Path 187");
			setAttribute(path_181, "class", "cls-4");
			setAttribute(path_181, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_183, "id", "Path_3-91");
			setAttribute(g_183, "data-name", "Path 3");
			setAttribute(g_183, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_182, "id", "Group_100");
			setAttribute(g_182, "data-name", "Group 100");
			setAttribute(g_182, "transform", "translate(170.277 -349.815)");
			setAttribute(path_182, "id", "Path_188");
			setAttribute(path_182, "data-name", "Path 188");
			setAttribute(path_182, "class", "cls-1");
			setAttribute(path_182, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_183, "id", "Path_189");
			setAttribute(path_183, "data-name", "Path 189");
			setAttribute(path_183, "class", "cls-4");
			setAttribute(path_183, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_185, "id", "Path_3-92");
			setAttribute(g_185, "data-name", "Path 3");
			setAttribute(g_185, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_184, "id", "Group_101");
			setAttribute(g_184, "data-name", "Group 101");
			setAttribute(g_184, "transform", "translate(229.277 -349.815)");
			setAttribute(path_184, "id", "Path_190");
			setAttribute(path_184, "data-name", "Path 190");
			setAttribute(path_184, "class", "cls-1");
			setAttribute(path_184, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_185, "id", "Path_191");
			setAttribute(path_185, "data-name", "Path 191");
			setAttribute(path_185, "class", "cls-4");
			setAttribute(path_185, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_187, "id", "Path_3-93");
			setAttribute(g_187, "data-name", "Path 3");
			setAttribute(g_187, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_186, "id", "Group_102");
			setAttribute(g_186, "data-name", "Group 102");
			setAttribute(g_186, "transform", "translate(288.277 -349.815)");
			setAttribute(path_186, "id", "Path_192");
			setAttribute(path_186, "data-name", "Path 192");
			setAttribute(path_186, "class", "cls-1");
			setAttribute(path_186, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_187, "id", "Path_193");
			setAttribute(path_187, "data-name", "Path 193");
			setAttribute(path_187, "class", "cls-4");
			setAttribute(path_187, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_189, "id", "Path_3-94");
			setAttribute(g_189, "data-name", "Path 3");
			setAttribute(g_189, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_188, "id", "Group_103");
			setAttribute(g_188, "data-name", "Group 103");
			setAttribute(g_188, "transform", "translate(347.277 -349.815)");
			setAttribute(path_188, "id", "Path_194");
			setAttribute(path_188, "data-name", "Path 194");
			setAttribute(path_188, "class", "cls-1");
			setAttribute(path_188, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_189, "id", "Path_195");
			setAttribute(path_189, "data-name", "Path 195");
			setAttribute(path_189, "class", "cls-4");
			setAttribute(path_189, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_191, "id", "Path_3-95");
			setAttribute(g_191, "data-name", "Path 3");
			setAttribute(g_191, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_190, "id", "Group_104");
			setAttribute(g_190, "data-name", "Group 104");
			setAttribute(g_190, "transform", "translate(406.277 -349.815)");
			setAttribute(path_190, "id", "Path_196");
			setAttribute(path_190, "data-name", "Path 196");
			setAttribute(path_190, "class", "cls-1");
			setAttribute(path_190, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_191, "id", "Path_197");
			setAttribute(path_191, "data-name", "Path 197");
			setAttribute(path_191, "class", "cls-4");
			setAttribute(path_191, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_193, "id", "Path_3-96");
			setAttribute(g_193, "data-name", "Path 3");
			setAttribute(g_193, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_192, "id", "Group_105");
			setAttribute(g_192, "data-name", "Group 105");
			setAttribute(g_192, "transform", "translate(465.277 -349.815)");
			setAttribute(path_192, "id", "Path_198");
			setAttribute(path_192, "data-name", "Path 198");
			setAttribute(path_192, "class", "cls-1");
			setAttribute(path_192, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_193, "id", "Path_199");
			setAttribute(path_193, "data-name", "Path 199");
			setAttribute(path_193, "class", "cls-4");
			setAttribute(path_193, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_195, "id", "Path_3-97");
			setAttribute(g_195, "data-name", "Path 3");
			setAttribute(g_195, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_194, "id", "Group_106");
			setAttribute(g_194, "data-name", "Group 106");
			setAttribute(g_194, "transform", "translate(524.277 -349.815)");
			setAttribute(path_194, "id", "Path_200");
			setAttribute(path_194, "data-name", "Path 200");
			setAttribute(path_194, "class", "cls-1");
			setAttribute(path_194, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_195, "id", "Path_201");
			setAttribute(path_195, "data-name", "Path 201");
			setAttribute(path_195, "class", "cls-4");
			setAttribute(path_195, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_197, "id", "Path_3-98");
			setAttribute(g_197, "data-name", "Path 3");
			setAttribute(g_197, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_196, "id", "Group_107");
			setAttribute(g_196, "data-name", "Group 107");
			setAttribute(g_196, "transform", "translate(583.277 -349.815)");
			setAttribute(path_196, "id", "Path_202");
			setAttribute(path_196, "data-name", "Path 202");
			setAttribute(path_196, "class", "cls-1");
			setAttribute(path_196, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_197, "id", "Path_203");
			setAttribute(path_197, "data-name", "Path 203");
			setAttribute(path_197, "class", "cls-4");
			setAttribute(path_197, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_199, "id", "Path_3-99");
			setAttribute(g_199, "data-name", "Path 3");
			setAttribute(g_199, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_198, "id", "Group_108");
			setAttribute(g_198, "data-name", "Group 108");
			setAttribute(g_198, "transform", "translate(642.277 -349.815)");
			setAttribute(path_198, "id", "Path_204");
			setAttribute(path_198, "data-name", "Path 204");
			setAttribute(path_198, "class", "cls-1");
			setAttribute(path_198, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_199, "id", "Path_205");
			setAttribute(path_199, "data-name", "Path 205");
			setAttribute(path_199, "class", "cls-4");
			setAttribute(path_199, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_201, "id", "Path_3-100");
			setAttribute(g_201, "data-name", "Path 3");
			setAttribute(g_201, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_200, "id", "Group_109");
			setAttribute(g_200, "data-name", "Group 109");
			setAttribute(g_200, "transform", "translate(701.277 -349.815)");
			setAttribute(path_200, "id", "Path_206");
			setAttribute(path_200, "data-name", "Path 206");
			setAttribute(path_200, "class", "cls-1");
			setAttribute(path_200, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_201, "id", "Path_207");
			setAttribute(path_201, "data-name", "Path 207");
			setAttribute(path_201, "class", "cls-4");
			setAttribute(path_201, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_203, "id", "Path_3-101");
			setAttribute(g_203, "data-name", "Path 3");
			setAttribute(g_203, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_202, "id", "Group_110");
			setAttribute(g_202, "data-name", "Group 110");
			setAttribute(g_202, "transform", "translate(760.277 -349.815)");
			setAttribute(path_202, "id", "Path_208");
			setAttribute(path_202, "data-name", "Path 208");
			setAttribute(path_202, "class", "cls-1");
			setAttribute(path_202, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_203, "id", "Path_209");
			setAttribute(path_203, "data-name", "Path 209");
			setAttribute(path_203, "class", "cls-4");
			setAttribute(path_203, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_205, "id", "Path_3-102");
			setAttribute(g_205, "data-name", "Path 3");
			setAttribute(g_205, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_204, "id", "Group_111");
			setAttribute(g_204, "data-name", "Group 111");
			setAttribute(g_204, "transform", "translate(819.277 -349.815)");
			setAttribute(path_204, "id", "Path_210");
			setAttribute(path_204, "data-name", "Path 210");
			setAttribute(path_204, "class", "cls-1");
			setAttribute(path_204, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_205, "id", "Path_211");
			setAttribute(path_205, "data-name", "Path 211");
			setAttribute(path_205, "class", "cls-4");
			setAttribute(path_205, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_207, "id", "Path_3-103");
			setAttribute(g_207, "data-name", "Path 3");
			setAttribute(g_207, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_206, "id", "Group_112");
			setAttribute(g_206, "data-name", "Group 112");
			setAttribute(g_206, "transform", "translate(-124.723 -295.815)");
			setAttribute(path_206, "id", "Path_212");
			setAttribute(path_206, "data-name", "Path 212");
			setAttribute(path_206, "class", "cls-1");
			setAttribute(path_206, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_207, "id", "Path_213");
			setAttribute(path_207, "data-name", "Path 213");
			setAttribute(path_207, "class", "cls-4");
			setAttribute(path_207, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_209, "id", "Path_3-104");
			setAttribute(g_209, "data-name", "Path 3");
			setAttribute(g_209, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_208, "id", "Group_113");
			setAttribute(g_208, "data-name", "Group 113");
			setAttribute(g_208, "transform", "translate(-65.723 -295.815)");
			setAttribute(path_208, "id", "Path_214");
			setAttribute(path_208, "data-name", "Path 214");
			setAttribute(path_208, "class", "cls-1");
			setAttribute(path_208, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_209, "id", "Path_215");
			setAttribute(path_209, "data-name", "Path 215");
			setAttribute(path_209, "class", "cls-4");
			setAttribute(path_209, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_211, "id", "Path_3-105");
			setAttribute(g_211, "data-name", "Path 3");
			setAttribute(g_211, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_210, "id", "Group_114");
			setAttribute(g_210, "data-name", "Group 114");
			setAttribute(g_210, "transform", "translate(-6.723 -295.815)");
			setAttribute(path_210, "id", "Path_216");
			setAttribute(path_210, "data-name", "Path 216");
			setAttribute(path_210, "class", "cls-1");
			setAttribute(path_210, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_211, "id", "Path_217");
			setAttribute(path_211, "data-name", "Path 217");
			setAttribute(path_211, "class", "cls-4");
			setAttribute(path_211, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_213, "id", "Path_3-106");
			setAttribute(g_213, "data-name", "Path 3");
			setAttribute(g_213, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_212, "id", "Group_115");
			setAttribute(g_212, "data-name", "Group 115");
			setAttribute(g_212, "transform", "translate(52.277 -295.815)");
			setAttribute(path_212, "id", "Path_218");
			setAttribute(path_212, "data-name", "Path 218");
			setAttribute(path_212, "class", "cls-1");
			setAttribute(path_212, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_213, "id", "Path_219");
			setAttribute(path_213, "data-name", "Path 219");
			setAttribute(path_213, "class", "cls-4");
			setAttribute(path_213, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_215, "id", "Path_3-107");
			setAttribute(g_215, "data-name", "Path 3");
			setAttribute(g_215, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_214, "id", "Group_116");
			setAttribute(g_214, "data-name", "Group 116");
			setAttribute(g_214, "transform", "translate(111.277 -295.815)");
			setAttribute(path_214, "id", "Path_220");
			setAttribute(path_214, "data-name", "Path 220");
			setAttribute(path_214, "class", "cls-1");
			setAttribute(path_214, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_215, "id", "Path_221");
			setAttribute(path_215, "data-name", "Path 221");
			setAttribute(path_215, "class", "cls-4");
			setAttribute(path_215, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_217, "id", "Path_3-108");
			setAttribute(g_217, "data-name", "Path 3");
			setAttribute(g_217, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_216, "id", "Group_117");
			setAttribute(g_216, "data-name", "Group 117");
			setAttribute(g_216, "transform", "translate(170.277 -295.815)");
			setAttribute(path_216, "id", "Path_222");
			setAttribute(path_216, "data-name", "Path 222");
			setAttribute(path_216, "class", "cls-1");
			setAttribute(path_216, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_217, "id", "Path_223");
			setAttribute(path_217, "data-name", "Path 223");
			setAttribute(path_217, "class", "cls-4");
			setAttribute(path_217, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_219, "id", "Path_3-109");
			setAttribute(g_219, "data-name", "Path 3");
			setAttribute(g_219, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_218, "id", "Group_118");
			setAttribute(g_218, "data-name", "Group 118");
			setAttribute(g_218, "transform", "translate(229.277 -295.815)");
			setAttribute(path_218, "id", "Path_224");
			setAttribute(path_218, "data-name", "Path 224");
			setAttribute(path_218, "class", "cls-1");
			setAttribute(path_218, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_219, "id", "Path_225");
			setAttribute(path_219, "data-name", "Path 225");
			setAttribute(path_219, "class", "cls-4");
			setAttribute(path_219, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_221, "id", "Path_3-110");
			setAttribute(g_221, "data-name", "Path 3");
			setAttribute(g_221, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_220, "id", "Group_119");
			setAttribute(g_220, "data-name", "Group 119");
			setAttribute(g_220, "transform", "translate(288.277 -295.815)");
			setAttribute(path_220, "id", "Path_226");
			setAttribute(path_220, "data-name", "Path 226");
			setAttribute(path_220, "class", "cls-1");
			setAttribute(path_220, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_221, "id", "Path_227");
			setAttribute(path_221, "data-name", "Path 227");
			setAttribute(path_221, "class", "cls-4");
			setAttribute(path_221, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_223, "id", "Path_3-111");
			setAttribute(g_223, "data-name", "Path 3");
			setAttribute(g_223, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_222, "id", "Group_120");
			setAttribute(g_222, "data-name", "Group 120");
			setAttribute(g_222, "transform", "translate(347.277 -295.815)");
			setAttribute(path_222, "id", "Path_228");
			setAttribute(path_222, "data-name", "Path 228");
			setAttribute(path_222, "class", "cls-1");
			setAttribute(path_222, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_223, "id", "Path_229");
			setAttribute(path_223, "data-name", "Path 229");
			setAttribute(path_223, "class", "cls-4");
			setAttribute(path_223, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_225, "id", "Path_3-112");
			setAttribute(g_225, "data-name", "Path 3");
			setAttribute(g_225, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_224, "id", "Group_121");
			setAttribute(g_224, "data-name", "Group 121");
			setAttribute(g_224, "transform", "translate(406.277 -295.815)");
			setAttribute(path_224, "id", "Path_230");
			setAttribute(path_224, "data-name", "Path 230");
			setAttribute(path_224, "class", "cls-1");
			setAttribute(path_224, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_225, "id", "Path_231");
			setAttribute(path_225, "data-name", "Path 231");
			setAttribute(path_225, "class", "cls-4");
			setAttribute(path_225, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_227, "id", "Path_3-113");
			setAttribute(g_227, "data-name", "Path 3");
			setAttribute(g_227, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_226, "id", "Group_122");
			setAttribute(g_226, "data-name", "Group 122");
			setAttribute(g_226, "transform", "translate(465.277 -295.815)");
			setAttribute(path_226, "id", "Path_232");
			setAttribute(path_226, "data-name", "Path 232");
			setAttribute(path_226, "class", "cls-1");
			setAttribute(path_226, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_227, "id", "Path_233");
			setAttribute(path_227, "data-name", "Path 233");
			setAttribute(path_227, "class", "cls-4");
			setAttribute(path_227, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_229, "id", "Path_3-114");
			setAttribute(g_229, "data-name", "Path 3");
			setAttribute(g_229, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_228, "id", "Group_123");
			setAttribute(g_228, "data-name", "Group 123");
			setAttribute(g_228, "transform", "translate(524.277 -295.815)");
			setAttribute(path_228, "id", "Path_234");
			setAttribute(path_228, "data-name", "Path 234");
			setAttribute(path_228, "class", "cls-1");
			setAttribute(path_228, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_229, "id", "Path_235");
			setAttribute(path_229, "data-name", "Path 235");
			setAttribute(path_229, "class", "cls-4");
			setAttribute(path_229, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_231, "id", "Path_3-115");
			setAttribute(g_231, "data-name", "Path 3");
			setAttribute(g_231, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_230, "id", "Group_124");
			setAttribute(g_230, "data-name", "Group 124");
			setAttribute(g_230, "transform", "translate(583.277 -295.815)");
			setAttribute(path_230, "id", "Path_236");
			setAttribute(path_230, "data-name", "Path 236");
			setAttribute(path_230, "class", "cls-1");
			setAttribute(path_230, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_231, "id", "Path_237");
			setAttribute(path_231, "data-name", "Path 237");
			setAttribute(path_231, "class", "cls-4");
			setAttribute(path_231, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_233, "id", "Path_3-116");
			setAttribute(g_233, "data-name", "Path 3");
			setAttribute(g_233, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_232, "id", "Group_125");
			setAttribute(g_232, "data-name", "Group 125");
			setAttribute(g_232, "transform", "translate(642.277 -295.815)");
			setAttribute(path_232, "id", "Path_238");
			setAttribute(path_232, "data-name", "Path 238");
			setAttribute(path_232, "class", "cls-1");
			setAttribute(path_232, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_233, "id", "Path_239");
			setAttribute(path_233, "data-name", "Path 239");
			setAttribute(path_233, "class", "cls-4");
			setAttribute(path_233, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_235, "id", "Path_3-117");
			setAttribute(g_235, "data-name", "Path 3");
			setAttribute(g_235, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_234, "id", "Group_126");
			setAttribute(g_234, "data-name", "Group 126");
			setAttribute(g_234, "transform", "translate(701.277 -295.815)");
			setAttribute(path_234, "id", "Path_240");
			setAttribute(path_234, "data-name", "Path 240");
			setAttribute(path_234, "class", "cls-1");
			setAttribute(path_234, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_235, "id", "Path_241");
			setAttribute(path_235, "data-name", "Path 241");
			setAttribute(path_235, "class", "cls-4");
			setAttribute(path_235, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_237, "id", "Path_3-118");
			setAttribute(g_237, "data-name", "Path 3");
			setAttribute(g_237, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_236, "id", "Group_127");
			setAttribute(g_236, "data-name", "Group 127");
			setAttribute(g_236, "transform", "translate(760.277 -295.815)");
			setAttribute(path_236, "id", "Path_242");
			setAttribute(path_236, "data-name", "Path 242");
			setAttribute(path_236, "class", "cls-1");
			setAttribute(path_236, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_237, "id", "Path_243");
			setAttribute(path_237, "data-name", "Path 243");
			setAttribute(path_237, "class", "cls-4");
			setAttribute(path_237, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_239, "id", "Path_3-119");
			setAttribute(g_239, "data-name", "Path 3");
			setAttribute(g_239, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_238, "id", "Group_128");
			setAttribute(g_238, "data-name", "Group 128");
			setAttribute(g_238, "transform", "translate(819.277 -295.815)");
			setAttribute(path_238, "id", "Path_244");
			setAttribute(path_238, "data-name", "Path 244");
			setAttribute(path_238, "class", "cls-1");
			setAttribute(path_238, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_239, "id", "Path_245");
			setAttribute(path_239, "data-name", "Path 245");
			setAttribute(path_239, "class", "cls-4");
			setAttribute(path_239, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_241, "id", "Path_3-120");
			setAttribute(g_241, "data-name", "Path 3");
			setAttribute(g_241, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_240, "id", "Group_129");
			setAttribute(g_240, "data-name", "Group 129");
			setAttribute(g_240, "transform", "translate(-124.723 -241.815)");
			setAttribute(path_240, "id", "Path_246");
			setAttribute(path_240, "data-name", "Path 246");
			setAttribute(path_240, "class", "cls-1");
			setAttribute(path_240, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_241, "id", "Path_247");
			setAttribute(path_241, "data-name", "Path 247");
			setAttribute(path_241, "class", "cls-4");
			setAttribute(path_241, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_243, "id", "Path_3-121");
			setAttribute(g_243, "data-name", "Path 3");
			setAttribute(g_243, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_242, "id", "Group_130");
			setAttribute(g_242, "data-name", "Group 130");
			setAttribute(g_242, "transform", "translate(-65.723 -241.815)");
			setAttribute(path_242, "id", "Path_248");
			setAttribute(path_242, "data-name", "Path 248");
			setAttribute(path_242, "class", "cls-1");
			setAttribute(path_242, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_243, "id", "Path_249");
			setAttribute(path_243, "data-name", "Path 249");
			setAttribute(path_243, "class", "cls-4");
			setAttribute(path_243, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_245, "id", "Path_3-122");
			setAttribute(g_245, "data-name", "Path 3");
			setAttribute(g_245, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_244, "id", "Group_131");
			setAttribute(g_244, "data-name", "Group 131");
			setAttribute(g_244, "transform", "translate(-6.723 -241.815)");
			setAttribute(path_244, "id", "Path_250");
			setAttribute(path_244, "data-name", "Path 250");
			setAttribute(path_244, "class", "cls-1");
			setAttribute(path_244, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_245, "id", "Path_251");
			setAttribute(path_245, "data-name", "Path 251");
			setAttribute(path_245, "class", "cls-4");
			setAttribute(path_245, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_247, "id", "Path_3-123");
			setAttribute(g_247, "data-name", "Path 3");
			setAttribute(g_247, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_246, "id", "Group_132");
			setAttribute(g_246, "data-name", "Group 132");
			setAttribute(g_246, "transform", "translate(52.277 -241.815)");
			setAttribute(path_246, "id", "Path_252");
			setAttribute(path_246, "data-name", "Path 252");
			setAttribute(path_246, "class", "cls-1");
			setAttribute(path_246, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_247, "id", "Path_253");
			setAttribute(path_247, "data-name", "Path 253");
			setAttribute(path_247, "class", "cls-4");
			setAttribute(path_247, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_249, "id", "Path_3-124");
			setAttribute(g_249, "data-name", "Path 3");
			setAttribute(g_249, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_248, "id", "Group_133");
			setAttribute(g_248, "data-name", "Group 133");
			setAttribute(g_248, "transform", "translate(111.277 -241.815)");
			setAttribute(path_248, "id", "Path_254");
			setAttribute(path_248, "data-name", "Path 254");
			setAttribute(path_248, "class", "cls-1");
			setAttribute(path_248, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_249, "id", "Path_255");
			setAttribute(path_249, "data-name", "Path 255");
			setAttribute(path_249, "class", "cls-4");
			setAttribute(path_249, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_251, "id", "Path_3-125");
			setAttribute(g_251, "data-name", "Path 3");
			setAttribute(g_251, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_250, "id", "Group_134");
			setAttribute(g_250, "data-name", "Group 134");
			setAttribute(g_250, "transform", "translate(170.277 -241.815)");
			setAttribute(path_250, "id", "Path_256");
			setAttribute(path_250, "data-name", "Path 256");
			setAttribute(path_250, "class", "cls-1");
			setAttribute(path_250, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_251, "id", "Path_257");
			setAttribute(path_251, "data-name", "Path 257");
			setAttribute(path_251, "class", "cls-4");
			setAttribute(path_251, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_253, "id", "Path_3-126");
			setAttribute(g_253, "data-name", "Path 3");
			setAttribute(g_253, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_252, "id", "Group_135");
			setAttribute(g_252, "data-name", "Group 135");
			setAttribute(g_252, "transform", "translate(229.277 -241.815)");
			setAttribute(path_252, "id", "Path_258");
			setAttribute(path_252, "data-name", "Path 258");
			setAttribute(path_252, "class", "cls-1");
			setAttribute(path_252, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_253, "id", "Path_259");
			setAttribute(path_253, "data-name", "Path 259");
			setAttribute(path_253, "class", "cls-4");
			setAttribute(path_253, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_255, "id", "Path_3-127");
			setAttribute(g_255, "data-name", "Path 3");
			setAttribute(g_255, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_254, "id", "Group_136");
			setAttribute(g_254, "data-name", "Group 136");
			setAttribute(g_254, "transform", "translate(288.277 -241.815)");
			setAttribute(path_254, "id", "Path_260");
			setAttribute(path_254, "data-name", "Path 260");
			setAttribute(path_254, "class", "cls-1");
			setAttribute(path_254, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_255, "id", "Path_261");
			setAttribute(path_255, "data-name", "Path 261");
			setAttribute(path_255, "class", "cls-4");
			setAttribute(path_255, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_257, "id", "Path_3-128");
			setAttribute(g_257, "data-name", "Path 3");
			setAttribute(g_257, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_256, "id", "Group_137");
			setAttribute(g_256, "data-name", "Group 137");
			setAttribute(g_256, "transform", "translate(347.277 -241.815)");
			setAttribute(path_256, "id", "Path_262");
			setAttribute(path_256, "data-name", "Path 262");
			setAttribute(path_256, "class", "cls-1");
			setAttribute(path_256, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_257, "id", "Path_263");
			setAttribute(path_257, "data-name", "Path 263");
			setAttribute(path_257, "class", "cls-4");
			setAttribute(path_257, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_259, "id", "Path_3-129");
			setAttribute(g_259, "data-name", "Path 3");
			setAttribute(g_259, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_258, "id", "Group_138");
			setAttribute(g_258, "data-name", "Group 138");
			setAttribute(g_258, "transform", "translate(406.277 -241.815)");
			setAttribute(path_258, "id", "Path_264");
			setAttribute(path_258, "data-name", "Path 264");
			setAttribute(path_258, "class", "cls-1");
			setAttribute(path_258, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_259, "id", "Path_265");
			setAttribute(path_259, "data-name", "Path 265");
			setAttribute(path_259, "class", "cls-4");
			setAttribute(path_259, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_261, "id", "Path_3-130");
			setAttribute(g_261, "data-name", "Path 3");
			setAttribute(g_261, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_260, "id", "Group_139");
			setAttribute(g_260, "data-name", "Group 139");
			setAttribute(g_260, "transform", "translate(465.277 -241.815)");
			setAttribute(path_260, "id", "Path_266");
			setAttribute(path_260, "data-name", "Path 266");
			setAttribute(path_260, "class", "cls-1");
			setAttribute(path_260, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_261, "id", "Path_267");
			setAttribute(path_261, "data-name", "Path 267");
			setAttribute(path_261, "class", "cls-4");
			setAttribute(path_261, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_263, "id", "Path_3-131");
			setAttribute(g_263, "data-name", "Path 3");
			setAttribute(g_263, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_262, "id", "Group_140");
			setAttribute(g_262, "data-name", "Group 140");
			setAttribute(g_262, "transform", "translate(524.277 -241.815)");
			setAttribute(path_262, "id", "Path_268");
			setAttribute(path_262, "data-name", "Path 268");
			setAttribute(path_262, "class", "cls-1");
			setAttribute(path_262, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_263, "id", "Path_269");
			setAttribute(path_263, "data-name", "Path 269");
			setAttribute(path_263, "class", "cls-4");
			setAttribute(path_263, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_265, "id", "Path_3-132");
			setAttribute(g_265, "data-name", "Path 3");
			setAttribute(g_265, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_264, "id", "Group_141");
			setAttribute(g_264, "data-name", "Group 141");
			setAttribute(g_264, "transform", "translate(583.277 -241.815)");
			setAttribute(path_264, "id", "Path_270");
			setAttribute(path_264, "data-name", "Path 270");
			setAttribute(path_264, "class", "cls-1");
			setAttribute(path_264, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_265, "id", "Path_271");
			setAttribute(path_265, "data-name", "Path 271");
			setAttribute(path_265, "class", "cls-4");
			setAttribute(path_265, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_267, "id", "Path_3-133");
			setAttribute(g_267, "data-name", "Path 3");
			setAttribute(g_267, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_266, "id", "Group_142");
			setAttribute(g_266, "data-name", "Group 142");
			setAttribute(g_266, "transform", "translate(642.277 -241.815)");
			setAttribute(path_266, "id", "Path_272");
			setAttribute(path_266, "data-name", "Path 272");
			setAttribute(path_266, "class", "cls-1");
			setAttribute(path_266, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_267, "id", "Path_273");
			setAttribute(path_267, "data-name", "Path 273");
			setAttribute(path_267, "class", "cls-4");
			setAttribute(path_267, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_269, "id", "Path_3-134");
			setAttribute(g_269, "data-name", "Path 3");
			setAttribute(g_269, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_268, "id", "Group_143");
			setAttribute(g_268, "data-name", "Group 143");
			setAttribute(g_268, "transform", "translate(701.277 -241.815)");
			setAttribute(path_268, "id", "Path_274");
			setAttribute(path_268, "data-name", "Path 274");
			setAttribute(path_268, "class", "cls-1");
			setAttribute(path_268, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_269, "id", "Path_275");
			setAttribute(path_269, "data-name", "Path 275");
			setAttribute(path_269, "class", "cls-4");
			setAttribute(path_269, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_271, "id", "Path_3-135");
			setAttribute(g_271, "data-name", "Path 3");
			setAttribute(g_271, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_270, "id", "Group_144");
			setAttribute(g_270, "data-name", "Group 144");
			setAttribute(g_270, "transform", "translate(760.277 -241.815)");
			setAttribute(path_270, "id", "Path_276");
			setAttribute(path_270, "data-name", "Path 276");
			setAttribute(path_270, "class", "cls-1");
			setAttribute(path_270, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_271, "id", "Path_277");
			setAttribute(path_271, "data-name", "Path 277");
			setAttribute(path_271, "class", "cls-4");
			setAttribute(path_271, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_273, "id", "Path_3-136");
			setAttribute(g_273, "data-name", "Path 3");
			setAttribute(g_273, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_272, "id", "Group_145");
			setAttribute(g_272, "data-name", "Group 145");
			setAttribute(g_272, "transform", "translate(819.277 -241.815)");
			setAttribute(path_272, "id", "Path_278");
			setAttribute(path_272, "data-name", "Path 278");
			setAttribute(path_272, "class", "cls-1");
			setAttribute(path_272, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_273, "id", "Path_279");
			setAttribute(path_273, "data-name", "Path 279");
			setAttribute(path_273, "class", "cls-4");
			setAttribute(path_273, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_275, "id", "Path_3-137");
			setAttribute(g_275, "data-name", "Path 3");
			setAttribute(g_275, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_274, "id", "Group_146");
			setAttribute(g_274, "data-name", "Group 146");
			setAttribute(g_274, "transform", "translate(-124.723 -187.815)");
			setAttribute(path_274, "id", "Path_280");
			setAttribute(path_274, "data-name", "Path 280");
			setAttribute(path_274, "class", "cls-1");
			setAttribute(path_274, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_275, "id", "Path_281");
			setAttribute(path_275, "data-name", "Path 281");
			setAttribute(path_275, "class", "cls-4");
			setAttribute(path_275, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_277, "id", "Path_3-138");
			setAttribute(g_277, "data-name", "Path 3");
			setAttribute(g_277, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_276, "id", "Group_147");
			setAttribute(g_276, "data-name", "Group 147");
			setAttribute(g_276, "transform", "translate(-65.723 -187.815)");
			setAttribute(path_276, "id", "Path_282");
			setAttribute(path_276, "data-name", "Path 282");
			setAttribute(path_276, "class", "cls-1");
			setAttribute(path_276, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_277, "id", "Path_283");
			setAttribute(path_277, "data-name", "Path 283");
			setAttribute(path_277, "class", "cls-4");
			setAttribute(path_277, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_279, "id", "Path_3-139");
			setAttribute(g_279, "data-name", "Path 3");
			setAttribute(g_279, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_278, "id", "Group_148");
			setAttribute(g_278, "data-name", "Group 148");
			setAttribute(g_278, "transform", "translate(-6.723 -187.815)");
			setAttribute(path_278, "id", "Path_284");
			setAttribute(path_278, "data-name", "Path 284");
			setAttribute(path_278, "class", "cls-1");
			setAttribute(path_278, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_279, "id", "Path_285");
			setAttribute(path_279, "data-name", "Path 285");
			setAttribute(path_279, "class", "cls-4");
			setAttribute(path_279, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_281, "id", "Path_3-140");
			setAttribute(g_281, "data-name", "Path 3");
			setAttribute(g_281, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_280, "id", "Group_149");
			setAttribute(g_280, "data-name", "Group 149");
			setAttribute(g_280, "transform", "translate(52.277 -187.815)");
			setAttribute(path_280, "id", "Path_286");
			setAttribute(path_280, "data-name", "Path 286");
			setAttribute(path_280, "class", "cls-1");
			setAttribute(path_280, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_281, "id", "Path_287");
			setAttribute(path_281, "data-name", "Path 287");
			setAttribute(path_281, "class", "cls-4");
			setAttribute(path_281, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_283, "id", "Path_3-141");
			setAttribute(g_283, "data-name", "Path 3");
			setAttribute(g_283, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_282, "id", "Group_150");
			setAttribute(g_282, "data-name", "Group 150");
			setAttribute(g_282, "transform", "translate(111.277 -187.815)");
			setAttribute(path_282, "id", "Path_288");
			setAttribute(path_282, "data-name", "Path 288");
			setAttribute(path_282, "class", "cls-1");
			setAttribute(path_282, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_283, "id", "Path_289");
			setAttribute(path_283, "data-name", "Path 289");
			setAttribute(path_283, "class", "cls-4");
			setAttribute(path_283, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_285, "id", "Path_3-142");
			setAttribute(g_285, "data-name", "Path 3");
			setAttribute(g_285, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_284, "id", "Group_151");
			setAttribute(g_284, "data-name", "Group 151");
			setAttribute(g_284, "transform", "translate(170.277 -187.815)");
			setAttribute(path_284, "id", "Path_290");
			setAttribute(path_284, "data-name", "Path 290");
			setAttribute(path_284, "class", "cls-1");
			setAttribute(path_284, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_285, "id", "Path_291");
			setAttribute(path_285, "data-name", "Path 291");
			setAttribute(path_285, "class", "cls-4");
			setAttribute(path_285, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_287, "id", "Path_3-143");
			setAttribute(g_287, "data-name", "Path 3");
			setAttribute(g_287, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_286, "id", "Group_152");
			setAttribute(g_286, "data-name", "Group 152");
			setAttribute(g_286, "transform", "translate(229.277 -187.815)");
			setAttribute(path_286, "id", "Path_292");
			setAttribute(path_286, "data-name", "Path 292");
			setAttribute(path_286, "class", "cls-1");
			setAttribute(path_286, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_287, "id", "Path_293");
			setAttribute(path_287, "data-name", "Path 293");
			setAttribute(path_287, "class", "cls-4");
			setAttribute(path_287, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_289, "id", "Path_3-144");
			setAttribute(g_289, "data-name", "Path 3");
			setAttribute(g_289, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_288, "id", "Group_153");
			setAttribute(g_288, "data-name", "Group 153");
			setAttribute(g_288, "transform", "translate(288.277 -187.815)");
			setAttribute(path_288, "id", "Path_294");
			setAttribute(path_288, "data-name", "Path 294");
			setAttribute(path_288, "class", "cls-1");
			setAttribute(path_288, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_289, "id", "Path_295");
			setAttribute(path_289, "data-name", "Path 295");
			setAttribute(path_289, "class", "cls-4");
			setAttribute(path_289, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_291, "id", "Path_3-145");
			setAttribute(g_291, "data-name", "Path 3");
			setAttribute(g_291, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_290, "id", "Group_154");
			setAttribute(g_290, "data-name", "Group 154");
			setAttribute(g_290, "transform", "translate(347.277 -187.815)");
			setAttribute(path_290, "id", "Path_296");
			setAttribute(path_290, "data-name", "Path 296");
			setAttribute(path_290, "class", "cls-1");
			setAttribute(path_290, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_291, "id", "Path_297");
			setAttribute(path_291, "data-name", "Path 297");
			setAttribute(path_291, "class", "cls-4");
			setAttribute(path_291, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_293, "id", "Path_3-146");
			setAttribute(g_293, "data-name", "Path 3");
			setAttribute(g_293, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_292, "id", "Group_155");
			setAttribute(g_292, "data-name", "Group 155");
			setAttribute(g_292, "transform", "translate(406.277 -187.815)");
			setAttribute(path_292, "id", "Path_298");
			setAttribute(path_292, "data-name", "Path 298");
			setAttribute(path_292, "class", "cls-1");
			setAttribute(path_292, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_293, "id", "Path_299");
			setAttribute(path_293, "data-name", "Path 299");
			setAttribute(path_293, "class", "cls-4");
			setAttribute(path_293, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_295, "id", "Path_3-147");
			setAttribute(g_295, "data-name", "Path 3");
			setAttribute(g_295, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_294, "id", "Group_156");
			setAttribute(g_294, "data-name", "Group 156");
			setAttribute(g_294, "transform", "translate(465.277 -187.815)");
			setAttribute(path_294, "id", "Path_300");
			setAttribute(path_294, "data-name", "Path 300");
			setAttribute(path_294, "class", "cls-1");
			setAttribute(path_294, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_295, "id", "Path_301");
			setAttribute(path_295, "data-name", "Path 301");
			setAttribute(path_295, "class", "cls-4");
			setAttribute(path_295, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_297, "id", "Path_3-148");
			setAttribute(g_297, "data-name", "Path 3");
			setAttribute(g_297, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_296, "id", "Group_157");
			setAttribute(g_296, "data-name", "Group 157");
			setAttribute(g_296, "transform", "translate(524.277 -187.815)");
			setAttribute(path_296, "id", "Path_302");
			setAttribute(path_296, "data-name", "Path 302");
			setAttribute(path_296, "class", "cls-1");
			setAttribute(path_296, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_297, "id", "Path_303");
			setAttribute(path_297, "data-name", "Path 303");
			setAttribute(path_297, "class", "cls-4");
			setAttribute(path_297, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_299, "id", "Path_3-149");
			setAttribute(g_299, "data-name", "Path 3");
			setAttribute(g_299, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_298, "id", "Group_158");
			setAttribute(g_298, "data-name", "Group 158");
			setAttribute(g_298, "transform", "translate(583.277 -187.815)");
			setAttribute(path_298, "id", "Path_304");
			setAttribute(path_298, "data-name", "Path 304");
			setAttribute(path_298, "class", "cls-1");
			setAttribute(path_298, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_299, "id", "Path_305");
			setAttribute(path_299, "data-name", "Path 305");
			setAttribute(path_299, "class", "cls-4");
			setAttribute(path_299, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_301, "id", "Path_3-150");
			setAttribute(g_301, "data-name", "Path 3");
			setAttribute(g_301, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_300, "id", "Group_159");
			setAttribute(g_300, "data-name", "Group 159");
			setAttribute(g_300, "transform", "translate(642.277 -187.815)");
			setAttribute(path_300, "id", "Path_306");
			setAttribute(path_300, "data-name", "Path 306");
			setAttribute(path_300, "class", "cls-1");
			setAttribute(path_300, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_301, "id", "Path_307");
			setAttribute(path_301, "data-name", "Path 307");
			setAttribute(path_301, "class", "cls-4");
			setAttribute(path_301, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_303, "id", "Path_3-151");
			setAttribute(g_303, "data-name", "Path 3");
			setAttribute(g_303, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_302, "id", "Group_160");
			setAttribute(g_302, "data-name", "Group 160");
			setAttribute(g_302, "transform", "translate(701.277 -187.815)");
			setAttribute(path_302, "id", "Path_308");
			setAttribute(path_302, "data-name", "Path 308");
			setAttribute(path_302, "class", "cls-1");
			setAttribute(path_302, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_303, "id", "Path_309");
			setAttribute(path_303, "data-name", "Path 309");
			setAttribute(path_303, "class", "cls-4");
			setAttribute(path_303, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_305, "id", "Path_3-152");
			setAttribute(g_305, "data-name", "Path 3");
			setAttribute(g_305, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_304, "id", "Group_161");
			setAttribute(g_304, "data-name", "Group 161");
			setAttribute(g_304, "transform", "translate(760.277 -187.815)");
			setAttribute(path_304, "id", "Path_310");
			setAttribute(path_304, "data-name", "Path 310");
			setAttribute(path_304, "class", "cls-1");
			setAttribute(path_304, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_305, "id", "Path_311");
			setAttribute(path_305, "data-name", "Path 311");
			setAttribute(path_305, "class", "cls-4");
			setAttribute(path_305, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_307, "id", "Path_3-153");
			setAttribute(g_307, "data-name", "Path 3");
			setAttribute(g_307, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_306, "id", "Group_162");
			setAttribute(g_306, "data-name", "Group 162");
			setAttribute(g_306, "transform", "translate(819.277 -187.815)");
			setAttribute(path_306, "id", "Path_312");
			setAttribute(path_306, "data-name", "Path 312");
			setAttribute(path_306, "class", "cls-1");
			setAttribute(path_306, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_307, "id", "Path_313");
			setAttribute(path_307, "data-name", "Path 313");
			setAttribute(path_307, "class", "cls-4");
			setAttribute(path_307, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_309, "id", "Path_3-154");
			setAttribute(g_309, "data-name", "Path 3");
			setAttribute(g_309, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_308, "id", "Group_163");
			setAttribute(g_308, "data-name", "Group 163");
			setAttribute(g_308, "transform", "translate(-124.723 -133.815)");
			setAttribute(path_308, "id", "Path_314");
			setAttribute(path_308, "data-name", "Path 314");
			setAttribute(path_308, "class", "cls-1");
			setAttribute(path_308, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_309, "id", "Path_315");
			setAttribute(path_309, "data-name", "Path 315");
			setAttribute(path_309, "class", "cls-4");
			setAttribute(path_309, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_311, "id", "Path_3-155");
			setAttribute(g_311, "data-name", "Path 3");
			setAttribute(g_311, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_310, "id", "Group_164");
			setAttribute(g_310, "data-name", "Group 164");
			setAttribute(g_310, "transform", "translate(-65.723 -133.815)");
			setAttribute(path_310, "id", "Path_316");
			setAttribute(path_310, "data-name", "Path 316");
			setAttribute(path_310, "class", "cls-1");
			setAttribute(path_310, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_311, "id", "Path_317");
			setAttribute(path_311, "data-name", "Path 317");
			setAttribute(path_311, "class", "cls-4");
			setAttribute(path_311, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_313, "id", "Path_3-156");
			setAttribute(g_313, "data-name", "Path 3");
			setAttribute(g_313, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_312, "id", "Group_165");
			setAttribute(g_312, "data-name", "Group 165");
			setAttribute(g_312, "transform", "translate(-6.723 -133.815)");
			setAttribute(path_312, "id", "Path_318");
			setAttribute(path_312, "data-name", "Path 318");
			setAttribute(path_312, "class", "cls-1");
			setAttribute(path_312, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_313, "id", "Path_319");
			setAttribute(path_313, "data-name", "Path 319");
			setAttribute(path_313, "class", "cls-4");
			setAttribute(path_313, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_315, "id", "Path_3-157");
			setAttribute(g_315, "data-name", "Path 3");
			setAttribute(g_315, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_314, "id", "Group_166");
			setAttribute(g_314, "data-name", "Group 166");
			setAttribute(g_314, "transform", "translate(52.277 -133.815)");
			setAttribute(path_314, "id", "Path_320");
			setAttribute(path_314, "data-name", "Path 320");
			setAttribute(path_314, "class", "cls-1");
			setAttribute(path_314, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_315, "id", "Path_321");
			setAttribute(path_315, "data-name", "Path 321");
			setAttribute(path_315, "class", "cls-4");
			setAttribute(path_315, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_317, "id", "Path_3-158");
			setAttribute(g_317, "data-name", "Path 3");
			setAttribute(g_317, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_316, "id", "Group_167");
			setAttribute(g_316, "data-name", "Group 167");
			setAttribute(g_316, "transform", "translate(111.277 -133.815)");
			setAttribute(path_316, "id", "Path_322");
			setAttribute(path_316, "data-name", "Path 322");
			setAttribute(path_316, "class", "cls-1");
			setAttribute(path_316, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_317, "id", "Path_323");
			setAttribute(path_317, "data-name", "Path 323");
			setAttribute(path_317, "class", "cls-4");
			setAttribute(path_317, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_319, "id", "Path_3-159");
			setAttribute(g_319, "data-name", "Path 3");
			setAttribute(g_319, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_318, "id", "Group_168");
			setAttribute(g_318, "data-name", "Group 168");
			setAttribute(g_318, "transform", "translate(170.277 -133.815)");
			setAttribute(path_318, "id", "Path_324");
			setAttribute(path_318, "data-name", "Path 324");
			setAttribute(path_318, "class", "cls-1");
			setAttribute(path_318, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_319, "id", "Path_325");
			setAttribute(path_319, "data-name", "Path 325");
			setAttribute(path_319, "class", "cls-4");
			setAttribute(path_319, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_321, "id", "Path_3-160");
			setAttribute(g_321, "data-name", "Path 3");
			setAttribute(g_321, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_320, "id", "Group_169");
			setAttribute(g_320, "data-name", "Group 169");
			setAttribute(g_320, "transform", "translate(229.277 -133.815)");
			setAttribute(path_320, "id", "Path_326");
			setAttribute(path_320, "data-name", "Path 326");
			setAttribute(path_320, "class", "cls-1");
			setAttribute(path_320, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_321, "id", "Path_327");
			setAttribute(path_321, "data-name", "Path 327");
			setAttribute(path_321, "class", "cls-4");
			setAttribute(path_321, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_323, "id", "Path_3-161");
			setAttribute(g_323, "data-name", "Path 3");
			setAttribute(g_323, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_322, "id", "Group_170");
			setAttribute(g_322, "data-name", "Group 170");
			setAttribute(g_322, "transform", "translate(288.277 -133.815)");
			setAttribute(path_322, "id", "Path_328");
			setAttribute(path_322, "data-name", "Path 328");
			setAttribute(path_322, "class", "cls-1");
			setAttribute(path_322, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_323, "id", "Path_329");
			setAttribute(path_323, "data-name", "Path 329");
			setAttribute(path_323, "class", "cls-4");
			setAttribute(path_323, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_325, "id", "Path_3-162");
			setAttribute(g_325, "data-name", "Path 3");
			setAttribute(g_325, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_324, "id", "Group_171");
			setAttribute(g_324, "data-name", "Group 171");
			setAttribute(g_324, "transform", "translate(347.277 -133.815)");
			setAttribute(path_324, "id", "Path_330");
			setAttribute(path_324, "data-name", "Path 330");
			setAttribute(path_324, "class", "cls-1");
			setAttribute(path_324, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_325, "id", "Path_331");
			setAttribute(path_325, "data-name", "Path 331");
			setAttribute(path_325, "class", "cls-4");
			setAttribute(path_325, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_327, "id", "Path_3-163");
			setAttribute(g_327, "data-name", "Path 3");
			setAttribute(g_327, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_326, "id", "Group_172");
			setAttribute(g_326, "data-name", "Group 172");
			setAttribute(g_326, "transform", "translate(406.277 -133.815)");
			setAttribute(path_326, "id", "Path_332");
			setAttribute(path_326, "data-name", "Path 332");
			setAttribute(path_326, "class", "cls-1");
			setAttribute(path_326, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_327, "id", "Path_333");
			setAttribute(path_327, "data-name", "Path 333");
			setAttribute(path_327, "class", "cls-4");
			setAttribute(path_327, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_329, "id", "Path_3-164");
			setAttribute(g_329, "data-name", "Path 3");
			setAttribute(g_329, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_328, "id", "Group_173");
			setAttribute(g_328, "data-name", "Group 173");
			setAttribute(g_328, "transform", "translate(465.277 -133.815)");
			setAttribute(path_328, "id", "Path_334");
			setAttribute(path_328, "data-name", "Path 334");
			setAttribute(path_328, "class", "cls-1");
			setAttribute(path_328, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_329, "id", "Path_335");
			setAttribute(path_329, "data-name", "Path 335");
			setAttribute(path_329, "class", "cls-4");
			setAttribute(path_329, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_331, "id", "Path_3-165");
			setAttribute(g_331, "data-name", "Path 3");
			setAttribute(g_331, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_330, "id", "Group_174");
			setAttribute(g_330, "data-name", "Group 174");
			setAttribute(g_330, "transform", "translate(524.277 -133.815)");
			setAttribute(path_330, "id", "Path_336");
			setAttribute(path_330, "data-name", "Path 336");
			setAttribute(path_330, "class", "cls-1");
			setAttribute(path_330, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_331, "id", "Path_337");
			setAttribute(path_331, "data-name", "Path 337");
			setAttribute(path_331, "class", "cls-4");
			setAttribute(path_331, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_333, "id", "Path_3-166");
			setAttribute(g_333, "data-name", "Path 3");
			setAttribute(g_333, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_332, "id", "Group_175");
			setAttribute(g_332, "data-name", "Group 175");
			setAttribute(g_332, "transform", "translate(583.277 -133.815)");
			setAttribute(path_332, "id", "Path_338");
			setAttribute(path_332, "data-name", "Path 338");
			setAttribute(path_332, "class", "cls-1");
			setAttribute(path_332, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_333, "id", "Path_339");
			setAttribute(path_333, "data-name", "Path 339");
			setAttribute(path_333, "class", "cls-4");
			setAttribute(path_333, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_335, "id", "Path_3-167");
			setAttribute(g_335, "data-name", "Path 3");
			setAttribute(g_335, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_334, "id", "Group_176");
			setAttribute(g_334, "data-name", "Group 176");
			setAttribute(g_334, "transform", "translate(642.277 -133.815)");
			setAttribute(path_334, "id", "Path_340");
			setAttribute(path_334, "data-name", "Path 340");
			setAttribute(path_334, "class", "cls-1");
			setAttribute(path_334, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_335, "id", "Path_341");
			setAttribute(path_335, "data-name", "Path 341");
			setAttribute(path_335, "class", "cls-4");
			setAttribute(path_335, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_337, "id", "Path_3-168");
			setAttribute(g_337, "data-name", "Path 3");
			setAttribute(g_337, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_336, "id", "Group_177");
			setAttribute(g_336, "data-name", "Group 177");
			setAttribute(g_336, "transform", "translate(701.277 -133.815)");
			setAttribute(path_336, "id", "Path_342");
			setAttribute(path_336, "data-name", "Path 342");
			setAttribute(path_336, "class", "cls-1");
			setAttribute(path_336, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_337, "id", "Path_343");
			setAttribute(path_337, "data-name", "Path 343");
			setAttribute(path_337, "class", "cls-4");
			setAttribute(path_337, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_339, "id", "Path_3-169");
			setAttribute(g_339, "data-name", "Path 3");
			setAttribute(g_339, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_338, "id", "Group_178");
			setAttribute(g_338, "data-name", "Group 178");
			setAttribute(g_338, "transform", "translate(760.277 -133.815)");
			setAttribute(path_338, "id", "Path_344");
			setAttribute(path_338, "data-name", "Path 344");
			setAttribute(path_338, "class", "cls-1");
			setAttribute(path_338, "d", "M10.145,19.587c-.329.028-.589.034-.747.034a9.4,9.4,0,0,1-9.4-9.4V0C3.147-.046,10.914.639,15.2,6.6a9.4,9.4,0,0,1,1.1,8.951h0a5.835,5.835,0,0,1-2.911,3.184,7.679,7.679,0,0,1-.93.388c1.367-5.238-.42-12.824-8.365-16.47C8.914,5.639,12.725,13.168,10.145,19.587Z");
			setAttribute(path_339, "id", "Path_345");
			setAttribute(path_339, "data-name", "Path 345");
			setAttribute(path_339, "class", "cls-4");
			setAttribute(path_339, "d", "M9.378,19.621H9.4c.158,0,.419-.006.747-.034,2.58-6.418-1.231-13.948-6.057-16.94,7.945,3.646,9.733,11.232,8.365,16.47a7.679,7.679,0,0,0,.93-.388,5.835,5.835,0,0,0,2.911-3.184l0,0A9.4,9.4,0,0,0,15.2,6.6C11.042.818,3.61,0,.3,0L0,0V10.223a9.4,9.4,0,0,0,9.378,9.4m1.636,1.051.472-1.807q.115-.441.2-.895a12.28,12.28,0,0,1-.608,1.99l-.23.571-.614.052c-.367.031-.655.038-.832.038h-.02A10.4,10.4,0,0,1-1,10.223V-.983L-.015-1,.3-1A24.39,24.39,0,0,1,7.746.182a16.132,16.132,0,0,1,8.264,5.831,10.4,10.4,0,0,1,1.217,9.9l-.561,1.41-.107-.107a6.809,6.809,0,0,1-2.735,2.406,8.722,8.722,0,0,1-1.045.435Z");
			setAttribute(g_341, "id", "Path_3-170");
			setAttribute(g_341, "data-name", "Path 3");
			setAttribute(g_341, "transform", "translate(124.723 636.777) rotate(-90)");
			setAttribute(g_340, "id", "Group_179");
			setAttribute(g_340, "data-name", "Group 179");
			setAttribute(g_340, "transform", "translate(819.277 -133.815)");
			setAttribute(g_1, "id", "Repeat_Grid_1");
			setAttribute(g_1, "data-name", "Repeat Grid 1");
			setAttribute(g_1, "class", "cls-3");
			setAttribute(g_1, "transform", "translate(125.277 147)");
			setAttribute(path_340, "id", "Path_1");
			setAttribute(path_340, "data-name", "Path 1");
			setAttribute(path_340, "class", "cls-5");
			setAttribute(path_340, "d", "M20.157,38.917c-.653.055-1.171.068-1.485.068A18.67,18.67,0,0,1,0,20.309V0C6.253-.1,21.685,1.266,30.2,13.1a18.686,18.686,0,0,1,2.184,17.786l-.006-.006a11.594,11.594,0,0,1-5.785,6.327,15.258,15.258,0,0,1-1.848.77c2.716-10.4-.836-25.477-16.622-32.718C17.712,11.2,25.283,26.165,20.157,38.917Z");
			setAttribute(path_341, "id", "Path_2");
			setAttribute(path_341, "data-name", "Path 2");
			setAttribute(path_341, "class", "cls-5");
			setAttribute(path_341, "d", "M169.95,14.7a6.31,6.31,0,0,0-5.236,2.446V15.135H161.07V38.829h3.647V29.875a6.368,6.368,0,0,0,5.233,2.415c4.673,0,8.354-3.666,8.354-8.779s-3.681-8.81-8.354-8.81Zm-.437,3.462c3.142,0,5.042,2.412,5.042,5.347s-1.9,5.35-5.042,5.35a5.012,5.012,0,0,1-5.039-5.35,5.011,5.011,0,0,1,5.039-5.349ZM189.942,14.7c-4.922,0-8.323,3.579-8.323,8.81,0,5.292,3.524,8.779,8.548,8.779a10.05,10.05,0,0,0,6.872-2.353l-1.814-2.587A7.969,7.969,0,0,1,190.4,29.1a4.715,4.715,0,0,1-4.972-4.245h12.349a11.3,11.3,0,0,0,.071-1.368c0-5.206-3.247-8.779-7.9-8.779Zm-.071,3.259c2.319,0,3.838,1.509,4.238,4.128h-8.671C185.808,19.644,187.271,17.959,189.871,17.959ZM209.477,14.7c-4.919,0-8.32,3.579-8.32,8.81,0,5.292,3.521,8.779,8.545,8.779a10.05,10.05,0,0,0,6.872-2.353l-1.811-2.587a7.968,7.968,0,0,1-4.836,1.747,4.714,4.714,0,0,1-4.969-4.245H217.31a11.992,11.992,0,0,0,.068-1.368c0-5.206-3.244-8.779-7.9-8.779Zm-.071,3.259c2.319,0,3.838,1.509,4.238,4.128h-8.668c.367-2.445,1.83-4.13,4.43-4.13ZM230.355,14.7a5.577,5.577,0,0,0-4.848,2.329V15.135H221.9v16.72h3.644V22.667c0-2.849,1.657-4.479,3.977-4.479a6.368,6.368,0,0,1,2.772.613l.875-3.6a6.938,6.938,0,0,0-2.809-.5Zm13.415,0a8.456,8.456,0,0,0-8.794,8.81,8.426,8.426,0,0,0,8.791,8.779,8.012,8.012,0,0,0,6.244-2.671l-2.249-2.5a6.125,6.125,0,0,1-4.1,1.743c-2.809,0-4.938-2.209-4.938-5.35,0-3.167,2.128-5.347,4.938-5.347a5.6,5.6,0,0,1,4.011,1.716l2.341-2.5a8.041,8.041,0,0,0-6.247-2.674Zm17.758,0a8.692,8.692,0,0,0-8.985,8.81,8.995,8.995,0,1,0,8.982-8.81h0Zm0,3.462a5.12,5.12,0,0,1,5.249,5.347,5.242,5.242,0,1,1-10.483,0,5.106,5.106,0,0,1,5.231-5.347Zm17.179,13.695V15.132h-3.662V31.855h3.662ZM276.858,6.794a2.516,2.516,0,0,0-2.547,2.587,2.467,2.467,0,0,0,2.407,2.526h.141a2.5,2.5,0,0,0,2.581-2.526,2.557,2.557,0,0,0-2.526-2.587Zm16.326,7.9a5.937,5.937,0,0,0-5.126,2.5V15.135H284.43v16.72h3.662V22.608a4.138,4.138,0,0,1,4.325-4.42c2.461,0,3.89,1.571,3.89,4.362v9.3h3.666V21.358a6.457,6.457,0,0,0-6.789-6.657Z");
			setAttribute(path_341, "transform", "translate(-111.456 -4.701)");
			setAttribute(g_342, "id", "Group_2");
			setAttribute(g_342, "data-name", "Group 2");
			setAttribute(g_342, "transform", "translate(505.554 390.766)");
			setAttribute(rect_2, "id", "Rectangle_3");
			setAttribute(rect_2, "data-name", "Rectangle 3");
			setAttribute(rect_2, "class", "cls-6");
			setAttribute(rect_2, "width", "4");
			setAttribute(rect_2, "height", "507");
			setAttribute(rect_2, "transform", "translate(437.554 147)");
			setAttribute(rect_3, "id", "Rectangle_2");
			setAttribute(rect_3, "data-name", "Rectangle 2");
			setAttribute(rect_3, "class", "cls-5");
			setAttribute(rect_3, "width", "209");
			setAttribute(rect_3, "height", "209");
			setAttribute(rect_3, "rx", "10");
			setAttribute(rect_3, "transform", "translate(157 297)");
			setAttribute(path_342, "id", "Path_1-2");
			setAttribute(path_342, "data-name", "Path 1");
			setAttribute(path_342, "class", "cls-5");
			setAttribute(path_342, "d", "M12.682,24.484c-.411.035-.736.043-.934.043A11.745,11.745,0,0,1,0,12.779V0C3.934-.06,13.643.8,19,8.244a11.756,11.756,0,0,1,1.374,11.19h0a7.294,7.294,0,0,1-3.639,3.981,9.6,9.6,0,0,1-1.163.484c1.7-6.55-.53-16.032-10.462-20.59C11.143,7.049,15.907,16.461,12.682,24.484Z");
			setAttribute(path_343, "id", "Path_2-2");
			setAttribute(path_343, "data-name", "Path 2");
			setAttribute(path_343, "class", "cls-5");
			setAttribute(path_343, "d", "M166.657,11.767a3.97,3.97,0,0,0-3.294,1.539V12.042H161.07V26.948h2.295V21.315a4.006,4.006,0,0,0,3.293,1.519,5.269,5.269,0,0,0,5.256-5.523,5.284,5.284,0,0,0-5.256-5.542Zm-.275,2.178a3.142,3.142,0,0,1,3.172,3.364,3.177,3.177,0,1,1-6.343,0,3.152,3.152,0,0,1,3.171-3.364Zm12.852-2.178c-3.1,0-5.236,2.252-5.236,5.542a5.177,5.177,0,0,0,5.378,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.141-1.628a5.014,5.014,0,0,1-3.039,1.1,2.966,2.966,0,0,1-3.128-2.67h7.769a7.109,7.109,0,0,0,.045-.86c0-3.275-2.043-5.523-4.973-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6H176.4a2.716,2.716,0,0,1,2.789-2.6Zm12.335-2.05c-3.1,0-5.234,2.252-5.234,5.542a5.176,5.176,0,0,0,5.376,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.14-1.628a5.013,5.013,0,0,1-3.043,1.1,2.966,2.966,0,0,1-3.126-2.67h7.771a7.544,7.544,0,0,0,.043-.86c0-3.275-2.041-5.523-4.971-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6h-5.453a2.713,2.713,0,0,1,2.787-2.6Zm13.18-2.05a3.509,3.509,0,0,0-3.05,1.465v-1.19h-2.271V22.561h2.293V16.78c0-1.793,1.043-2.818,2.5-2.818a4.007,4.007,0,0,1,1.744.386l.55-2.267a4.365,4.365,0,0,0-1.767-.312Zm8.44,0a5.32,5.32,0,0,0-5.533,5.542,5.3,5.3,0,0,0,5.531,5.523,5.041,5.041,0,0,0,3.928-1.68l-1.415-1.574a3.854,3.854,0,0,1-2.579,1.1,3.142,3.142,0,0,1-3.107-3.366,3.131,3.131,0,0,1,3.107-3.364,3.52,3.52,0,0,1,2.523,1.079l1.473-1.574a5.059,5.059,0,0,0-3.93-1.682Zm11.172,0a5.534,5.534,0,1,0,5.663,5.542,5.468,5.468,0,0,0-5.663-5.542Zm0,2.178a3.221,3.221,0,0,1,3.3,3.364,3.3,3.3,0,1,1-6.6,0,3.212,3.212,0,0,1,3.291-3.364Zm10.808,8.616V12.04h-2.3V22.561ZM233.917,6.794a1.583,1.583,0,0,0-1.6,1.628,1.552,1.552,0,0,0,1.514,1.589h.089a1.575,1.575,0,0,0,1.624-1.589,1.609,1.609,0,0,0-1.589-1.628Zm10.271,4.973a3.735,3.735,0,0,0-3.225,1.574v-1.3H238.68v10.52h2.3V16.743a2.6,2.6,0,0,1,2.721-2.781c1.548,0,2.448.988,2.448,2.744v5.853h2.306v-6.6a4.062,4.062,0,0,0-4.271-4.188Z");
			setAttribute(path_343, "transform", "translate(-129.856 -5.478)");
			setAttribute(g_343, "id", "Group_1");
			setAttribute(g_343, "data-name", "Group 1");
			setAttribute(g_343, "transform", "translate(201.554 241)");
			setAttribute(path_344, "id", "Path_1-3");
			setAttribute(path_344, "data-name", "Path 1");
			setAttribute(path_344, "class", "cls-5");
			setAttribute(path_344, "d", "M12.682,24.484c-.411.035-.736.043-.934.043A11.745,11.745,0,0,1,0,12.779V0C3.934-.06,13.643.8,19,8.244a11.756,11.756,0,0,1,1.374,11.19h0a7.294,7.294,0,0,1-3.639,3.981,9.6,9.6,0,0,1-1.163.484c1.7-6.55-.53-16.032-10.462-20.59C11.143,7.049,15.907,16.461,12.682,24.484Z");
			setAttribute(path_345, "id", "Path_2-3");
			setAttribute(path_345, "data-name", "Path 2");
			setAttribute(path_345, "class", "cls-5");
			setAttribute(path_345, "d", "M166.657,11.767a3.97,3.97,0,0,0-3.294,1.539V12.042H161.07V26.948h2.295V21.315a4.006,4.006,0,0,0,3.293,1.519,5.269,5.269,0,0,0,5.256-5.523,5.284,5.284,0,0,0-5.256-5.542Zm-.275,2.178a3.142,3.142,0,0,1,3.172,3.364,3.177,3.177,0,1,1-6.343,0,3.152,3.152,0,0,1,3.171-3.364Zm12.852-2.178c-3.1,0-5.236,2.252-5.236,5.542a5.177,5.177,0,0,0,5.378,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.141-1.628a5.014,5.014,0,0,1-3.039,1.1,2.966,2.966,0,0,1-3.128-2.67h7.769a7.109,7.109,0,0,0,.045-.86c0-3.275-2.043-5.523-4.973-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6H176.4a2.716,2.716,0,0,1,2.789-2.6Zm12.335-2.05c-3.1,0-5.234,2.252-5.234,5.542a5.176,5.176,0,0,0,5.376,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.14-1.628a5.013,5.013,0,0,1-3.043,1.1,2.966,2.966,0,0,1-3.126-2.67h7.771a7.544,7.544,0,0,0,.043-.86c0-3.275-2.041-5.523-4.971-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6h-5.453a2.713,2.713,0,0,1,2.787-2.6Zm13.18-2.05a3.509,3.509,0,0,0-3.05,1.465v-1.19h-2.271V22.561h2.293V16.78c0-1.793,1.043-2.818,2.5-2.818a4.007,4.007,0,0,1,1.744.386l.55-2.267a4.365,4.365,0,0,0-1.767-.312Zm8.44,0a5.32,5.32,0,0,0-5.533,5.542,5.3,5.3,0,0,0,5.531,5.523,5.041,5.041,0,0,0,3.928-1.68l-1.415-1.574a3.854,3.854,0,0,1-2.579,1.1,3.142,3.142,0,0,1-3.107-3.366,3.131,3.131,0,0,1,3.107-3.364,3.52,3.52,0,0,1,2.523,1.079l1.473-1.574a5.059,5.059,0,0,0-3.93-1.682Zm11.172,0a5.534,5.534,0,1,0,5.663,5.542,5.468,5.468,0,0,0-5.663-5.542Zm0,2.178a3.221,3.221,0,0,1,3.3,3.364,3.3,3.3,0,1,1-6.6,0,3.212,3.212,0,0,1,3.291-3.364Zm10.808,8.616V12.04h-2.3V22.561ZM233.917,6.794a1.583,1.583,0,0,0-1.6,1.628,1.552,1.552,0,0,0,1.514,1.589h.089a1.575,1.575,0,0,0,1.624-1.589,1.609,1.609,0,0,0-1.589-1.628Zm10.271,4.973a3.735,3.735,0,0,0-3.225,1.574v-1.3H238.68v10.52h2.3V16.743a2.6,2.6,0,0,1,2.721-2.781c1.548,0,2.448.988,2.448,2.744v5.853h2.306v-6.6a4.062,4.062,0,0,0-4.271-4.188Z");
			setAttribute(path_345, "transform", "translate(-129.856 -5.478)");
			setAttribute(g_344, "id", "Group_3");
			setAttribute(g_344, "data-name", "Group 3");
			setAttribute(g_344, "transform", "translate(320.157 559.527) rotate(180)");
			setAttribute(rect_4, "id", "Rectangle_4");
			setAttribute(rect_4, "data-name", "Rectangle 4");
			setAttribute(rect_4, "class", "cls-6");
			setAttribute(rect_4, "width", "4");
			setAttribute(rect_4, "height", "507");
			setAttribute(rect_4, "transform", "translate(757.554 147)");
			setAttribute(tspan, "x", "-52.524");
			setAttribute(tspan, "y", "0");
			setAttribute(text_1, "id", "PUBLIC_ADDRESS");
			setAttribute(text_1, "data-name", "PUBLIC ADDRESS");
			setAttribute(text_1, "class", "cls-7");
			setAttribute(text_1, "transform", "translate(262 317)");
			setAttribute(tspan_1, "x", "-52.524");
			setAttribute(tspan_1, "y", "0");
			setAttribute(text_3, "id", "PUBLIC_ADDRESS-2");
			setAttribute(text_3, "data-name", "PUBLIC ADDRESS");
			setAttribute(text_3, "class", "cls-7");
			setAttribute(text_3, "transform", "translate(262 485) rotate(180)");
			setAttribute(rect_5, "class", "cls-16");
			setAttribute(rect_5, "width", "147");
			setAttribute(rect_5, "height", "147");
			setAttribute(rect_5, "rx", "5");
			setAttribute(rect_6, "class", "cls-1");
			setAttribute(rect_6, "x", "0.5");
			setAttribute(rect_6, "y", "0.5");
			setAttribute(rect_6, "width", "146");
			setAttribute(rect_6, "height", "146");
			setAttribute(rect_6, "rx", "4.5");
			setAttribute(g_345, "id", "Rectangle_5");
			setAttribute(g_345, "data-name", "Rectangle 5");
			setAttribute(g_345, "class", "cls-8");
			setAttribute(g_345, "transform", "translate(187.554 327)");
			setAttribute(tspan_2, "x", "-52.524");
			setAttribute(tspan_2, "y", "0");
			setAttribute(text_5, "id", "PUBLIC_ADDRESS-3");
			setAttribute(text_5, "data-name", "PUBLIC ADDRESS");
			setAttribute(text_5, "class", "cls-7");
			setAttribute(text_5, "transform", "translate(177.554 401) rotate(-90)");
			setAttribute(tspan_3, "x", "-52.524");
			setAttribute(tspan_3, "y", "0");
			setAttribute(text_7, "id", "PUBLIC_ADDRESS-4");
			setAttribute(text_7, "data-name", "PUBLIC ADDRESS");
			setAttribute(text_7, "class", "cls-7");
			setAttribute(text_7, "transform", "translate(345.554 401) rotate(90)");
			setAttribute(rect_7, "id", "Rectangle_6");
			setAttribute(rect_7, "data-name", "Rectangle 6");
			setAttribute(rect_7, "class", "cls-5");
			setAttribute(rect_7, "width", "209");
			setAttribute(rect_7, "height", "209");
			setAttribute(rect_7, "rx", "10");
			setAttribute(rect_7, "transform", "translate(836 296)");
			setAttribute(path_346, "id", "Path_1-4");
			setAttribute(path_346, "data-name", "Path 1");
			setAttribute(path_346, "class", "cls-5");
			setAttribute(path_346, "d", "M12.682,24.484c-.411.035-.736.043-.934.043A11.745,11.745,0,0,1,0,12.779V0C3.934-.06,13.643.8,19,8.244a11.756,11.756,0,0,1,1.374,11.19h0a7.294,7.294,0,0,1-3.639,3.981,9.6,9.6,0,0,1-1.163.484c1.7-6.55-.53-16.032-10.462-20.59C11.143,7.049,15.907,16.461,12.682,24.484Z");
			setAttribute(path_347, "id", "Path_2-4");
			setAttribute(path_347, "data-name", "Path 2");
			setAttribute(path_347, "class", "cls-5");
			setAttribute(path_347, "d", "M166.657,11.767a3.97,3.97,0,0,0-3.294,1.539V12.042H161.07V26.948h2.295V21.315a4.006,4.006,0,0,0,3.293,1.519,5.269,5.269,0,0,0,5.256-5.523,5.284,5.284,0,0,0-5.256-5.542Zm-.275,2.178a3.142,3.142,0,0,1,3.172,3.364,3.177,3.177,0,1,1-6.343,0,3.152,3.152,0,0,1,3.171-3.364Zm12.852-2.178c-3.1,0-5.236,2.252-5.236,5.542a5.177,5.177,0,0,0,5.378,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.141-1.628a5.014,5.014,0,0,1-3.039,1.1,2.966,2.966,0,0,1-3.128-2.67h7.769a7.109,7.109,0,0,0,.045-.86c0-3.275-2.043-5.523-4.973-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6H176.4a2.716,2.716,0,0,1,2.789-2.6Zm12.335-2.05c-3.1,0-5.234,2.252-5.234,5.542a5.176,5.176,0,0,0,5.376,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.14-1.628a5.013,5.013,0,0,1-3.043,1.1,2.966,2.966,0,0,1-3.126-2.67h7.771a7.544,7.544,0,0,0,.043-.86c0-3.275-2.041-5.523-4.971-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6h-5.453a2.713,2.713,0,0,1,2.787-2.6Zm13.18-2.05a3.509,3.509,0,0,0-3.05,1.465v-1.19h-2.271V22.561h2.293V16.78c0-1.793,1.043-2.818,2.5-2.818a4.007,4.007,0,0,1,1.744.386l.55-2.267a4.365,4.365,0,0,0-1.767-.312Zm8.44,0a5.32,5.32,0,0,0-5.533,5.542,5.3,5.3,0,0,0,5.531,5.523,5.041,5.041,0,0,0,3.928-1.68l-1.415-1.574a3.854,3.854,0,0,1-2.579,1.1,3.142,3.142,0,0,1-3.107-3.366,3.131,3.131,0,0,1,3.107-3.364,3.52,3.52,0,0,1,2.523,1.079l1.473-1.574a5.059,5.059,0,0,0-3.93-1.682Zm11.172,0a5.534,5.534,0,1,0,5.663,5.542,5.468,5.468,0,0,0-5.663-5.542Zm0,2.178a3.221,3.221,0,0,1,3.3,3.364,3.3,3.3,0,1,1-6.6,0,3.212,3.212,0,0,1,3.291-3.364Zm10.808,8.616V12.04h-2.3V22.561ZM233.917,6.794a1.583,1.583,0,0,0-1.6,1.628,1.552,1.552,0,0,0,1.514,1.589h.089a1.575,1.575,0,0,0,1.624-1.589,1.609,1.609,0,0,0-1.589-1.628Zm10.271,4.973a3.735,3.735,0,0,0-3.225,1.574v-1.3H238.68v10.52h2.3V16.743a2.6,2.6,0,0,1,2.721-2.781c1.548,0,2.448.988,2.448,2.744v5.853h2.306v-6.6a4.062,4.062,0,0,0-4.271-4.188Z");
			setAttribute(path_347, "transform", "translate(-129.856 -5.478)");
			setAttribute(g_346, "id", "Group_4");
			setAttribute(g_346, "data-name", "Group 4");
			setAttribute(g_346, "transform", "translate(880.554 241)");
			setAttribute(path_348, "id", "Path_1-5");
			setAttribute(path_348, "data-name", "Path 1");
			setAttribute(path_348, "class", "cls-5");
			setAttribute(path_348, "d", "M12.682,24.484c-.411.035-.736.043-.934.043A11.745,11.745,0,0,1,0,12.779V0C3.934-.06,13.643.8,19,8.244a11.756,11.756,0,0,1,1.374,11.19h0a7.294,7.294,0,0,1-3.639,3.981,9.6,9.6,0,0,1-1.163.484c1.7-6.55-.53-16.032-10.462-20.59C11.143,7.049,15.907,16.461,12.682,24.484Z");
			setAttribute(path_349, "id", "Path_2-5");
			setAttribute(path_349, "data-name", "Path 2");
			setAttribute(path_349, "class", "cls-5");
			setAttribute(path_349, "d", "M166.657,11.767a3.97,3.97,0,0,0-3.294,1.539V12.042H161.07V26.948h2.295V21.315a4.006,4.006,0,0,0,3.293,1.519,5.269,5.269,0,0,0,5.256-5.523,5.284,5.284,0,0,0-5.256-5.542Zm-.275,2.178a3.142,3.142,0,0,1,3.172,3.364,3.177,3.177,0,1,1-6.343,0,3.152,3.152,0,0,1,3.171-3.364Zm12.852-2.178c-3.1,0-5.236,2.252-5.236,5.542a5.177,5.177,0,0,0,5.378,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.141-1.628a5.014,5.014,0,0,1-3.039,1.1,2.966,2.966,0,0,1-3.128-2.67h7.769a7.109,7.109,0,0,0,.045-.86c0-3.275-2.043-5.523-4.973-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6H176.4a2.716,2.716,0,0,1,2.789-2.6Zm12.335-2.05c-3.1,0-5.234,2.252-5.234,5.542a5.176,5.176,0,0,0,5.376,5.523,6.323,6.323,0,0,0,4.324-1.481l-1.14-1.628a5.013,5.013,0,0,1-3.043,1.1,2.966,2.966,0,0,1-3.126-2.67h7.771a7.544,7.544,0,0,0,.043-.86c0-3.275-2.041-5.523-4.971-5.523Zm-.045,2.05c1.459,0,2.415.95,2.667,2.6h-5.453a2.713,2.713,0,0,1,2.787-2.6Zm13.18-2.05a3.509,3.509,0,0,0-3.05,1.465v-1.19h-2.271V22.561h2.293V16.78c0-1.793,1.043-2.818,2.5-2.818a4.007,4.007,0,0,1,1.744.386l.55-2.267a4.365,4.365,0,0,0-1.767-.312Zm8.44,0a5.32,5.32,0,0,0-5.533,5.542,5.3,5.3,0,0,0,5.531,5.523,5.041,5.041,0,0,0,3.928-1.68l-1.415-1.574a3.854,3.854,0,0,1-2.579,1.1,3.142,3.142,0,0,1-3.107-3.366,3.131,3.131,0,0,1,3.107-3.364,3.52,3.52,0,0,1,2.523,1.079l1.473-1.574a5.059,5.059,0,0,0-3.93-1.682Zm11.172,0a5.534,5.534,0,1,0,5.663,5.542,5.468,5.468,0,0,0-5.663-5.542Zm0,2.178a3.221,3.221,0,0,1,3.3,3.364,3.3,3.3,0,1,1-6.6,0,3.212,3.212,0,0,1,3.291-3.364Zm10.808,8.616V12.04h-2.3V22.561ZM233.917,6.794a1.583,1.583,0,0,0-1.6,1.628,1.552,1.552,0,0,0,1.514,1.589h.089a1.575,1.575,0,0,0,1.624-1.589,1.609,1.609,0,0,0-1.589-1.628Zm10.271,4.973a3.735,3.735,0,0,0-3.225,1.574v-1.3H238.68v10.52h2.3V16.743a2.6,2.6,0,0,1,2.721-2.781c1.548,0,2.448.988,2.448,2.744v5.853h2.306v-6.6a4.062,4.062,0,0,0-4.271-4.188Z");
			setAttribute(path_349, "transform", "translate(-129.856 -5.478)");
			setAttribute(g_347, "id", "Group_5");
			setAttribute(g_347, "data-name", "Group 5");
			setAttribute(g_347, "transform", "translate(999.157 559.527) rotate(180)");
			setAttribute(tspan_4, "x", "-39.336");
			setAttribute(tspan_4, "y", "0");
			setAttribute(text_9, "id", "PRIVATE_KEY");
			setAttribute(text_9, "data-name", "PRIVATE KEY");
			setAttribute(text_9, "class", "cls-7");
			setAttribute(text_9, "transform", "translate(940 317)");
			setAttribute(tspan_5, "x", "-39.336");
			setAttribute(tspan_5, "y", "0");
			setAttribute(text_11, "id", "PRIVATE_KEY-2");
			setAttribute(text_11, "data-name", "PRIVATE KEY");
			setAttribute(text_11, "class", "cls-7");
			setAttribute(text_11, "transform", "translate(940 485) rotate(180)");
			setAttribute(rect_8, "class", "cls-16");
			setAttribute(rect_8, "width", "147");
			setAttribute(rect_8, "height", "147");
			setAttribute(rect_8, "rx", "5");
			setAttribute(rect_9, "class", "cls-1");
			setAttribute(rect_9, "x", "0.5");
			setAttribute(rect_9, "y", "0.5");
			setAttribute(rect_9, "width", "146");
			setAttribute(rect_9, "height", "146");
			setAttribute(rect_9, "rx", "4.5");
			setAttribute(g_348, "id", "Rectangle_7");
			setAttribute(g_348, "data-name", "Rectangle 7");
			setAttribute(g_348, "class", "cls-8");
			setAttribute(g_348, "transform", "translate(866.554 327)");
			setAttribute(tspan_6, "x", "-39.336");
			setAttribute(tspan_6, "y", "0");
			setAttribute(text_13, "id", "PRIVATE_KEY-3");
			setAttribute(text_13, "data-name", "PRIVATE KEY");
			setAttribute(text_13, "class", "cls-7");
			setAttribute(text_13, "transform", "translate(856.554 401) rotate(-90)");
			setAttribute(tspan_7, "x", "-39.336");
			setAttribute(tspan_7, "y", "0");
			setAttribute(text_15, "id", "PRIVATE_KEY-4");
			setAttribute(text_15, "data-name", "PRIVATE KEY");
			setAttribute(text_15, "class", "cls-7");
			setAttribute(text_15, "transform", "translate(1024.554 401) rotate(90)");
			setAttribute(rect_10, "id", "Rectangle_8");
			setAttribute(rect_10, "data-name", "Rectangle 8");
			setAttribute(rect_10, "width", "209");
			setAttribute(rect_10, "height", "35");
			setAttribute(rect_10, "rx", "17.5");
			setAttribute(rect_10, "transform", "translate(836 182)");
			setAttribute(path_350, "id", "Path_4");
			setAttribute(path_350, "data-name", "Path 4");
			setAttribute(path_350, "class", "cls-1");
			setAttribute(path_350, "d", "M0,0H24V24H0Z");
			setAttribute(path_351, "id", "Path_5");
			setAttribute(path_351, "data-name", "Path 5");
			setAttribute(path_351, "class", "cls-9");
			setAttribute(path_351, "d", "M18,8H17V6A5,5,0,1,0,7,6V8H6a2.006,2.006,0,0,0-2,2V20a2.006,2.006,0,0,0,2,2H18a2.006,2.006,0,0,0,2-2V10A2.006,2.006,0,0,0,18,8Zm-6,9a2,2,0,1,1,2-2A2,2,0,0,1,12,17Zm3.1-9H8.9V6a3.1,3.1,0,0,1,6.2,0Z");
			setAttribute(g_350, "id", "ic-lock-24px");
			setAttribute(g_350, "transform", "translate(812 187)");
			setAttribute(tspan_8, "x", "-45.69");
			setAttribute(tspan_8, "y", "0");
			setAttribute(text_17, "id", "HIDE_THIS_SIDE");
			setAttribute(text_17, "data-name", "HIDE THIS SIDE");
			setAttribute(text_17, "class", "cls-10");
			setAttribute(text_17, "transform", "translate(885.31 204)");
			setAttribute(g_349, "id", "Group_6");
			setAttribute(g_349, "data-name", "Group 6");
			setAttribute(g_349, "transform", "translate(69)");
			setAttribute(rect_11, "id", "Rectangle_8-2");
			setAttribute(rect_11, "data-name", "Rectangle 8");
			setAttribute(rect_11, "width", "209");
			setAttribute(rect_11, "height", "35");
			setAttribute(rect_11, "rx", "17.5");
			setAttribute(rect_11, "transform", "translate(1045 619) rotate(180)");
			setAttribute(path_352, "id", "Path_4-2");
			setAttribute(path_352, "data-name", "Path 4");
			setAttribute(path_352, "class", "cls-1");
			setAttribute(path_352, "d", "M0,0H24V24H0Z");
			setAttribute(path_353, "id", "Path_5-2");
			setAttribute(path_353, "data-name", "Path 5");
			setAttribute(path_353, "class", "cls-9");
			setAttribute(path_353, "d", "M18,8H17V6A5,5,0,1,0,7,6V8H6a2.006,2.006,0,0,0-2,2V20a2.006,2.006,0,0,0,2,2H18a2.006,2.006,0,0,0,2-2V10A2.006,2.006,0,0,0,18,8Zm-6,9a2,2,0,1,1,2-2A2,2,0,0,1,12,17Zm3.1-9H8.9V6a3.1,3.1,0,0,1,6.2,0Z");
			setAttribute(g_352, "id", "ic-lock-24px-2");
			setAttribute(g_352, "data-name", "ic-lock-24px");
			setAttribute(g_352, "transform", "translate(812 187)");
			setAttribute(tspan_9, "x", "-45.69");
			setAttribute(tspan_9, "y", "0");
			setAttribute(text_19, "id", "HIDE_THIS_SIDE-2");
			setAttribute(text_19, "data-name", "HIDE THIS SIDE");
			setAttribute(text_19, "class", "cls-10");
			setAttribute(text_19, "transform", "translate(885.31 204)");
			setAttribute(g_351, "id", "Group_6-2");
			setAttribute(g_351, "data-name", "Group 6");
			setAttribute(g_351, "transform", "translate(1812.31 801) rotate(180)");
			setAttribute(rect_12, "id", "Rectangle_9");
			setAttribute(rect_12, "data-name", "Rectangle 9");
			setAttribute(rect_12, "class", "cls-5");
			setAttribute(rect_12, "width", "31");
			setAttribute(rect_12, "height", "437");
			setAttribute(rect_12, "rx", "5");
			setAttribute(rect_12, "transform", "translate(794 182)");
			setAttribute(rect_13, "id", "Rectangle_10");
			setAttribute(rect_13, "data-name", "Rectangle 10");
			setAttribute(rect_13, "class", "cls-5");
			setAttribute(rect_13, "width", "31");
			setAttribute(rect_13, "height", "437");
			setAttribute(rect_13, "rx", "5");
			setAttribute(rect_13, "transform", "translate(377 182)");
			setAttribute(rect_14, "id", "Rectangle_11");
			setAttribute(rect_14, "data-name", "Rectangle 11");
			setAttribute(rect_14, "class", "cls-11");
			setAttribute(rect_14, "width", "950");
			setAttribute(rect_14, "height", "10");
			setAttribute(rect_14, "transform", "translate(125.554 157)");
			setAttribute(rect_15, "id", "Rectangle_12");
			setAttribute(rect_15, "data-name", "Rectangle 12");
			setAttribute(rect_15, "class", "cls-11");
			setAttribute(rect_15, "width", "950");
			setAttribute(rect_15, "height", "10");
			setAttribute(rect_15, "transform", "translate(125.554 634)");
			setAttribute(tspan_10, "x", "-65.507");
			setAttribute(tspan_10, "y", "0");
			setAttribute(text_21, "id", "Paper_Wallet");
			setAttribute(text_21, "data-name", "Paper Wallet");
			setAttribute(text_21, "class", "cls-12");
			setAttribute(text_21, "transform", "translate(600.047 465)");
			setAttribute(tspan_11, "x", "-47.945");
			setAttribute(tspan_11, "y", "0");
			setAttribute(text_23, "id", "peercoin.net");
			setAttribute(text_23, "class", "cls-13");
			setAttribute(text_23, "transform", "translate(600 614)");
			setAttribute(tspan_12, "x", "-78.306");
			setAttribute(tspan_12, "y", "0");
			setAttribute(text_25, "id", "paperwallet.peercoin.net");
			setAttribute(text_25, "class", "cls-14");
			setAttribute(text_25, "transform", "translate(600 554)");
			setAttribute(tspan_13, "x", "-74.58");
			setAttribute(tspan_13, "y", "0");
			setAttribute(text_27, "id", "Generate_your_wallet_at:");
			setAttribute(text_27, "data-name", "Generate your wallet at:");
			setAttribute(text_27, "class", "cls-15");
			setAttribute(text_27, "transform", "translate(600 534)");
			setAttribute(tspan_14, "x", "-95.002");
			setAttribute(tspan_14, "y", "0");
			setAttribute(text_29, "id", "Learn_more_about_Peercoin_at:");
			setAttribute(text_29, "data-name", "Learn more about Peercoin at:");
			setAttribute(text_29, "class", "cls-15");
			setAttribute(text_29, "transform", "translate(600 594)");
			setAttribute(rect_16, "id", "Rectangle_13");
			setAttribute(rect_16, "data-name", "Rectangle 13");
			setAttribute(rect_16, "class", "cls-5");
			setAttribute(rect_16, "width", "266");
			setAttribute(rect_16, "height", "170");
			setAttribute(rect_16, "rx", "10");
			setAttribute(rect_16, "transform", "translate(467 190)");
			setAttribute(tspan_15, "x", "-116.026");
			setAttribute(tspan_15, "y", "0");
			setAttribute(text_31, "id", "USE_THIS_SPACE_TO_WRITE_ANYTHING:");
			setAttribute(text_31, "data-name", "USE THIS SPACE TO WRITE ANYTHING:");
			setAttribute(text_31, "class", "cls-7");
			setAttribute(text_31, "transform", "translate(600 212)");
			setAttribute(tspan_16, "x", "-14.917");
			setAttribute(tspan_16, "y", "0");
			setAttribute(text_33, "id", "_2018");
			setAttribute(text_33, "text-anchor", "middle");
			setAttribute(text_33, "data-name", "2018");
			setAttribute(text_33, "class", "cls-7");
			setAttribute(text_33, "transform", "translate(397 385.5) rotate(-90)");
			setAttribute(tspan_17, "x", "-14.917");
			setAttribute(tspan_17, "y", "0");
			setAttribute(text_35, "id", "_2018-2");
			setAttribute(text_35, "text-anchor", "middle");
			setAttribute(text_35, "data-name", "2018");
			setAttribute(text_35, "class", "cls-7");
			setAttribute(text_35, "transform", "translate(805 415.5) rotate(90)");
			setXlinkAttribute(image, "xlink:href", state.publicQRCode);
			setAttribute(image, "x", "0");
			setAttribute(image, "y", "0");
			setAttribute(image, "height", "130px");
			setAttribute(image, "width", "130px");
			setAttribute(image, "transform", "translate(195 335)");
			setXlinkAttribute(image_1, "xlink:href", state.privateQRCode);
			setAttribute(image_1, "x", "0");
			setAttribute(image_1, "y", "0");
			setAttribute(image_1, "height", "130px");
			setAttribute(image_1, "width", "130px");
			setAttribute(image_1, "transform", "translate(875 335)");
			setAttribute(g, "id", "PaperWallet");
			setAttribute(g, "transform", "translate(-125.277 -147)");
			setAttribute(svg, "xmlns", "http://www.w3.org/2000/svg");
			setAttribute(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			setAttribute(svg, "viewBox", "0 0 950.277 507");
			setAttribute(svg, "class", "PaperWalletComp print-only");
		},

		m: function mount(target, anchor) {
			insertNode(svg, target, anchor);
			appendNode(defs, svg);
			appendNode(style, defs);
			appendNode(text, style);
			appendNode(linearGradient, defs);
			appendNode(stop, linearGradient);
			appendNode(stop_1, linearGradient);
			appendNode(clipPath, defs);
			appendNode(rect, clipPath);
			appendNode(linearGradient_1, defs);
			appendNode(stop_2, linearGradient_1);
			appendNode(stop_3, linearGradient_1);
			appendNode(stop_4, linearGradient_1);
			appendNode(stop_5, linearGradient_1);
			appendNode(stop_6, linearGradient_1);
			appendNode(stop_7, linearGradient_1);
			appendNode(stop_8, linearGradient_1);
			appendNode(stop_9, linearGradient_1);
			appendNode(stop_10, linearGradient_1);
			appendNode(g, svg);
			appendNode(rect_1, g);
			appendNode(g_1, g);
			appendNode(g_2, g_1);
			appendNode(g_3, g_2);
			appendNode(path, g_3);
			appendNode(path_1, g_3);
			appendNode(g_4, g_1);
			appendNode(g_5, g_4);
			appendNode(path_2, g_5);
			appendNode(path_3, g_5);
			appendNode(g_6, g_1);
			appendNode(g_7, g_6);
			appendNode(path_4, g_7);
			appendNode(path_5, g_7);
			appendNode(g_8, g_1);
			appendNode(g_9, g_8);
			appendNode(path_6, g_9);
			appendNode(path_7, g_9);
			appendNode(g_10, g_1);
			appendNode(g_11, g_10);
			appendNode(path_8, g_11);
			appendNode(path_9, g_11);
			appendNode(g_12, g_1);
			appendNode(g_13, g_12);
			appendNode(path_10, g_13);
			appendNode(path_11, g_13);
			appendNode(g_14, g_1);
			appendNode(g_15, g_14);
			appendNode(path_12, g_15);
			appendNode(path_13, g_15);
			appendNode(g_16, g_1);
			appendNode(g_17, g_16);
			appendNode(path_14, g_17);
			appendNode(path_15, g_17);
			appendNode(g_18, g_1);
			appendNode(g_19, g_18);
			appendNode(path_16, g_19);
			appendNode(path_17, g_19);
			appendNode(g_20, g_1);
			appendNode(g_21, g_20);
			appendNode(path_18, g_21);
			appendNode(path_19, g_21);
			appendNode(g_22, g_1);
			appendNode(g_23, g_22);
			appendNode(path_20, g_23);
			appendNode(path_21, g_23);
			appendNode(g_24, g_1);
			appendNode(g_25, g_24);
			appendNode(path_22, g_25);
			appendNode(path_23, g_25);
			appendNode(g_26, g_1);
			appendNode(g_27, g_26);
			appendNode(path_24, g_27);
			appendNode(path_25, g_27);
			appendNode(g_28, g_1);
			appendNode(g_29, g_28);
			appendNode(path_26, g_29);
			appendNode(path_27, g_29);
			appendNode(g_30, g_1);
			appendNode(g_31, g_30);
			appendNode(path_28, g_31);
			appendNode(path_29, g_31);
			appendNode(g_32, g_1);
			appendNode(g_33, g_32);
			appendNode(path_30, g_33);
			appendNode(path_31, g_33);
			appendNode(g_34, g_1);
			appendNode(g_35, g_34);
			appendNode(path_32, g_35);
			appendNode(path_33, g_35);
			appendNode(g_36, g_1);
			appendNode(g_37, g_36);
			appendNode(path_34, g_37);
			appendNode(path_35, g_37);
			appendNode(g_38, g_1);
			appendNode(g_39, g_38);
			appendNode(path_36, g_39);
			appendNode(path_37, g_39);
			appendNode(g_40, g_1);
			appendNode(g_41, g_40);
			appendNode(path_38, g_41);
			appendNode(path_39, g_41);
			appendNode(g_42, g_1);
			appendNode(g_43, g_42);
			appendNode(path_40, g_43);
			appendNode(path_41, g_43);
			appendNode(g_44, g_1);
			appendNode(g_45, g_44);
			appendNode(path_42, g_45);
			appendNode(path_43, g_45);
			appendNode(g_46, g_1);
			appendNode(g_47, g_46);
			appendNode(path_44, g_47);
			appendNode(path_45, g_47);
			appendNode(g_48, g_1);
			appendNode(g_49, g_48);
			appendNode(path_46, g_49);
			appendNode(path_47, g_49);
			appendNode(g_50, g_1);
			appendNode(g_51, g_50);
			appendNode(path_48, g_51);
			appendNode(path_49, g_51);
			appendNode(g_52, g_1);
			appendNode(g_53, g_52);
			appendNode(path_50, g_53);
			appendNode(path_51, g_53);
			appendNode(g_54, g_1);
			appendNode(g_55, g_54);
			appendNode(path_52, g_55);
			appendNode(path_53, g_55);
			appendNode(g_56, g_1);
			appendNode(g_57, g_56);
			appendNode(path_54, g_57);
			appendNode(path_55, g_57);
			appendNode(g_58, g_1);
			appendNode(g_59, g_58);
			appendNode(path_56, g_59);
			appendNode(path_57, g_59);
			appendNode(g_60, g_1);
			appendNode(g_61, g_60);
			appendNode(path_58, g_61);
			appendNode(path_59, g_61);
			appendNode(g_62, g_1);
			appendNode(g_63, g_62);
			appendNode(path_60, g_63);
			appendNode(path_61, g_63);
			appendNode(g_64, g_1);
			appendNode(g_65, g_64);
			appendNode(path_62, g_65);
			appendNode(path_63, g_65);
			appendNode(g_66, g_1);
			appendNode(g_67, g_66);
			appendNode(path_64, g_67);
			appendNode(path_65, g_67);
			appendNode(g_68, g_1);
			appendNode(g_69, g_68);
			appendNode(path_66, g_69);
			appendNode(path_67, g_69);
			appendNode(g_70, g_1);
			appendNode(g_71, g_70);
			appendNode(path_68, g_71);
			appendNode(path_69, g_71);
			appendNode(g_72, g_1);
			appendNode(g_73, g_72);
			appendNode(path_70, g_73);
			appendNode(path_71, g_73);
			appendNode(g_74, g_1);
			appendNode(g_75, g_74);
			appendNode(path_72, g_75);
			appendNode(path_73, g_75);
			appendNode(g_76, g_1);
			appendNode(g_77, g_76);
			appendNode(path_74, g_77);
			appendNode(path_75, g_77);
			appendNode(g_78, g_1);
			appendNode(g_79, g_78);
			appendNode(path_76, g_79);
			appendNode(path_77, g_79);
			appendNode(g_80, g_1);
			appendNode(g_81, g_80);
			appendNode(path_78, g_81);
			appendNode(path_79, g_81);
			appendNode(g_82, g_1);
			appendNode(g_83, g_82);
			appendNode(path_80, g_83);
			appendNode(path_81, g_83);
			appendNode(g_84, g_1);
			appendNode(g_85, g_84);
			appendNode(path_82, g_85);
			appendNode(path_83, g_85);
			appendNode(g_86, g_1);
			appendNode(g_87, g_86);
			appendNode(path_84, g_87);
			appendNode(path_85, g_87);
			appendNode(g_88, g_1);
			appendNode(g_89, g_88);
			appendNode(path_86, g_89);
			appendNode(path_87, g_89);
			appendNode(g_90, g_1);
			appendNode(g_91, g_90);
			appendNode(path_88, g_91);
			appendNode(path_89, g_91);
			appendNode(g_92, g_1);
			appendNode(g_93, g_92);
			appendNode(path_90, g_93);
			appendNode(path_91, g_93);
			appendNode(g_94, g_1);
			appendNode(g_95, g_94);
			appendNode(path_92, g_95);
			appendNode(path_93, g_95);
			appendNode(g_96, g_1);
			appendNode(g_97, g_96);
			appendNode(path_94, g_97);
			appendNode(path_95, g_97);
			appendNode(g_98, g_1);
			appendNode(g_99, g_98);
			appendNode(path_96, g_99);
			appendNode(path_97, g_99);
			appendNode(g_100, g_1);
			appendNode(g_101, g_100);
			appendNode(path_98, g_101);
			appendNode(path_99, g_101);
			appendNode(g_102, g_1);
			appendNode(g_103, g_102);
			appendNode(path_100, g_103);
			appendNode(path_101, g_103);
			appendNode(g_104, g_1);
			appendNode(g_105, g_104);
			appendNode(path_102, g_105);
			appendNode(path_103, g_105);
			appendNode(g_106, g_1);
			appendNode(g_107, g_106);
			appendNode(path_104, g_107);
			appendNode(path_105, g_107);
			appendNode(g_108, g_1);
			appendNode(g_109, g_108);
			appendNode(path_106, g_109);
			appendNode(path_107, g_109);
			appendNode(g_110, g_1);
			appendNode(g_111, g_110);
			appendNode(path_108, g_111);
			appendNode(path_109, g_111);
			appendNode(g_112, g_1);
			appendNode(g_113, g_112);
			appendNode(path_110, g_113);
			appendNode(path_111, g_113);
			appendNode(g_114, g_1);
			appendNode(g_115, g_114);
			appendNode(path_112, g_115);
			appendNode(path_113, g_115);
			appendNode(g_116, g_1);
			appendNode(g_117, g_116);
			appendNode(path_114, g_117);
			appendNode(path_115, g_117);
			appendNode(g_118, g_1);
			appendNode(g_119, g_118);
			appendNode(path_116, g_119);
			appendNode(path_117, g_119);
			appendNode(g_120, g_1);
			appendNode(g_121, g_120);
			appendNode(path_118, g_121);
			appendNode(path_119, g_121);
			appendNode(g_122, g_1);
			appendNode(g_123, g_122);
			appendNode(path_120, g_123);
			appendNode(path_121, g_123);
			appendNode(g_124, g_1);
			appendNode(g_125, g_124);
			appendNode(path_122, g_125);
			appendNode(path_123, g_125);
			appendNode(g_126, g_1);
			appendNode(g_127, g_126);
			appendNode(path_124, g_127);
			appendNode(path_125, g_127);
			appendNode(g_128, g_1);
			appendNode(g_129, g_128);
			appendNode(path_126, g_129);
			appendNode(path_127, g_129);
			appendNode(g_130, g_1);
			appendNode(g_131, g_130);
			appendNode(path_128, g_131);
			appendNode(path_129, g_131);
			appendNode(g_132, g_1);
			appendNode(g_133, g_132);
			appendNode(path_130, g_133);
			appendNode(path_131, g_133);
			appendNode(g_134, g_1);
			appendNode(g_135, g_134);
			appendNode(path_132, g_135);
			appendNode(path_133, g_135);
			appendNode(g_136, g_1);
			appendNode(g_137, g_136);
			appendNode(path_134, g_137);
			appendNode(path_135, g_137);
			appendNode(g_138, g_1);
			appendNode(g_139, g_138);
			appendNode(path_136, g_139);
			appendNode(path_137, g_139);
			appendNode(g_140, g_1);
			appendNode(g_141, g_140);
			appendNode(path_138, g_141);
			appendNode(path_139, g_141);
			appendNode(g_142, g_1);
			appendNode(g_143, g_142);
			appendNode(path_140, g_143);
			appendNode(path_141, g_143);
			appendNode(g_144, g_1);
			appendNode(g_145, g_144);
			appendNode(path_142, g_145);
			appendNode(path_143, g_145);
			appendNode(g_146, g_1);
			appendNode(g_147, g_146);
			appendNode(path_144, g_147);
			appendNode(path_145, g_147);
			appendNode(g_148, g_1);
			appendNode(g_149, g_148);
			appendNode(path_146, g_149);
			appendNode(path_147, g_149);
			appendNode(g_150, g_1);
			appendNode(g_151, g_150);
			appendNode(path_148, g_151);
			appendNode(path_149, g_151);
			appendNode(g_152, g_1);
			appendNode(g_153, g_152);
			appendNode(path_150, g_153);
			appendNode(path_151, g_153);
			appendNode(g_154, g_1);
			appendNode(g_155, g_154);
			appendNode(path_152, g_155);
			appendNode(path_153, g_155);
			appendNode(g_156, g_1);
			appendNode(g_157, g_156);
			appendNode(path_154, g_157);
			appendNode(path_155, g_157);
			appendNode(g_158, g_1);
			appendNode(g_159, g_158);
			appendNode(path_156, g_159);
			appendNode(path_157, g_159);
			appendNode(g_160, g_1);
			appendNode(g_161, g_160);
			appendNode(path_158, g_161);
			appendNode(path_159, g_161);
			appendNode(g_162, g_1);
			appendNode(g_163, g_162);
			appendNode(path_160, g_163);
			appendNode(path_161, g_163);
			appendNode(g_164, g_1);
			appendNode(g_165, g_164);
			appendNode(path_162, g_165);
			appendNode(path_163, g_165);
			appendNode(g_166, g_1);
			appendNode(g_167, g_166);
			appendNode(path_164, g_167);
			appendNode(path_165, g_167);
			appendNode(g_168, g_1);
			appendNode(g_169, g_168);
			appendNode(path_166, g_169);
			appendNode(path_167, g_169);
			appendNode(g_170, g_1);
			appendNode(g_171, g_170);
			appendNode(path_168, g_171);
			appendNode(path_169, g_171);
			appendNode(g_172, g_1);
			appendNode(g_173, g_172);
			appendNode(path_170, g_173);
			appendNode(path_171, g_173);
			appendNode(g_174, g_1);
			appendNode(g_175, g_174);
			appendNode(path_172, g_175);
			appendNode(path_173, g_175);
			appendNode(g_176, g_1);
			appendNode(g_177, g_176);
			appendNode(path_174, g_177);
			appendNode(path_175, g_177);
			appendNode(g_178, g_1);
			appendNode(g_179, g_178);
			appendNode(path_176, g_179);
			appendNode(path_177, g_179);
			appendNode(g_180, g_1);
			appendNode(g_181, g_180);
			appendNode(path_178, g_181);
			appendNode(path_179, g_181);
			appendNode(g_182, g_1);
			appendNode(g_183, g_182);
			appendNode(path_180, g_183);
			appendNode(path_181, g_183);
			appendNode(g_184, g_1);
			appendNode(g_185, g_184);
			appendNode(path_182, g_185);
			appendNode(path_183, g_185);
			appendNode(g_186, g_1);
			appendNode(g_187, g_186);
			appendNode(path_184, g_187);
			appendNode(path_185, g_187);
			appendNode(g_188, g_1);
			appendNode(g_189, g_188);
			appendNode(path_186, g_189);
			appendNode(path_187, g_189);
			appendNode(g_190, g_1);
			appendNode(g_191, g_190);
			appendNode(path_188, g_191);
			appendNode(path_189, g_191);
			appendNode(g_192, g_1);
			appendNode(g_193, g_192);
			appendNode(path_190, g_193);
			appendNode(path_191, g_193);
			appendNode(g_194, g_1);
			appendNode(g_195, g_194);
			appendNode(path_192, g_195);
			appendNode(path_193, g_195);
			appendNode(g_196, g_1);
			appendNode(g_197, g_196);
			appendNode(path_194, g_197);
			appendNode(path_195, g_197);
			appendNode(g_198, g_1);
			appendNode(g_199, g_198);
			appendNode(path_196, g_199);
			appendNode(path_197, g_199);
			appendNode(g_200, g_1);
			appendNode(g_201, g_200);
			appendNode(path_198, g_201);
			appendNode(path_199, g_201);
			appendNode(g_202, g_1);
			appendNode(g_203, g_202);
			appendNode(path_200, g_203);
			appendNode(path_201, g_203);
			appendNode(g_204, g_1);
			appendNode(g_205, g_204);
			appendNode(path_202, g_205);
			appendNode(path_203, g_205);
			appendNode(g_206, g_1);
			appendNode(g_207, g_206);
			appendNode(path_204, g_207);
			appendNode(path_205, g_207);
			appendNode(g_208, g_1);
			appendNode(g_209, g_208);
			appendNode(path_206, g_209);
			appendNode(path_207, g_209);
			appendNode(g_210, g_1);
			appendNode(g_211, g_210);
			appendNode(path_208, g_211);
			appendNode(path_209, g_211);
			appendNode(g_212, g_1);
			appendNode(g_213, g_212);
			appendNode(path_210, g_213);
			appendNode(path_211, g_213);
			appendNode(g_214, g_1);
			appendNode(g_215, g_214);
			appendNode(path_212, g_215);
			appendNode(path_213, g_215);
			appendNode(g_216, g_1);
			appendNode(g_217, g_216);
			appendNode(path_214, g_217);
			appendNode(path_215, g_217);
			appendNode(g_218, g_1);
			appendNode(g_219, g_218);
			appendNode(path_216, g_219);
			appendNode(path_217, g_219);
			appendNode(g_220, g_1);
			appendNode(g_221, g_220);
			appendNode(path_218, g_221);
			appendNode(path_219, g_221);
			appendNode(g_222, g_1);
			appendNode(g_223, g_222);
			appendNode(path_220, g_223);
			appendNode(path_221, g_223);
			appendNode(g_224, g_1);
			appendNode(g_225, g_224);
			appendNode(path_222, g_225);
			appendNode(path_223, g_225);
			appendNode(g_226, g_1);
			appendNode(g_227, g_226);
			appendNode(path_224, g_227);
			appendNode(path_225, g_227);
			appendNode(g_228, g_1);
			appendNode(g_229, g_228);
			appendNode(path_226, g_229);
			appendNode(path_227, g_229);
			appendNode(g_230, g_1);
			appendNode(g_231, g_230);
			appendNode(path_228, g_231);
			appendNode(path_229, g_231);
			appendNode(g_232, g_1);
			appendNode(g_233, g_232);
			appendNode(path_230, g_233);
			appendNode(path_231, g_233);
			appendNode(g_234, g_1);
			appendNode(g_235, g_234);
			appendNode(path_232, g_235);
			appendNode(path_233, g_235);
			appendNode(g_236, g_1);
			appendNode(g_237, g_236);
			appendNode(path_234, g_237);
			appendNode(path_235, g_237);
			appendNode(g_238, g_1);
			appendNode(g_239, g_238);
			appendNode(path_236, g_239);
			appendNode(path_237, g_239);
			appendNode(g_240, g_1);
			appendNode(g_241, g_240);
			appendNode(path_238, g_241);
			appendNode(path_239, g_241);
			appendNode(g_242, g_1);
			appendNode(g_243, g_242);
			appendNode(path_240, g_243);
			appendNode(path_241, g_243);
			appendNode(g_244, g_1);
			appendNode(g_245, g_244);
			appendNode(path_242, g_245);
			appendNode(path_243, g_245);
			appendNode(g_246, g_1);
			appendNode(g_247, g_246);
			appendNode(path_244, g_247);
			appendNode(path_245, g_247);
			appendNode(g_248, g_1);
			appendNode(g_249, g_248);
			appendNode(path_246, g_249);
			appendNode(path_247, g_249);
			appendNode(g_250, g_1);
			appendNode(g_251, g_250);
			appendNode(path_248, g_251);
			appendNode(path_249, g_251);
			appendNode(g_252, g_1);
			appendNode(g_253, g_252);
			appendNode(path_250, g_253);
			appendNode(path_251, g_253);
			appendNode(g_254, g_1);
			appendNode(g_255, g_254);
			appendNode(path_252, g_255);
			appendNode(path_253, g_255);
			appendNode(g_256, g_1);
			appendNode(g_257, g_256);
			appendNode(path_254, g_257);
			appendNode(path_255, g_257);
			appendNode(g_258, g_1);
			appendNode(g_259, g_258);
			appendNode(path_256, g_259);
			appendNode(path_257, g_259);
			appendNode(g_260, g_1);
			appendNode(g_261, g_260);
			appendNode(path_258, g_261);
			appendNode(path_259, g_261);
			appendNode(g_262, g_1);
			appendNode(g_263, g_262);
			appendNode(path_260, g_263);
			appendNode(path_261, g_263);
			appendNode(g_264, g_1);
			appendNode(g_265, g_264);
			appendNode(path_262, g_265);
			appendNode(path_263, g_265);
			appendNode(g_266, g_1);
			appendNode(g_267, g_266);
			appendNode(path_264, g_267);
			appendNode(path_265, g_267);
			appendNode(g_268, g_1);
			appendNode(g_269, g_268);
			appendNode(path_266, g_269);
			appendNode(path_267, g_269);
			appendNode(g_270, g_1);
			appendNode(g_271, g_270);
			appendNode(path_268, g_271);
			appendNode(path_269, g_271);
			appendNode(g_272, g_1);
			appendNode(g_273, g_272);
			appendNode(path_270, g_273);
			appendNode(path_271, g_273);
			appendNode(g_274, g_1);
			appendNode(g_275, g_274);
			appendNode(path_272, g_275);
			appendNode(path_273, g_275);
			appendNode(g_276, g_1);
			appendNode(g_277, g_276);
			appendNode(path_274, g_277);
			appendNode(path_275, g_277);
			appendNode(g_278, g_1);
			appendNode(g_279, g_278);
			appendNode(path_276, g_279);
			appendNode(path_277, g_279);
			appendNode(g_280, g_1);
			appendNode(g_281, g_280);
			appendNode(path_278, g_281);
			appendNode(path_279, g_281);
			appendNode(g_282, g_1);
			appendNode(g_283, g_282);
			appendNode(path_280, g_283);
			appendNode(path_281, g_283);
			appendNode(g_284, g_1);
			appendNode(g_285, g_284);
			appendNode(path_282, g_285);
			appendNode(path_283, g_285);
			appendNode(g_286, g_1);
			appendNode(g_287, g_286);
			appendNode(path_284, g_287);
			appendNode(path_285, g_287);
			appendNode(g_288, g_1);
			appendNode(g_289, g_288);
			appendNode(path_286, g_289);
			appendNode(path_287, g_289);
			appendNode(g_290, g_1);
			appendNode(g_291, g_290);
			appendNode(path_288, g_291);
			appendNode(path_289, g_291);
			appendNode(g_292, g_1);
			appendNode(g_293, g_292);
			appendNode(path_290, g_293);
			appendNode(path_291, g_293);
			appendNode(g_294, g_1);
			appendNode(g_295, g_294);
			appendNode(path_292, g_295);
			appendNode(path_293, g_295);
			appendNode(g_296, g_1);
			appendNode(g_297, g_296);
			appendNode(path_294, g_297);
			appendNode(path_295, g_297);
			appendNode(g_298, g_1);
			appendNode(g_299, g_298);
			appendNode(path_296, g_299);
			appendNode(path_297, g_299);
			appendNode(g_300, g_1);
			appendNode(g_301, g_300);
			appendNode(path_298, g_301);
			appendNode(path_299, g_301);
			appendNode(g_302, g_1);
			appendNode(g_303, g_302);
			appendNode(path_300, g_303);
			appendNode(path_301, g_303);
			appendNode(g_304, g_1);
			appendNode(g_305, g_304);
			appendNode(path_302, g_305);
			appendNode(path_303, g_305);
			appendNode(g_306, g_1);
			appendNode(g_307, g_306);
			appendNode(path_304, g_307);
			appendNode(path_305, g_307);
			appendNode(g_308, g_1);
			appendNode(g_309, g_308);
			appendNode(path_306, g_309);
			appendNode(path_307, g_309);
			appendNode(g_310, g_1);
			appendNode(g_311, g_310);
			appendNode(path_308, g_311);
			appendNode(path_309, g_311);
			appendNode(g_312, g_1);
			appendNode(g_313, g_312);
			appendNode(path_310, g_313);
			appendNode(path_311, g_313);
			appendNode(g_314, g_1);
			appendNode(g_315, g_314);
			appendNode(path_312, g_315);
			appendNode(path_313, g_315);
			appendNode(g_316, g_1);
			appendNode(g_317, g_316);
			appendNode(path_314, g_317);
			appendNode(path_315, g_317);
			appendNode(g_318, g_1);
			appendNode(g_319, g_318);
			appendNode(path_316, g_319);
			appendNode(path_317, g_319);
			appendNode(g_320, g_1);
			appendNode(g_321, g_320);
			appendNode(path_318, g_321);
			appendNode(path_319, g_321);
			appendNode(g_322, g_1);
			appendNode(g_323, g_322);
			appendNode(path_320, g_323);
			appendNode(path_321, g_323);
			appendNode(g_324, g_1);
			appendNode(g_325, g_324);
			appendNode(path_322, g_325);
			appendNode(path_323, g_325);
			appendNode(g_326, g_1);
			appendNode(g_327, g_326);
			appendNode(path_324, g_327);
			appendNode(path_325, g_327);
			appendNode(g_328, g_1);
			appendNode(g_329, g_328);
			appendNode(path_326, g_329);
			appendNode(path_327, g_329);
			appendNode(g_330, g_1);
			appendNode(g_331, g_330);
			appendNode(path_328, g_331);
			appendNode(path_329, g_331);
			appendNode(g_332, g_1);
			appendNode(g_333, g_332);
			appendNode(path_330, g_333);
			appendNode(path_331, g_333);
			appendNode(g_334, g_1);
			appendNode(g_335, g_334);
			appendNode(path_332, g_335);
			appendNode(path_333, g_335);
			appendNode(g_336, g_1);
			appendNode(g_337, g_336);
			appendNode(path_334, g_337);
			appendNode(path_335, g_337);
			appendNode(g_338, g_1);
			appendNode(g_339, g_338);
			appendNode(path_336, g_339);
			appendNode(path_337, g_339);
			appendNode(g_340, g_1);
			appendNode(g_341, g_340);
			appendNode(path_338, g_341);
			appendNode(path_339, g_341);
			appendNode(g_342, g);
			appendNode(path_340, g_342);
			appendNode(path_341, g_342);
			appendNode(rect_2, g);
			appendNode(rect_3, g);
			appendNode(g_343, g);
			appendNode(path_342, g_343);
			appendNode(path_343, g_343);
			appendNode(g_344, g);
			appendNode(path_344, g_344);
			appendNode(path_345, g_344);
			appendNode(rect_4, g);
			appendNode(text_1, g);
			appendNode(tspan, text_1);
			appendNode(text_2, tspan);
			appendNode(text_3, g);
			appendNode(tspan_1, text_3);
			appendNode(text_4, tspan_1);
			appendNode(g_345, g);
			appendNode(rect_5, g_345);
			appendNode(rect_6, g_345);
			appendNode(text_5, g);
			appendNode(tspan_2, text_5);
			appendNode(text_6, tspan_2);
			appendNode(text_7, g);
			appendNode(tspan_3, text_7);
			appendNode(text_8, tspan_3);
			appendNode(rect_7, g);
			appendNode(g_346, g);
			appendNode(path_346, g_346);
			appendNode(path_347, g_346);
			appendNode(g_347, g);
			appendNode(path_348, g_347);
			appendNode(path_349, g_347);
			appendNode(text_9, g);
			appendNode(tspan_4, text_9);
			appendNode(text_10, tspan_4);
			appendNode(text_11, g);
			appendNode(tspan_5, text_11);
			appendNode(text_12, tspan_5);
			appendNode(g_348, g);
			appendNode(rect_8, g_348);
			appendNode(rect_9, g_348);
			appendNode(text_13, g);
			appendNode(tspan_6, text_13);
			appendNode(text_14, tspan_6);
			appendNode(text_15, g);
			appendNode(tspan_7, text_15);
			appendNode(text_16, tspan_7);
			appendNode(rect_10, g);
			appendNode(g_349, g);
			appendNode(g_350, g_349);
			appendNode(path_350, g_350);
			appendNode(path_351, g_350);
			appendNode(text_17, g_349);
			appendNode(tspan_8, text_17);
			appendNode(text_18, tspan_8);
			appendNode(rect_11, g);
			appendNode(g_351, g);
			appendNode(g_352, g_351);
			appendNode(path_352, g_352);
			appendNode(path_353, g_352);
			appendNode(text_19, g_351);
			appendNode(tspan_9, text_19);
			appendNode(text_20, tspan_9);
			appendNode(rect_12, g);
			appendNode(rect_13, g);
			appendNode(rect_14, g);
			appendNode(rect_15, g);
			appendNode(text_21, g);
			appendNode(tspan_10, text_21);
			appendNode(text_22, tspan_10);
			appendNode(text_23, g);
			appendNode(tspan_11, text_23);
			appendNode(text_24, tspan_11);
			appendNode(text_25, g);
			appendNode(tspan_12, text_25);
			appendNode(text_26, tspan_12);
			appendNode(text_27, g);
			appendNode(tspan_13, text_27);
			appendNode(text_28, tspan_13);
			appendNode(text_29, g);
			appendNode(tspan_14, text_29);
			appendNode(text_30, tspan_14);
			appendNode(rect_16, g);
			appendNode(text_31, g);
			appendNode(tspan_15, text_31);
			appendNode(text_32, tspan_15);
			appendNode(text_33, g);
			appendNode(tspan_16, text_33);
			appendNode(text_34, tspan_16);
			appendNode(text_35, g);
			appendNode(tspan_17, text_35);
			appendNode(text_36, tspan_17);
			appendNode(image, g);
			appendNode(image_1, g);
		},

		p: function update(changed, state) {
			if (changed.publicAddress) {
				text_34.data = state.publicAddress;
			}

			if (changed.privateKey) {
				text_36.data = state.privateKey;
			}

			if (changed.publicQRCode) {
				setXlinkAttribute(image, "xlink:href", state.publicQRCode);
			}

			if (changed.privateQRCode) {
				setXlinkAttribute(image_1, "xlink:href", state.privateQRCode);
			}
		},

		u: function unmount() {
			detachNode(svg);
		},

		d: noop
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });

Multiple_wallets_component_svelte.prototype._recompute = noop;

function createSvgElement(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function createText(data) {
	return document.createTextNode(data);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function setXlinkAttribute(node, attribute, value) {
	node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function noop() {}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function blankObject() {
	return Object.create(null);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("helpers/checkCompatibility.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
                 value: true
});
exports.isCompatible = isCompatible;
function isCompatible() {
                 var isCompat = window.crypto && document.querySelector && window.Uint8Array;
                 return !!isCompat;
}
});

;require.register("helpers/objectFlatten.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = flatten;
function flatten(ob) {
	var toReturn = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

		if (_typeof(ob[i]) == 'object') {
			var flatObject = flatten(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;

				toReturn[i + '_' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
};
});

require.register("helpers/peercoin/Base58.js", function(exports, require, module) {
"use strict";

var BigInteger = require("./BigInteger");
var Base58 = function () {
    function Base58() {}
    Base58.encode = function (input) {
        var bi = BigInteger.fromByteArrayUnsigned(input);
        var chars = [];
        while (bi.compareTo(Base58.base) >= 0) {
            var mod = bi.mod(Base58.base);
            chars.unshift(Base58.alphabet[mod.intValue()]);
            bi = bi.subtract(mod).divide(Base58.base);
        }
        chars.unshift(Base58.alphabet[bi.intValue()]);
        // Convert leading zeros too.
        for (var i = 0; i < input.length; i++) {
            if (input[i] == 0x00) {
                chars.unshift(Base58.alphabet[0]);
            } else break;
        }
        return chars.join('');
    };
    /**
     * Convert a base58-encoded string to a byte array.
     *
     * Written by Mike Hearn for BitcoinJ.
     *   Copyright (c) 2011 Google Inc.
     *
     * Ported to JavaScript by Stefan Thomas.
     */
    Base58.decode = function (input) {
        var bi = BigInteger.valueOf(0);
        var leadingZerosNum = 0;
        for (var i = input.length - 1; i >= 0; i--) {
            var alphaIndex = Base58.alphabet.indexOf(input[i]);
            if (alphaIndex < 0) {
                throw "Invalid character";
            }
            bi = bi.add(BigInteger.valueOf(alphaIndex).multiply(Base58.base.pow(input.length - 1 - i)));
            // This counts leading zero bytes
            if (input[i] == "1") leadingZerosNum++;else leadingZerosNum = 0;
        }
        var bytes = bi.toByteArrayUnsigned();
        // Add leading zeros
        while (leadingZerosNum-- > 0) {
            bytes.unshift(0);
        }return bytes;
    };
    Base58.alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    Base58.validRegex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    Base58.base = BigInteger.valueOf(58);
    return Base58;
}();
module.exports = Base58;
});

require.register("helpers/peercoin/BigInteger.js", function(exports, require, module) {
"use strict";

var Classic = function () {
    function Classic(m) {
        this.m = m;
    }
    Classic.prototype.convert = function (x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);else return x;
    };
    Classic.prototype.revert = function (x) {
        return x;
    };
    Classic.prototype.reduce = function (x) {
        x.divRemTo(this.m, null, x);
    };
    Classic.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    Classic.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Classic;
}();
var Barrett = function () {
    function Barrett(m) {
        // setup Barrett
        this.r2 = BigInteger.nbi();
        this.q3 = BigInteger.nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
        this.m = m;
    }
    Barrett.prototype.convert = function (x) {
        if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);else if (x.compareTo(this.m) < 0) return x;else {
            var r = BigInteger.nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    };
    Barrett.prototype.revert = function (x) {
        return x;
    };
    // x = x mod m (HAC 14.42)
    Barrett.prototype.reduce = function (x) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
        }x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
        }
    };
    // r = x*y mod m; x,y != r
    Barrett.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // r = x^2 mod m; x != r
    Barrett.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Barrett;
}();
var Montgomery = function () {
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << BigInteger.DB - 15) - 1;
        this.mt2 = 2 * m.t;
    }
    // xR mod m
    Montgomery.prototype.convert = function (x) {
        var r = BigInteger.nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
        return r;
    };
    // x/R mod m
    Montgomery.prototype.revert = function (x) {
        var r = BigInteger.nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    };
    // x = x/R mod m (HAC 14.32)
    Montgomery.prototype.reduce = function (x) {
        while (x.t <= this.mt2) {
            x[x.t++] = 0;
        }for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & BigInteger.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= BigInteger.DV) {
                x[j] -= BigInteger.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
    };
    // r = "xy/R mod m"; x,y != r
    Montgomery.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    };
    // r = "x^2/R mod m"; x != r
    Montgomery.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
        this.reduce(r);
    };
    return Montgomery;
}();
var NullExp = function () {
    function NullExp() {}
    NullExp.prototype.convert = function (x) {
        return x;
    };
    NullExp.prototype.revert = function (x) {
        return x;
    };
    NullExp.prototype.mulTo = function (x, y, r) {
        x.multiplyTo(y, r);
    };
    NullExp.prototype.sqrTo = function (x, r) {
        x.squareTo(r);
    };
    return NullExp;
}();
/*!
 * Refactored to TypeScript
 * Basic JavaScript BN library - subset useful for RSA encryption. v1.3
 *
 * Copyright (c) 2005  Tom Wu
 * All Rights Reserved.
 * BSD License
 * http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE
 *
 * Copyright Stephan Thomas
 * Copyright bitaddress.org
 */
/////////////////////////////////////////////////////////////////
var BigInteger = function () {
    function BigInteger(a, b, c) {
        if (!BigInteger._isinitialised) BigInteger.initVars();
        if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);else if (b == null && "string" != typeof a) this.fromString(a, 256);else this.fromString(a, b);
    }
    BigInteger.nbv = function (i) {
        var r = new BigInteger(null, null, null);
        r.fromInt(i);
        return r;
    };
    BigInteger.nbi = function () {
        return new BigInteger(null, null, null);
    };
    BigInteger.initVars = function () {
        BigInteger._isinitialised = true;
        if (BigInteger.j_lm && navigator.appName == "Microsoft Internet Explorer") {
            BigInteger.prototype.am = BigInteger.prototype.am2;
            BigInteger.dbits = 30;
        } else if (BigInteger.j_lm && navigator.appName != "Netscape") {
            BigInteger.prototype.am = BigInteger.prototype.am1;
            BigInteger.dbits = 26;
        } else {
            BigInteger.prototype.am = BigInteger.prototype.am3;
            BigInteger.dbits = 28;
        }
        BigInteger.DB = BigInteger.dbits;
        BigInteger.DM = (1 << BigInteger.dbits) - 1;
        BigInteger.DV = 1 << BigInteger.dbits;
        BigInteger.BI_FP = 52;
        BigInteger.FV = Math.pow(2, BigInteger.BI_FP);
        BigInteger.F1 = BigInteger.BI_FP - BigInteger.dbits;
        BigInteger.F2 = 2 * BigInteger.dbits - BigInteger.BI_FP;
        var rr = "0".charCodeAt(0);
        for (var vv = 0; vv <= 9; ++vv) {
            BigInteger.BI_RC[rr++] = vv;
        }rr = "a".charCodeAt(0);
        for (var vv = 10; vv < 36; ++vv) {
            BigInteger.BI_RC[rr++] = vv;
        }rr = "A".charCodeAt(0);
        for (var vv = 10; vv < 36; ++vv) {
            BigInteger.BI_RC[rr++] = vv;
        }
    };
    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.
    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    BigInteger.prototype.am1 = function (i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    };
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    BigInteger.prototype.am2 = function (i, x, w, j, c, n) {
        var xl = x & 0x7fff,
            xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 0x7fff;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 0x3fffffff;
        }
        return c;
    };
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    BigInteger.prototype.am3 = function (i, x, w, j, c, n) {
        var xl = x & 0x3fff,
            xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 0x3fff;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 0xfffffff;
        }
        return c;
    };
    BigInteger.prototype.am = function (i, x, w, j, c, n) {
        throw "class not initialised";
        return c;
    };
    BigInteger.prototype.fromInt = function (x) {
        this.t = 1;
        this.s = x < 0 ? -1 : 0;
        if (x > 0) this[0] = x;else if (x < -1) this[0] = x + BigInteger.DV;else this.t = 0;
    };
    /**
     * Turns a byte array into a big integer.
     *
     * This function will interpret a byte array as a big integer in big
     * endian notation and ignore leading zeros.
     */
    BigInteger.fromByteArrayUnsigned = function (ba) {
        if (!ba.length) {
            return BigInteger.nbv(0);
        } else if (ba[0] & 0x80) {
            // Prepend a zero so the BigInteger class doesn't mistake this
            // for a negative integer.
            return new BigInteger([0].concat(ba), null, null);
        } else {
            return new BigInteger(ba, null, null);
        }
    };
    BigInteger.prototype.toByteArrayUnsigned = function () {
        var ba = this.abs().toByteArray();
        if (ba.length) {
            if (ba[0] == 0) {
                ba = ba.slice(1);
            }
            return ba.map(function (v) {
                return v < 0 ? v + 256 : v;
            });
        } else {
            // Empty array, nothing to do
            return ba;
        }
    };
    BigInteger.prototype.fromString = function (s, b) {
        var k;
        if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 256) k = 8; // byte array
        else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else {
                this.fromRadix(s, b);
                return;
            }
        this.t = 0;
        this.s = 0;
        var i = s.length,
            mi = false,
            sh = 0;
        while (--i >= 0) {
            var x = k == 8 ? s[i] & 0xff : this.intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-") mi = true;
                continue;
            }
            mi = false;
            if (sh == 0) this[this.t++] = x;else if (sh + k > BigInteger.DB) {
                this[this.t - 1] |= (x & (1 << BigInteger.DB - sh) - 1) << sh;
                this[this.t++] = x >> BigInteger.DB - sh;
            } else this[this.t - 1] |= x << sh;
            sh += k;
            if (sh >= BigInteger.DB) sh -= BigInteger.DB;
        }
        if (k == 8 && (s[0] & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) this[this.t - 1] |= (1 << BigInteger.DB - sh) - 1 << sh;
        }
        this.clamp();
        if (mi) BigInteger.ZERO.subTo(this, this);
    };
    BigInteger.prototype.fromRadix = function (s, b) {
        this.fromInt(0);
        if (b == null) b = 10;
        var cs = this.chunkSize(b);
        var d = Math.pow(b, cs),
            mi = false,
            j = 0,
            w = 0;
        for (var i = 0; i < s.length; ++i) {
            var x = this.intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
                continue;
            }
            w = b * w + x;
            if (++j >= cs) {
                this.dMultiply(d);
                this.dAddOffset(w, 0);
                j = 0;
                w = 0;
            }
        }
        if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
        }
        if (mi) BigInteger.ZERO.subTo(this, this);
    };
    // (protected) alternate constructor
    BigInteger.prototype.fromNumber = function (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) this.fromInt(1);else {
                this.fromNumber(a, c, null);
                if (!this.testBit(a - 1)) this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), this.op_or, this);
                if (this.isEven()) this.dAddOffset(1, 0); // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                }
            }
        } else {
            // new BigInteger(int,RNG)
            var x = new Array(),
                t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) x[0] &= (1 << t) - 1;else x[0] = 0;
            this.fromString(x, 256);
        }
    };
    BigInteger.prototype.toRadix = function (b) {
        if (b == null) b = 10;
        if (this.signum() == 0 || b < 2 || b > 36) return "0";
        var cs = this.chunkSize(b);
        var a = Math.pow(b, cs);
        var d = BigInteger.nbv(a),
            y = BigInteger.nbi(),
            z = BigInteger.nbi(),
            r = "";
        this.divRemTo(d, y, z);
        while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
        }
        return z.intValue().toString(b) + r;
    };
    BigInteger.prototype.compareTo = function (a) {
        var r = this.s - a.s;
        if (r != 0) return r;
        var i = this.t;
        r = i - a.t;
        if (r != 0) return this.s < 0 ? -r : r;
        while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) return r;
        }return 0;
    };
    BigInteger.prototype.op_xor = function (x, y) {
        return x ^ y;
    };
    BigInteger.prototype.op_andnot = function (x, y) {
        return x & ~y;
    };
    BigInteger.prototype.andNot = function (a) {
        var r = BigInteger.nbi();
        this.bitwiseTo(a, this.op_andnot, r);
        return r;
    };
    BigInteger.prototype.op_and = function (x, y) {
        return x & y;
    };
    BigInteger.prototype.and = function (a) {
        var r = BigInteger.nbi();
        this.bitwiseTo(a, this.op_and, r);
        return r;
    };
    // (public) ~this
    BigInteger.prototype.not = function () {
        var r = BigInteger.nbi();
        for (var i = 0; i < this.t; ++i) {
            r[i] = BigInteger.DM & ~this[i];
        }r.t = this.t;
        r.s = ~this.s;
        return r;
    };
    BigInteger.prototype.bitLength = function () {
        if (this.t <= 0) return 0;
        return BigInteger.DB * (this.t - 1) + this.nbits(this[this.t - 1] ^ this.s & BigInteger.DM);
    };
    BigInteger.prototype.signum = function () {
        if (this.s < 0) return -1;else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;else return 1;
    };
    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    BigInteger.prototype.invDigit = function () {
        if (this.t < 1) return 0;
        var x = this[0];
        if ((x & 1) == 0) return 0;
        var y = x & 3; // y == 1/x mod 2^2
        y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4
        y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8
        y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
        // last step - calculate inverse mod DV directly;
        // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
        y = y * (2 - x * y % BigInteger.DV) % BigInteger.DV; // y == 1/x mod 2^dbits
        // we really want the negative inverse, and -DV < y < DV
        return y > 0 ? BigInteger.DV - y : -y;
    };
    // return index of lowest 1-bit in x, x < 2^31
    BigInteger.prototype.lbit = function (x) {
        if (x == 0) return -1;
        var r = 0;
        if ((x & 0xffff) == 0) {
            x >>= 16;
            r += 16;
        }
        if ((x & 0xff) == 0) {
            x >>= 8;
            r += 8;
        }
        if ((x & 0xf) == 0) {
            x >>= 4;
            r += 4;
        }
        if ((x & 3) == 0) {
            x >>= 2;
            r += 2;
        }
        if ((x & 1) == 0) ++r;
        return r;
    };
    // return number of 1 bits in x
    BigInteger.prototype.cbit = function (x) {
        var r = 0;
        while (x != 0) {
            x &= x - 1;
            ++r;
        }
        return r;
    };
    // (public) returns index of lowest 1-bit (or -1 if none)
    BigInteger.prototype.getLowestSetBit = function () {
        for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) return i * BigInteger.DB + this.lbit(this[i]);
        }if (this.s < 0) return this.t * BigInteger.DB;
        return -1;
    };
    // (public) return number of set bits
    BigInteger.prototype.bitCount = function () {
        var r = 0,
            x = this.s & BigInteger.DM;
        for (var i = 0; i < this.t; ++i) {
            r += this.cbit(this[i] ^ x);
        }return r;
    };
    // (public) true iff nth bit is set
    BigInteger.prototype.testBit = function (n) {
        var j = Math.floor(n / BigInteger.DB);
        if (j >= this.t) return this.s != 0;
        return (this[j] & 1 << n % BigInteger.DB) != 0;
    };
    BigInteger.prototype.setBit = function (n) {
        return this.changeBit(n, this.op_or);
    };
    BigInteger.prototype.clearBit = function (n) {
        return this.changeBit(n, this.op_andnot);
    };
    BigInteger.prototype.flipBit = function (n) {
        return this.changeBit(n, this.op_xor);
    };
    // (public) this + a
    BigInteger.prototype.add = function (a) {
        var r = BigInteger.nbi();
        this.addTo(a, r);
        return r;
    };
    BigInteger.prototype.subtract = function (a) {
        var r = BigInteger.nbi();
        this.subTo(a, r);
        return r;
    };
    BigInteger.prototype.multiply = function (a) {
        var r = BigInteger.nbi();
        this.multiplyTo(a, r);
        return r;
    };
    // (public) this / a
    BigInteger.prototype.divide = function (a) {
        var r = BigInteger.nbi();
        this.divRemTo(a, r, null);
        return r;
    };
    // (public) this % a
    BigInteger.prototype.remainder = function (a) {
        var r = BigInteger.nbi();
        this.divRemTo(a, null, r);
        return r;
    };
    // (public) [this/a,this%a]
    BigInteger.prototype.divideAndRemainder = function (a) {
        var q = BigInteger.nbi(),
            r = BigInteger.nbi();
        this.divRemTo(a, q, r);
        return new Array(q, r);
    };
    BigInteger.prototype.negate = function () {
        var r = BigInteger.nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    };
    BigInteger.prototype.mod = function (a) {
        var r = BigInteger.nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
        return r;
    };
    BigInteger.prototype.squareTo = function (r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0) {
            r[i] = 0;
        }for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= BigInteger.DV) {
                r[i + x.t] -= BigInteger.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        r.s = 0;
        r.clamp();
    };
    BigInteger.prototype.op_or = function (x, y) {
        return x | y;
    };
    BigInteger.prototype.shiftLeft = function (n) {
        var r = BigInteger.nbi();
        if (n < 0) this.rShiftTo(-n, r);else this.lShiftTo(n, r);
        return r;
    };
    BigInteger.prototype.abs = function () {
        return this.s < 0 ? this.negate() : this;
    };
    BigInteger.prototype.isProbablePrime = function (t) {
        var lplen = BigInteger.lowprimes.length;
        var i,
            x = this.abs();
        if (x.t == 1 && x[0] <= BigInteger.lowprimes[lplen - 1]) {
            for (i = 0; i < lplen; ++i) {
                if (x[0] == BigInteger.lowprimes[i]) return true;
            }return false;
        }
        if (x.isEven()) return false;
        i = 1;
        while (i < lplen) {
            var m = BigInteger.lowprimes[i],
                j = i + 1;
            while (j < lplen && m < BigInteger.lplim) {
                m *= BigInteger.lowprimes[j++];
            }m = x.modInt(m);
            while (i < j) {
                if (m % BigInteger.lowprimes[i++] == 0) return false;
            }
        }
        return x.millerRabin(t);
    };
    // (public)
    BigInteger.prototype.clone = function () {
        var r = BigInteger.nbi();
        this.copyTo(r);
        return r;
    };
    // (public) return value as integer
    BigInteger.prototype.intValue = function () {
        if (this.s < 0) {
            if (this.t == 1) return this[0] - BigInteger.DV;else if (this.t == 0) return -1;
        } else if (this.t == 1) return this[0];else if (this.t == 0) return 0;
        // assumes 16 < DB < 32
        return (this[1] & (1 << 32 - BigInteger.DB) - 1) << BigInteger.DB | this[0];
    };
    // (public) return value as byte
    BigInteger.prototype.byteValue = function () {
        return this.t == 0 ? this.s : this[0] << 24 >> 24;
    };
    // (public) return value as short (assumes DB>=16)
    BigInteger.prototype.shortValue = function () {
        return this.t == 0 ? this.s : this[0] << 16 >> 16;
    };
    // (public) convert to bigendian byte array
    BigInteger.prototype.toByteArray = function () {
        var i = this.t,
            r = new Array();
        r[0] = this.s;
        var p = BigInteger.DB - i * BigInteger.DB % 8,
            d,
            k = 0;
        if (i-- > 0) {
            if (p < BigInteger.DB && (d = this[i] >> p) != (this.s & BigInteger.DM) >> p) r[k++] = d | this.s << BigInteger.DB - p;
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & (1 << p) - 1) << 8 - p;
                    d |= this[--i] >> (p += BigInteger.DB - 8);
                } else {
                    d = this[i] >> (p -= 8) & 0xff;
                    if (p <= 0) {
                        p += BigInteger.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0) d |= -256;
                if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
                if (k > 0 || d != this.s) r[k++] = d;
            }
        }
        return r;
    };
    BigInteger.prototype.equals = function (a) {
        return this.compareTo(a) == 0;
    };
    BigInteger.prototype.min = function (a) {
        return this.compareTo(a) < 0 ? this : a;
    };
    BigInteger.prototype.max = function (a) {
        return this.compareTo(a) > 0 ? this : a;
    };
    BigInteger.prototype.lShiftTo = function (n, r) {
        var bs = n % BigInteger.DB;
        var cbs = BigInteger.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / BigInteger.DB),
            c = this.s << bs & BigInteger.DM,
            i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = this[i] >> cbs | c;
            c = (this[i] & bm) << bs;
        }
        for (i = ds - 1; i >= 0; --i) {
            r[i] = 0;
        }r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    };
    BigInteger.prototype.rShiftTo = function (n, r) {
        r.s = this.s;
        var ds = Math.floor(n / BigInteger.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % BigInteger.DB;
        var cbs = BigInteger.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
    };
    BigInteger.prototype.clamp = function () {
        var c = this.s & BigInteger.DM;
        while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
        }
    };
    BigInteger.prototype.nbits = function (x) {
        var r = 1,
            t;
        if ((t = x >>> 16) != 0) {
            x = t;
            r += 16;
        }
        if ((t = x >> 8) != 0) {
            x = t;
            r += 8;
        }
        if ((t = x >> 4) != 0) {
            x = t;
            r += 4;
        }
        if ((t = x >> 2) != 0) {
            x = t;
            r += 2;
        }
        if ((t = x >> 1) != 0) {
            x = t;
            r += 1;
        }
        return r;
    };
    BigInteger.prototype.shiftRight = function (n) {
        var r = BigInteger.nbi();
        if (n < 0) this.lShiftTo(-n, r);else this.rShiftTo(n, r);
        return r;
    };
    // (public) 1/this % m (HAC 14.61)
    BigInteger.prototype.modInverse = function (m) {
        var ac = m.isEven();
        if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
        var u = m.clone(),
            v = this.clone();
        var a = BigInteger.nbv(1),
            b = BigInteger.nbv(0),
            c = BigInteger.nbv(0),
            d = BigInteger.nbv(1);
        while (u.signum() != 0) {
            while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                    if (!a.isEven() || !b.isEven()) {
                        a.addTo(this, a);
                        b.subTo(m, b);
                    }
                    a.rShiftTo(1, a);
                } else if (!b.isEven()) b.subTo(m, b);
                b.rShiftTo(1, b);
            }
            while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                    if (!c.isEven() || !d.isEven()) {
                        c.addTo(this, c);
                        d.subTo(m, d);
                    }
                    c.rShiftTo(1, c);
                } else if (!d.isEven()) d.subTo(m, d);
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) a.subTo(c, a);
                b.subTo(d, b);
            } else {
                v.subTo(u, v);
                if (ac) c.subTo(a, c);
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
        if (d.compareTo(m) >= 0) return d.subtract(m);
        if (d.signum() < 0) d.addTo(m, d);else return d;
        if (d.signum() < 0) return d.add(m);else return d;
    };
    // (public) return string representation in given radix
    BigInteger.prototype.toString = function (b) {
        if (this.s < 0) return "-" + this.negate().toString(b);
        var k;
        if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else return this.toRadix(b);
        var km = (1 << k) - 1,
            d,
            m = false,
            r = "",
            i = this.t;
        var p = BigInteger.DB - i * BigInteger.DB % k;
        if (i-- > 0) {
            if (p < BigInteger.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = this.int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & (1 << p) - 1) << k - p;
                    d |= this[--i] >> (p += BigInteger.DB - k);
                } else {
                    d = this[i] >> (p -= k) & km;
                    if (p <= 0) {
                        p += BigInteger.DB;
                        --i;
                    }
                }
                if (d > 0) m = true;
                if (m) r += this.int2char(d);
            }
        }
        return m ? r : "0";
    };
    // (public) gcd(this,a) (HAC 14.54)
    BigInteger.prototype.gcd = function (a) {
        var x = this.s < 0 ? this.negate() : this.clone();
        var y = a.s < 0 ? a.negate() : a.clone();
        if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
        }
        var i = x.getLowestSetBit(),
            g = y.getLowestSetBit();
        if (g < 0) return x;
        if (i < g) g = i;
        if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
        }
        while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
            if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
            if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
            } else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
            }
        }
        if (g > 0) y.lShiftTo(g, y);
        return y;
    };
    BigInteger.prototype.drShiftTo = function (n, r) {
        for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
        }r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    };
    BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0) {
            r[--i] = 0;
        }var j;
        for (j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        }for (j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
        }r.clamp();
    };
    BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0) {
            r[i] = 0;
        }for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        }r.clamp();
        r.drShiftTo(1, r);
    };
    BigInteger.prototype.dlShiftTo = function (n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
        }for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
        }r.t = this.t + n;
        r.s = this.s;
    };
    BigInteger.prototype.copyTo = function (r) {
        for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
        }r.t = this.t;
        r.s = this.s;
    };
    BigInteger.prototype.bitwiseTo = function (a, op, r) {
        var i,
            f,
            m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
        }if (a.t < this.t) {
            f = a.s & BigInteger.DM;
            for (i = m; i < this.t; ++i) {
                r[i] = op(this[i], f);
            }r.t = this.t;
        } else {
            f = this.s & BigInteger.DM;
            for (i = m; i < a.t; ++i) {
                r[i] = op(f, a[i]);
            }r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    };
    BigInteger.prototype.isEven = function () {
        return (this.t > 0 ? this[0] & 1 : this.s) == 0;
    };
    BigInteger.prototype.dAddOffset = function (n, w) {
        if (n == 0) return;
        while (this.t <= w) {
            this[this.t++] = 0;
        }this[w] += n;
        while (this[w] >= BigInteger.DV) {
            this[w] -= BigInteger.DV;
            if (++w >= this.t) this[this.t++] = 0;
            ++this[w];
        }
    };
    BigInteger.prototype.modInt = function (n) {
        if (n <= 0) return 0;
        var d = BigInteger.DV % n,
            r = this.s < 0 ? n - 1 : 0;
        if (this.t > 0) if (d == 0) r = this[0] % n;else for (var i = this.t - 1; i >= 0; --i) {
            r = (d * r + this[i]) % n;
        }return r;
    };
    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    BigInteger.prototype.millerRabin = function (t) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0) return false;
        var r = n1.shiftRight(k);
        t = t + 1 >> 1;
        if (t > BigInteger.lowprimes.length) t = BigInteger.lowprimes.length;
        var a = BigInteger.nbi();
        for (var i = 0; i < t; ++i) {
            //Pick bases at random, instead of starting at 2
            a.fromInt(BigInteger.lowprimes[Math.floor(Math.random() * BigInteger.lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0) return false;
                }
                if (y.compareTo(n1) != 0) return false;
            }
        }
        return true;
    };
    BigInteger.prototype.subTo = function (a, r) {
        var i = 0,
            c = 0,
            m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & BigInteger.DM;
            c >>= BigInteger.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & BigInteger.DM;
                c >>= BigInteger.DB;
            }
            c += this.s;
        } else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & BigInteger.DM;
                c >>= BigInteger.DB;
            }
            c -= a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c < -1) r[i++] = BigInteger.DV + c;else if (c > 0) r[i++] = c;
        r.t = i;
        r.clamp();
    };
    BigInteger.prototype.multiplyTo = function (a, r) {
        var x = this.abs(),
            y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0) {
            r[i] = 0;
        }for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        }r.s = 0;
        r.clamp();
        if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
    };
    BigInteger.prototype.changeBit = function (n, op) {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    };
    BigInteger.prototype.addTo = function (a, r) {
        var i = 0,
            c = 0,
            m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & BigInteger.DM;
            c >>= BigInteger.DB;
        }
        if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & BigInteger.DM;
                c >>= BigInteger.DB;
            }
            c += this.s;
        } else {
            c += this.s;
            while (i < a.t) {
                c += a[i];
                r[i++] = c & BigInteger.DM;
                c >>= BigInteger.DB;
            }
            c += a.s;
        }
        r.s = c < 0 ? -1 : 0;
        if (c > 0) r[i++] = c;else if (c < -1) r[i++] = BigInteger.DV + c;
        r.t = i;
        r.clamp();
    };
    BigInteger.prototype.divRemTo = function (m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0) return;
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null) q.fromInt(0);
            if (r != null) this.copyTo(r);
            return;
        }
        if (r == null) r = BigInteger.nbi();
        var y = BigInteger.nbi(),
            ts = this.s,
            ms = m.s;
        var nsh = BigInteger.DB - this.nbits(pm[pm.t - 1]); // normalize modulus
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        } else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0) return;
        var yt = y0 * (1 << BigInteger.F1) + (ys > 1 ? y[ys - 2] >> BigInteger.F2 : 0);
        var d1 = BigInteger.FV / yt,
            d2 = (1 << BigInteger.F1) / yt,
            e = 1 << BigInteger.F2;
        var i = r.t,
            j = i - ys,
            t = q == null ? BigInteger.nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys) {
            y[y.t++] = 0;
        }while (--j >= 0) {
            // Estimate quotient digit
            var qd = r[--i] == y0 ? BigInteger.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) {
                    r.subTo(t, r);
                }
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) BigInteger.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
        if (ts < 0) BigInteger.ZERO.subTo(r, r);
    };
    BigInteger.prototype.int2char = function (n) {
        return BigInteger.BI_RM.charAt(n);
    };
    BigInteger.prototype.intAt = function (s, i) {
        var c = BigInteger.BI_RC[s.charCodeAt(i)];
        return c == null ? -1 : c;
    };
    BigInteger.prototype.dMultiply = function (n) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    };
    BigInteger.prototype.chunkSize = function (r) {
        return Math.floor(Math.LN2 * BigInteger.DB / Math.log(r));
    };
    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    BigInteger.prototype.exp = function (e, z) {
        if (e > 0xffffffff || e < 1) return BigInteger.ONE;
        var r = BigInteger.nbi(),
            r2 = BigInteger.nbi(),
            g = z.convert(this),
            i = this.nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & 1 << i) > 0) z.mulTo(r2, g, r);else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    };
    BigInteger.prototype.square = function () {
        var e = BigInteger.nbi();
        this.squareTo(e);
        return e;
    };
    BigInteger.prototype.pow = function (e) {
        return this.exp(e, new NullExp());
    };
    BigInteger.prototype.modPow = function (e, m) {
        var i = e.bitLength(),
            k,
            r = BigInteger.nbv(1),
            z;
        if (i <= 0) return r;else if (i < 18) k = 1;else if (i < 48) k = 3;else if (i < 144) k = 4;else if (i < 768) k = 5;else k = 6;
        if (i < 8) z = new Classic(m);else if (m.isEven()) z = new Barrett(m);else z = new Montgomery(m);
        // precomputation
        var g = new Array(),
            n = 3,
            k1 = k - 1,
            km = (1 << k) - 1;
        g[1] = z.convert(this);
        if (k > 1) {
            var g2 = BigInteger.nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
                g[n] = BigInteger.nbi();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
            }
        }
        var j = e.t - 1,
            w,
            is1 = true,
            r2 = BigInteger.nbi(),
            t;
        i = this.nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1) w = e[j] >> i - k1 & km;else {
                w = (e[j] & (1 << i + 1) - 1) << k1 - i;
                if (j > 0) w |= e[j - 1] >> BigInteger.DB + i - k1;
            }
            n = k;
            while ((w & 1) == 0) {
                w >>= 1;
                --n;
            }
            if ((i -= n) < 0) {
                i += BigInteger.DB;
                --j;
            }
            if (is1) {
                g[w].copyTo(r);
                is1 = false;
            } else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0) z.sqrTo(r, r2);else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & 1 << i) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                    i = BigInteger.DB - 1;
                    --j;
                }
            }
        }
        return z.revert(r);
    };
    BigInteger._isinitialised = false;
    BigInteger.canary = 0xdeadbeefcafe;
    BigInteger.j_lm = (BigInteger.canary & 0xffffff) == 0xefcafe;
    BigInteger.BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    BigInteger.BI_RC = [];
    BigInteger.lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
    BigInteger.lplim = (1 << 26) / BigInteger.lowprimes[BigInteger.lowprimes.length - 1];
    BigInteger.valueOf = BigInteger.nbv;
    BigInteger.ZERO = BigInteger.nbv(0);
    BigInteger.ONE = BigInteger.nbv(1);
    return BigInteger;
}();
module.exports = BigInteger;
});

require.register("helpers/peercoin/ECurve.js", function(exports, require, module) {
"use strict";

var BigInteger = require("./BigInteger");
function integerToBytes(e, t) {
    var n = e.toByteArrayUnsigned();
    if (t < n.length) n = n.slice(n.length - t);else while (t > n.length) {
        n.unshift(0);
    }return n;
}
function secp256k1() {
    var e = new BigInteger("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16),
        t = BigInteger.ZERO,
        n = new BigInteger("7", 16),
        r = new BigInteger("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16),
        i = BigInteger.ONE,
        s = new ECCurveFp(e, t, n),
        o = s.decodePointHex("0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");
    return new X9ECParameters(s, o, r, i);
}
exports.secp256k1 = secp256k1;
// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
function getPublicKey(bn) {
    var curve = secp256k1();
    var curvePt = curve.getG().multiply(bn);
    var x = curvePt.getX().toBigInteger();
    var y = curvePt.getY().toBigInteger();
    // returns x,y as big ints
    return {
        x: bytesToHex(integerToBytes(x, 32)),
        y: bytesToHex(integerToBytes(y, 32)),
        yParity: y.isEven() ? "even" : "odd"
    };
}
exports.getPublicKey = getPublicKey;
var ECFieldElementFp = function () {
    function ECFieldElementFp(e, t) {
        this.x = t, this.q = e;
    }
    ECFieldElementFp.prototype.equals = function (e) {
        return e == this ? !0 : this.q.equals(e.q) && this.x.equals(e.x);
    };
    ECFieldElementFp.prototype.toBigInteger = function () {
        return this.x;
    };
    ECFieldElementFp.prototype.negate = function () {
        return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
    };
    ECFieldElementFp.prototype.add = function (e) {
        return new ECFieldElementFp(this.q, this.x.add(e.toBigInteger()).mod(this.q));
    };
    ECFieldElementFp.prototype.subtract = function (e) {
        return new ECFieldElementFp(this.q, this.x.subtract(e.toBigInteger()).mod(this.q));
    };
    ECFieldElementFp.prototype.multiply = function (e) {
        return new ECFieldElementFp(this.q, this.x.multiply(e.toBigInteger()).mod(this.q));
    };
    ECFieldElementFp.prototype.square = function () {
        return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
    };
    ECFieldElementFp.prototype.divide = function (e) {
        return new ECFieldElementFp(this.q, this.x.multiply(e.toBigInteger().modInverse(this.q)).mod(this.q));
    };
    ECFieldElementFp.prototype.getByteLength = function () {
        return Math.floor((this.toBigInteger().bitLength() + 7) / 8);
    };
    return ECFieldElementFp;
}();
exports.ECFieldElementFp = ECFieldElementFp; //class fieldelement
var ECCurveFp = function () {
    function ECCurveFp(e, t, n) {
        this.q = e, this.a = this.fromBigInteger(t), this.b = this.fromBigInteger(n), this.infinity = new ECPointFp(this, null, null);
    }
    ECCurveFp.prototype.getQ = function () {
        return this.q;
    };
    ECCurveFp.prototype.getA = function () {
        return this.a;
    };
    ECCurveFp.prototype.getB = function () {
        return this.b;
    };
    ECCurveFp.prototype.equals = function (e) {
        return e == this ? !0 : this.q.equals(e.q) && this.a.equals(e.a) && this.b.equals(e.b);
    };
    ECCurveFp.prototype.getInfinity = function () {
        return this.infinity;
    };
    ECCurveFp.prototype.fromBigInteger = function (e) {
        return new ECFieldElementFp(this.q, e);
    };
    ECCurveFp.prototype.decodePointHex = function (e) {
        switch (parseInt(e.substr(0, 2), 16)) {
            case 0:
                return this.infinity;
            case 2:
            case 3:
                return null;
            case 4:
            case 6:
            case 7:
                var t = (e.length - 2) / 2,
                    n = e.substr(2, t),
                    r = e.substr(t + 2, t);
                return new ECPointFp(this, this.fromBigInteger(new BigInteger(n, 16)), this.fromBigInteger(new BigInteger(r, 16)));
            default:
                return null;
        }
    };
    return ECCurveFp;
}();
exports.ECCurveFp = ECCurveFp; //class ECCurveFp
var ECPointFp = function () {
    function ECPointFp(e, t, n, r) {
        this.curve = e;
        this.x = t;
        this.y = n;
        r == null ? this.z = BigInteger.ONE : this.z = r;
        this.zinv = null;
    }
    ECPointFp.prototype.getX = function () {
        return this.zinv == null && (this.zinv = this.z.modInverse(this.curve.q)), this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    };
    ECPointFp.prototype.getY = function () {
        return this.zinv == null && (this.zinv = this.z.modInverse(this.curve.q)), this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    };
    ECPointFp.prototype.equals = function (e) {
        if (e == this) return !0;
        if (this.isInfinity()) return e.isInfinity();
        if (e.isInfinity()) return this.isInfinity();
        var t, n;
        return t = e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q), t.equals(BigInteger.ZERO) ? (n = e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q), n.equals(BigInteger.ZERO)) : !1;
    };
    ECPointFp.prototype.isInfinity = function () {
        return this.x == null && this.y == null ? !0 : this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
    };
    ECPointFp.prototype.negate = function () {
        return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
    };
    ECPointFp.prototype.add = function (e) {
        if (this.isInfinity()) return e;
        if (e.isInfinity()) return this;
        var t = e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q),
            n = e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q);
        if (BigInteger.ZERO.equals(n)) return BigInteger.ZERO.equals(t) ? this.twice() : this.curve.getInfinity();
        var r = new BigInteger("3"),
            i = this.x.toBigInteger(),
            s = this.y.toBigInteger(),
            o = e.x.toBigInteger(),
            u = e.y.toBigInteger(),
            a = n.square(),
            f = a.multiply(n),
            l = i.multiply(a),
            c = t.square().multiply(this.z),
            h = c.subtract(l.shiftLeft(1)).multiply(e.z).subtract(f).multiply(n).mod(this.curve.q),
            p = l.multiply(r).multiply(t).subtract(s.multiply(f)).subtract(c.multiply(t)).multiply(e.z).add(t.multiply(f)).mod(this.curve.q),
            d = f.multiply(this.z).multiply(e.z).mod(this.curve.q);
        return new ECPointFp(this.curve, this.curve.fromBigInteger(h), this.curve.fromBigInteger(p), d);
    };
    ECPointFp.prototype.twice = function () {
        if (this.isInfinity()) return this;
        if (this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();
        var e = new BigInteger("3"),
            t = this.x.toBigInteger(),
            n = this.y.toBigInteger(),
            r = n.multiply(this.z),
            i = r.multiply(n).mod(this.curve.q),
            s = this.curve.a.toBigInteger(),
            o = t.square().multiply(e);
        BigInteger.ZERO.equals(s) || (o = o.add(this.z.square().multiply(s))), o = o.mod(this.curve.q);
        var u = o.square().subtract(t.shiftLeft(3).multiply(i)).shiftLeft(1).multiply(r).mod(this.curve.q),
            a = o.multiply(e).multiply(t).subtract(i.shiftLeft(1)).shiftLeft(2).multiply(i).subtract(o.square().multiply(o)).mod(this.curve.q),
            f = r.square().multiply(r).shiftLeft(3).mod(this.curve.q);
        return new ECPointFp(this.curve, this.curve.fromBigInteger(u), this.curve.fromBigInteger(a), f);
    };
    ECPointFp.prototype.multiply = function (e) {
        if (this.isInfinity()) return this;
        if (e.signum() == 0) return this.curve.getInfinity();
        var t = e,
            n = t.multiply(new BigInteger("3")),
            r = this.negate(),
            i = this,
            s;
        for (s = n.bitLength() - 2; s > 0; --s) {
            i = i.twice();
            var o = n.testBit(s),
                u = t.testBit(s);
            o != u && (i = i.add(o ? this : r));
        }
        return i;
    };
    ECPointFp.prototype.multiplyTwo = function (e, t, n) {
        var r;
        e.bitLength() > n.bitLength() ? r = e.bitLength() - 1 : r = n.bitLength() - 1;
        var i = this.curve.getInfinity(),
            s = this.add(t);
        while (r >= 0) {
            i = i.twice(), e.testBit(r) ? n.testBit(r) ? i = i.add(s) : i = i.add(this) : n.testBit(r) && (i = i.add(t)), --r;
        }return i;
    };
    ECPointFp.prototype.getEncoded = function (e) {
        var t = this.getX().toBigInteger(),
            n = this.getY().toBigInteger(),
            r = integerToBytes(t, 32);
        return e ? n.isEven() ? r.unshift(2) : r.unshift(3) : (r.unshift(4), r = r.concat(integerToBytes(n, 32))), r;
    };
    ECPointFp.prototype.decodeFrom = function (e, t) {
        var n = t[0],
            r = t.length - 1,
            i = t.slice(1, 1 + r / 2),
            s = t.slice(1 + r / 2, 1 + r);
        i.unshift(0), s.unshift(0);
        var o = new BigInteger(i),
            u = new BigInteger(s);
        return new ECPointFp(e, e.fromBigInteger(o), e.fromBigInteger(u));
    };
    ECPointFp.prototype.add2D = function (e) {
        if (this.isInfinity()) return e;
        if (e.isInfinity()) return this;
        if (this.x.equals(e.x)) return this.y.equals(e.y) ? this.twice() : this.curve.getInfinity();
        var t = e.x.subtract(this.x),
            n = e.y.subtract(this.y),
            r = n.divide(t),
            i = r.square().subtract(this.x).subtract(e.x),
            s = r.multiply(this.x.subtract(i)).subtract(this.y);
        return new ECPointFp(this.curve, i, s);
    };
    ECPointFp.prototype.twice2D = function () {
        if (this.isInfinity()) return this;
        if (this.y.toBigInteger().signum() == 0) return this.curve.getInfinity();
        var e = this.curve.fromBigInteger(BigInteger.valueOf(2)),
            t = this.curve.fromBigInteger(BigInteger.valueOf(3)),
            n = this.x.square().multiply(t).add(this.curve.a).divide(this.y.multiply(e)),
            r = n.square().subtract(this.x.multiply(e)),
            i = n.multiply(this.x.subtract(r)).subtract(this.y);
        return new ECPointFp(this.curve, r, i);
    };
    ECPointFp.prototype.multiply2D = function (e) {
        if (this.isInfinity()) return this;
        if (e.signum() == 0) return this.curve.getInfinity();
        var t = e,
            n = t.multiply(new BigInteger("3")),
            r = this.negate(),
            i = this,
            s;
        for (s = n.bitLength() - 2; s > 0; --s) {
            i = i.twice();
            var o = n.testBit(s),
                u = t.testBit(s);
            o != u && (i = i.add2D(o ? this : r));
        }
        return i;
    };
    ECPointFp.prototype.isOnCurve = function () {
        var e = this.getX().toBigInteger(),
            t = this.getY().toBigInteger(),
            n = this.curve.getA().toBigInteger(),
            r = this.curve.getB().toBigInteger(),
            i = this.curve.getQ(),
            s = t.multiply(t).mod(i),
            o = e.multiply(e).multiply(e).add(n.multiply(e)).add(r).mod(i);
        return s.equals(o);
    };
    ECPointFp.prototype.toString = function () {
        return "(" + this.getX().toBigInteger().toString() + "," + this.getY().toBigInteger().toString() + ")";
    };
    ECPointFp.prototype.validate = function () {
        var e = this.curve.getQ();
        if (this.isInfinity()) throw new Error("Point is at infinity.");
        var t = this.getX().toBigInteger(),
            n = this.getY().toBigInteger();
        if (t.compareTo(BigInteger.ONE) < 0 || t.compareTo(e.subtract(BigInteger.ONE)) > 0) throw new Error("x coordinate out of bounds");
        if (n.compareTo(BigInteger.ONE) < 0 || n.compareTo(e.subtract(BigInteger.ONE)) > 0) throw new Error("y coordinate out of bounds");
        if (!this.isOnCurve()) throw new Error("Point is not on the curve.");
        if (this.multiply(e).isInfinity()) throw new Error("Point is not a scalar multiple of G.");
        return !0;
    };
    return ECPointFp;
}();
exports.ECPointFp = ECPointFp; //class ECPointFp
var X9ECParameters = function () {
    function X9ECParameters(e, t, n, r) {
        this.curve = e, this.g = t, this.n = n, this.h = r;
    }
    X9ECParameters.prototype.getCurve = function () {
        return this.curve;
    };
    X9ECParameters.prototype.getG = function () {
        return this.g;
    };
    X9ECParameters.prototype.getN = function () {
        return this.n;
    };
    X9ECParameters.prototype.getH = function () {
        return this.h;
    };
    X9ECParameters.prototype.fromHex = function (e) {
        return new BigInteger(e, 16);
    };
    return X9ECParameters;
}();
exports.X9ECParameters = X9ECParameters;
});

require.register("helpers/peercoin/Peercoin.js", function(exports, require, module) {
"use strict";

var BigInteger = require("./BigInteger");
var Base58 = require("./Base58");
//module Peercoin {
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var Crypto = function () {
    function Crypto() {}
    // Bit-wise rotate left
    Crypto.rotl = function (n, b) {
        return n << b | n >>> 32 - b;
    };
    // Bit-wise rotate right
    Crypto.rotr = function (n, b) {
        return n << 32 - b | n >>> b;
    };
    // Swap big-endian to little-endian and vice versa
    Crypto.endian = function (n) {
        // If number given, swap endian
        if (n.constructor == Number) {
            return Crypto.rotl(n, 8) & 0x00FF00FF | Crypto.rotl(n, 24) & 0xFF00FF00;
        }
        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++) {
            n[i] = Crypto.endian(n[i]);
        }return n;
    };
    // Generate an array of any length of random bytes
    Crypto.randomBytes = function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) {
            words[b >>> 5] |= (bytes[i] & 0xFF) << 24 - b % 32;
        }return words;
    };
    // Convert a byte array to big-endian 32-bit words
    Crypto.bytesToWords = function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8) {
            words[b >>> 5] |= (bytes[i] & 0xFF) << 24 - b % 32;
        }return words;
    };
    // Convert big-endian 32-bit words to a byte array
    Crypto.wordsToBytes = function (words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8) {
            bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);
        }return bytes;
    };
    // Convert a byte array to a hex string
    Crypto.bytesToHex = function (bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
            hex.push((bytes[i] >>> 4).toString(16));
            hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join("");
    };
    // Convert a hex string to a byte array
    Crypto.hexToBytes = function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }return bytes;
    };
    // Convert a byte array to a base-64 string
    Crypto.bytesToBase64 = function (bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 <= bytes.length * 8) base64.push(Crypto.base64map.charAt(triplet >>> 6 * (3 - j) & 0x3F));else base64.push("=");
            }
        }
        return base64.join("");
    };
    // Convert a base-64 string to a byte array
    Crypto.base64ToBytes = function (base64) {
        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0) continue;
            bytes.push((Crypto.base64map.indexOf(base64.charAt(i - 1)) & Math.pow(2, -2 * imod4 + 8) - 1) << imod4 * 2 | Crypto.base64map.indexOf(base64.charAt(i)) >>> 6 - imod4 * 2);
        }
        return bytes;
    };
    // Convert a byte array to little-endian 32-bit words
    Crypto.bytesToLWords = function (bytes) {
        var output = Array(bytes.length >> 2);
        for (var i = 0; i < output.length; i++) {
            output[i] = 0;
        }for (var i = 0; i < bytes.length * 8; i += 8) {
            output[i >> 5] |= (bytes[i / 8] & 0xFF) << i % 32;
        }return output;
    };
    // Convert little-endian 32-bit words to a byte array
    Crypto.lWordsToBytes = function (words) {
        var output = [];
        for (var i = 0; i < words.length * 32; i += 8) {
            output.push(words[i >> 5] >>> i % 32 & 0xff);
        }return output;
    };
    Crypto.integerToBytes = function (e, t) {
        var n = e.toByteArrayUnsigned();
        if (t < n.length) n = n.slice(n.length - t);else while (t > n.length) {
            n.unshift(0);
        }return n;
    };
    Crypto.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xFFFF;
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    Crypto.bit_rol = function (num, cnt) {
        return num << cnt | num >>> 32 - cnt;
    };
    Crypto.rmd160_f = function (j, x, y, z) {
        if (j >= 80) throw "rmd160_f: j out of range";
        return 0 <= j && j <= 15 ? x ^ y ^ z : 16 <= j && j <= 31 ? x & y | ~x & z : 32 <= j && j <= 47 ? (x | ~y) ^ z : 48 <= j && j <= 63 ? x & z | y & ~z : x ^ (y | ~z);
    };
    Crypto.rmd160_K1 = function (j) {
        if (j >= 80) throw "rmd160_K1: j out of range";
        return 0 <= j && j <= 15 ? 0x00000000 : 16 <= j && j <= 31 ? 0x5a827999 : 32 <= j && j <= 47 ? 0x6ed9eba1 : 48 <= j && j <= 63 ? 0x8f1bbcdc : 0xa953fd4e;
    };
    Crypto.rmd160_K2 = function (j) {
        if (j >= 80) throw "rmd160_K2: j out of range";
        return 0 <= j && j <= 15 ? 0x50a28be6 : 16 <= j && j <= 31 ? 0x5c4dd124 : 32 <= j && j <= 47 ? 0x6d703ef3 : 48 <= j && j <= 63 ? 0x7a6d76e9 : 0x00000000;
    };
    Crypto._rmd160 = function (message) {
        // Convert to byte array
        if (message.constructor == String) message = Crypto.UTF8.stringToBytes(message);
        var x = Crypto.bytesToLWords(message),
            len = message.length * 8;
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32;
        x[(len + 64 >>> 9 << 4) + 14] = len;
        var h0 = 0x67452301;
        var h1 = 0xefcdab89;
        var h2 = 0x98badcfe;
        var h3 = 0x10325476;
        var h4 = 0xc3d2e1f0;
        var safe_add = Crypto.safe_add;
        var bit_rol = Crypto.bit_rol;
        var rmd160_f = Crypto.rmd160_f;
        var rmd160_K1 = Crypto.rmd160_K1;
        var rmd160_K2 = Crypto.rmd160_K2;
        for (var i = 0, xlh = x.length; i < xlh; i += 16) {
            var T;
            var A1 = h0,
                B1 = h1,
                C1 = h2,
                D1 = h3,
                E1 = h4;
            var A2 = h0,
                B2 = h1,
                C2 = h2,
                D2 = h3,
                E2 = h4;
            for (var j = 0; j <= 79; ++j) {
                T = safe_add(A1, rmd160_f(j, B1, C1, D1));
                T = safe_add(T, x[i + Crypto.rmd160_r1[j]]);
                T = safe_add(T, rmd160_K1(j));
                T = safe_add(bit_rol(T, Crypto.rmd160_s1[j]), E1);
                A1 = E1;
                E1 = D1;
                D1 = bit_rol(C1, 10);
                C1 = B1;
                B1 = T;
                T = safe_add(A2, rmd160_f(79 - j, B2, C2, D2));
                T = safe_add(T, x[i + Crypto.rmd160_r2[j]]);
                T = safe_add(T, rmd160_K2(j));
                T = safe_add(bit_rol(T, Crypto.rmd160_s2[j]), E2);
                A2 = E2;
                E2 = D2;
                D2 = bit_rol(C2, 10);
                C2 = B2;
                B2 = T;
            }
            T = safe_add(h1, safe_add(C1, D2));
            h1 = safe_add(h2, safe_add(D1, E2));
            h2 = safe_add(h3, safe_add(E1, A2));
            h3 = safe_add(h4, safe_add(A1, B2));
            h4 = safe_add(h0, safe_add(B1, C2));
            h0 = T;
        }
        return [h0, h1, h2, h3, h4];
    };
    Crypto._sha256 = function (message) {
        // Convert to byte array
        if (message.constructor == String) message = Crypto.UTF8.stringToBytes(message);
        /* else, assume byte array already */
        var m = Crypto.bytesToWords(message),
            l = message.length * 8,
            H = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19],
            w = [],
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            t1,
            t2;
        // Padding
        m[l >> 5] |= 0x80 << 24 - l % 32;
        m[(l + 64 >> 9 << 4) + 15] = l;
        for (var i = 0, ml = m.length; i < ml; i += 16) {
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];
            for (var j = 0; j < 64; j++) {
                if (j < 16) w[j] = m[j + i];else {
                    var gamma0x = w[j - 15],
                        gamma1x = w[j - 2],
                        gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3,
                        gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                    w[j] = gamma0 + (w[j - 7] >>> 0) + gamma1 + (w[j - 16] >>> 0);
                }
                var ch = e & f ^ ~e & g,
                    maj = a & b ^ a & c ^ b & c,
                    sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22),
                    sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                t1 = (h >>> 0) + sigma1 + ch + Crypto.K[j] + (w[j] >>> 0);
                t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = d + t1 >>> 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 >>> 0;
            }
            H[0] += a;
            H[1] += b;
            H[2] += c;
            H[3] += d;
            H[4] += e;
            H[5] += f;
            H[6] += g;
            H[7] += h;
        }
        return H;
    };
    /**
    * RIPEMD160 e.g.: HashUtil.RIPEMD160(hash, {asBytes : true})
    */
    Crypto.RIPEMD160 = function (message, options) {
        var ret,
            digestbytes = Crypto.lWordsToBytes(Crypto._rmd160(message));
        if (options && options.asBytes) {
            ret = digestbytes;
        } else if (options && options.asString) {
            ret = Crypto.charenc.Binary.bytesToString(digestbytes);
        } else {
            ret = Crypto.bytesToHex(digestbytes);
        }
        return ret;
    };
    // Public API
    /**
     * SHA256 e.g.: HashUtil.SHA256(hash, {asBytes : true})
     */
    Crypto.SHA256 = function (message, options) {
        var ret,
            digestbytes = Crypto.wordsToBytes(Crypto._sha256(message));
        if (options && options.asBytes) {
            ret = digestbytes;
        } else if (options && options.asString) {
            ret = Crypto.charenc.Binary.bytesToString(digestbytes);
        } else {
            ret = Crypto.bytesToHex(digestbytes);
        }
        return ret;
    };
    Crypto.base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    Crypto.charenc = {
        Binary: {
            // Convert a string to a byte array
            stringToBytes: function stringToBytes(str) {
                for (var bytes = [], i = 0; i < str.length; i++) {
                    bytes.push(str.charCodeAt(i) & 0xFF);
                }return bytes;
            },
            // Convert a byte array to a string
            bytesToString: function bytesToString(bytes) {
                for (var str = [], i = 0; i < bytes.length; i++) {
                    str.push(String.fromCharCode(bytes[i]));
                }return str.join("");
            }
        },
        UTF8: {
            // Convert a string to a byte array
            stringToBytes: function stringToBytes(str) {
                return Crypto.charenc.Binary.stringToBytes(decodeURIComponent(encodeURIComponent(str)));
            },
            // Convert a byte array to a string
            bytesToString: function bytesToString(bytes) {
                return decodeURIComponent(encodeURIComponent(Crypto.charenc.Binary.bytesToString(bytes)));
            }
        }
    };
    Crypto.UTF8 = Crypto.charenc.UTF8;
    Crypto.rmd160_r1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13];
    Crypto.rmd160_r2 = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11];
    Crypto.rmd160_s1 = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6];
    Crypto.rmd160_s2 = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11];
    // Constants
    Crypto.K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
    return Crypto;
}();
exports.Crypto = Crypto; //crypto
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var Address = function () {
    function Address(bytes) {
        if ("string" == typeof bytes) {
            bytes = this.decodeString(bytes);
        }
        this.hash = bytes;
        this.version = Address.networkVersion;
    }
    Address.prototype.decodeString = function (str) {
        var bytes = Base58.decode(str);
        var hash = bytes.slice(0, 21);
        var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });
        if (checksum[0] != bytes[21] || checksum[1] != bytes[22] || checksum[2] != bytes[23] || checksum[3] != bytes[24]) {
            throw "Checksum validation failed!";
        }
        var version = hash.shift();
        if (version != Address.networkVersion) {
            throw "Version " + version + " not supported!";
        }
        return hash;
    };
    Address.prototype.getHashBase64 = function () {
        return Crypto.bytesToBase64(this.hash);
    };
    Address.prototype.toString = function () {
        // Get a copy of the hash
        var hash = this.hash.slice(0);
        // Version
        hash.unshift(this.version);
        var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
            asBytes: true
        }), {
            asBytes: true
        });
        var bytes = hash.concat(checksum.slice(0, 4));
        return Base58.encode(bytes);
    };
    Address.networkVersion = 0x37; // Peercoin mainnet
    return Address;
}();
exports.Address = Address;
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var Mint = function () {
    function Mint() {}
    Mint.DiffToTarget = function (diff) {
        //floor it
        diff = diff | 0;
        var mantissa = 0x0000ffff / diff;
        var exp = 1;
        var tmp = mantissa;
        while (tmp >= 256.0) {
            tmp /= 256.0;
            exp++;
        }
        for (var i = 0; i < exp; i++) {
            mantissa *= 256.0;
        }
        var bn = new BigInteger('' + (mantissa | 0), 10);
        bn = bn.shiftLeft((26 - exp) * 8);
        return bn;
    };
    Mint.IncCompact = function (compact) {
        var mantissa = compact & 0x007fffff;
        var neg = compact & 0x00800000;
        var exponent = compact >> 24;
        if (exponent <= 3) {
            mantissa += 1 << 8 * (3 - exponent);
        } else {
            mantissa++;
        }
        if (mantissa >= 0x00800000) {
            mantissa >>= 8;
            exponent++;
        }
        return exponent << 24 | mantissa | neg;
    };
    // BigToCompact converts a whole number N to a compact representation using
    // an unsigned 32-bit number.  The compact representation only provides 23 bits
    // of precision, so values larger than (2^23 - 1) only encode the most
    // significant digits of the number.  See CompactToBig for details.
    Mint.BigToCompact = function (n) {
        // No need to do any work if it's zero.
        if (n.equals(BigInteger.ZERO)) {
            return 0;
        }
        // Since the base for the exponent is 256, the exponent can be treated
        // as the number of bytes.  So, shift the number right or left
        // accordingly.  This is equivalent to:
        // mantissa = mantissa / 256^(exponent-3)
        var mantissa; // uint32   var	mantissa = compact & 0x007fffff,
        var exponent = n.toByteArrayUnsigned().length;
        if (exponent <= 3) {
            mantissa = n.and(new BigInteger('4294967295', 10)).intValue();
            mantissa <<= 8 * (3 - exponent);
        } else {
            // Use a copy to avoid modifying the caller's original number.
            var tn = new BigInteger(n.toString(10), 10);
            mantissa = tn.shiftRight(8 * (exponent - 3)).and(new BigInteger('4294967295', 10)).intValue();
        }
        // When the mantissa already has the sign bit set, the number is too
        // large to fit into the available 23-bits, so divide the number by 256
        // and increment the exponent accordingly.
        if ((mantissa & 0x00800000) != 0) {
            mantissa >>= 8;
            exponent++;
        }
        // Pack the exponent, sign bit, and mantissa into an unsigned 32-bit
        // int and return it.
        var compact = exponent << 24 | mantissa;
        if (n.compareTo(BigInteger.ZERO) < 0) {
            compact |= 0x00800000;
        }
        return compact;
    };
    Mint.CompactToDiff = function (bits) {
        var nShift = bits >> 24 & 0xff;
        var diff = 1.0 * 0x0000ffff / (bits & 0x00ffffff);
        for (var n = 0; nShift < 29; nShift++) {
            diff *= 256.0;
        }
        for (var n = 0; nShift > 29; nShift--) {
            diff /= 256.0;
        }
        return diff;
    };
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // CompactToBig converts a compact representation of a whole number N to an
    // unsigned 32-bit number.  The representation is similar to IEEE754 floating
    // point numbers.
    //
    // Like IEEE754 floating point, there are three basic components: the sign,
    // the exponent, and the mantissa.  They are broken out as follows:
    //
    //	* the most significant 8 bits represent the unsigned base 256 exponent
    // 	* bit 23 (the 24th bit) represents the sign bit
    //	* the least significant 23 bits represent the mantissa
    //
    //	-------------------------------------------------
    //	|   Exponent     |    Sign    |    Mantissa     |
    //	-------------------------------------------------
    //	| 8 bits [31-24] | 1 bit [23] | 23 bits [22-00] |
    //	-------------------------------------------------
    //
    // The formula to calculate N is:
    // 	N = (-1^sign) * mantissa * 256^(exponent-3)
    //
    // This compact form is only used in bitcoin to encode unsigned 256-bit numbers
    // which represent difficulty targets, thus there really is not a need for a
    // sign bit, but it is implemented here to stay consistent with bitcoind.
    Mint.CompactToBig = function (compact) {
        // Extract the mantissa, sign bit, and exponent.
        var mantissa = compact & 0x007fffff,
            isNegative = (compact & 0x00800000) != 0,
            exponent = compact >> 24 >>> 0;
        // Since the base for the exponent is 256, the exponent can be treated
        // as the number of bytes to represent the full 256-bit number.  So,
        // treat the exponent as the number of bytes and shift the mantissa
        // right or left accordingly.  This is equivalent to:
        // N = mantissa * 256^(exponent-3)
        var bn;
        if (exponent <= 3) {
            mantissa >>= 8 * (3 - exponent);
            bn = new BigInteger('' + mantissa, 10);
        } else {
            bn = new BigInteger('' + mantissa, 10);
            bn = bn.shiftLeft(8 * (exponent - 3));
        }
        // Make it negative if the sign bit is set.
        if (isNegative) {
            bn = bn.multiply(new BigInteger('-1', 10, null));
        }
        return bn;
    };
    Mint.day = 60 * 60 * 24;
    Mint.stakeMaxAge = 90 * Mint.day;
    Mint.coin = 1000000;
    Mint.coinDay = Mint.coin * Mint.day;
    Mint.minStakeMinAge = 2592000;
    return Mint;
}();
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////	
var StakeKernelTemplate = function () {
    function StakeKernelTemplate(tpl, manager) {
        this.BlockFromTime = tpl.BlockFromTime; // int64
        this.StakeModifier = tpl.StakeModifier; //uint64  => BigInteger!!!
        this.PrevTxOffset = tpl.PrevTxOffset; //uint32
        this.PrevTxTime = tpl.PrevTxTime; //int64
        this.PrevTxOutIndex = tpl.PrevTxOutIndex; //uint32
        this.PrevTxOutValue = tpl.PrevTxOutValue; //int64
        this.UnspentOutputs = manager;
        this.IsProtocolV03 = 'IsProtocolV03' in tpl ? tpl.IsProtocolV03 : true; //bool
        this.StakeMinAge = 'StakeMinAge' in tpl ? tpl.StakeMinAge : Mint.minStakeMinAge; //int64
        this.Bits = 'Bits' in tpl ? tpl.Bits : this.setBitsWithDifficulty(parseFloat("10.33")); //uint32
        this.Results = [];
        this.maxResults = 7;
    }
    StakeKernelTemplate.prototype.setBitsWithDifficulty = function (diff) {
        this.Bits = Mint.BigToCompact(Mint.DiffToTarget(diff));
        return this.Bits;
    };
    StakeKernelTemplate.prototype.checkStakeKernelHash = function () {
        var retobj = { success: false, minTarget: BigInteger.ZERO, hash: [] };
        if (this.UnspentOutputs.TxTime < this.PrevTxTime) {
            console.log("CheckStakeKernelHash() : nTime violation");
            return retobj;
        }
        if (this.BlockFromTime + this.StakeMinAge > this.UnspentOutputs.TxTime) {
            console.log("CheckStakeKernelHash() : min age violation");
            return retobj;
        }
        var bnTargetPerCoinDay = Mint.CompactToBig(this.Bits);
        var timeReduction = this.IsProtocolV03 ? timeReduction = this.StakeMinAge : 0;
        var nTimeWeight = this.UnspentOutputs.TxTime - this.PrevTxTime; // int64
        if (nTimeWeight > Mint.stakeMaxAge) {
            nTimeWeight = Mint.stakeMaxAge;
        }
        nTimeWeight -= timeReduction;
        var bnCoinDayWeight; // *big.Int
        var valueTime = this.PrevTxOutValue * nTimeWeight;
        if (valueTime > 0) {
            bnCoinDayWeight = new BigInteger('' + Math.floor(valueTime / Mint.coinDay), 10);
        } else {
            // overflow, calc w/ big.Int or return error?
            // err = errors.New("valueTime overflow")
            // return
            var t1 = new BigInteger('' + 24 * 60 * 60, 10);
            var t2 = new BigInteger('' + Mint.coin, 10);
            var t3 = new BigInteger('' + this.PrevTxOutValue, 10);
            var t4 = new BigInteger('' + nTimeWeight, 10);
            bnCoinDayWeight = t3.multiply(t4).divide(t2).divide(t1);
        }
        var targetInt = bnCoinDayWeight.multiply(bnTargetPerCoinDay);
        var buf = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var _o_ = 0;
        if (this.IsProtocolV03) {
            var d = this.StakeModifier.toByteArrayUnsigned().reverse();
            for (var i = 0; i < 8; i++) {
                buf[_o_] = d[i];
                _o_++;
            }
        } else {
            var d2 = this.Bits;
            for (var i = 0; i < 4; i++) {
                buf[_o_] = d2 & 0xff;
                d2 >>= 8;
                _o_++;
            }
        }
        var data = [this.BlockFromTime, this.PrevTxOffset, this.PrevTxTime, this.PrevTxOutIndex, this.UnspentOutputs.TxTime];
        for (var k = 0, arrayLength = data.length; k < arrayLength; k++) {
            var dn = data[k];
            for (var i = 0; i < 4; i++) {
                buf[_o_] = dn & 0xff;
                dn >>= 8;
                _o_++;
            }
        }
        var hashProofOfStake = Crypto.SHA256(Crypto.SHA256(buf, { asBytes: true }), { asBytes: true }).reverse();
        var hashProofOfStakeInt = BigInteger.fromByteArrayUnsigned(hashProofOfStake);
        if (hashProofOfStakeInt.compareTo(targetInt) > 0) {
            return retobj;
        }
        retobj.minTarget = hashProofOfStakeInt.divide(bnCoinDayWeight).subtract(BigInteger.ONE);
        retobj.success = true;
        retobj.hash = hashProofOfStake;
        return retobj;
    };
    return StakeKernelTemplate;
}();
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var UnspentOutputsToStake = function () {
    function UnspentOutputsToStake() {
        this.arrStakeKernelTemplates = []; //
        this.Bits = Mint.BigToCompact(Mint.DiffToTarget(parseFloat("15"))); //uint32
        this.TxTime = Date.now() / 1000 | 0; //int64
        this.StartTime = this.TxTime;
        this.MaxTime = this.TxTime + 3600;
        this.Stop = false;
        this.Results = [];
        this.orgtpl = [];
    }
    UnspentOutputsToStake.prototype.add = function (tpldata) {
        var addrfound = this.orgtpl.some(function (el) {
            if (el.PrevTxOffset == tpldata.PrevTxOffset && el.PrevTxOutIndex == tpldata.PrevTxOutIndex && el.PrevTxOutValue == tpldata.PrevTxOutValue && el.StakeModifier.toString() == tpldata.StakeModifier.toString()) {
                return true;
            }
        });
        if (!addrfound) {
            this.orgtpl.push(tpldata);
            this.arrStakeKernelTemplates.push(new StakeKernelTemplate(tpldata, this));
        }
    };
    UnspentOutputsToStake.prototype.setBitsWithDifficulty = function (diff) {
        var _this = this;
        var that = this;
        this.Bits = Mint.BigToCompact(Mint.DiffToTarget(diff));
        this.arrStakeKernelTemplates.forEach(function (element) {
            element.Bits = _this.Bits;
        });
    };
    UnspentOutputsToStake.prototype.setStartStop = function (start, stop) {
        var that = this;
        that.TxTime = start;
        that.StartTime = that.TxTime;
        that.MaxTime = stop;
    };
    UnspentOutputsToStake.prototype.stop = function () {
        this.Stop = true;
    };
    UnspentOutputsToStake.prototype.findStakeAt = function () {
        var _this = this;
        var stakesfound = [];
        //filter out oudated templates
        var newarrKT = [];
        this.arrStakeKernelTemplates.forEach(function (element, index, array) {
            if (element.UnspentOutputs.TxTime < element.PrevTxTime || element.BlockFromTime + element.StakeMinAge > element.UnspentOutputs.TxTime) {} else {
                newarrKT.push(element);
            }
        });
        this.arrStakeKernelTemplates = newarrKT;
        this.arrStakeKernelTemplates.forEach(function (element, index, array) {
            if (!_this.Stop) {
                var resultobj = element.checkStakeKernelHash(); //{succes: succes, hash, minTarget:minTarget}
                if (resultobj.success) {
                    var comp = Mint.IncCompact(Mint.BigToCompact(resultobj.minTarget));
                    var diff = Mint.CompactToDiff(comp);
                    if (diff < 0.25) {
                        console.log('hmmm is this min diff ok: ' + diff);
                    }
                    var res = {
                        "foundstake": _this.TxTime,
                        "mindifficulty": diff * 10 / 10
                    };
                    element.Results.push(res);
                    stakesfound.push(res);
                }
            }
        });
        return stakesfound;
    };
    UnspentOutputsToStake.prototype.recursiveFind = function (ob) {
        var _this = this;
        ob.progressWhen++;
        this.TxTime++;
        var res = this.findStakeAt();
        if (res.length > 0) {
            ob.mintcallback(res);
            this.Results.push(res);
        }
        var loopfunc = ob.setZeroTimeout;
        if (ob.progressWhen > 555 / this.arrStakeKernelTemplates.length) {
            ob.progressWhen = 0;
            ob.progresscallback((this.TxTime - this.StartTime) / (1.0 * (this.MaxTime - this.StartTime)), ((this.MaxTime - this.TxTime) / 60.0).toFixed(1) + ' min remaining');
            loopfunc = setTimeout;
        }
        if (!this.Stop && this.TxTime < this.MaxTime) loopfunc(function () {
            return _this.recursiveFind(ob);
        }, 40);else ob.progresscallback(100, 'done');
    };
    UnspentOutputsToStake.prototype.findStake = function (mintcallback, progresscallback, setZeroTimeout) {
        var _this = this;
        if (this.arrStakeKernelTemplates.length > 0) {
            var ob = {
                progressWhen: 0,
                mintcallback: mintcallback,
                progresscallback: progresscallback,
                setZeroTimeout: setZeroTimeout
            };
            setZeroTimeout(function () {
                return _this.recursiveFind(ob);
            });
        }
    };
    return UnspentOutputsToStake;
}();
exports.UnspentOutputsToStake = UnspentOutputsToStake;
function valueToBigInt(valueBuffer) {
    if (valueBuffer instanceof BigInteger) return valueBuffer;
    // Prepend zero byte to prevent interpretation as negative integer
    return BigInteger.fromByteArrayUnsigned(valueBuffer);
}
exports.valueToBigInt = valueToBigInt;
/**
 * Format a Peercoin value as a string.
 *
 * Takes a BigInteger or byte-array and returns that amount of Peercoins in a
 * nice standard formatting.
 *
 * Examples:
 * 12.3555
 * 0.1234
 * 900.99998888
 * 34.00
 */
function formatValue(valueBuffer) {
    var value = valueToBigInt(valueBuffer).toString();
    var integerPart = value.length > 8 ? value.substr(0, value.length - 8) : '0';
    var decimalPart = value.length > 8 ? value.substr(value.length - 8) : value;
    while (decimalPart.length < 8) {
        decimalPart = "0" + decimalPart;
    }decimalPart = decimalPart.replace(/0*$/, '');
    while (decimalPart.length < 2) {
        decimalPart += "0";
    }return integerPart + "." + decimalPart;
}
exports.formatValue = formatValue;
/**
 * Parse a floating point string as a Peercoin value.
 *
 * Keep in mind that parsing user input is messy. You should always display
 * the parsed value back to the user to make sure we understood his input
 * correctly.
 */
function parseValue(valueString) {
    // TODO: Detect other number formats (e.g. comma as decimal separator)
    var valueComp = valueString.split('.');
    var integralPart = valueComp[0];
    var fractionalPart = valueComp[1] || "0";
    while (fractionalPart.length < 8) {
        fractionalPart += "0";
    }fractionalPart = fractionalPart.replace(/^0+/g, '');
    var value = BigInteger.valueOf(parseInt(integralPart));
    value = value.multiply(BigInteger.valueOf(100000000));
    value = value.add(BigInteger.valueOf(parseInt(fractionalPart)));
    return value;
}
exports.parseValue = parseValue;
/*
export function integerToBytes(e: BigInteger, t:number):number[] {
   var n = e.toByteArrayUnsigned();
   if (t < n.length)
      n = n.slice(n.length - t);
   else
      while (t > n.length)
         n.unshift(0);
   return n
}*/
});

;require.register("initialize.js", function(exports, require, module) {
'use strict';

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _storeUmd = require('svelte/store.umd.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * This is the entrypoint of all the JavaScript files.
 */

document.addEventListener('DOMContentLoaded', main);

function main() {
  registerSW();

  window['allowedLanguages'] = ['en-US', 'pt-BR'];
  var allowedLanguages = window['allowedLanguages'];
  var language = localStorage.getItem('ppc-user-language') || navigator.language || 'en-US';

  if (!allowedLanguages.includes(language)) {
    language = 'en-US';
  }

  fetch('/locales/' + language + '.json').then(function (res) {
    return res.json();
  }).then(function (dictionary) {
    document.title = dictionary.index.title;
    localStorage.setItem('ppc-user-language', language);
    window.Routes = new _routes2.default();
    window.store = new _storeUmd.Store({
      wallets: [],
      numberOfWallets: 1,
      dictionary: dictionary
    });
  });
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  } else {
    console.log('No Service Worker available in this browser.');
  }
}
});

;require.register("pages/about/about.handler.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aboutPage = require('./about.page.svelte');

var _aboutPage2 = _interopRequireDefault(_aboutPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AboutHandler = function () {
  function AboutHandler() {
    _classCallCheck(this, AboutHandler);
  }

  _createClass(AboutHandler, [{
    key: 'route',
    get: function get() {
      return {
        enter: function enter(current, previous) {
          this.component = new _aboutPage2.default({
            target: document.getElementById('app'),
            store: window.store
          });
          document.body.style.overflow = 'hidden';
        },
        leave: function leave(current, previous) {
          this.component.destroy();
        }
      };
    }
  }]);

  return AboutHandler;
}();

exports.default = AboutHandler;
});

;require.register("pages/about/about.page.svelte.html", function(exports, require, module) {
/* app/pages/about/about.page.svelte.html generated by Svelte v1.64.1 */
"use strict";
var roadtrip = require("roadtrip");
roadtrip = (roadtrip && roadtrip.__esModule) ? roadtrip["default"] : roadtrip;

function timeAlive() {
  const PPC_GENESIS = 1344794258295;
  const NOW = +new Date();
  const YEAR = 31536000000;

  return Math.round((NOW - PPC_GENESIS) / YEAR);
};

var methods = {
  goto(path, e) {
    if (e) {
      e.preventDefault();
    }
    roadtrip.goto(path);
  },
  enableScroll() {
    document.body.style = '';
    this.refs.page.classList.remove('page-entering');
  }
};

function create_main_fragment(component, state) {
	var div, header, a, text_value = state.$dictionary.about.backBtn, text, text_2, div_1, div_2, text_3_value = state.$dictionary.about.titleAbout, text_3, text_4, p, text_5_value = state.$dictionary.about.about1, text_5, text_6, p_1, text_7_value = state.$dictionary.about.about2, text_7, text_8, div_3, text_9_value = state.$dictionary.about.titlePeercoin, text_9, text_10, p_2, text_11_value = state.$dictionary.about.peercoin1, text_11, text_12, div_4, text_13_value = state.$dictionary.about.titleDisclaimer, text_13, text_14, p_3, text_15_value = state.$dictionary.about.disclaimer1, text_15, text_16, div_5, text_17_value = state.$dictionary.about.titleCredits, text_17, text_18, p_4, text_19_value = state.$dictionary.about.credits1, text_19, text_20, p_5, text_21_value = state.$dictionary.about.credits2, text_21, text_22, p_6, raw_value = state.$dictionary.about.credits3;

	function click_handler(event) {
		component.goto('/', event);
	}

	function animationend_handler(event) {
		component.enableScroll();
	}

	return {
		c: function create() {
			div = createElement("div");
			header = createElement("header");
			a = createElement("a");
			text = createText(text_value);
			text_2 = createText("\n  ");
			div_1 = createElement("div");
			div_2 = createElement("div");
			text_3 = createText(text_3_value);
			text_4 = createText("\n    ");
			p = createElement("p");
			text_5 = createText(text_5_value);
			text_6 = createText("\n    ");
			p_1 = createElement("p");
			text_7 = createText(text_7_value);
			text_8 = createText("\n\n    ");
			div_3 = createElement("div");
			text_9 = createText(text_9_value);
			text_10 = createText("\n    ");
			p_2 = createElement("p");
			text_11 = createText(text_11_value);
			text_12 = createText("\n\n    ");
			div_4 = createElement("div");
			text_13 = createText(text_13_value);
			text_14 = createText("\n    ");
			p_3 = createElement("p");
			text_15 = createText(text_15_value);
			text_16 = createText("\n\n    ");
			div_5 = createElement("div");
			text_17 = createText(text_17_value);
			text_18 = createText("\n    ");
			p_4 = createElement("p");
			text_19 = createText(text_19_value);
			text_20 = createText("\n    ");
			p_5 = createElement("p");
			text_21 = createText(text_21_value);
			text_22 = createText("\n    ");
			p_6 = createElement("p");
			this.h();
		},

		h: function hydrate() {
			addListener(a, "click", click_handler);
			a.href = "/";
			a.className = "btn-back";
			header.className = "header";
			div_2.className = "title";
			div_3.className = "title";
			div_4.className = "title";
			div_5.className = "title";
			div_1.className = "container";
			addListener(div, "animationend", animationend_handler);
			div.className = "AboutPage page page-entering";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(header, div);
			appendNode(a, header);
			appendNode(text, a);
			appendNode(text_2, div);
			appendNode(div_1, div);
			appendNode(div_2, div_1);
			appendNode(text_3, div_2);
			appendNode(text_4, div_1);
			appendNode(p, div_1);
			appendNode(text_5, p);
			appendNode(text_6, div_1);
			appendNode(p_1, div_1);
			appendNode(text_7, p_1);
			appendNode(text_8, div_1);
			appendNode(div_3, div_1);
			appendNode(text_9, div_3);
			appendNode(text_10, div_1);
			appendNode(p_2, div_1);
			appendNode(text_11, p_2);
			appendNode(text_12, div_1);
			appendNode(div_4, div_1);
			appendNode(text_13, div_4);
			appendNode(text_14, div_1);
			appendNode(p_3, div_1);
			appendNode(text_15, p_3);
			appendNode(text_16, div_1);
			appendNode(div_5, div_1);
			appendNode(text_17, div_5);
			appendNode(text_18, div_1);
			appendNode(p_4, div_1);
			appendNode(text_19, p_4);
			appendNode(text_20, div_1);
			appendNode(p_5, div_1);
			appendNode(text_21, p_5);
			appendNode(text_22, div_1);
			appendNode(p_6, div_1);
			p_6.innerHTML = raw_value;
			component.refs.page = div;
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_value !== (text_value = state.$dictionary.about.backBtn)) {
				text.data = text_value;
			}

			if ((changed.$dictionary) && text_3_value !== (text_3_value = state.$dictionary.about.titleAbout)) {
				text_3.data = text_3_value;
			}

			if ((changed.$dictionary) && text_5_value !== (text_5_value = state.$dictionary.about.about1)) {
				text_5.data = text_5_value;
			}

			if ((changed.$dictionary) && text_7_value !== (text_7_value = state.$dictionary.about.about2)) {
				text_7.data = text_7_value;
			}

			if ((changed.$dictionary) && text_9_value !== (text_9_value = state.$dictionary.about.titlePeercoin)) {
				text_9.data = text_9_value;
			}

			if ((changed.$dictionary) && text_11_value !== (text_11_value = state.$dictionary.about.peercoin1)) {
				text_11.data = text_11_value;
			}

			if ((changed.$dictionary) && text_13_value !== (text_13_value = state.$dictionary.about.titleDisclaimer)) {
				text_13.data = text_13_value;
			}

			if ((changed.$dictionary) && text_15_value !== (text_15_value = state.$dictionary.about.disclaimer1)) {
				text_15.data = text_15_value;
			}

			if ((changed.$dictionary) && text_17_value !== (text_17_value = state.$dictionary.about.titleCredits)) {
				text_17.data = text_17_value;
			}

			if ((changed.$dictionary) && text_19_value !== (text_19_value = state.$dictionary.about.credits1)) {
				text_19.data = text_19_value;
			}

			if ((changed.$dictionary) && text_21_value !== (text_21_value = state.$dictionary.about.credits2)) {
				text_21.data = text_21_value;
			}

			if ((changed.$dictionary) && raw_value !== (raw_value = state.$dictionary.about.credits3)) {
				p_6.innerHTML = raw_value;
			}
		},

		u: function unmount() {
			p_6.innerHTML = '';

			detachNode(div);
		},

		d: function destroy() {
			removeListener(a, "click", click_handler);
			removeListener(div, "animationend", animationend_handler);
			if (component.refs.page === div) component.refs.page = null;
		}
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this.refs = {};
	this._state = assign(this.store._init(["dictionary"]), options.data);
	this.store._add(this, ["dictionary"]);

	this._handlers.destroy = [removeFromStore];

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });
assign(Multiple_wallets_component_svelte.prototype, methods);

Multiple_wallets_component_svelte.prototype._recompute = noop;

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function removeFromStore() {
	this.store._remove(this);
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function noop() {}

function blankObject() {
	return Object.create(null);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("pages/generator/generator.handler.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _roadtrip = require('roadtrip');

var _roadtrip2 = _interopRequireDefault(_roadtrip);

var _generatorPage = require('./generator.page.svelte');

var _generatorPage2 = _interopRequireDefault(_generatorPage);

var _checkCompatibility = require('../../helpers/checkCompatibility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeneratorHandler = function () {
  function GeneratorHandler() {
    _classCallCheck(this, GeneratorHandler);
  }

  _createClass(GeneratorHandler, [{
    key: 'route',
    get: function get() {
      return {
        enter: function enter(current, previous) {
          // If the browser using this app is not compatible,
          // send it to "Not Supported" page. 
          if (!(0, _checkCompatibility.isCompatible)()) {
            _roadtrip2.default.goto('/not-supported');
            return;
          }
          this.component = new _generatorPage2.default({
            target: document.getElementById('app'),
            store: window.store
          });

          // Disable overflow to prevent scrolling
          // while giving seed by touch
          document.body.style.overflow = 'hidden';
        },
        leave: function leave(current, previous) {
          if (this.component) {
            this.component.destroy();
          }

          // Enable overflow for other views
          document.body.style.overflow = '';
        }
      };
    }
  }]);

  return GeneratorHandler;
}();

exports.default = GeneratorHandler;
});

;require.register("pages/generator/generator.page.svelte.html", function(exports, require, module) {
/* app/pages/generator/generator.page.svelte.html generated by Svelte v1.64.1 */
"use strict";
var roadtrip = require("roadtrip");

var QRious = require("qrious");

var BigInteger = require("../../helpers/peercoin/BigInteger");

var Peercoin = require("../../helpers/peercoin/Peercoin");

var Base58 = require("../../helpers/peercoin/Base58");

var ECurve = require("../../helpers/peercoin/ECurve");

var Icon = require("../../components/icon/icon.component.svelte");

var __import7 = require("../../helpers/checkCompatibility");
roadtrip = (roadtrip && roadtrip.__esModule) ? roadtrip["default"] : roadtrip;
QRious = (QRious && QRious.__esModule) ? QRious["default"] : QRious;
BigInteger = (BigInteger && BigInteger.__esModule) ? BigInteger["default"] : BigInteger;
Peercoin = (Peercoin && Peercoin.__esModule) ? Peercoin["default"] : Peercoin;
Base58 = (Base58 && Base58.__esModule) ? Base58["default"] : Base58;
ECurve = (ECurve && ECurve.__esModule) ? ECurve["default"] : ECurve;
Icon = (Icon && Icon.__esModule) ? Icon["default"] : Icon;
var isCompatible = __import7.isCompatible;

function data() {
  return {
    lastTouch: +new Date(),
    touches: 0,
    totalTouches: 120 + (Math.round(crypto.getRandomValues(new Uint8Array(10))[5] / 4)),
    hasStarted: false,
    hasFinished: false,
    isTouchDevice: true,
    seedPercentage: 0,
    touchList: [],
    initialTouchTime: 0,
    finalTouchTime: 0,
    // This is used only for visual purposes and don't play any role
    // in final wallet security
    obfuscatedPartialSeed: '',
  }
};

var methods = {
  goto(path, e) {
    if (e) {
      e.preventDefault();
    }
    roadtrip.goto(path);
  },
  isTouchDevice() {
    return 'ontouchstart' in window || window.innerWidth <= 1024;
  },
  handleSeed(e) {
    const isTouch = this.get('isTouchDevice');
    const touches = +this.get('touches');
    const totalTouches = +this.get('totalTouches');
    const numberOfWallets = window.store.get('numberOfWallets');

    // Ignore mouse events if device is mobile/touch
    if (isTouch && e.type === 'mousemove') {
      return;
    }

    // Ignore touch events if device is desktop/mouse
    if (!isTouch && e.type === 'touchmove') {
      return;
    }

    // If mousemove, simulate touch to keep with the function
    if (e.type === 'mousemove') {
      e.touches = [];
      e.touches[0] = {
        pageX: e.layerX,
        pageY: e.layerY 
      };
    }

    // If the event fired before 80ms from last one,
    // simply ignore it
    if (+new Date() - this.get('lastTouch') < 80) {
      return;
    }

    // If the number of touches surpassed the maximum needed,
    // also ignore it and generate wallet
    if (touches >= totalTouches) {
      // If this is the last computed touch, save its time for seed usage
      if (touches == totalTouches) {
        this.set({ finalTouchTime: +new Date() });
      }
      // Finally, generate wallet using computed seed.
      for (let i = 0; i < numberOfWallets; i++) {
        this.generateWallet(
          this.get('initialTouchTime'),
          this.get('finalTouchTime'),
          this.get('touchList')
        );
      }

      this.goto('/wallet');
      return;
    }

    // If first seed point, save its time for seed usage
    if (touches === 0) {
      this.set({ initialTouchTime: +new Date() });
    }

    // If none of the above conditionals triggered, keep with
    // seed calculation  
    const touchList = this.get('touchList');
    const userPoint = e.touches[0].pageX * e.touches[0].pageY;

    touchList.push(userPoint);
    
    this.set({
      lastTouch: +new Date(),
      touches: touches + 1,
      hasStarted: true,
      seedPercentage: (touches + 1) * 100 / totalTouches,
      touchList: touchList,
      obfuscatedPartialSeed: Peercoin.Crypto.SHA256(touchList.join(''), null).repeat(10)
    });

    this.addVisualPoint(e.touches[0].pageX, e.touches[0].pageY);
  },
  addVisualPoint(x, y) {
    const point = document.createElement('div');

    point.classList.add('point');
    point.style.top = `${y}px`;
    point.style.left = `${x}px`;

    this.refs.generator.appendChild(point);
  },
  generateWallet(initialTime, finalTime, touchList) {
    const wallets = window.store.get('wallets') || [];
    const numberOfWallets = window.store.get('numberOfWallets') || [];

    if (wallets.length >= numberOfWallets) {
      return;
    }

    // Seed
    const randomSeed = Array.from(window.crypto.getRandomValues(new Uint8Array(2048 / 8))).join('');
    const secret = `${randomSeed}:${initialTime}${touchList.join('')}${finalTime}`;

    // Generating peercoin address/priv. key
    const secretHash = Peercoin.Crypto.SHA256("" + secret);
    let privateKeyBNP2TH = BigInteger.fromByteArrayUnsigned(Peercoin.Crypto.hexToBytes(secretHash));
    let pubKeyP2TH = ECurve.getPublicKey(privateKeyBNP2TH);
    let pub_keyP2TH = ((pubKeyP2TH.yParity === "even") ? "02" : "03") + pubKeyP2TH.x.toString();    
    let sha = Peercoin.Crypto.SHA256(Peercoin.Crypto.hexToBytes(pub_keyP2TH), null);
    let hash160 = Peercoin.Crypto.RIPEMD160(Peercoin.Crypto.hexToBytes(sha), null);
    let hashAndBytes = Peercoin.Crypto.hexToBytes(hash160);
    hashAndBytes.unshift(Peercoin.Address.networkVersion);//Peercoin Public Address lead Hex value 
    let versionAndRipe = Peercoin.Crypto.bytesToHex(hashAndBytes);
    let check = this.computeChecksum(versionAndRipe);
    let address = Base58.encode(Peercoin.Crypto.hexToBytes(versionAndRipe + check.checksum));
    
    let pkWIF = "B7" + secretHash + "01"; //compressionflag
    let checkpr = this.computeChecksum(pkWIF);
    let addresspriv = Base58.encode(Peercoin.Crypto.hexToBytes(pkWIF + checkpr.checksum));

    // Send generated Address to new page
    window.store.set({
      wallets: wallets.concat({
        publicAddress: address,
        privateKey: addresspriv,
        privateQRCode: new QRious({value: addresspriv, size: 200 * 4, level: 'L'}).toDataURL(),
        publicQRCode: new QRious({value: address, size: 200 * 4, level: 'L'}).toDataURL(),
      })
    });
  },
  computeChecksum(hx) {
    var firstSHA = Peercoin.Crypto.SHA256(Peercoin.Crypto.hexToBytes(hx));
    var secondSHA = Peercoin.Crypto.SHA256(Peercoin.Crypto.hexToBytes(firstSHA));
    return {
      checksum: secondSHA.substr(0,8).toUpperCase(),
      nonChecksum: secondSHA.substr(8,secondSHA.length).toUpperCase()
    };
  }
};

function oncreate() {
  this.set({
    isTouchDevice: this.isTouchDevice()
  });
};

function create_main_fragment(component, state) {
	var div, div_1, div_2, h1, text_value = state.$dictionary.generator.title, text, text_1, h2, text_2_value = state.$dictionary.generator.subtitle1, text_2, text_3, h2_1, raw_value = state.$dictionary.generator.subtitle2, text_4, div_1_class_value, text_7, div_3, div_4, h1_1, text_8_value = state.$dictionary.generator.keepSwiping, text_8, text_9, div_5, text_10_value = state.Math.floor(state.seedPercentage), text_10, text_11, div_4_class_value, text_13, div_6, div_7, text_14;

	var icon_initial_data = { name: "hand" };
	var icon = new Icon({
		root: component.root,
		data: icon_initial_data
	});

	function touchmove_handler(event) {
		component.handleSeed(event);
	}

	function mousemove_handler(event) {
		component.handleSeed(event);
	}

	return {
		c: function create() {
			div = createElement("div");
			div_1 = createElement("div");
			div_2 = createElement("div");
			h1 = createElement("h1");
			text = createText(text_value);
			text_1 = createText("\n      ");
			h2 = createElement("h2");
			text_2 = createText(text_2_value);
			text_3 = createText("\n      ");
			h2_1 = createElement("h2");
			text_4 = createText("\n      ");
			icon._fragment.c();
			text_7 = createText("\n  ");
			div_3 = createElement("div");
			div_4 = createElement("div");
			h1_1 = createElement("h1");
			text_8 = createText(text_8_value);
			text_9 = createText("\n      ");
			div_5 = createElement("div");
			text_10 = createText(text_10_value);
			text_11 = createText("%");
			text_13 = createText("\n    ");
			div_6 = createElement("div");
			div_7 = createElement("div");
			text_14 = createText(state.obfuscatedPartialSeed);
			this.h();
		},

		h: function hydrate() {
			h1.className = "title";
			h2.className = "subtitle";
			h2_1.className = "subtitle";
			div_2.className = "container";
			div_1.className = div_1_class_value = "instructions " + ((state.hasStarted) ? '' : 'active');
			h1_1.className = "title";
			div_5.className = "percentage";
			div_4.className = div_4_class_value = "progress-label " + ((state.seedPercentage > 44) ? 'white' : '');
			div_7.className = "seed no-selectable";
			div_6.className = "progress";
			setStyle(div_6, "transform", "translate3d(0, " + ( 100 - state.seedPercentage ) + "%, 0)");
			div_3.className = "generator";
			addListener(div, "touchmove", touchmove_handler);
			addListener(div, "mousemove", mousemove_handler);
			div.className = "GeneratorPage page page-entering";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(div_1, div);
			appendNode(div_2, div_1);
			appendNode(h1, div_2);
			appendNode(text, h1);
			appendNode(text_1, div_2);
			appendNode(h2, div_2);
			appendNode(text_2, h2);
			appendNode(text_3, div_2);
			appendNode(h2_1, div_2);
			h2_1.innerHTML = raw_value;
			appendNode(text_4, div_2);
			icon._mount(div_2, null);
			appendNode(text_7, div);
			appendNode(div_3, div);
			appendNode(div_4, div_3);
			appendNode(h1_1, div_4);
			appendNode(text_8, h1_1);
			appendNode(text_9, div_4);
			appendNode(div_5, div_4);
			appendNode(text_10, div_5);
			appendNode(text_11, div_5);
			appendNode(text_13, div_3);
			appendNode(div_6, div_3);
			appendNode(div_7, div_6);
			appendNode(text_14, div_7);
			component.refs.generator = div_3;
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_value !== (text_value = state.$dictionary.generator.title)) {
				text.data = text_value;
			}

			if ((changed.$dictionary) && text_2_value !== (text_2_value = state.$dictionary.generator.subtitle1)) {
				text_2.data = text_2_value;
			}

			if ((changed.$dictionary) && raw_value !== (raw_value = state.$dictionary.generator.subtitle2)) {
				h2_1.innerHTML = raw_value;
			}

			if ((changed.hasStarted) && div_1_class_value !== (div_1_class_value = "instructions " + ((state.hasStarted) ? '' : 'active'))) {
				div_1.className = div_1_class_value;
			}

			if ((changed.$dictionary) && text_8_value !== (text_8_value = state.$dictionary.generator.keepSwiping)) {
				text_8.data = text_8_value;
			}

			if ((changed.Math || changed.seedPercentage) && text_10_value !== (text_10_value = state.Math.floor(state.seedPercentage))) {
				text_10.data = text_10_value;
			}

			if ((changed.seedPercentage) && div_4_class_value !== (div_4_class_value = "progress-label " + ((state.seedPercentage > 44) ? 'white' : ''))) {
				div_4.className = div_4_class_value;
			}

			if (changed.obfuscatedPartialSeed) {
				text_14.data = state.obfuscatedPartialSeed;
			}

			if (changed.seedPercentage) {
				setStyle(div_6, "transform", "translate3d(0, " + ( 100 - state.seedPercentage ) + "%, 0)");
			}
		},

		u: function unmount() {
			h2_1.innerHTML = '';

			detachNode(div);
		},

		d: function destroy() {
			icon.destroy(false);
			if (component.refs.generator === div_3) component.refs.generator = null;
			removeListener(div, "touchmove", touchmove_handler);
			removeListener(div, "mousemove", mousemove_handler);
		}
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this.refs = {};
	this._state = assign(assign(assign({ Math : Math }, this.store._init(["dictionary"])), data()), options.data);
	this.store._add(this, ["dictionary"]);

	this._handlers.destroy = [removeFromStore];

	var self = this;
	var _oncreate = function() {
		var changed = { hasStarted: 1, $dictionary: 1, seedPercentage: 1, Math: 1, obfuscatedPartialSeed: 1 };
		oncreate.call(self);
		self.fire("update", { changed: changed, current: self._state });
	};

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	this.root._oncreate.push(_oncreate);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });
assign(Multiple_wallets_component_svelte.prototype, methods);

Multiple_wallets_component_svelte.prototype._recompute = noop;

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function setStyle(node, key, value) {
	node.style.setProperty(key, value);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function removeFromStore() {
	this.store._remove(this);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function noop() {}

function blankObject() {
	return Object.create(null);
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("pages/index/index.handler.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _indexPage = require('./index.page.svelte');

var _indexPage2 = _interopRequireDefault(_indexPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IndexHandler = function () {
  function IndexHandler() {
    _classCallCheck(this, IndexHandler);
  }

  _createClass(IndexHandler, [{
    key: 'route',
    get: function get() {
      return {
        enter: function enter(current, previous) {
          window.scrollTo(0, 1);
          this.component = new _indexPage2.default({
            target: document.getElementById('app'),
            store: window.store
          });
        },
        leave: function leave(current, previous) {
          this.component.destroy();
        }
      };
    }
  }]);

  return IndexHandler;
}();

exports.default = IndexHandler;
});

;require.register("pages/index/index.page.svelte.html", function(exports, require, module) {
/* app/pages/index/index.page.svelte.html generated by Svelte v1.64.1 */
"use strict";
var roadtrip = require("roadtrip");

var Icon = require("../../components/icon/icon.component.svelte");
roadtrip = (roadtrip && roadtrip.__esModule) ? roadtrip["default"] : roadtrip;
Icon = (Icon && Icon.__esModule) ? Icon["default"] : Icon;

function data() {
  return {
    allowedLanguages: window['allowedLanguages'],
    currentLang: localStorage.getItem('ppc-user-language')
  }
};

var methods = {
  goto(path, e) {
    if (e) {
      e.preventDefault();
    }
    roadtrip.goto(path);
  },
  handleBulk(number) {
    window.store.set({
      numberOfWallets: number
    });
  },
  handleLanguage(e) {
    const lang = e.target.value;
    localStorage.setItem('ppc-user-language', lang);
    window.location.reload();
  }
};

function create_main_fragment(component, state) {
	var div, div_1, text, h1, text_1_value = state.$dictionary.index.title, text_1, text_2, h2, text_3_value = state.$dictionary.index.subtitle, text_3, text_4, a, text_5_value = state.$dictionary.index.start, text_5, text_7, div_2, div_3, label, text_8_value = state.$dictionary.index.options.numberOfWallets, text_8, text_9, input, text_11, div_4, label_1, text_12_value = state.$dictionary.index.options.language, text_12, text_13, select, text_17, footer, a_1, text_18_value = state.$dictionary.index.aboutLink, text_18, text_19, a_2;

	var icon_initial_data = { name: "logo" };
	var icon = new Icon({
		root: component.root,
		data: icon_initial_data
	});

	function click_handler(event) {
		component.goto('/generator');
	}

	function input_handler(event) {
		component.handleBulk(event.target.value);
	}

	var each_value = state.allowedLanguages;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, assign(assign({}, state), {
			each_value: each_value,
			lang: each_value[i],
			lang_index: i
		}));
	}

	function change_handler(event) {
		component.handleLanguage(event);
	}

	function click_handler_1(event) {
		component.goto('/about');
	}

	return {
		c: function create() {
			div = createElement("div");
			div_1 = createElement("div");
			icon._fragment.c();
			text = createText("\n    ");
			h1 = createElement("h1");
			text_1 = createText(text_1_value);
			text_2 = createText("\n    ");
			h2 = createElement("h2");
			text_3 = createText(text_3_value);
			text_4 = createText("\n    ");
			a = createElement("a");
			text_5 = createText(text_5_value);
			text_7 = createText("\n\n    ");
			div_2 = createElement("div");
			div_3 = createElement("div");
			label = createElement("label");
			text_8 = createText(text_8_value);
			text_9 = createText("\n        ");
			input = createElement("input");
			text_11 = createText("\n      ");
			div_4 = createElement("div");
			label_1 = createElement("label");
			text_12 = createText(text_12_value);
			text_13 = createText("\n        ");
			select = createElement("select");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			text_17 = createText("\n  ");
			footer = createElement("footer");
			a_1 = createElement("a");
			text_18 = createText(text_18_value);
			text_19 = createText("\n    ");
			a_2 = createElement("a");
			a_2.textContent = "peercoin.net";
			this.h();
		},

		h: function hydrate() {
			h1.className = "title";
			h2.className = "subtitle";
			addListener(a, "click", click_handler);
			a.href = "#";
			a.className = "btn-start";
			addListener(input, "input", input_handler);
			input.className = "field";
			setAttribute(input, "type", "number");
			input.min = "1";
			input.max = "1000";
			input.value = "1";
			div_3.className = "option";
			addListener(select, "change", change_handler);
			div_4.className = "option";
			div_2.className = "options-panel";
			div_1.className = "container";
			addListener(a_1, "click", click_handler_1);
			a_1.href = "#";
			a_1.className = "footer-link";
			a_2.href = "https://peercoin.net/";
			a_2.target = "_blank";
			a_2.className = "footer-link";
			footer.className = "footer";
			div.className = "IndexPage page page-entering";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(div_1, div);
			icon._mount(div_1, null);
			appendNode(text, div_1);
			appendNode(h1, div_1);
			appendNode(text_1, h1);
			appendNode(text_2, div_1);
			appendNode(h2, div_1);
			appendNode(text_3, h2);
			appendNode(text_4, div_1);
			appendNode(a, div_1);
			appendNode(text_5, a);
			appendNode(text_7, div_1);
			appendNode(div_2, div_1);
			appendNode(div_3, div_2);
			appendNode(label, div_3);
			appendNode(text_8, label);
			appendNode(text_9, div_3);
			appendNode(input, div_3);
			appendNode(text_11, div_2);
			appendNode(div_4, div_2);
			appendNode(label_1, div_4);
			appendNode(text_12, label_1);
			appendNode(text_13, div_4);
			appendNode(select, div_4);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			appendNode(text_17, div);
			appendNode(footer, div);
			appendNode(a_1, footer);
			appendNode(text_18, a_1);
			appendNode(text_19, footer);
			appendNode(a_2, footer);
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_1_value !== (text_1_value = state.$dictionary.index.title)) {
				text_1.data = text_1_value;
			}

			if ((changed.$dictionary) && text_3_value !== (text_3_value = state.$dictionary.index.subtitle)) {
				text_3.data = text_3_value;
			}

			if ((changed.$dictionary) && text_5_value !== (text_5_value = state.$dictionary.index.start)) {
				text_5.data = text_5_value;
			}

			if ((changed.$dictionary) && text_8_value !== (text_8_value = state.$dictionary.index.options.numberOfWallets)) {
				text_8.data = text_8_value;
			}

			if ((changed.$dictionary) && text_12_value !== (text_12_value = state.$dictionary.index.options.language)) {
				text_12.data = text_12_value;
			}

			var each_value = state.allowedLanguages;

			if (changed.allowedLanguages || changed.currentLang) {
				for (var i = 0; i < each_value.length; i += 1) {
					var each_context = assign(assign({}, state), {
						each_value: each_value,
						lang: each_value[i],
						lang_index: i
					});

					if (each_blocks[i]) {
						each_blocks[i].p(changed, each_context);
					} else {
						each_blocks[i] = create_each_block(component, each_context);
						each_blocks[i].c();
						each_blocks[i].m(select, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = each_value.length;
			}

			if ((changed.$dictionary) && text_18_value !== (text_18_value = state.$dictionary.index.aboutLink)) {
				text_18.data = text_18_value;
			}
		},

		u: function unmount() {
			detachNode(div);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}
		},

		d: function destroy() {
			icon.destroy(false);
			removeListener(a, "click", click_handler);
			removeListener(input, "input", input_handler);

			destroyEach(each_blocks);

			removeListener(select, "change", change_handler);
			removeListener(a_1, "click", click_handler_1);
		}
	};
}

// (18:10) {{#each allowedLanguages as lang}}
function create_each_block(component, state) {
	var lang = state.lang, each_value = state.each_value, lang_index = state.lang_index;
	var if_block_anchor, if_block_1_anchor;

	var if_block = (lang === state.currentLang) && create_if_block(component, state);

	var if_block_1 = (lang !== state.currentLang) && create_if_block_1(component, state);

	return {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = createComment();
			if (if_block_1) if_block_1.c();
			if_block_1_anchor = createComment();
		},

		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insertNode(if_block_anchor, target, anchor);
			if (if_block_1) if_block_1.m(target, anchor);
			insertNode(if_block_1_anchor, target, anchor);
		},

		p: function update(changed, state) {
			lang = state.lang;
			each_value = state.each_value;
			lang_index = state.lang_index;
			if (lang === state.currentLang) {
				if (if_block) {
					if_block.p(changed, state);
				} else {
					if_block = create_if_block(component, state);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.u();
				if_block.d();
				if_block = null;
			}

			if (lang !== state.currentLang) {
				if (if_block_1) {
					if_block_1.p(changed, state);
				} else {
					if_block_1 = create_if_block_1(component, state);
					if_block_1.c();
					if_block_1.m(if_block_1_anchor.parentNode, if_block_1_anchor);
				}
			} else if (if_block_1) {
				if_block_1.u();
				if_block_1.d();
				if_block_1 = null;
			}
		},

		u: function unmount() {
			if (if_block) if_block.u();
			detachNode(if_block_anchor);
			if (if_block_1) if_block_1.u();
			detachNode(if_block_1_anchor);
		},

		d: function destroy() {
			if (if_block) if_block.d();
			if (if_block_1) if_block_1.d();
		}
	};
}

// (19:12) {{#if lang === currentLang}}
function create_if_block(component, state) {
	var lang = state.lang, each_value = state.each_value, lang_index = state.lang_index;
	var option, text_value = lang, text, option_value_value;

	return {
		c: function create() {
			option = createElement("option");
			text = createText(text_value);
			this.h();
		},

		h: function hydrate() {
			option.__value = option_value_value = lang;
			option.value = option.__value;
			option.selected = true;
		},

		m: function mount(target, anchor) {
			insertNode(option, target, anchor);
			appendNode(text, option);
		},

		p: function update(changed, state) {
			lang = state.lang;
			each_value = state.each_value;
			lang_index = state.lang_index;
			if ((changed.allowedLanguages) && text_value !== (text_value = lang)) {
				text.data = text_value;
			}

			if ((changed.allowedLanguages) && option_value_value !== (option_value_value = lang)) {
				option.__value = option_value_value;
			}

			option.value = option.__value;
		},

		u: function unmount() {
			detachNode(option);
		},

		d: noop
	};
}

// (22:12) {{#if lang !== currentLang}}
function create_if_block_1(component, state) {
	var lang = state.lang, each_value = state.each_value, lang_index = state.lang_index;
	var option, text_value = lang, text, option_value_value;

	return {
		c: function create() {
			option = createElement("option");
			text = createText(text_value);
			this.h();
		},

		h: function hydrate() {
			option.__value = option_value_value = lang;
			option.value = option.__value;
		},

		m: function mount(target, anchor) {
			insertNode(option, target, anchor);
			appendNode(text, option);
		},

		p: function update(changed, state) {
			lang = state.lang;
			each_value = state.each_value;
			lang_index = state.lang_index;
			if ((changed.allowedLanguages) && text_value !== (text_value = lang)) {
				text.data = text_value;
			}

			if ((changed.allowedLanguages) && option_value_value !== (option_value_value = lang)) {
				option.__value = option_value_value;
			}

			option.value = option.__value;
		},

		u: function unmount() {
			detachNode(option);
		},

		d: noop
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this._state = assign(assign(this.store._init(["dictionary"]), data()), options.data);
	this.store._add(this, ["dictionary"]);

	this._handlers.destroy = [removeFromStore];

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });
assign(Multiple_wallets_component_svelte.prototype, methods);

Multiple_wallets_component_svelte.prototype._recompute = noop;

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createComment() {
	return document.createComment('');
}

function noop() {}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function removeFromStore() {
	this.store._remove(this);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function blankObject() {
	return Object.create(null);
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("pages/not-supported/not-supported.handler.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _roadtrip = require('roadtrip');

var _roadtrip2 = _interopRequireDefault(_roadtrip);

var _notSupportedPage = require('./not-supported.page.svelte');

var _notSupportedPage2 = _interopRequireDefault(_notSupportedPage);

var _checkCompatibility = require('../../helpers/checkCompatibility');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NotSupportedHandler = function () {
  function NotSupportedHandler() {
    _classCallCheck(this, NotSupportedHandler);
  }

  _createClass(NotSupportedHandler, [{
    key: 'route',
    get: function get() {
      return {
        enter: function enter(current, previous) {
          // If a compatible browser enters this page by mistake,
          // redirect it to home
          if ((0, _checkCompatibility.isCompatible)()) {
            _roadtrip2.default.goto('/');
            return;
          }

          // Otherwise, render the "Not Supported" view
          this.component = new _notSupportedPage2.default({
            target: document.getElementById('app')
          });
        },
        leave: function leave(current, previous) {
          if (this.component) {
            this.component.destroy();
          }
        }
      };
    }
  }]);

  return NotSupportedHandler;
}();

exports.default = NotSupportedHandler;
});

;require.register("pages/not-supported/not-supported.page.svelte.html", function(exports, require, module) {
/* app/pages/not-supported/not-supported.page.svelte.html generated by Svelte v1.64.1 */
"use strict";

function create_main_fragment(component, state) {
	var div;

	return {
		c: function create() {
			div = createElement("div");
			div.innerHTML = "<div class=\"container\"><div class=\"title\">Your browser is not supported.</div>\n    <p>This wallet uses new technology that requires modern browsers in order to run properly.</p>\n    <p>We recommend updating your browser or downloading one of the alternatives below before using this software.</p>\n\n    <div class=\"title\">Modern browsers available for download:</div>\n    <div><ul class=\"browsers\"><li><a href=\"https://www.mozilla.org/firefox/new/\">Firefox</a></li>\n        <li><a href=\"https://www.google.com/chrome/\">Chrome</a></li>\n        <li><a href=\"https://www.opera.com/\">Opera</a></li>\n      </ul></div></div>";
			this.h();
		},

		h: function hydrate() {
			div.className = "NotSupportedPage page page-entering";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		p: noop,

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });

Multiple_wallets_component_svelte.prototype._recompute = noop;

function createElement(name) {
	return document.createElement(name);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function noop() {}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function blankObject() {
	return Object.create(null);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("pages/wallet/wallet.handler.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _roadtrip = require('roadtrip');

var _roadtrip2 = _interopRequireDefault(_roadtrip);

var _walletPage = require('./wallet.page.svelte');

var _walletPage2 = _interopRequireDefault(_walletPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WalletHandler = function () {
  function WalletHandler() {
    _classCallCheck(this, WalletHandler);
  }

  _createClass(WalletHandler, [{
    key: 'route',
    get: function get() {
      return {
        enter: function enter(current, previous) {
          var wallets = window.store.get('wallets') || [];

          // If no address generated, redirect to home
          if (wallets.length < 1) {
            _roadtrip2.default.goto('/');
          } else {
            // Else, load view
            this.component = new _walletPage2.default({
              target: document.getElementById('app'),
              store: window.store
            });
          }
        },
        leave: function leave(current, previous) {
          if (this.component) {
            this.component.destroy();
          }
        }
      };
    }
  }]);

  return WalletHandler;
}();

exports.default = WalletHandler;
});

;require.register("pages/wallet/wallet.page.svelte.html", function(exports, require, module) {
/* app/pages/wallet/wallet.page.svelte.html generated by Svelte v1.64.1 */
"use strict";
var roadtrip = require("roadtrip");

var __import1 = require("svelte/store.umd.js");

var Icon = require("../../components/icon/icon.component.svelte");

var MultipleWallets = require("../../components/multiple-wallets/multiple-wallets.component.svelte");

var PaperWallet = require("../../components/paperwallet/paperwallet.component.svelte");
roadtrip = (roadtrip && roadtrip.__esModule) ? roadtrip["default"] : roadtrip;
var Store = __import1.Store;
Icon = (Icon && Icon.__esModule) ? Icon["default"] : Icon;
MultipleWallets = (MultipleWallets && MultipleWallets.__esModule) ? MultipleWallets["default"] : MultipleWallets;
PaperWallet = (PaperWallet && PaperWallet.__esModule) ? PaperWallet["default"] : PaperWallet;

function data() {
  const wallets = window.store.get('wallets');
  return {
    wallets: wallets,
    publicAddress: wallets[0].publicAddress,
    privateKey: wallets[0].privateKey,
    privateQRCode: wallets[0].privateQRCode,
    publicQRCode: wallets[0].publicQRCode,
    isPrivateKeyVisible: false,
    isShareMenuOpen: false
  }
};

function actionDownloadTextFile() {
  const text = `
  Date issued: ${new Date()}
  
  Public Address: ${window.store.get('publicAddress')}
  
  Private Key (DO NOT SHARE): ${window.store.get('privateKey')}
  `;

  return URL.createObjectURL(new Blob([text], {type: 'text/plain'}));
};

function actionGetMailBody() {
  const text = `
  Date issued: ${new Date()}

  Public Address: ${window.store.get('publicAddress')}
  
  Private Key (DO NOT SHARE): ${window.store.get('privateKey')}
  `;

  return text;
};

function actionDownloadJSONFile() {
  const data = {
    dateIssued: new Date(),
    publicAddress: window.store.get('publicAddress'),
    privateKey: window.store.get('privateKey')
  };

  return URL.createObjectURL(new Blob([JSON.stringify(data)], {type: 'application/json'}));
};

var methods = {
  goto(path, e) {
    if (e) {
      e.preventDefault();
    }
    roadtrip.goto(path);
  },
  togglePrivateKeyVisibility() {
    this.set({isPrivateKeyVisible: !this.get('isPrivateKeyVisible')})
  },
  reset() {
    delete window.store;
    window.store = null;
    window.store = new Store({
      wallets: [],
      numberOfWallets: 1
    });
    this.goto('/');
  },
  openShareMenu() {
    this.set({isShareMenuOpen: true});
  },
  closeShareMenu() {
    this.set({isShareMenuOpen: false});
  },
  actionPaperWallet(e) {
    e.preventDefault();
    window.print();
  },
  actionCopyToClipboard(e) {
    e.preventDefault();

    const textArea = document.createElement("textarea");
    const keys = `${this.get('publicAddress')} /// ${this.get('privateKey')}`;
    
    textArea.classList.add('clipboard', 'selectable');
    textArea.value = keys;

    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  },
  actionPrint(e) {
    e.preventDefault();
    window.print();
  }
};

function create_main_fragment(component, state) {
	var div, h1, text, text_2, text_3, text_4, button, text_5_value = state.$dictionary.wallet.clearBtn, text_5, text_6, nav, div_1, text_7, ul, li, a, text_8_value = state.$dictionary.wallet.menu.saveText, text_8, a_href_value, li_1, a_1, raw_value = state.$dictionary.wallet.menu.copyAddress, li_2, a_2, text_9_value = state.$dictionary.wallet.menu.sendEmail, text_9, a_2_href_value, li_3, a_3, text_10_value = state.$dictionary.wallet.menu.saveJSON, text_10, a_3_href_value, li_4, a_4, text_11_value = state.$dictionary.wallet.menu.paperWallet, text_11, nav_class_value;

	var if_block = (state.wallets.length === 1) && create_if_block(component, state);

	var if_block_1 = (state.wallets.length > 1) && create_if_block_1(component, state);

	var if_block_2 = (state.wallets.length > 1) && create_if_block_2(component, state);

	var if_block_3 = (state.wallets.length === 1) && create_if_block_3(component, state);

	function click_handler(event) {
		component.reset();
	}

	function click_handler_1(event) {
		component.closeShareMenu();
	}

	function click_handler_2(event) {
		component.actionCopyToClipboard(event);
	}

	function click_handler_3(event) {
		component.actionPaperWallet(event);
	}

	return {
		c: function create() {
			div = createElement("div");
			h1 = createElement("h1");
			if (if_block) if_block.c();
			text = createText("\n    ");
			if (if_block_1) if_block_1.c();
			text_2 = createText("\n\n  ");
			if (if_block_2) if_block_2.c();
			text_3 = createText("\n  ");
			if (if_block_3) if_block_3.c();
			text_4 = createText("\n\n  ");
			button = createElement("button");
			text_5 = createText(text_5_value);
			text_6 = createText("\n\n  ");
			nav = createElement("nav");
			div_1 = createElement("div");
			text_7 = createText("\n    ");
			ul = createElement("ul");
			li = createElement("li");
			a = createElement("a");
			text_8 = createText(text_8_value);
			li_1 = createElement("li");
			a_1 = createElement("a");
			li_2 = createElement("li");
			a_2 = createElement("a");
			text_9 = createText(text_9_value);
			li_3 = createElement("li");
			a_3 = createElement("a");
			text_10 = createText(text_10_value);
			li_4 = createElement("li");
			a_4 = createElement("a");
			text_11 = createText(text_11_value);
			this.h();
		},

		h: function hydrate() {
			h1.className = "title";
			addListener(button, "click", click_handler);
			button.className = "btn clear-data";
			addListener(div_1, "click", click_handler_1);
			div_1.className = "overlay";
			a.href = a_href_value = actionDownloadTextFile();
			a.download = "peercoin_wallet.txt";
			addListener(a_1, "click", click_handler_2);
			a_1.href = "#";
			a_2.href = a_2_href_value = "mailto:your-address-here@email.com?body=" + actionGetMailBody();
			a_3.href = a_3_href_value = actionDownloadJSONFile();
			a_3.download = "peercoin_wallet.json";
			addListener(a_4, "click", click_handler_3);
			a_4.href = "#";
			ul.className = "menu";
			nav.className = nav_class_value = "share-menu " + ((state.isShareMenuOpen) ? 'active' : '');
			div.className = "WalletPage page page-entering";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(h1, div);
			if (if_block) if_block.m(h1, null);
			appendNode(text, h1);
			if (if_block_1) if_block_1.m(h1, null);
			appendNode(text_2, div);
			if (if_block_2) if_block_2.m(div, null);
			appendNode(text_3, div);
			if (if_block_3) if_block_3.m(div, null);
			appendNode(text_4, div);
			appendNode(button, div);
			appendNode(text_5, button);
			appendNode(text_6, div);
			appendNode(nav, div);
			appendNode(div_1, nav);
			appendNode(text_7, nav);
			appendNode(ul, nav);
			appendNode(li, ul);
			appendNode(a, li);
			appendNode(text_8, a);
			appendNode(li_1, ul);
			appendNode(a_1, li_1);
			a_1.innerHTML = raw_value;
			appendNode(li_2, ul);
			appendNode(a_2, li_2);
			appendNode(text_9, a_2);
			appendNode(li_3, ul);
			appendNode(a_3, li_3);
			appendNode(text_10, a_3);
			appendNode(li_4, ul);
			appendNode(a_4, li_4);
			appendNode(text_11, a_4);
			component.refs.page = div;
		},

		p: function update(changed, state) {
			if (state.wallets.length === 1) {
				if (if_block) {
					if_block.p(changed, state);
				} else {
					if_block = create_if_block(component, state);
					if_block.c();
					if_block.m(h1, text);
				}
			} else if (if_block) {
				if_block.u();
				if_block.d();
				if_block = null;
			}

			if (state.wallets.length > 1) {
				if (if_block_1) {
					if_block_1.p(changed, state);
				} else {
					if_block_1 = create_if_block_1(component, state);
					if_block_1.c();
					if_block_1.m(h1, null);
				}
			} else if (if_block_1) {
				if_block_1.u();
				if_block_1.d();
				if_block_1 = null;
			}

			if (state.wallets.length > 1) {
				if (if_block_2) {
					if_block_2.p(changed, state);
				} else {
					if_block_2 = create_if_block_2(component, state);
					if_block_2.c();
					if_block_2.m(div, text_3);
				}
			} else if (if_block_2) {
				if_block_2.u();
				if_block_2.d();
				if_block_2 = null;
			}

			if (state.wallets.length === 1) {
				if (if_block_3) {
					if_block_3.p(changed, state);
				} else {
					if_block_3 = create_if_block_3(component, state);
					if_block_3.c();
					if_block_3.m(div, text_4);
				}
			} else if (if_block_3) {
				if_block_3.u();
				if_block_3.d();
				if_block_3 = null;
			}

			if ((changed.$dictionary) && text_5_value !== (text_5_value = state.$dictionary.wallet.clearBtn)) {
				text_5.data = text_5_value;
			}

			if ((changed.$dictionary) && text_8_value !== (text_8_value = state.$dictionary.wallet.menu.saveText)) {
				text_8.data = text_8_value;
			}

			if ((changed.$dictionary) && raw_value !== (raw_value = state.$dictionary.wallet.menu.copyAddress)) {
				a_1.innerHTML = raw_value;
			}

			if ((changed.$dictionary) && text_9_value !== (text_9_value = state.$dictionary.wallet.menu.sendEmail)) {
				text_9.data = text_9_value;
			}

			if ((changed.$dictionary) && text_10_value !== (text_10_value = state.$dictionary.wallet.menu.saveJSON)) {
				text_10.data = text_10_value;
			}

			if ((changed.$dictionary) && text_11_value !== (text_11_value = state.$dictionary.wallet.menu.paperWallet)) {
				text_11.data = text_11_value;
			}

			if ((changed.isShareMenuOpen) && nav_class_value !== (nav_class_value = "share-menu " + ((state.isShareMenuOpen) ? 'active' : ''))) {
				nav.className = nav_class_value;
			}
		},

		u: function unmount() {
			a_1.innerHTML = '';

			detachNode(div);
			if (if_block) if_block.u();
			if (if_block_1) if_block_1.u();
			if (if_block_2) if_block_2.u();
			if (if_block_3) if_block_3.u();
		},

		d: function destroy() {
			if (if_block) if_block.d();
			if (if_block_1) if_block_1.d();
			if (if_block_2) if_block_2.d();
			if (if_block_3) if_block_3.d();
			removeListener(button, "click", click_handler);
			removeListener(div_1, "click", click_handler_1);
			removeListener(a_1, "click", click_handler_2);
			removeListener(a_4, "click", click_handler_3);
			if (component.refs.page === div) component.refs.page = null;
		}
	};
}

// (3:4) {{#if wallets.length === 1}}
function create_if_block(component, state) {
	var div, text, text_1_value = state.$dictionary.wallet.title, text_1;

	var icon_initial_data = { name: "check" };
	var icon = new Icon({
		root: component.root,
		data: icon_initial_data
	});

	return {
		c: function create() {
			div = createElement("div");
			icon._fragment.c();
			text = createText(" ");
			text_1 = createText(text_1_value);
			this.h();
		},

		h: function hydrate() {
			div.className = "checkmark";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			icon._mount(div, null);
			insertNode(text, target, anchor);
			insertNode(text_1, target, anchor);
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_1_value !== (text_1_value = state.$dictionary.wallet.title)) {
				text_1.data = text_1_value;
			}
		},

		u: function unmount() {
			detachNode(div);
			detachNode(text);
			detachNode(text_1);
		},

		d: function destroy() {
			icon.destroy(false);
		}
	};
}

// (6:4) {{#if wallets.length > 1}}
function create_if_block_1(component, state) {
	var div, text, text_1_value = state.wallets.length, text_1, text_2, text_3_value = state.$dictionary.wallet.titlePlural, text_3;

	var icon_initial_data = { name: "check" };
	var icon = new Icon({
		root: component.root,
		data: icon_initial_data
	});

	return {
		c: function create() {
			div = createElement("div");
			icon._fragment.c();
			text = createText(" ");
			text_1 = createText(text_1_value);
			text_2 = createText(" ");
			text_3 = createText(text_3_value);
			this.h();
		},

		h: function hydrate() {
			div.className = "checkmark";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			icon._mount(div, null);
			insertNode(text, target, anchor);
			insertNode(text_1, target, anchor);
			insertNode(text_2, target, anchor);
			insertNode(text_3, target, anchor);
		},

		p: function update(changed, state) {
			if ((changed.wallets) && text_1_value !== (text_1_value = state.wallets.length)) {
				text_1.data = text_1_value;
			}

			if ((changed.$dictionary) && text_3_value !== (text_3_value = state.$dictionary.wallet.titlePlural)) {
				text_3.data = text_3_value;
			}
		},

		u: function unmount() {
			detachNode(div);
			detachNode(text);
			detachNode(text_1);
			detachNode(text_2);
			detachNode(text_3);
		},

		d: function destroy() {
			icon.destroy(false);
		}
	};
}

// (11:2) {{#if wallets.length > 1}}
function create_if_block_2(component, state) {

	var multiplewallets_initial_data = { wallets: state.wallets };
	var multiplewallets = new MultipleWallets({
		root: component.root,
		data: multiplewallets_initial_data
	});

	return {
		c: function create() {
			multiplewallets._fragment.c();
		},

		m: function mount(target, anchor) {
			multiplewallets._mount(target, anchor);
		},

		p: function update(changed, state) {
			var multiplewallets_changes = {};
			if (changed.wallets) multiplewallets_changes.wallets = state.wallets;
			multiplewallets._set(multiplewallets_changes);
		},

		u: function unmount() {
			multiplewallets._unmount();
		},

		d: function destroy() {
			multiplewallets.destroy(false);
		}
	};
}

// (30:8) {{#if !isPrivateKeyVisible}}
function create_if_block_4(component, state) {
	var div, text_value = state.$dictionary.wallet.makeSure, text;

	return {
		c: function create() {
			div = createElement("div");
			text = createText(text_value);
			this.h();
		},

		h: function hydrate() {
			div.className = "section-value grey";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			appendNode(text, div);
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_value !== (text_value = state.$dictionary.wallet.makeSure)) {
				text.data = text_value;
			}
		},

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

// (33:8) {{#if isPrivateKeyVisible}}
function create_if_block_5(component, state) {
	var img, img_alt_value, text, div, text_1;

	return {
		c: function create() {
			img = createElement("img");
			text = createText("\n          ");
			div = createElement("div");
			text_1 = createText(state.privateKey);
			this.h();
		},

		h: function hydrate() {
			img.src = state.privateQRCode;
			img.alt = img_alt_value = state.$dictionary.wallet.privateQRCode;
			img.className = "qr-code-private";
			div.className = "section-value selectable";
		},

		m: function mount(target, anchor) {
			insertNode(img, target, anchor);
			insertNode(text, target, anchor);
			insertNode(div, target, anchor);
			appendNode(text_1, div);
		},

		p: function update(changed, state) {
			if (changed.privateQRCode) {
				img.src = state.privateQRCode;
			}

			if ((changed.$dictionary) && img_alt_value !== (img_alt_value = state.$dictionary.wallet.privateQRCode)) {
				img.alt = img_alt_value;
			}

			if (changed.privateKey) {
				text_1.data = state.privateKey;
			}
		},

		u: function unmount() {
			detachNode(img);
			detachNode(text);
			detachNode(div);
		},

		d: noop
	};
}

// (14:2) {{#if wallets.length === 1}}
function create_if_block_3(component, state) {
	var h1, text_value = state.$dictionary.wallet.titlePrint, text, text_1, text_2, img, text_3, div, div_1, text_5, div_2, div_3, text_6_value = state.$dictionary.wallet.address, text_6, text_7, div_4, text_8, text_10, div_5, div_6, text_11_value = state.$dictionary.wallet.privateKey, text_11, text_12, button, text_13_value = (state.isPrivateKeyVisible) ? 'Hide' : 'Show', text_13, text_15, text_16;

	var paperwallet_initial_data = {
	 	publicAddress: state.publicAddress,
	 	privateKey: state.privateKey,
	 	publicQRCode: state.publicQRCode,
	 	privateQRCode: state.privateQRCode
	 };
	var paperwallet = new PaperWallet({
		root: component.root,
		data: paperwallet_initial_data
	});

	var icon_initial_data = { name: "share" };
	var icon = new Icon({
		root: component.root,
		data: icon_initial_data
	});

	function click_handler(event) {
		component.openShareMenu();
	}

	function click_handler_1(event) {
		component.togglePrivateKeyVisibility();
	}

	var if_block = (!state.isPrivateKeyVisible) && create_if_block_4(component, state);

	var if_block_1 = (state.isPrivateKeyVisible) && create_if_block_5(component, state);

	return {
		c: function create() {
			h1 = createElement("h1");
			text = createText(text_value);
			text_1 = createText("\n    ");
			paperwallet._fragment.c();
			text_2 = createText("\n    ");
			img = createElement("img");
			text_3 = createText("\n    ");
			div = createElement("div");
			div_1 = createElement("div");
			icon._fragment.c();
			text_5 = createText("\n      ");
			div_2 = createElement("div");
			div_3 = createElement("div");
			text_6 = createText(text_6_value);
			text_7 = createText("\n        ");
			div_4 = createElement("div");
			text_8 = createText(state.publicAddress);
			text_10 = createText("\n      ");
			div_5 = createElement("div");
			div_6 = createElement("div");
			text_11 = createText(text_11_value);
			text_12 = createText("\n          ");
			button = createElement("button");
			text_13 = createText(text_13_value);
			text_15 = createText("\n        ");
			if (if_block) if_block.c();
			text_16 = createText("\n        ");
			if (if_block_1) if_block_1.c();
			this.h();
		},

		h: function hydrate() {
			h1.className = "print-only print-title";
			img.src = state.publicQRCode;
			img.alt = "Public Address QR Code";
			img.className = "qr-code";
			addListener(div_1, "click", click_handler);
			div_1.className = "share-btn";
			div_3.className = "section-title";
			div_4.className = "section-value selectable";
			div_2.className = "section";
			addListener(button, "click", click_handler_1);
			button.className = "btn btn-section";
			div_6.className = "section-title";
			div_5.className = "section";
			div.className = "wallet-details";
		},

		m: function mount(target, anchor) {
			insertNode(h1, target, anchor);
			appendNode(text, h1);
			insertNode(text_1, target, anchor);
			paperwallet._mount(target, anchor);
			insertNode(text_2, target, anchor);
			insertNode(img, target, anchor);
			insertNode(text_3, target, anchor);
			insertNode(div, target, anchor);
			appendNode(div_1, div);
			icon._mount(div_1, null);
			appendNode(text_5, div);
			appendNode(div_2, div);
			appendNode(div_3, div_2);
			appendNode(text_6, div_3);
			appendNode(text_7, div_2);
			appendNode(div_4, div_2);
			appendNode(text_8, div_4);
			appendNode(text_10, div);
			appendNode(div_5, div);
			appendNode(div_6, div_5);
			appendNode(text_11, div_6);
			appendNode(text_12, div_6);
			appendNode(button, div_6);
			appendNode(text_13, button);
			appendNode(text_15, div_5);
			if (if_block) if_block.m(div_5, null);
			appendNode(text_16, div_5);
			if (if_block_1) if_block_1.m(div_5, null);
		},

		p: function update(changed, state) {
			if ((changed.$dictionary) && text_value !== (text_value = state.$dictionary.wallet.titlePrint)) {
				text.data = text_value;
			}

			var paperwallet_changes = {};
			if (changed.publicAddress) paperwallet_changes.publicAddress = state.publicAddress;
			if (changed.privateKey) paperwallet_changes.privateKey = state.privateKey;
			if (changed.publicQRCode) paperwallet_changes.publicQRCode = state.publicQRCode;
			if (changed.privateQRCode) paperwallet_changes.privateQRCode = state.privateQRCode;
			paperwallet._set(paperwallet_changes);

			if (changed.publicQRCode) {
				img.src = state.publicQRCode;
			}

			if ((changed.$dictionary) && text_6_value !== (text_6_value = state.$dictionary.wallet.address)) {
				text_6.data = text_6_value;
			}

			if (changed.publicAddress) {
				text_8.data = state.publicAddress;
			}

			if ((changed.$dictionary) && text_11_value !== (text_11_value = state.$dictionary.wallet.privateKey)) {
				text_11.data = text_11_value;
			}

			if ((changed.isPrivateKeyVisible) && text_13_value !== (text_13_value = (state.isPrivateKeyVisible) ? 'Hide' : 'Show')) {
				text_13.data = text_13_value;
			}

			if (!state.isPrivateKeyVisible) {
				if (if_block) {
					if_block.p(changed, state);
				} else {
					if_block = create_if_block_4(component, state);
					if_block.c();
					if_block.m(div_5, text_16);
				}
			} else if (if_block) {
				if_block.u();
				if_block.d();
				if_block = null;
			}

			if (state.isPrivateKeyVisible) {
				if (if_block_1) {
					if_block_1.p(changed, state);
				} else {
					if_block_1 = create_if_block_5(component, state);
					if_block_1.c();
					if_block_1.m(div_5, null);
				}
			} else if (if_block_1) {
				if_block_1.u();
				if_block_1.d();
				if_block_1 = null;
			}
		},

		u: function unmount() {
			detachNode(h1);
			detachNode(text_1);
			paperwallet._unmount();
			detachNode(text_2);
			detachNode(img);
			detachNode(text_3);
			detachNode(div);
			if (if_block) if_block.u();
			if (if_block_1) if_block_1.u();
		},

		d: function destroy() {
			paperwallet.destroy(false);
			icon.destroy(false);
			removeListener(div_1, "click", click_handler);
			removeListener(button, "click", click_handler_1);
			if (if_block) if_block.d();
			if (if_block_1) if_block_1.d();
		}
	};
}

function Multiple_wallets_component_svelte(options) {
	init(this, options);
	this.refs = {};
	this._state = assign(assign(this.store._init(["dictionary"]), data()), options.data);
	this.store._add(this, ["dictionary"]);

	this._handlers.destroy = [removeFromStore];

	if (!options.root) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign(Multiple_wallets_component_svelte.prototype, {
 	destroy: destroy,
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set,
 	teardown: destroy,
 	_set: _set,
 	_mount: _mount,
 	_unmount: _unmount,
 	_differs: _differs
 });
assign(Multiple_wallets_component_svelte.prototype, methods);

Multiple_wallets_component_svelte.prototype._recompute = noop;

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function noop() {}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
}

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function removeFromStore() {
	this.store._remove(this);
}

function callAll(fns) {
	while (fns && fns.length) fns.shift()();
}

function destroy(detach) {
	this.destroy = noop;
	this.fire('destroy');
	this.set = this.get = noop;

	if (detach !== false) this._fragment.u();
	this._fragment.d();
	this._fragment = this._state = null;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		var handler = handlers[i];

		if (!handler.__calling) {
			handler.__calling = true;
			handler.call(this, data);
			handler.__calling = false;
		}
	}
}

function observe(key, callback, options) {
	var fn = callback.bind(this);

	if (!options || options.init !== false) {
		fn(this.get()[key], undefined);
	}

	return this.on(options && options.defer ? 'update' : 'state', function(event) {
		if (event.changed[key]) fn(event.current[key], event.previous && event.previous[key]);
	});
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this.root._lock) return;
	this.root._lock = true;
	callAll(this.root._beforecreate);
	callAll(this.root._oncreate);
	callAll(this.root._aftercreate);
	this.root._lock = false;
}

function _set(newState) {
	var oldState = this._state,
		changed = {},
		dirty = false;

	for (var key in newState) {
		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	}
	if (!dirty) return;

	this._state = assign(assign({}, oldState), newState);
	this._recompute(changed, this._state);
	if (this._bind) this._bind(changed, this._state);

	if (this._fragment) {
		this.fire("state", { changed: changed, current: this._state, previous: oldState });
		this._fragment.p(changed, this._state);
		this.fire("update", { changed: changed, current: this._state, previous: oldState });
	}
}

function _mount(target, anchor) {
	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

function _unmount() {
	if (this._fragment) this._fragment.u();
}

function _differs(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function blankObject() {
	return Object.create(null);
}

module.exports = Multiple_wallets_component_svelte;});

;require.register("routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _roadtrip = require('roadtrip');

var _roadtrip2 = _interopRequireDefault(_roadtrip);

var _index = require('./pages/index/index.handler');

var _index2 = _interopRequireDefault(_index);

var _generator = require('./pages/generator/generator.handler');

var _generator2 = _interopRequireDefault(_generator);

var _about = require('./pages/about/about.handler');

var _about2 = _interopRequireDefault(_about);

var _wallet = require('./pages/wallet/wallet.handler');

var _wallet2 = _interopRequireDefault(_wallet);

var _notSupported = require('./pages/not-supported/not-supported.handler');

var _notSupported2 = _interopRequireDefault(_notSupported);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Routes = function () {
  function Routes() {
    _classCallCheck(this, Routes);

    this.router = _roadtrip2.default;
    this.init();
  }

  _createClass(Routes, [{
    key: 'init',
    value: function init() {
      this.index_handler = new _index2.default();
      this.about_handler = new _about2.default();
      this.generator_handler = new _generator2.default();
      this.wallet_handler = new _wallet2.default();
      this.not_supported_handler = new _notSupported2.default();

      this.router.add('/', this.index_handler.route).add('/about', this.about_handler.route).add('/generator', this.generator_handler.route).add('/wallet', this.wallet_handler.route).add('/not-supported', this.not_supported_handler.route).start({
        fallback: '/'
      });
    }
  }]);

  return Routes;
}();

exports.default = Routes;
});

;require.alias("qrious/dist/qrious.js", "qrious");
require.alias("roadtrip/dist/roadtrip.umd.js", "roadtrip");require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('initialize');
//# sourceMappingURL=app.js.map
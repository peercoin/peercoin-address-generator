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

function Icon_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Icon_component_svelte.prototype, {
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

Icon_component_svelte.prototype._recompute = noop;

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

module.exports = Icon_component_svelte;});

;require.register("components/multiple-wallets/multiple-wallets.component.svelte.html", function(exports, require, module) {
/* app/components/multiple-wallets/multiple-wallets.component.svelte.html generated by Svelte v1.64.1 */
"use strict";

function create_main_fragment(component, state) {
	var div;

	var each_value = state.wallets;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(component, assign(assign({}, state), {
			each_value: each_value,
			wallet: each_value[i],
			i: i
		}));
	}

	return {
		c: function create() {
			div = createElement("div");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			this.h();
		},

		h: function hydrate() {
			div.className = "MultipleWalletsComp";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},

		p: function update(changed, state) {
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
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].u();
					each_blocks[i].d();
				}
				each_blocks.length = each_value.length;
			}
		},

		u: function unmount() {
			detachNode(div);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].u();
			}
		},

		d: function destroy() {
			destroyEach(each_blocks);
		}
	};
}

// (2:2) {{#each wallets as wallet, i}}
function create_each_block(component, state) {
	var wallet = state.wallet, each_value = state.each_value, i = state.i;
	var div, h2, text, text_1_value = i + 1, text_1, text_2, div_1, div_2, text_4, div_3, text_5_value = wallet.publicAddress, text_5, text_7, div_4, div_5, text_9, div_6, text_10_value = wallet.privateKey, text_10;

	return {
		c: function create() {
			div = createElement("div");
			h2 = createElement("h2");
			text = createText("Wallet #");
			text_1 = createText(text_1_value);
			text_2 = createText("\n    ");
			div_1 = createElement("div");
			div_2 = createElement("div");
			div_2.textContent = "Public Address:";
			text_4 = createText("\n      ");
			div_3 = createElement("div");
			text_5 = createText(text_5_value);
			text_7 = createText("\n    ");
			div_4 = createElement("div");
			div_5 = createElement("div");
			div_5.textContent = "Private key:";
			text_9 = createText("\n      ");
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
			appendNode(text_4, div_1);
			appendNode(div_3, div_1);
			appendNode(text_5, div_3);
			appendNode(text_7, div);
			appendNode(div_4, div);
			appendNode(div_5, div_4);
			appendNode(text_9, div_4);
			appendNode(div_6, div_4);
			appendNode(text_10, div_6);
		},

		p: function update(changed, state) {
			wallet = state.wallet;
			each_value = state.each_value;
			i = state.i;
			if ((changed.wallets) && text_5_value !== (text_5_value = wallet.publicAddress)) {
				text_5.data = text_5_value;
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

function Icon_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Icon_component_svelte.prototype, {
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

Icon_component_svelte.prototype._recompute = noop;

function assign(tar, src) {
	for (var k in src) tar[k] = src[k];
	return tar;
}

function createElement(name) {
	return document.createElement(name);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations) {
	for (var i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d();
	}
}

function createText(data) {
	return document.createTextNode(data);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function noop() {}

function init(component, options) {
	component._handlers = blankObject();
	component._bind = options._bind;

	component.options = options;
	component.root = options.root || component;
	component.store = component.root.store || options.store;
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

module.exports = Icon_component_svelte;});

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

;require.register("helpers/peercoin/Base58.js", function(exports, require, module) {
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
  window.Routes = new _routes2.default();
  window.store = new _storeUmd.Store({
    wallets: [],
    numberOfWallets: 1
  });
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
            target: document.getElementById('app')
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
	var div, header, a, text_2, div_1, div_2, text_4, p, text_6, p_1, text_8, div_3, text_10, p_2, text_11, b, text_12_value = timeAlive(), text_12, text_13, text_14, text_15_value = timeAlive(), text_15, text_16, text_17, div_4, text_19, p_3, text_21, div_5, text_23, p_4, text_25, p_5, text_27, p_6;

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
			a.textContent = "Back";
			text_2 = createText("\n  ");
			div_1 = createElement("div");
			div_2 = createElement("div");
			div_2.textContent = "About";
			text_4 = createText("\n    ");
			p = createElement("p");
			p.textContent = "This Wallet Generator was build from scratch for Peercoin.";
			text_6 = createText("\n    ");
			p_1 = createElement("p");
			p_1.textContent = "The main focus is to deliver a good and fast experience for mobile users, which seem forsaken by classic wallet generators. We're using cutting edge browser technologies in order to deliver this better experience, so please understand that older browsers may not work as expected (or at all) with this application.";
			text_8 = createText("\n\n    ");
			div_3 = createElement("div");
			div_3.textContent = "Peercoin";
			text_10 = createText("\n    ");
			p_2 = createElement("p");
			text_11 = createText("Peercoin is the first cryptocurrency to implement the hybrid Proof of Work (POW) and Proof of Stake (POS) algorithm. Created in 2012, it's been running for more than ");
			b = createElement("b");
			text_12 = createText(text_12_value);
			text_13 = createText(" years");
			text_14 = createText(" with considerably less energy than pure PoW cryptocurrencies such as Bitcoin. Along those ");
			text_15 = createText(text_15_value);
			text_16 = createText(" years Peercoin also never had any type involvement with pre-mining, fraudulent ICOs or any critical security breaches.");
			text_17 = createText("\n\n    ");
			div_4 = createElement("div");
			div_4.textContent = "Disclaimer";
			text_19 = createText("\n    ");
			p_3 = createElement("p");
			p_3.textContent = "Peercoin team, this wallet developers, or anyone involved with Peercoin do not hold any responsibility for money lost upon wallet generation from this tool, or any other means involving Peercoin or other cryptocurrencies. The owner of the wallet generated is responsible for its money and thus should follow all security steps in order to keep them safe. We do our best to keep this tool as up-to-date and secure as possible. This tool is 100% open-source. If you find any bugs or issues, please report to our repository.";
			text_21 = createText("\n\n    ");
			div_5 = createElement("div");
			div_5.textContent = "Credits";
			text_23 = createText("\n    ");
			p_4 = createElement("p");
			p_4.textContent = "This is an open-source tool, and as such, cointains 3rd-party libraries with respective licenses. Those can be found at this application repository.";
			text_25 = createText("\n    ");
			p_5 = createElement("p");
			p_5.textContent = "If you find any lack of credits, please open an issue at our repository.";
			text_27 = createText("\n    ");
			p_6 = createElement("p");
			p_6.innerHTML = "Developed by <a href=\"https://twitter.com/kazzkiq/\" target=\"_blank\">@Kazzkiq</a>, made possible by Peercoin Community.";
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
			appendNode(text_2, div);
			appendNode(div_1, div);
			appendNode(div_2, div_1);
			appendNode(text_4, div_1);
			appendNode(p, div_1);
			appendNode(text_6, div_1);
			appendNode(p_1, div_1);
			appendNode(text_8, div_1);
			appendNode(div_3, div_1);
			appendNode(text_10, div_1);
			appendNode(p_2, div_1);
			appendNode(text_11, p_2);
			appendNode(b, p_2);
			appendNode(text_12, b);
			appendNode(text_13, b);
			appendNode(text_14, p_2);
			appendNode(text_15, p_2);
			appendNode(text_16, p_2);
			appendNode(text_17, div_1);
			appendNode(div_4, div_1);
			appendNode(text_19, div_1);
			appendNode(p_3, div_1);
			appendNode(text_21, div_1);
			appendNode(div_5, div_1);
			appendNode(text_23, div_1);
			appendNode(p_4, div_1);
			appendNode(text_25, div_1);
			appendNode(p_5, div_1);
			appendNode(text_27, div_1);
			appendNode(p_6, div_1);
			component.refs.page = div;
		},

		p: noop,

		u: function unmount() {
			detachNode(div);
		},

		d: function destroy() {
			removeListener(a, "click", click_handler);
			removeListener(div, "animationend", animationend_handler);
			if (component.refs.page === div) component.refs.page = null;
		}
	};
}

function Icon_component_svelte(options) {
	init(this, options);
	this.refs = {};
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Icon_component_svelte.prototype, {
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
assign(Icon_component_svelte.prototype, methods);

Icon_component_svelte.prototype._recompute = noop;

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

function noop() {}

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

module.exports = Icon_component_svelte;});

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
            target: document.getElementById('app')
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

var BigInteger = require("../../helpers/peercoin/BigInteger");

var Peercoin = require("../../helpers/peercoin/Peercoin");

var Base58 = require("../../helpers/peercoin/Base58");

var ECurve = require("../../helpers/peercoin/ECurve");

var Icon = require("../../components/icon/icon.component.svelte");

var __import6 = require("../../helpers/checkCompatibility");
roadtrip = (roadtrip && roadtrip.__esModule) ? roadtrip["default"] : roadtrip;
BigInteger = (BigInteger && BigInteger.__esModule) ? BigInteger["default"] : BigInteger;
Peercoin = (Peercoin && Peercoin.__esModule) ? Peercoin["default"] : Peercoin;
Base58 = (Base58 && Base58.__esModule) ? Base58["default"] : Base58;
ECurve = (ECurve && ECurve.__esModule) ? ECurve["default"] : ECurve;
Icon = (Icon && Icon.__esModule) ? Icon["default"] : Icon;
var isCompatible = __import6.isCompatible;

function data() {
  return {
    lastTouch: +new Date(),
    touches: 0,
    totalTouches: 1 + (Math.round(crypto.getRandomValues(new Uint8Array(10))[5] / 4)), // 120
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
      console.log(e);
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
        privateKey: addresspriv
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
	var div, div_1, div_2, h1, text_1, h2, text_3, h2_1, text_6, div_1_class_value, text_9, div_3, div_4, h1_1, text_11, div_5, text_12_value = state.Math.floor(state.seedPercentage), text_12, text_13, div_4_class_value, text_15, div_6, div_7, text_16;

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
			h1.textContent = "Swipe finger for randomness.";
			text_1 = createText("\n      ");
			h2 = createElement("h2");
			h2.textContent = "Use your finger to start swiping randomly along the screen, this helps with the uniqueness when generating your wallet.";
			text_3 = createText("\n      ");
			h2_1 = createElement("h2");
			h2_1.innerHTML = "<b>You can start at anytime.</b> We will let you know once the proccess is finished.";
			text_6 = createText("\n      ");
			icon._fragment.c();
			text_9 = createText("\n  ");
			div_3 = createElement("div");
			div_4 = createElement("div");
			h1_1 = createElement("h1");
			h1_1.textContent = "Keep Swiping";
			text_11 = createText("\n      ");
			div_5 = createElement("div");
			text_12 = createText(text_12_value);
			text_13 = createText("%");
			text_15 = createText("\n    ");
			div_6 = createElement("div");
			div_7 = createElement("div");
			text_16 = createText(state.obfuscatedPartialSeed);
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
			appendNode(text_1, div_2);
			appendNode(h2, div_2);
			appendNode(text_3, div_2);
			appendNode(h2_1, div_2);
			appendNode(text_6, div_2);
			icon._mount(div_2, null);
			appendNode(text_9, div);
			appendNode(div_3, div);
			appendNode(div_4, div_3);
			appendNode(h1_1, div_4);
			appendNode(text_11, div_4);
			appendNode(div_5, div_4);
			appendNode(text_12, div_5);
			appendNode(text_13, div_5);
			appendNode(text_15, div_3);
			appendNode(div_6, div_3);
			appendNode(div_7, div_6);
			appendNode(text_16, div_7);
			component.refs.generator = div_3;
		},

		p: function update(changed, state) {
			if ((changed.hasStarted) && div_1_class_value !== (div_1_class_value = "instructions " + ((state.hasStarted) ? '' : 'active'))) {
				div_1.className = div_1_class_value;
			}

			if ((changed.Math || changed.seedPercentage) && text_12_value !== (text_12_value = state.Math.floor(state.seedPercentage))) {
				text_12.data = text_12_value;
			}

			if ((changed.seedPercentage) && div_4_class_value !== (div_4_class_value = "progress-label " + ((state.seedPercentage > 44) ? 'white' : ''))) {
				div_4.className = div_4_class_value;
			}

			if (changed.obfuscatedPartialSeed) {
				text_16.data = state.obfuscatedPartialSeed;
			}

			if (changed.seedPercentage) {
				setStyle(div_6, "transform", "translate3d(0, " + ( 100 - state.seedPercentage ) + "%, 0)");
			}
		},

		u: function unmount() {
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

function Icon_component_svelte(options) {
	init(this, options);
	this.refs = {};
	this._state = assign(assign({ Math : Math }, data()), options.data);

	var self = this;
	var _oncreate = function() {
		var changed = { hasStarted: 1, seedPercentage: 1, Math: 1, obfuscatedPartialSeed: 1 };
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

assign(Icon_component_svelte.prototype, {
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
assign(Icon_component_svelte.prototype, methods);

Icon_component_svelte.prototype._recompute = noop;

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

module.exports = Icon_component_svelte;});

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
            target: document.getElementById('app')
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
  }
};

function create_main_fragment(component, state) {
	var div, div_1, text, h1, text_2, h2, text_4, a, text_6, div_2, div_3, label, text_8, input, text_12, footer, a_1, text_14, a_2;

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
			h1.textContent = "Wallet Generator";
			text_2 = createText("\n    ");
			h2 = createElement("h2");
			h2.textContent = "To generate a new wallet, simply click in the button below and follow the instructions.";
			text_4 = createText("\n    ");
			a = createElement("a");
			a.textContent = "Start";
			text_6 = createText("\n\n    ");
			div_2 = createElement("div");
			div_3 = createElement("div");
			label = createElement("label");
			label.textContent = "Number of Wallets to generate (Bulk Generation):";
			text_8 = createText("\n        ");
			input = createElement("input");
			text_12 = createText("\n  ");
			footer = createElement("footer");
			a_1 = createElement("a");
			a_1.textContent = "about";
			text_14 = createText("\n    ");
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
			appendNode(text_2, div_1);
			appendNode(h2, div_1);
			appendNode(text_4, div_1);
			appendNode(a, div_1);
			appendNode(text_6, div_1);
			appendNode(div_2, div_1);
			appendNode(div_3, div_2);
			appendNode(label, div_3);
			appendNode(text_8, div_3);
			appendNode(input, div_3);
			appendNode(text_12, div);
			appendNode(footer, div);
			appendNode(a_1, footer);
			appendNode(text_14, footer);
			appendNode(a_2, footer);
		},

		p: noop,

		u: function unmount() {
			detachNode(div);
		},

		d: function destroy() {
			icon.destroy(false);
			removeListener(a, "click", click_handler);
			removeListener(input, "input", input_handler);
			removeListener(a_1, "click", click_handler_1);
		}
	};
}

function Icon_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

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

assign(Icon_component_svelte.prototype, {
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
assign(Icon_component_svelte.prototype, methods);

Icon_component_svelte.prototype._recompute = noop;

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

function noop() {}

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

module.exports = Icon_component_svelte;});

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

function Icon_component_svelte(options) {
	init(this, options);
	this._state = assign({}, options.data);

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Icon_component_svelte.prototype, {
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

Icon_component_svelte.prototype._recompute = noop;

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

module.exports = Icon_component_svelte;});

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

          console.log(wallets);

          // If no address generated, redirect to home
          if (wallets.length < 1) {
            _roadtrip2.default.goto('/');
          } else {
            // Else, load view
            this.component = new _walletPage2.default({
              target: document.getElementById('app')
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

var QRious = require("qrious");

var __import2 = require("svelte/store.umd.js");

var Icon = require("../../components/icon/icon.component.svelte");

var MultipleWallets = require("../../components/multiple-wallets/multiple-wallets.component.svelte");
roadtrip = (roadtrip && roadtrip.__esModule) ? roadtrip["default"] : roadtrip;
QRious = (QRious && QRious.__esModule) ? QRious["default"] : QRious;
var Store = __import2.Store;
Icon = (Icon && Icon.__esModule) ? Icon["default"] : Icon;
MultipleWallets = (MultipleWallets && MultipleWallets.__esModule) ? MultipleWallets["default"] : MultipleWallets;

function data() {
  return {
    wallets: window.store.get('wallets'),
    publicAddress: window.store.get('wallets')[0].publicAddress,
    privateKey: window.store.get('wallets')[0].privateKey,
    privateQRCode: new QRious({value: window.store.get('wallets')[0].privateKey || 'just a sample lorem ipsum dolor sit', size: 200 * 4, level: 'L'}).toDataURL(),
    publicQRCode: new QRious({value: window.store.get('wallets')[0].publicAddress || 'just a sample lorem ipsum dolor sit', size: 200 * 4, level: 'L'}).toDataURL(),
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
      console.log('Copied!');
    } catch (err) {
      console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  },
  actionPrint(e) {
    e.preventDefault();
    window.print();
  }
};

function create_main_fragment(component, state) {
	var div, h1, text, text_2, text_3, text_4, button, text_6, nav, div_1, text_7, ul, li, a, a_href_value, li_1, a_1, li_2, a_2, a_2_href_value, li_3, a_3, a_3_href_value, li_4, nav_class_value;

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
			button.textContent = "Clear data and start again.";
			text_6 = createText("\n\n  ");
			nav = createElement("nav");
			div_1 = createElement("div");
			text_7 = createText("\n    ");
			ul = createElement("ul");
			li = createElement("li");
			a = createElement("a");
			a.textContent = "Save .txt locally";
			li_1 = createElement("li");
			a_1 = createElement("a");
			a_1.innerHTML = "Copy <b>address/priv. key</b> to clipboard";
			li_2 = createElement("li");
			a_2 = createElement("a");
			a_2.textContent = "Send via email";
			li_3 = createElement("li");
			a_3 = createElement("a");
			a_3.textContent = "Save JSON data";
			li_4 = createElement("li");
			li_4.innerHTML = "<a href=\"#\">Choose paper wallet model (soon)</a>";
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
			li_4.className = "disabled";
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
			appendNode(text_6, div);
			appendNode(nav, div);
			appendNode(div_1, nav);
			appendNode(text_7, nav);
			appendNode(ul, nav);
			appendNode(li, ul);
			appendNode(a, li);
			appendNode(li_1, ul);
			appendNode(a_1, li_1);
			appendNode(li_2, ul);
			appendNode(a_2, li_2);
			appendNode(li_3, ul);
			appendNode(a_3, li_3);
			appendNode(li_4, ul);
			component.refs.page = div;
		},

		p: function update(changed, state) {
			if (state.wallets.length === 1) {
				if (!if_block) {
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

			if ((changed.isShareMenuOpen) && nav_class_value !== (nav_class_value = "share-menu " + ((state.isShareMenuOpen) ? 'active' : ''))) {
				nav.className = nav_class_value;
			}
		},

		u: function unmount() {
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
			if (component.refs.page === div) component.refs.page = null;
		}
	};
}

// (3:4) {{#if wallets.length === 1}}
function create_if_block(component, state) {
	var div, text;

	var icon_initial_data = { name: "check" };
	var icon = new Icon({
		root: component.root,
		data: icon_initial_data
	});

	return {
		c: function create() {
			div = createElement("div");
			icon._fragment.c();
			text = createText(" Wallet generated!");
			this.h();
		},

		h: function hydrate() {
			div.className = "checkmark";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
			icon._mount(div, null);
			insertNode(text, target, anchor);
		},

		u: function unmount() {
			detachNode(div);
			detachNode(text);
		},

		d: function destroy() {
			icon.destroy(false);
		}
	};
}

// (6:4) {{#if wallets.length > 1}}
function create_if_block_1(component, state) {
	var div, text, text_1_value = state.wallets.length, text_1, text_2;

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
			text_2 = createText(" Wallets generated!");
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
		},

		p: function update(changed, state) {
			if ((changed.wallets) && text_1_value !== (text_1_value = state.wallets.length)) {
				text_1.data = text_1_value;
			}
		},

		u: function unmount() {
			detachNode(div);
			detachNode(text);
			detachNode(text_1);
			detachNode(text_2);
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

// (28:8) {{#if !isPrivateKeyVisible}}
function create_if_block_4(component, state) {
	var div;

	return {
		c: function create() {
			div = createElement("div");
			div.textContent = "Make sure nobody is watching.";
			this.h();
		},

		h: function hydrate() {
			div.className = "section-value grey";
		},

		m: function mount(target, anchor) {
			insertNode(div, target, anchor);
		},

		u: function unmount() {
			detachNode(div);
		},

		d: noop
	};
}

// (31:8) {{#if isPrivateKeyVisible}}
function create_if_block_5(component, state) {
	var img, text, div, text_1;

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
			img.alt = "Private Key QR Code";
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
	var img, text, div, div_1, text_2, div_2, div_3, text_4, div_4, text_5, text_7, div_5, div_6, text_8, button, text_9_value = (state.isPrivateKeyVisible) ? 'Hide' : 'Show', text_9, text_11, text_12;

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
			img = createElement("img");
			text = createText("\n    ");
			div = createElement("div");
			div_1 = createElement("div");
			icon._fragment.c();
			text_2 = createText("\n      ");
			div_2 = createElement("div");
			div_3 = createElement("div");
			div_3.textContent = "Address";
			text_4 = createText("\n        ");
			div_4 = createElement("div");
			text_5 = createText(state.publicAddress);
			text_7 = createText("\n      ");
			div_5 = createElement("div");
			div_6 = createElement("div");
			text_8 = createText("Private Key\n          ");
			button = createElement("button");
			text_9 = createText(text_9_value);
			text_11 = createText("\n        ");
			if (if_block) if_block.c();
			text_12 = createText("\n        ");
			if (if_block_1) if_block_1.c();
			this.h();
		},

		h: function hydrate() {
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
			insertNode(img, target, anchor);
			insertNode(text, target, anchor);
			insertNode(div, target, anchor);
			appendNode(div_1, div);
			icon._mount(div_1, null);
			appendNode(text_2, div);
			appendNode(div_2, div);
			appendNode(div_3, div_2);
			appendNode(text_4, div_2);
			appendNode(div_4, div_2);
			appendNode(text_5, div_4);
			appendNode(text_7, div);
			appendNode(div_5, div);
			appendNode(div_6, div_5);
			appendNode(text_8, div_6);
			appendNode(button, div_6);
			appendNode(text_9, button);
			appendNode(text_11, div_5);
			if (if_block) if_block.m(div_5, null);
			appendNode(text_12, div_5);
			if (if_block_1) if_block_1.m(div_5, null);
		},

		p: function update(changed, state) {
			if (changed.publicQRCode) {
				img.src = state.publicQRCode;
			}

			if (changed.publicAddress) {
				text_5.data = state.publicAddress;
			}

			if ((changed.isPrivateKeyVisible) && text_9_value !== (text_9_value = (state.isPrivateKeyVisible) ? 'Hide' : 'Show')) {
				text_9.data = text_9_value;
			}

			if (!state.isPrivateKeyVisible) {
				if (!if_block) {
					if_block = create_if_block_4(component, state);
					if_block.c();
					if_block.m(div_5, text_12);
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
			detachNode(img);
			detachNode(text);
			detachNode(div);
			if (if_block) if_block.u();
			if (if_block_1) if_block_1.u();
		},

		d: function destroy() {
			icon.destroy(false);
			removeListener(div_1, "click", click_handler);
			removeListener(button, "click", click_handler_1);
			if (if_block) if_block.d();
			if (if_block_1) if_block_1.d();
		}
	};
}

function Icon_component_svelte(options) {
	init(this, options);
	this.refs = {};
	this._state = assign(data(), options.data);

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

assign(Icon_component_svelte.prototype, {
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
assign(Icon_component_svelte.prototype, methods);

Icon_component_svelte.prototype._recompute = noop;

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

module.exports = Icon_component_svelte;});

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

'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */
;require('initialize');
//# sourceMappingURL=app.js.map
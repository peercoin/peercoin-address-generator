var BigInteger = require("./BigInteger");
var Base58 = require("./Base58");
//module Peercoin {
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var Crypto = (function () {
    function Crypto() {
    }
    // Bit-wise rotate left
    Crypto.rotl = function (n, b) {
        return (n << b) | (n >>> (32 - b));
    };
    // Bit-wise rotate right
    Crypto.rotr = function (n, b) {
        return (n << (32 - b)) | (n >>> b);
    };
    // Swap big-endian to little-endian and vice versa
    Crypto.endian = function (n) {
        // If number given, swap endian
        if (n.constructor == Number) {
            return Crypto.rotl(n, 8) & 0x00FF00FF |
                Crypto.rotl(n, 24) & 0xFF00FF00;
        }
        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++)
            n[i] = Crypto.endian(n[i]);
        return n;
    };
    // Generate an array of any length of random bytes
    Crypto.randomBytes = function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
        return words;
    };
    // Convert a byte array to big-endian 32-bit words
    Crypto.bytesToWords = function (bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
            words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
        return words;
    };
    // Convert big-endian 32-bit words to a byte array
    Crypto.wordsToBytes = function (words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
            bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        return bytes;
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
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    };
    // Convert a byte array to a base-64 string
    Crypto.bytesToBase64 = function (bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
            var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 <= bytes.length * 8)
                    base64.push(Crypto.base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                else
                    base64.push("=");
            }
        }
        return base64.join("");
    };
    // Convert a base-64 string to a byte array
    Crypto.base64ToBytes = function (base64) {
        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
        for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
            if (imod4 == 0)
                continue;
            bytes.push(((Crypto.base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
                (Crypto.base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
        }
        return bytes;
    };
    // Convert a byte array to little-endian 32-bit words
    Crypto.bytesToLWords = function (bytes) {
        var output = Array(bytes.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < bytes.length * 8; i += 8)
            output[i >> 5] |= (bytes[i / 8] & 0xFF) << (i % 32);
        return output;
    };
    // Convert little-endian 32-bit words to a byte array
    Crypto.lWordsToBytes = function (words) {
        var output = [];
        for (var i = 0; i < words.length * 32; i += 8)
            output.push((words[i >> 5] >>> (i % 32)) & 0xff);
        return output;
    };
    Crypto.integerToBytes = function (e, t) {
        var n = e.toByteArrayUnsigned();
        if (t < n.length)
            n = n.slice(n.length - t);
        else
            while (t > n.length)
                n.unshift(0);
        return n;
    };
    Crypto.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    Crypto.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    Crypto.rmd160_f = function (j, x, y, z) {
        if (j >= 80)
            throw ("rmd160_f: j out of range");
        return (0 <= j && j <= 15) ? (x ^ y ^ z) :
            (16 <= j && j <= 31) ? (x & y) | (~x & z) :
                (32 <= j && j <= 47) ? (x | ~y) ^ z :
                    (48 <= j && j <= 63) ? (x & z) | (y & ~z) :
                        x ^ (y | ~z);
    };
    Crypto.rmd160_K1 = function (j) {
        if (j >= 80)
            throw ("rmd160_K1: j out of range");
        return (0 <= j && j <= 15) ? 0x00000000 :
            (16 <= j && j <= 31) ? 0x5a827999 :
                (32 <= j && j <= 47) ? 0x6ed9eba1 :
                    (48 <= j && j <= 63) ? 0x8f1bbcdc
                        : 0xa953fd4e;
    };
    Crypto.rmd160_K2 = function (j) {
        if (j >= 80)
            throw ("rmd160_K2: j out of range");
        return (0 <= j && j <= 15) ? 0x50a28be6 :
            (16 <= j && j <= 31) ? 0x5c4dd124 :
                (32 <= j && j <= 47) ? 0x6d703ef3 :
                    (48 <= j && j <= 63) ? 0x7a6d76e9 :
                        0x00000000;
    };
    Crypto._rmd160 = function (message) {
        // Convert to byte array
        if (message.constructor == String)
            message = Crypto.UTF8.stringToBytes(message);
        var x = Crypto.bytesToLWords(message), len = message.length * 8;
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
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
            var A1 = h0, B1 = h1, C1 = h2, D1 = h3, E1 = h4;
            var A2 = h0, B2 = h1, C2 = h2, D2 = h3, E2 = h4;
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
        if (message.constructor == String)
            message = Crypto.UTF8.stringToBytes(message);
        /* else, assume byte array already */
        var m = Crypto.bytesToWords(message), l = message.length * 8, H = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
            0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19], w = [], a, b, c, d, e, f, g, h, t1, t2;
        // Padding
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
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
                if (j < 16)
                    w[j] = m[j + i];
                else {
                    var gamma0x = w[j - 15], gamma1x = w[j - 2], gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                        ((gamma0x << 14) | (gamma0x >>> 18)) ^
                        (gamma0x >>> 3), gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                        ((gamma1x << 13) | (gamma1x >>> 19)) ^
                        (gamma1x >>> 10);
                    w[j] = gamma0 + (w[j - 7] >>> 0) +
                        gamma1 + (w[j - 16] >>> 0);
                }
                var ch = e & f ^ ~e & g, maj = a & b ^ a & c ^ b & c, sigma0 = ((a << 30) | (a >>> 2)) ^
                    ((a << 19) | (a >>> 13)) ^
                    ((a << 10) | (a >>> 22)), sigma1 = ((e << 26) | (e >>> 6)) ^
                    ((e << 21) | (e >>> 11)) ^
                    ((e << 7) | (e >>> 25));
                t1 = (h >>> 0) + sigma1 + ch + (Crypto.K[j]) + (w[j] >>> 0);
                t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = (d + t1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) >>> 0;
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
        var ret, digestbytes = Crypto.lWordsToBytes(Crypto._rmd160(message));
        if (options && options.asBytes) {
            ret = digestbytes;
        }
        else if (options && options.asString) {
            ret = Crypto.charenc.Binary.bytesToString(digestbytes);
        }
        else {
            ret = Crypto.bytesToHex(digestbytes);
        }
        return ret;
    };
    // Public API
    /**
     * SHA256 e.g.: HashUtil.SHA256(hash, {asBytes : true})
     */
    Crypto.SHA256 = function (message, options) {
        var ret, digestbytes = Crypto.wordsToBytes(Crypto._sha256(message));
        if (options && options.asBytes) {
            ret = digestbytes;
        }
        else if (options && options.asString) {
            ret = Crypto.charenc.Binary.bytesToString(digestbytes);
        }
        else {
            ret = Crypto.bytesToHex(digestbytes);
        }
        return ret;
    };
    Crypto.base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    Crypto.charenc = {
        Binary: {
            // Convert a string to a byte array
            stringToBytes: function (str) {
                for (var bytes = [], i = 0; i < str.length; i++)
                    bytes.push(str.charCodeAt(i) & 0xFF);
                return bytes;
            },
            // Convert a byte array to a string
            bytesToString: function (bytes) {
                for (var str = [], i = 0; i < bytes.length; i++)
                    str.push(String.fromCharCode(bytes[i]));
                return str.join("");
            }
        },
        UTF8: {
            // Convert a string to a byte array
            stringToBytes: function (str) {
                return Crypto.charenc.Binary.stringToBytes(decodeURIComponent(encodeURIComponent(str)));
            },
            // Convert a byte array to a string
            bytesToString: function (bytes) {
                return decodeURIComponent(encodeURIComponent(Crypto.charenc.Binary.bytesToString(bytes)));
            }
        }
    };
    Crypto.UTF8 = Crypto.charenc.UTF8;
    Crypto.rmd160_r1 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
        3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
        1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
        4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
    ];
    Crypto.rmd160_r2 = [
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
        6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
        15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
        8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
        12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
    ];
    Crypto.rmd160_s1 = [
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
        7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
        11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
        11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
        9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
    ];
    Crypto.rmd160_s2 = [
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
        9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
        9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
        15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
        8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
    ];
    // Constants
    Crypto.K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
        0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
        0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
        0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
        0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
    return Crypto;
})();
exports.Crypto = Crypto; //crypto
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var Address = (function () {
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
        if (checksum[0] != bytes[21] ||
            checksum[1] != bytes[22] ||
            checksum[2] != bytes[23] ||
            checksum[3] != bytes[24]) {
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
})();
exports.Address = Address;
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var Mint = (function () {
    function Mint() {
    }
    Mint.DiffToTarget = function (diff) {
        //floor it
        diff = (diff | 0);
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
        var exponent = (compact >> 24);
        if (exponent <= 3) {
            mantissa += (1 << (8 * (3 - exponent)));
        }
        else {
            mantissa++;
        }
        if (mantissa >= 0x00800000) {
            mantissa >>= 8;
            exponent++;
        }
        return (exponent << 24) | mantissa | neg;
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
        }
        else {
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
        var compact = ((exponent << 24) | mantissa);
        if (n.compareTo(BigInteger.ZERO) < 0) {
            compact |= 0x00800000;
        }
        return compact;
    };
    Mint.CompactToDiff = function (bits) {
        var nShift = (bits >> 24) & 0xff;
        var diff = 1.0 * (0x0000ffff) / (bits & 0x00ffffff);
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
        var mantissa = compact & 0x007fffff, isNegative = (compact & 0x00800000) != 0, exponent = (compact >> 24) >>> 0;
        // Since the base for the exponent is 256, the exponent can be treated
        // as the number of bytes to represent the full 256-bit number.  So,
        // treat the exponent as the number of bytes and shift the mantissa
        // right or left accordingly.  This is equivalent to:
        // N = mantissa * 256^(exponent-3)
        var bn;
        if (exponent <= 3) {
            mantissa >>= 8 * (3 - exponent);
            bn = new BigInteger('' + mantissa, 10);
        }
        else {
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
})();
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////	
var StakeKernelTemplate = (function () {
    function StakeKernelTemplate(tpl, manager) {
        this.BlockFromTime = tpl.BlockFromTime; // int64
        this.StakeModifier = tpl.StakeModifier; //uint64  => BigInteger!!!
        this.PrevTxOffset = tpl.PrevTxOffset; //uint32
        this.PrevTxTime = tpl.PrevTxTime; //int64
        this.PrevTxOutIndex = tpl.PrevTxOutIndex; //uint32
        this.PrevTxOutValue = tpl.PrevTxOutValue; //int64
        this.UnspentOutputs = manager;
        this.IsProtocolV03 = ('IsProtocolV03' in tpl) ? tpl.IsProtocolV03 : true; //bool
        this.StakeMinAge = ('StakeMinAge' in tpl) ? tpl.StakeMinAge : Mint.minStakeMinAge; //int64
        this.Bits = ('Bits' in tpl) ? tpl.Bits : this.setBitsWithDifficulty(parseFloat("10.33")); //uint32
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
        var timeReduction = (this.IsProtocolV03) ? timeReduction = this.StakeMinAge : 0;
        var nTimeWeight = this.UnspentOutputs.TxTime - this.PrevTxTime; // int64
        if (nTimeWeight > Mint.stakeMaxAge) {
            nTimeWeight = Mint.stakeMaxAge;
        }
        nTimeWeight -= timeReduction;
        var bnCoinDayWeight; // *big.Int
        var valueTime = this.PrevTxOutValue * nTimeWeight;
        if (valueTime > 0) {
            bnCoinDayWeight = new BigInteger('' + (Math.floor(valueTime / Mint.coinDay)), 10);
        }
        else {
            // overflow, calc w/ big.Int or return error?
            // err = errors.New("valueTime overflow")
            // return
            var t1 = new BigInteger('' + (24 * 60 * 60), 10);
            var t2 = new BigInteger('' + (Mint.coin), 10);
            var t3 = new BigInteger('' + (this.PrevTxOutValue), 10);
            var t4 = new BigInteger('' + (nTimeWeight), 10);
            bnCoinDayWeight = ((t3.multiply(t4)).divide(t2)).divide(t1);
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
        }
        else {
            var d2 = this.Bits;
            for (var i = 0; i < 4; i++) {
                buf[_o_] = (d2 & 0xff);
                d2 >>= 8;
                _o_++;
            }
        }
        var data = [this.BlockFromTime, this.PrevTxOffset, this.PrevTxTime, this.PrevTxOutIndex, this.UnspentOutputs.TxTime];
        for (var k = 0, arrayLength = data.length; k < arrayLength; k++) {
            var dn = data[k];
            for (var i = 0; i < 4; i++) {
                buf[_o_] = (dn & 0xff);
                dn >>= 8;
                _o_++;
            }
        }
        var hashProofOfStake = (Crypto.SHA256(Crypto.SHA256(buf, { asBytes: true }), { asBytes: true })).reverse();
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
})();
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
var UnspentOutputsToStake = (function () {
    function UnspentOutputsToStake() {
        this.arrStakeKernelTemplates = []; //
        this.Bits = Mint.BigToCompact(Mint.DiffToTarget(parseFloat("15"))); //uint32
        this.TxTime = (Date.now() / 1000 | 0); //int64
        this.StartTime = this.TxTime;
        this.MaxTime = this.TxTime + 3600;
        this.Stop = false;
        this.Results = [];
        this.orgtpl = [];
    }
    UnspentOutputsToStake.prototype.add = function (tpldata) {
        var addrfound = this.orgtpl.some(function (el) {
            if ((el.PrevTxOffset == tpldata.PrevTxOffset && el.PrevTxOutIndex == tpldata.PrevTxOutIndex &&
                el.PrevTxOutValue == tpldata.PrevTxOutValue &&
                el.StakeModifier.toString() == tpldata.StakeModifier.toString())) {
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
        this.arrStakeKernelTemplates.forEach(function (element) { element.Bits = _this.Bits; });
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
            if ((element.UnspentOutputs.TxTime < element.PrevTxTime) ||
                (element.BlockFromTime + element.StakeMinAge > element.UnspentOutputs.TxTime)) {
            }
            else {
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
                        "mindifficulty": ((diff * 10) / 10)
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
            ob.progresscallback(((this.TxTime - this.StartTime) / (1.0 * (this.MaxTime - this.StartTime))), ((this.MaxTime - this.TxTime) / 60.0).toFixed(1) + ' min remaining');
            loopfunc = setTimeout;
        }
        if (!this.Stop && this.TxTime < this.MaxTime)
            loopfunc(function () { return _this.recursiveFind(ob); }, 40);
        else
            ob.progresscallback(100, 'done');
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
            setZeroTimeout(function () { return _this.recursiveFind(ob); });
        }
    };
    return UnspentOutputsToStake;
})();
exports.UnspentOutputsToStake = UnspentOutputsToStake;
function valueToBigInt(valueBuffer) {
    if (valueBuffer instanceof BigInteger)
        return valueBuffer;
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
    while (decimalPart.length < 8)
        decimalPart = "0" + decimalPart;
    decimalPart = decimalPart.replace(/0*$/, '');
    while (decimalPart.length < 2)
        decimalPart += "0";
    return integerPart + "." + decimalPart;
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
    while (fractionalPart.length < 8)
        fractionalPart += "0";
    fractionalPart = fractionalPart.replace(/^0+/g, '');
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

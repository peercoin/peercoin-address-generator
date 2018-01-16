import BigInteger=require("./BigInteger");
import Base58=require("./Base58");

//module Peercoin {

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
	export class Crypto {
			
		static base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	
		// Bit-wise rotate left
		static rotl(n, b) {
			return (n << b) | (n >>> (32 - b));
		}
		// Bit-wise rotate right
		static rotr(n, b) {
			return (n << (32 - b)) | (n >>> b);
		}
		// Swap big-endian to little-endian and vice versa
		static endian  (n) {
			// If number given, swap endian
			if (n.constructor == Number) {
				return Crypto.rotl(n, 8) & 0x00FF00FF |
				Crypto.rotl(n, 24) & 0xFF00FF00;
			}
		
			// Else, assume array and swap all items
			for (var i = 0; i < n.length; i++)
				n[i] = Crypto.endian(n[i]);
				
			return n;
		}
		// Generate an array of any length of random bytes
		static randomBytes (bytes:number[]) : number[] {
			for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
				words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
			return words;
		}
		// Convert a byte array to big-endian 32-bit words
		static bytesToWords(bytes:number[]) : number[] {
			for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
				words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
			return words;
		}
		 // Convert big-endian 32-bit words to a byte array
		static wordsToBytes (words:number[]) : number[] {
			for (var bytes = [], b = 0; b < words.length * 32; b += 8)
				bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
			return bytes;
		}
		// Convert a byte array to a hex string
		static bytesToHex (bytes:number[]) : string {
			for (var hex = [], i = 0; i < bytes.length; i++) {
				hex.push((bytes[i] >>> 4).toString(16));
				hex.push((bytes[i] & 0xF).toString(16));
			}
			return hex.join("");
		}
	
		// Convert a hex string to a byte array
		static hexToBytes (hex:string) :number[] {
			for (var bytes = [], c = 0; c < hex.length; c += 2)
				bytes.push(parseInt(hex.substr(c, 2), 16));
			return bytes;
		}
	
		// Convert a byte array to a base-64 string
		static bytesToBase64 (bytes:number[]) :string{
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
		}
			// Convert a base-64 string to a byte array
		static base64ToBytes  (base64:string) :number[] {
			// Remove non-base-64 characters
			base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
	
			for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
				if (imod4 == 0)
					continue;
				bytes.push(((Crypto.base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
					(Crypto.base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
			}
	
			return bytes;
		}	
		
		// Convert a byte array to little-endian 32-bit words
		static bytesToLWords (bytes:number[]) :number[] {
	
			var output = Array(bytes.length >> 2);
			for (var i = 0; i < output.length; i++)
				output[i] = 0;
			for (var i = 0; i < bytes.length * 8; i += 8)
				output[i >> 5] |= (bytes[i / 8] & 0xFF) << (i % 32);
			return output;
		}
	
		// Convert little-endian 32-bit words to a byte array
		static lWordsToBytes  (words:number[]) :number[] {
			var output = [];
			for (var i = 0; i < words.length * 32; i += 8)
				output.push((words[i >> 5] >>> (i % 32)) & 0xff);
			return output;
		}

	    static integerToBytes(e: BigInteger, t:number):number[] {
		   var n = e.toByteArrayUnsigned();
		   if (t < n.length)
		      n = n.slice(n.length - t);
		   else
		      while (t > n.length)
		         n.unshift(0);
		   return n
		}
	
	
		
		static charenc = {
			Binary: {
							// Convert a string to a byte array
				stringToBytes : function (str:string):number[] {
					for (var bytes = [], i = 0; i < str.length; i++)
						bytes.push(str.charCodeAt(i) & 0xFF);
					return bytes;
				},
	
				// Convert a byte array to a string
				bytesToString : function (bytes:number[]) :string {
					for (var str = [], i = 0; i < bytes.length; i++)
						str.push(String.fromCharCode(bytes[i]));
					return str.join("");
				}
			},
			UTF8 : {
	
				// Convert a string to a byte array
				stringToBytes : function (str:string) {
					return Crypto.charenc.Binary.stringToBytes(decodeURIComponent(encodeURIComponent(str)));
				},
	
				// Convert a byte array to a string
				bytesToString : function (bytes) {
					return decodeURIComponent(encodeURIComponent(Crypto.charenc.Binary.bytesToString(bytes)));
				}
			}		
		}
		
		static UTF8 = Crypto.charenc.UTF8;
		
		private static safe_add(x:number, y:number) :number {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}
	
					/*
					 * Bitwise rotate a 32-bit number to the left.
					 */
		private static bit_rol(num:number, cnt:number) :number {
			return (num << cnt) | (num >>> (32 - cnt));
		}
		
		private static rmd160_f(j:number, x:number, y:number, z:number) :number {
			if (j>=80)	throw("rmd160_f: j out of range");
			
			return (0 <= j && j <= 15) ? (x^y^z) :
			(16 <= j && j <= 31) ? (x & y) | (~x & z) :
			(32 <= j && j <= 47) ? (x | ~y)^z :
			(48 <= j && j <= 63) ? (x & z) | (y & ~z) :
			 x^(y | ~z) ;		
		}
		private static  rmd160_K1(j:number):number {
			if (j>=80)	throw("rmd160_K1: j out of range");
			
			return (0 <= j && j <= 15) ? 0x00000000 :
			(16 <= j && j <= 31) ? 0x5a827999 :
			(32 <= j && j <= 47) ? 0x6ed9eba1 :
			(48 <= j && j <= 63) ? 0x8f1bbcdc 
			: 0xa953fd4e; 
		}
		private static  rmd160_K2(j:number) :number {		
			if (j>=80)	throw("rmd160_K2: j out of range");
			return (0 <= j && j <= 15) ? 0x50a28be6 :
			(16 <= j && j <= 31) ? 0x5c4dd124 :
			(32 <= j && j <= 47) ? 0x6d703ef3 :
			(48 <= j && j <= 63) ? 0x7a6d76e9 :
			 0x00000000 ;
		}
		private static  rmd160_r1 = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
			7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
			3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
			1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
			4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
		]
		private static  rmd160_r2 = [
			5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
			6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
			15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
			8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
			12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
		]
		private static  rmd160_s1 = [
			11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
			7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
			11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
			11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
			9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
		]
		private static  rmd160_s2 = [
			8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
			9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
			9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
			15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
			8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
		]
			
		private static _rmd160 (message) :number[]{
			// Convert to byte array
			if (message.constructor == String)
				message = Crypto.UTF8.stringToBytes(message);
		
			var x = Crypto.bytesToLWords(message),
			len = message.length * 8;
		
			/* append padding */
			x[len >> 5] |= 0x80 << (len % 32);
			x[(((len + 64) >>> 9) << 4) + 14] = len;
		
			var h0 = 0x67452301;
			var h1 = 0xefcdab89;
			var h2 = 0x98badcfe;
			var h3 = 0x10325476;
			var h4 = 0xc3d2e1f0;
			
			var safe_add=Crypto.safe_add;
			var bit_rol=Crypto.bit_rol;
			var rmd160_f=Crypto.rmd160_f;		
			var rmd160_K1=Crypto.rmd160_K1;
			var rmd160_K2=Crypto.rmd160_K2;
			
			for (var i = 0, xlh=x.length; i < xlh; i += 16) {
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
		}
	
							// Constants
		private static K:number[] = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
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
			0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2]
	
		private static _sha256  (message) :number[] {
	
			// Convert to byte array
			if (message.constructor == String)
				message = Crypto.UTF8.stringToBytes(message);
			/* else, assume byte array already */
	
			var m = Crypto.bytesToWords(message),
			l = message.length * 8,
			H = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
				0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19],
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
			m[l >> 5] |= 0x80 << (24 - l % 32);
			m[((l + 64 >> 9) << 4) + 15] = l;
	
			for (var i = 0, ml=m.length; i < ml; i += 16) {
	
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
	
						var gamma0x = w[j - 15],
						gamma1x = w[j - 2],
						gamma0 = ((gamma0x << 25) | (gamma0x >>> 7))^
						((gamma0x << 14) | (gamma0x >>> 18))^
						(gamma0x >>> 3),
						gamma1 = ((gamma1x << 15) | (gamma1x >>> 17))^
						((gamma1x << 13) | (gamma1x >>> 19))^
						(gamma1x >>> 10);
	
						w[j] = gamma0 + (w[j - 7] >>> 0) +
							gamma1 + (w[j - 16] >>> 0);
	
					}
	
					var ch = e & f^~e & g,
					maj = a & b^a & c^b & c,
					sigma0 = ((a << 30) | (a >>> 2))^
					((a << 19) | (a >>> 13))^
					((a << 10) | (a >>> 22)),
					sigma1 = ((e << 26) | (e >>> 6))^
					((e << 21) | (e >>> 11))^
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
		}
		
			/**
		 * RIPEMD160 e.g.: HashUtil.RIPEMD160(hash, {asBytes : true})
		 */
		static RIPEMD160(message, options) {
			var ret, digestbytes = Crypto.lWordsToBytes(Crypto._rmd160(message));
			
			if (options && options.asBytes){
				ret=digestbytes;
			}else if (options && options.asString){
				ret=Crypto.charenc.Binary.bytesToString(digestbytes);
			} else {
				ret=Crypto.bytesToHex(digestbytes);
			}
			
			return ret;
		}
	
		// Public API
		/**
		 * SHA256 e.g.: HashUtil.SHA256(hash, {asBytes : true})
		 */
		static SHA256 (message, options) {
			var ret, digestbytes:number[] = Crypto.wordsToBytes(Crypto._sha256(message));
			
			if (options && options.asBytes){
				ret = digestbytes;
			}else if (options && options.asString){
				ret = Crypto.charenc.Binary.bytesToString(digestbytes);
			}else{
				ret=Crypto.bytesToHex(digestbytes);
			}
			return ret;
		}
					
						// Package private blocksize???
				//	SHA256._blocksize = 16;
	
				//	SHA256._digestsize = 32;			
					
					
	}//crypto


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
	export class Address {
		
		static networkVersion = 0x37; // Peercoin mainnet
		
		hash:number[];
		version;
		constructor(bytes) {
			if ("string" == typeof bytes) {
				bytes = this.decodeString(bytes);
			}
			this.hash = bytes;
			this.version = Address.networkVersion;  	
		}
		
		decodeString (str:string) {
			var bytes = Base58.decode(str);
			var hash = bytes.slice(0, 21);
			var checksum = Crypto.SHA256(Crypto.SHA256(hash, {asBytes : true}), {asBytes : true});
	
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
		}
		
		getHashBase64 () {
			return Crypto.bytesToBase64(this.hash);
		}
		
		toString  () :string {
			// Get a copy of the hash
			var hash = this.hash.slice(0);
	
			// Version
			hash.unshift(this.version);
			var checksum = Crypto.SHA256(Crypto.SHA256(hash, {
						asBytes : true
					}), {
					asBytes : true
				});
			var bytes = hash.concat(checksum.slice(0, 4));
			return Base58.encode(bytes);
		}
	}
 
interface I_Calc {
  convert(x:BigInteger): BigInteger;
  revert(x:any):any;   
  mulTo(x:BigInteger, y:BigInteger, r:BigInteger);
  sqrTo(x:BigInteger, r:BigInteger);
}     
     
class Classic implements I_Calc{
    private m:BigInteger;
    constructor(m) {
        this.m = m;
    }
	convert(x:BigInteger) :BigInteger {
        if (x.s < 0 || x.compareTo(this.m) >= 0)
            return x.mod(this.m);
        else
            return x;
    }
    revert(x) {
        return x;
    }
    reduce(x:BigInteger) {
        x.divRemTo(this.m, null, x);
    }
    mulTo (x:BigInteger, y:BigInteger, r:BigInteger) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }
    sqrTo (x:BigInteger, r:BigInteger) {
        x.squareTo(r);
        this.reduce(r);
    }
}

class Barrett  implements I_Calc{
    private m:BigInteger;
    private r2:BigInteger;
    private q3:BigInteger;
    private mu:BigInteger;
    
    constructor(m:BigInteger) {
        // setup Barrett
        this.r2 = BigInteger.nbi();
        this.q3 = BigInteger.nbi();
        BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
        this.mu = this.r2.divide(m);
        this.m = m;
    }

	convert(x:BigInteger):BigInteger {
        if (x.s < 0 || x.t > 2 * this.m.t)
            return x.mod(this.m);
        else if (x.compareTo(this.m) < 0)
            return x;
        else {
            var r = BigInteger.nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
        }
    }
    revert (x) {
        return x;
    }
    // x = x mod m (HAC 14.42)
    reduce (x:BigInteger) {
        x.drShiftTo(this.m.t - 1, this.r2);
        if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (x.compareTo(this.r2) < 0)
            x.dAddOffset(1, this.m.t + 1);
        x.subTo(this.r2, x);
        while (x.compareTo(this.m) >= 0)
            x.subTo(this.m, x);
    }
    // r = x*y mod m; x,y != r
    mulTo (x:BigInteger, y:BigInteger, r:BigInteger) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }
    // r = x^2 mod m; x != r
    sqrTo (x:BigInteger, r) {
        x.squareTo(r);
        this.reduce(r);
    }
}

class Montgomery  implements I_Calc {
    private m:BigInteger;
    private mp:number;
    private mpl:number;
    private mph:number;
    private mt2:number; 
    private um:number;
    constructor(m:BigInteger) {
            this.m = m;
            this.mp = m.invDigit();
            this.mpl = this.mp & 0x7fff;
            this.mph = this.mp >> 15;
            this.um = (1 << (BigInteger.DB - 15)) - 1;
            this.mt2 = 2 * m.t;
    }
 
		// xR mod m
    convert (x:BigInteger) : BigInteger {
        var r = BigInteger.nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
            this.m.subTo(r, r);
        return r;
    }
	// x/R mod m
	 revert  (x:BigInteger) : BigInteger {
        var r = BigInteger.nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    }
        // x = x/R mod m (HAC 14.32)
   reduce (x:BigInteger) {
        while (x.t <= this.mt2) // pad x so am has enough room later
            x[x.t++] = 0;
        for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & BigInteger.DM;
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
        if (x.compareTo(this.m) >= 0)
            x.subTo(this.m, x);
    }
        // r = "xy/R mod m"; x,y != r
    mulTo (x:BigInteger, y:BigInteger, r:BigInteger) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }
        // r = "x^2/R mod m"; x != r
    sqrTo (x:BigInteger, r:BigInteger) {
        x.squareTo(r);
        this.reduce(r);
    }
}
class NullExp  implements I_Calc {
    constructor(){
        
    }
	convert (x:BigInteger) : BigInteger {
		return x;
	}
	revert (x) {
		return x;
	}
	 mulTo (x:BigInteger, y:BigInteger, r:BigInteger) {
		x.multiplyTo(y, r);
	}
	sqrTo (x:BigInteger, r:BigInteger) {
		x.squareTo(r);
	}
}
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
class BigInteger {
    static _isinitialised = false;

    s: number;
    t: number;

    static dbits: number;
    static canary: number = 0xdeadbeefcafe;
    static j_lm = ((BigInteger.canary & 0xffffff) == 0xefcafe);
    
    static DB;
    static DM;
    static DV;
    static BI_FP;
    static FV;
    static F1;
    static F2;
    static BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    static BI_RC: number[]=[];
    
    static lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
    static lplim = (1 << 26) / BigInteger.lowprimes[BigInteger.lowprimes.length - 1];

    constructor(a, b?, c?) {

        if (!BigInteger._isinitialised) BigInteger.initVars();

        if (a != null)
            if ("number" == typeof a)
                this.fromNumber(a, b, c);
            else if (b == null && "string" != typeof a)
                this.fromString(a, 256);
            else
                this.fromString(a, b);
    }

    static nbv (i: number): BigInteger {
        var r = new BigInteger(null, null, null);
        r.fromInt(i);
        return r;
    }

    static nbi (): BigInteger {
        return new BigInteger(null, null, null);
    }
    static valueOf = BigInteger.nbv;
        
    private static initVars() {
        BigInteger._isinitialised = true;

        if (BigInteger.j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
            BigInteger.prototype.am = BigInteger.prototype.am2;
            BigInteger.dbits = 30;
        } else if (BigInteger.j_lm && (navigator.appName != "Netscape")) {
            BigInteger.prototype.am = BigInteger.prototype.am1;
            BigInteger.dbits = 26;
        } else { // Mozilla/Netscape seems to prefer am3
            BigInteger.prototype.am = BigInteger.prototype.am3;
            BigInteger.dbits = 28;
        }
        BigInteger.DB = BigInteger.dbits;
        BigInteger.DM = ((1 << BigInteger.dbits) - 1);
        BigInteger.DV = (1 << BigInteger.dbits);

        BigInteger.BI_FP = 52;
        BigInteger.FV = Math.pow(2, BigInteger.BI_FP);
        BigInteger.F1 = BigInteger.BI_FP - BigInteger.dbits;
        BigInteger.F2 = 2 * BigInteger.dbits - BigInteger.BI_FP;

        var rr = "0".charCodeAt(0);
        for (var vv = 0; vv <= 9; ++vv)
            BigInteger.BI_RC[rr++] = vv;

        rr = "a".charCodeAt(0);
        for (var vv = 10; vv < 36; ++vv)
            BigInteger.BI_RC[rr++] = vv;

        rr = "A".charCodeAt(0);
        for (var vv = 10; vv < 36; ++vv)
            BigInteger.BI_RC[rr++] = vv;

    }    

    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.

    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    private am1(i, x, w, j, c:number, n): number {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    }

    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    private am2(i, x, w, j, c: number, n): number {
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
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    private am3(i, x, w, j, c: number, n): number  {
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
    }
    
    am(i, x, w, j, c, n) {
        throw("class not initialised")
        return c;
    }

    private fromInt(x:number) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0)
            this[0] = x;
        else if (x < -1)
            this[0] = x + BigInteger.DV;
        else
            this.t = 0;
    }
    static ZERO = BigInteger.nbv(0);
    static ONE = BigInteger.nbv(1);
		/**
		 * Turns a byte array into a big integer.
		 *
		 * This function will interpret a byte array as a big integer in big
		 * endian notation and ignore leading zeros.
		 */
	static fromByteArrayUnsigned (ba:number[]) : BigInteger {
		if (!ba.length) {
			return BigInteger.nbv(0); 
		} else if (ba[0] & 0x80) {
			// Prepend a zero so the BigInteger class doesn't mistake this
			// for a negative integer.
			return new BigInteger([0].concat(ba),null,null);
		} else {
			return new BigInteger(ba,null,null);
		}
	}
    
    toByteArrayUnsigned (): number[] {
		var ba = this.abs().toByteArray();
		if (ba.length) {
			if (ba[0] == 0) {
				ba = ba.slice(1);
			}
			return ba.map(function (v) {
				return (v < 0) ? v + 256 : v;
			});
		} else {
			// Empty array, nothing to do
			return ba;
		}
	}

    private fromString (s, b:number) {
        var k;
        if (b == 16)
            k = 4;
        else if (b == 8)
            k = 3;
        else if (b == 256)
            k = 8; // byte array
        else if (b == 2)
            k = 1;
        else if (b == 32)
            k = 5;
        else if (b == 4)
            k = 2;
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length,
            mi = false,
            sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? s[i] & 0xff : this.intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-")
                    mi = true;
                continue;
            }
            mi = false;
            if (sh == 0)
                this[this.t++] = x;
            else if (sh + k > BigInteger.DB) {
                this[this.t - 1] |= (x & ((1 << (BigInteger.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (BigInteger.DB - sh));
            } else
                this[this.t - 1] |= x << sh;
            sh += k;
            if (sh >= BigInteger.DB)
                sh -= BigInteger.DB;
        }
        if (k == 8 && (s[0] & 0x80) != 0) {
            this.s = -1;
            if (sh > 0)
                this[this.t - 1] |= ((1 << (BigInteger.DB - sh)) - 1) << sh;
        }
        this.clamp();
        if (mi)
            BigInteger.ZERO.subTo(this, this);
    }
        
    private fromRadix (s, b) {
            this.fromInt(0);
            if (b == null)
                b = 10;
            var cs = this.chunkSize(b);
            var d = Math.pow(b, cs),
                mi = false,
                j = 0,
                w = 0;
            for (var i = 0; i < s.length; ++i) {
                var x = this.intAt(s, i);
                if (x < 0) {
                    if (s.charAt(i) == "-" && this.signum() == 0)
                        mi = true;
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
            if (mi)
                BigInteger.ZERO.subTo(this, this);
        }    
    
            // (protected) alternate constructor
    private fromNumber (a, b, c) {
        if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2)
                this.fromInt(1);
            else {
                this.fromNumber(a, c, null);
                if (!this.testBit(a - 1)) // force MSB set
                    this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), this.op_or, this);
                if (this.isEven())
                    this.dAddOffset(1, 0); // force odd
                while (!this.isProbablePrime(b)) {
                    this.dAddOffset(2, 0);
                    if (this.bitLength() > a)
                        this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                }
            }
        } else {
            // new BigInteger(int,RNG)
            var x = new Array(),
                t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0)
                x[0] &= ((1 << t) - 1);
            else
                x[0] = 0;
            this.fromString(x, 256);
        }
    }
    
    toRadix (b:number):string {
        if (b == null)
            b = 10;
        if (this.signum() == 0 || b < 2 || b > 36)
            return "0";
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
    }
    
    compareTo (a:BigInteger):number {
        var r = this.s - a.s;
        if (r != 0)
            return r;
        var i = this.t;
        r = i - a.t;
        if (r != 0)
            return (this.s < 0) ? -r : r;
        while (--i >= 0)
            if ((r = this[i] - a[i]) != 0)
                return r;
        return 0;
    }

	private op_xor(x, y) : number {
       return x ^ y;
    }
	
	private op_andnot(x, y): number {
            return x & ~y;
    }
    andNot (a):BigInteger {
        var r = BigInteger.nbi();
        this.bitwiseTo(a, this.op_andnot, r);
        return r;
    }
    private op_and(x, y) {
		return x & y;
	}
        
    and (a:BigInteger) :BigInteger {
		var r = BigInteger.nbi();
		this.bitwiseTo(a, this.op_and, r);
		return r;
	}    
 
        // (public) ~this
    not () : BigInteger {
        var r = BigInteger.nbi();
        for (var i = 0; i < this.t; ++i)
            r[i] = BigInteger.DM & ~this[i];
        r.t = this.t;
        r.s = ~this.s;
        return r;
    } 
        
    bitLength () : number {
        if (this.t <= 0)
            return 0;
        return BigInteger.DB * (this.t - 1) + this.nbits(this[this.t - 1] ^ (this.s & BigInteger.DM));
    }

    signum () : number {
        if (this.s < 0)
            return -1;
        else if (this.t <= 0 || (this.t == 1 && this[0] <= 0))
            return 0;
        else
            return 1;
    }

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
        invDigit  ():number {
            if (this.t < 1)
                return 0;
            var x = this[0];
            if ((x & 1) == 0)
                return 0;
            var y = x & 3; // y == 1/x mod 2^2
            y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
            y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
            y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
            // last step - calculate inverse mod DV directly;
            // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
            y = (y * (2 - x * y % BigInteger.DV)) % BigInteger.DV; // y == 1/x mod 2^dbits
            // we really want the negative inverse, and -DV < y < DV
            return (y > 0) ? BigInteger.DV - y : -y;
        }



    // return index of lowest 1-bit in x, x < 2^31
    lbit(x: number): number{
        if (x == 0)
            return -1;
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
        if ((x & 1) == 0)
            ++r;
        return r;
    }

    // return number of 1 bits in x
    cbit(x: number): number {
        var r = 0;
        while (x != 0) {
            x &= x - 1;
            ++r;
        }
        return r;
    }
    
        // (public) returns index of lowest 1-bit (or -1 if none)
    getLowestSetBit () {
        for (var i = 0; i < this.t; ++i)
            if (this[i] != 0)
                return i * BigInteger.DB + this.lbit(this[i]);
        if (this.s < 0)
            return this.t * BigInteger.DB;
        return -1;
    }

        // (public) return number of set bits
    bitCount () {
        var r = 0,
            x = this.s & BigInteger.DM;
        for (var i = 0; i < this.t; ++i)
            r += this.cbit(this[i] ^ x);
        return r;
    }

        // (public) true iff nth bit is set
    testBit(n: number)  {
       var j = Math.floor(n / BigInteger.DB);
        if (j >= this.t)
            return (this.s != 0);
       return ((this[j] & (1 << (n % BigInteger.DB))) != 0);
    }

    setBit (n) {
        return this.changeBit(n, this.op_or);
    }

   clearBit (n) {
        return this.changeBit(n, this.op_andnot);
   }

    flipBit (n) {
        return this.changeBit(n, this.op_xor);
    }
        // (public) this + a
   add (a) {
       var r = BigInteger.nbi();
        this.addTo(a, r);
        return r;
    }
     
   subtract (a) {
       var r = BigInteger.nbi();
        this.subTo(a, r);
        return r;
    }
     
    multiply (a) {
        var r = BigInteger.nbi();
        this.multiplyTo(a, r);
        return r;
    }
        // (public) this / a

    divide (a:BigInteger) :BigInteger {
        var r = BigInteger.nbi();
        this.divRemTo(a, r, null);
        return r;
    }
        // (public) this % a
    remainder (a) {
        var r = BigInteger.nbi();
        this.divRemTo(a, null, r);
        return r;
    }
        // (public) [this/a,this%a]

    divideAndRemainder (a) {
        var q = BigInteger.nbi(),
            r = BigInteger.nbi();
        this.divRemTo(a, q, r);
        return new Array(q, r);
    }

	negate () : BigInteger {
        var r = BigInteger.nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    }

    mod (a:BigInteger) :BigInteger {
        var r = BigInteger.nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
            a.subTo(r, r);
        return r;
    }

    squareTo (r:BigInteger) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0)
            r[i] = 0;
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= BigInteger.DV) {
                r[i + x.t] -= BigInteger.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0)
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        r.s = 0;
        r.clamp();
    }

    private op_or(x:number, y:number) :number{
        return x | y;
    }

    shiftLeft(n:number): BigInteger{
        var r = BigInteger.nbi();
        if (n < 0)
            this.rShiftTo(-n, r);
        else
            this.lShiftTo(n, r);

        return r;
    }

    abs () : BigInteger {
        return (this.s < 0) ? this.negate() : this;
    }

    isProbablePrime(t:number) {
        var lplen = BigInteger.lowprimes.length;
        var i,
            x = this.abs();
        if (x.t == 1 && x[0] <= BigInteger.lowprimes[lplen - 1]) {
            for (i = 0; i < lplen; ++i)
                if (x[0] == BigInteger.lowprimes[i])
                    return true;
            return false;
        }
        if (x.isEven())
            return false;

        i = 1;
        
        while (i < lplen) {
            var m = BigInteger.lowprimes[i],
                j = i + 1;
            while (j < lplen && m < BigInteger.lplim)
                m *= BigInteger.lowprimes[j++];
            m = x.modInt(m);
            while (i < j)
                if (m % BigInteger.lowprimes[i++] == 0)
                    return false;
        }
        return x.millerRabin(t);
    }

    // (public)
    clone () : BigInteger{
        var r = BigInteger.nbi();
        this.copyTo(r);
        return r;
    }

    // (public) return value as integer
    intValue () : number{
        if (this.s < 0) {
            if (this.t == 1)
                return this[0] - BigInteger.DV;
            else if (this.t == 0)
                return -1;
        } else if (this.t == 1)
            return this[0];
        else if (this.t == 0)
            return 0;
        // assumes 16 < DB < 32
        return ((this[1] & ((1 << (32 - BigInteger.DB)) - 1)) << BigInteger.DB) | this[0];
    }

    // (public) return value as byte
    byteValue ():number {
        return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
    }

    // (public) return value as short (assumes DB>=16)
    shortValue () :number {
        return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
    }

    // (public) convert to bigendian byte array
     toByteArray () : number[]{
        var i = this.t,
            r = new Array();
        r[0] = this.s;
        var p = BigInteger.DB - (i * BigInteger.DB) % 8,
            d,
            k = 0;
        if (i-- > 0) {
            if (p < BigInteger.DB && (d = this[i] >> p) != (this.s & BigInteger.DM) >> p)
                r[k++] = d | (this.s << (BigInteger.DB - p));
            while (i >= 0) {
                if (p < 8) {
                    d = (this[i] & ((1 << p) - 1)) << (8 - p);
                    d |= this[--i] >> (p += BigInteger.DB - 8);
                } else {
                    d = (this[i] >> (p -= 8)) & 0xff;
                    if (p <= 0) {
                        p += BigInteger.DB;
                        --i;
                    }
                }
                if ((d & 0x80) != 0)
                    d |= -256;
                if (k == 0 && (this.s & 0x80) != (d & 0x80))
                    ++k;
                if (k > 0 || d != this.s)
                    r[k++] = d;
            }
        }
        return r;
    }

    equals (a:BigInteger):boolean {
        return (this.compareTo(a) == 0);
    }
    min (a:BigInteger) : BigInteger {
        return (this.compareTo(a) < 0) ? this : a;
    }
    max (a:BigInteger) : BigInteger {
            return (this.compareTo(a) > 0) ? this : a;
    }

    lShiftTo (n:number, r: BigInteger) {
        var bs = n % BigInteger.DB;
        var cbs = BigInteger.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / BigInteger.DB),
            c = (this.s << bs) & BigInteger.DM,
            i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (i = ds - 1; i >= 0; --i)
            r[i] = 0;
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    }

    rShiftTo(n: number, r: BigInteger) {
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
        if (bs > 0)
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
    }

    clamp () {
        var c = this.s & BigInteger.DM;
        while (this.t > 0 && this[this.t - 1] == c)
            --this.t;
    }

    nbits(x:number) :number {
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
    }

    shiftRight (n) {
        var r = BigInteger.nbi();
        if (n < 0)
            this.lShiftTo(-n, r);
        else
            this.rShiftTo(n, r);
        return r;
    }

        // (public) 1/this % m (HAC 14.61)
    modInverse (m:BigInteger):BigInteger {
        var ac = m.isEven();
        if ((this.isEven() && ac) || m.signum() == 0)
            return BigInteger.ZERO;
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
                } else if (!b.isEven())
                    b.subTo(m, b);
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
                } else if (!d.isEven())
                    d.subTo(m, d);
                d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac)
                    a.subTo(c, a);
                b.subTo(d, b);
            } else {
                v.subTo(u, v);
                if (ac)
                    c.subTo(a, c);
                d.subTo(b, d);
            }
        }
        if (v.compareTo(BigInteger.ONE) != 0)
            return BigInteger.ZERO;
        if (d.compareTo(m) >= 0)
            return d.subtract(m);
        if (d.signum() < 0)
            d.addTo(m, d);
        else
            return d;
        if (d.signum() < 0)
            return d.add(m);
        else
            return d;
    }

        // (public) return string representation in given radix
   toString(b?) : string {
        if (this.s < 0)
            return "-" + this.negate().toString(b);
        var k;
        if (b == 16)
            k = 4;
        else if (b == 8)
            k = 3;
        else if (b == 2)
            k = 1;
        else if (b == 32)
            k = 5;
        else if (b == 4)
            k = 2;
        else
            return this.toRadix(b);
        var km = (1 << k) - 1,
            d,
            m = false,
            r = "",
            i = this.t;
        var p = BigInteger.DB - (i * BigInteger.DB) % k;
        if (i-- > 0) {
            if (p < BigInteger.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = this.int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += BigInteger.DB - k);
                } else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += BigInteger.DB;
                        --i;
                    }
                }
                if (d > 0)
                    m = true;
                if (m)
                    r += this.int2char(d);
            }
        }
        return m ? r : "0";
    }
       // (public) gcd(this,a) (HAC 14.54)
    gcd (a:BigInteger):BigInteger {
            var x = (this.s < 0) ? this.negate() : this.clone();
            var y = (a.s < 0) ? a.negate() : a.clone();
            if (x.compareTo(y) < 0) {
                var t = x;
                x = y;
                y = t;
            }
            var i = x.getLowestSetBit(),
                g = y.getLowestSetBit();
            if (g < 0)
                return x;
            if (i < g)
                g = i;
            if (g > 0) {
                x.rShiftTo(g, x);
                y.rShiftTo(g, y);
            }
            while (x.signum() > 0) {
                if ((i = x.getLowestSetBit()) > 0)
                    x.rShiftTo(i, x);
                if ((i = y.getLowestSetBit()) > 0)
                    y.rShiftTo(i, y);
                if (x.compareTo(y) >= 0) {
                    x.subTo(y, x);
                    x.rShiftTo(1, x);
                } else {
                    y.subTo(x, y);
                    y.rShiftTo(1, y);
                }
            }
            if (g > 0)
                y.lShiftTo(g, y);
            return y;
        }
 

    drShiftTo  (n:number, r:BigInteger) {
        for (var i = n; i < this.t; ++i)
            r[i - n] = this[i];
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    }
        
    multiplyLowerTo  (a:BigInteger, n:number, r:BigInteger) {
        var i = Math.min(this.t + a.t, n);
        r.s = 0; // assumes a,this >= 0
        r.t = i;
        while (i > 0)
            r[--i] = 0;
        var j;
        for (j = r.t - this.t; i < j; ++i)
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
        for (j = Math.min(a.t, n); i < j; ++i)
            this.am(0, a[i], r, i, 0, n - i);
        r.clamp();
    }    
        
    multiplyUpperTo (a:BigInteger, n:number, r:BigInteger) {
        --n;
        var i = r.t = this.t + a.t - n;
        r.s = 0; // assumes a,this >= 0
        while (--i >= 0)
            r[i] = 0;
        for (i = Math.max(n - this.t, 0); i < a.t; ++i)
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
        r.clamp();
        r.drShiftTo(1, r);
    }
        
    dlShiftTo (n:number, r:BigInteger) {
        var i;
        for (i = this.t - 1; i >= 0; --i)
            r[i + n] = this[i];
        for (i = n - 1; i >= 0; --i)
            r[i] = 0;
        r.t = this.t + n;
        r.s = this.s;
    }

	copyTo (r: BigInteger) {
            for (var i = this.t - 1; i >= 0; --i)
                r[i] = this[i];
            r.t = this.t;
            r.s = this.s;
    }

    private bitwiseTo (a:BigInteger, op:(x:any,y:any)=>number, r:BigInteger) {
        var i,
            f,
            m = Math.min(a.t, this.t);
        for (i = 0; i < m; ++i)
            r[i] = op(this[i], a[i]);
        if (a.t < this.t) {
            f = a.s & BigInteger.DM;
            for (i = m; i < this.t; ++i)
                r[i] = op(this[i], f);
            r.t = this.t;
        } else {
            f = this.s & BigInteger.DM;
            for (i = m; i < a.t; ++i)
                r[i] = op(f, a[i]);
            r.t = a.t;
        }
        r.s = op(this.s, a.s);
        r.clamp();
    }

    isEven():boolean{
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    }

    dAddOffset (n:number, w:number) {
        if (n == 0)
            return;
        while (this.t <= w)
            this[this.t++] = 0;
        this[w] += n;
        while (this[w] >= BigInteger.DV) {
            this[w] -= BigInteger.DV;
            if (++w >= this.t)
                this[this.t++] = 0;
            ++this[w];
        }
    }

    private modInt (n):number {
        if (n <= 0)
            return 0;
        var d = BigInteger.DV % n,
            r = (this.s < 0) ? n - 1 : 0;
        if (this.t > 0)
            if (d == 0)
                r = this[0] % n;
            else
                for (var i = this.t - 1; i >= 0; --i)
                    r = (d * r + this[i]) % n;
        return r;
    }

        // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    private millerRabin (t:number) {
        var n1 = this.subtract(BigInteger.ONE);
        var k = n1.getLowestSetBit();
        if (k <= 0)
            return false;
        var r = n1.shiftRight(k);
        t = (t + 1) >> 1;
        if (t > BigInteger.lowprimes.length)
            t = BigInteger.lowprimes.length;
        var a = BigInteger.nbi();
        for (var i = 0; i < t; ++i) {
            //Pick bases at random, instead of starting at 2
            a.fromInt(BigInteger.lowprimes[Math.floor(Math.random() * BigInteger.lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                    y = y.modPowInt(2, this);
                    if (y.compareTo(BigInteger.ONE) == 0)
                        return false;
                }
                if (y.compareTo(n1) != 0)
                    return false;
            }
        }
        return true;
    }

    subTo (a:BigInteger, r:BigInteger) {
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
        r.s = (c < 0) ? -1 : 0;
        if (c < -1)
            r[i++] = BigInteger.DV + c;
        else if (c > 0)
            r[i++] = c;
        r.t = i;
        r.clamp();
    }

    multiplyTo (a:BigInteger, r:BigInteger) {
        var x = this.abs(),
            y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0)
            r[i] = 0;
        for (i = 0; i < y.t; ++i)
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        r.s = 0;
        r.clamp();
        if (this.s != a.s)
            BigInteger.ZERO.subTo(r, r);
    }

    private changeBit (n:number, op:(x:any,y:any)=>number):BigInteger {
        var r = BigInteger.ONE.shiftLeft(n);
        this.bitwiseTo(r, op, r);
        return r;
    }

    private addTo (a:BigInteger, r:BigInteger) {
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
        r.s = (c < 0) ? -1 : 0;
        if (c > 0)
            r[i++] = c;
        else if (c < -1)
            r[i++] = BigInteger.DV + c;
        r.t = i;
        r.clamp();
    }

    divRemTo (m:BigInteger, q:BigInteger, r:BigInteger) {
        var pm = m.abs();
        if (pm.t <= 0)
            return;
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null)
                q.fromInt(0);
            if (r != null)
                this.copyTo(r);
            return;
        }
        if (r == null)
            r = BigInteger.nbi();
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
        if (y0 == 0)
            return;
        var yt = y0 * (1 << BigInteger.F1) + ((ys > 1) ? y[ys - 2] >> BigInteger.F2 : 0);
        var d1 = BigInteger.FV / yt,
            d2 = (1 << BigInteger.F1) / yt,
            e = 1 << BigInteger.F2;
        var i = r.t,
            j = i - ys,
            t = (q == null) ? BigInteger.nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y); // "negative" y so we can replace sub with am later
        while (y.t < ys)
            y[y.t++] = 0;
        while (--j >= 0) {
            // Estimate quotient digit
            var qd = (r[--i] == y0) ? BigInteger.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd)
                    r.subTo(t, r);
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms)
                BigInteger.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0)
            r.rShiftTo(nsh, r); // Denormalize remainder
        if (ts < 0)
            BigInteger.ZERO.subTo(r, r);
    }
    
    int2char(n:number) : string {
            return BigInteger.BI_RM.charAt(n);
    }
    
    private intAt(s:string, i:number) :number {
        var c = BigInteger.BI_RC[s.charCodeAt(i)];
        return (c == null) ? -1 : c;
    }
    
    private dMultiply (n:number) {
        this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp();
    }
    
    private chunkSize (r:number) : number {
            return Math.floor(Math.LN2 * BigInteger.DB / Math.log(r));
    }

   // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
   private exp (e:number, z:I_Calc):BigInteger {
        if (e > 0xffffffff || e < 1)
            return BigInteger.ONE;
        var r = BigInteger.nbi(),
            r2 = BigInteger.nbi(),
            g = z.convert(this),
            i =  this.nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0)
                z.mulTo(r2, g, r);
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    }

    square():BigInteger {
       var e = BigInteger.nbi();
       this.squareTo(e);
       return e;
    }

    pow (e:number) {
			return this.exp(e, new NullExp());
	}

    modPow (e:BigInteger, m:BigInteger) {
        var i:number = e.bitLength(),
            k:number,
            r:BigInteger = BigInteger.nbv(1),
            z:I_Calc;
        if (i <= 0)
            return r;
        else if (i < 18)
            k = 1;
        else if (i < 48)
            k = 3;
        else if (i < 144)
            k = 4;
        else if (i < 768)
            k = 5;
        else
            k = 6;
        if (i < 8)
            z = new Classic(m);
        else if (m.isEven())
            z = new Barrett(m);
        else
            z = new Montgomery(m);

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

        var j:number = e.t - 1,
            w:number,
            is1 = true,
            r2:BigInteger = BigInteger.nbi(),
            t:BigInteger;
        i = this.nbits(e[j]) - 1;
        while (j >= 0) {
            if (i >= k1)
                w = (e[j] >> (i - k1)) & km;
            else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0)
                    w |= e[j - 1] >> (BigInteger.DB + i - k1);
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
            if (is1) { // ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
            } else {
                while (n > 1) {
                    z.sqrTo(r, r2);
                    z.sqrTo(r2, r);
                    n -= 2;
                }
                if (n > 0)
                    z.sqrTo(r, r2);
                else {
                    t = r;
                    r = r2;
                    r2 = t;
                }
                z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
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
    }
    
    
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 export = BigInteger;
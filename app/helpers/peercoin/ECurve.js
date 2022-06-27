var BigInteger = require("./BigInteger");
function integerToBytes(e, t) {
    var n = e.toByteArrayUnsigned();
    if (t < n.length)
        n = n.slice(n.length - t);
    else
        while (t > n.length)
            n.unshift(0);
    return n;
}
function secp256k1() {
    var e = new BigInteger("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F", 16), t = BigInteger.ZERO, n = new BigInteger("7", 16), r = new BigInteger("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16), i = BigInteger.ONE, s = new ECCurveFp(e, t, n), o = s.decodePointHex("0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8");
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
var ECFieldElementFp = (function () {
    function ECFieldElementFp(e, t) {
        this.x = t,
            this.q = e;
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
})();
exports.ECFieldElementFp = ECFieldElementFp; //class fieldelement
var ECCurveFp = (function () {
    function ECCurveFp(e, t, n) {
        this.q = e,
            this.a = this.fromBigInteger(t),
            this.b = this.fromBigInteger(n),
            this.infinity = new ECPointFp(this, null, null);
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
                var t = (e.length - 2) / 2, n = e.substr(2, t), r = e.substr(t + 2, t);
                return new ECPointFp(this, this.fromBigInteger(new BigInteger(n, 16)), this.fromBigInteger(new BigInteger(r, 16)));
            default:
                return null;
        }
    };
    return ECCurveFp;
})();
exports.ECCurveFp = ECCurveFp; //class ECCurveFp
var ECPointFp = (function () {
    function ECPointFp(e, t, n, r) {
        this.curve = e;
        this.x = t;
        this.y = n;
        r == null ? this.z = BigInteger.ONE : this.z = r;
        this.zinv = null;
    }
    ECPointFp.prototype.getX = function () {
        return this.zinv == null && (this.zinv = this.z.modInverse(this.curve.q)),
            this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    };
    ECPointFp.prototype.getY = function () {
        return this.zinv == null && (this.zinv = this.z.modInverse(this.curve.q)),
            this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
    };
    ECPointFp.prototype.equals = function (e) {
        if (e == this)
            return !0;
        if (this.isInfinity())
            return e.isInfinity();
        if (e.isInfinity())
            return this.isInfinity();
        var t, n;
        return t = e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q),
            t.equals(BigInteger.ZERO) ? (n = e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q), n.equals(BigInteger.ZERO)) : !1;
    };
    ECPointFp.prototype.isInfinity = function () {
        return this.x == null && this.y == null ? !0 : this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
    };
    ECPointFp.prototype.negate = function () {
        return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
    };
    ECPointFp.prototype.add = function (e) {
        if (this.isInfinity())
            return e;
        if (e.isInfinity())
            return this;
        var t = e.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(e.z)).mod(this.curve.q), n = e.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(e.z)).mod(this.curve.q);
        if (BigInteger.ZERO.equals(n))
            return BigInteger.ZERO.equals(t) ? this.twice() : this.curve.getInfinity();
        var r = new BigInteger("3"), i = this.x.toBigInteger(), s = this.y.toBigInteger(), o = e.x.toBigInteger(), u = e.y.toBigInteger(), a = n.square(), f = a.multiply(n), l = i.multiply(a), c = t.square().multiply(this.z), h = c.subtract(l.shiftLeft(1)).multiply(e.z).subtract(f).multiply(n).mod(this.curve.q), p = l.multiply(r).multiply(t).subtract(s.multiply(f)).subtract(c.multiply(t)).multiply(e.z).add(t.multiply(f)).mod(this.curve.q), d = f.multiply(this.z).multiply(e.z).mod(this.curve.q);
        return new ECPointFp(this.curve, this.curve.fromBigInteger(h), this.curve.fromBigInteger(p), d);
    };
    ECPointFp.prototype.twice = function () {
        if (this.isInfinity())
            return this;
        if (this.y.toBigInteger().signum() == 0)
            return this.curve.getInfinity();
        var e = new BigInteger("3"), t = this.x.toBigInteger(), n = this.y.toBigInteger(), r = n.multiply(this.z), i = r.multiply(n).mod(this.curve.q), s = this.curve.a.toBigInteger(), o = t.square().multiply(e);
        BigInteger.ZERO.equals(s) || (o = o.add(this.z.square().multiply(s))),
            o = o.mod(this.curve.q);
        var u = o.square().subtract(t.shiftLeft(3).multiply(i)).shiftLeft(1).multiply(r).mod(this.curve.q), a = o.multiply(e).multiply(t).subtract(i.shiftLeft(1)).shiftLeft(2).multiply(i).subtract(o.square().multiply(o)).mod(this.curve.q), f = r.square().multiply(r).shiftLeft(3).mod(this.curve.q);
        return new ECPointFp(this.curve, this.curve.fromBigInteger(u), this.curve.fromBigInteger(a), f);
    };
    ECPointFp.prototype.multiply = function (e) {
        if (this.isInfinity())
            return this;
        if (e.signum() == 0)
            return this.curve.getInfinity();
        var t = e, n = t.multiply(new BigInteger("3")), r = this.negate(), i = this, s;
        for (s = n.bitLength() - 2; s > 0; --s) {
            i = i.twice();
            var o = n.testBit(s), u = t.testBit(s);
            o != u && (i = i.add(o ? this : r));
        }
        return i;
    };
    ECPointFp.prototype.multiplyTwo = function (e, t, n) {
        var r;
        e.bitLength() > n.bitLength() ? r = e.bitLength() - 1 : r = n.bitLength() - 1;
        var i = this.curve.getInfinity(), s = this.add(t);
        while (r >= 0)
            i = i.twice(), e.testBit(r) ? n.testBit(r) ? i = i.add(s) : i = i.add(this) : n.testBit(r) && (i = i.add(t)), --r;
        return i;
    };
    ECPointFp.prototype.getEncoded = function (e) {
        var t = this.getX().toBigInteger(), n = this.getY().toBigInteger(), r = integerToBytes(t, 32);
        return e ? n.isEven() ? r.unshift(2) : r.unshift(3) : (r.unshift(4), r = r.concat(integerToBytes(n, 32))),
            r;
    };
    ECPointFp.prototype.decodeFrom = function (e, t) {
        var n = t[0], r = t.length - 1, i = t.slice(1, 1 + r / 2), s = t.slice(1 + r / 2, 1 + r);
        i.unshift(0),
            s.unshift(0);
        var o = new BigInteger(i), u = new BigInteger(s);
        return new ECPointFp(e, e.fromBigInteger(o), e.fromBigInteger(u));
    };
    ECPointFp.prototype.add2D = function (e) {
        if (this.isInfinity())
            return e;
        if (e.isInfinity())
            return this;
        if (this.x.equals(e.x))
            return this.y.equals(e.y) ? this.twice() : this.curve.getInfinity();
        var t = e.x.subtract(this.x), n = e.y.subtract(this.y), r = n.divide(t), i = r.square().subtract(this.x).subtract(e.x), s = r.multiply(this.x.subtract(i)).subtract(this.y);
        return new ECPointFp(this.curve, i, s);
    };
    ECPointFp.prototype.twice2D = function () {
        if (this.isInfinity())
            return this;
        if (this.y.toBigInteger().signum() == 0)
            return this.curve.getInfinity();
        var e = this.curve.fromBigInteger(BigInteger.valueOf(2)), t = this.curve.fromBigInteger(BigInteger.valueOf(3)), n = this.x.square().multiply(t).add(this.curve.a).divide(this.y.multiply(e)), r = n.square().subtract(this.x.multiply(e)), i = n.multiply(this.x.subtract(r)).subtract(this.y);
        return new ECPointFp(this.curve, r, i);
    };
    ECPointFp.prototype.multiply2D = function (e) {
        if (this.isInfinity())
            return this;
        if (e.signum() == 0)
            return this.curve.getInfinity();
        var t = e, n = t.multiply(new BigInteger("3")), r = this.negate(), i = this, s;
        for (s = n.bitLength() - 2; s > 0; --s) {
            i = i.twice();
            var o = n.testBit(s), u = t.testBit(s);
            o != u && (i = i.add2D(o ? this : r));
        }
        return i;
    };
    ECPointFp.prototype.isOnCurve = function () {
        var e = this.getX().toBigInteger(), t = this.getY().toBigInteger(), n = this.curve.getA().toBigInteger(), r = this.curve.getB().toBigInteger(), i = this.curve.getQ(), s = t.multiply(t).mod(i), o = e.multiply(e).multiply(e).add(n.multiply(e)).add(r).mod(i);
        return s.equals(o);
    };
    ECPointFp.prototype.toString = function () {
        return "(" + this.getX().toBigInteger().toString() + "," + this.getY().toBigInteger().toString() + ")";
    };
    ECPointFp.prototype.validate = function () {
        var e = this.curve.getQ();
        if (this.isInfinity())
            throw new Error("Point is at infinity.");
        var t = this.getX().toBigInteger(), n = this.getY().toBigInteger();
        if (t.compareTo(BigInteger.ONE) < 0 || t.compareTo(e.subtract(BigInteger.ONE)) > 0)
            throw new Error("x coordinate out of bounds");
        if (n.compareTo(BigInteger.ONE) < 0 || n.compareTo(e.subtract(BigInteger.ONE)) > 0)
            throw new Error("y coordinate out of bounds");
        if (!this.isOnCurve())
            throw new Error("Point is not on the curve.");
        if (this.multiply(e).isInfinity())
            throw new Error("Point is not a scalar multiple of G.");
        return !0;
    };
    return ECPointFp;
})();
exports.ECPointFp = ECPointFp; //class ECPointFp
var X9ECParameters = (function () {
    function X9ECParameters(e, t, n, r) {
        this.curve = e,
            this.g = t,
            this.n = n,
            this.h = r;
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
})();
exports.X9ECParameters = X9ECParameters;

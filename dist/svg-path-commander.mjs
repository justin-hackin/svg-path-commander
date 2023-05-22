var Gt = Object.defineProperty;
var te = (e, t, n) => t in e ? Gt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var N = (e, t, n) => (te(e, typeof t != "symbol" ? t + "" : t, n), n);
const mt = {
  origin: [0, 0, 0],
  round: 4
}, k = "SVGPathCommander Error", U = {
  a: 7,
  c: 6,
  h: 1,
  l: 2,
  m: 2,
  r: 4,
  q: 4,
  s: 4,
  t: 2,
  v: 1,
  z: 0
}, Lt = (e) => {
  let t = e.pathValue[e.segmentStart], n = t.toLowerCase();
  const { data: r } = e;
  for (; r.length >= U[n] && (n === "m" && r.length > 2 ? (e.segments.push([t, ...r.splice(0, 2)]), n = "l", t = t === "m" ? "l" : "L") : e.segments.push([t, ...r.splice(0, U[n])]), !!U[n]); )
    ;
}, ee = (e) => {
  const { index: t, pathValue: n } = e, r = n.charCodeAt(t);
  if (r === 48) {
    e.param = 0, e.index += 1;
    return;
  }
  if (r === 49) {
    e.param = 1, e.index += 1;
    return;
  }
  e.err = `${k}: invalid Arc flag "${n[t]}", expecting 0 or 1 at index ${t}`;
}, D = (e) => e >= 48 && e <= 57, R = "Invalid path value", ne = (e) => {
  const { max: t, pathValue: n, index: r } = e;
  let s = r, i = !1, o = !1, a = !1, l = !1, c;
  if (s >= t) {
    e.err = `${k}: ${R} at index ${s}, "pathValue" is missing param`;
    return;
  }
  if (c = n.charCodeAt(s), (c === 43 || c === 45) && (s += 1, c = n.charCodeAt(s)), !D(c) && c !== 46) {
    e.err = `${k}: ${R} at index ${s}, "${n[s]}" is not a number`;
    return;
  }
  if (c !== 46) {
    if (i = c === 48, s += 1, c = n.charCodeAt(s), i && s < t && c && D(c)) {
      e.err = `${k}: ${R} at index ${r}, "${n[r]}" illegal number`;
      return;
    }
    for (; s < t && D(n.charCodeAt(s)); )
      s += 1, o = !0;
    c = n.charCodeAt(s);
  }
  if (c === 46) {
    for (l = !0, s += 1; D(n.charCodeAt(s)); )
      s += 1, a = !0;
    c = n.charCodeAt(s);
  }
  if (c === 101 || c === 69) {
    if (l && !o && !a) {
      e.err = `${k}: ${R} at index ${s}, "${n[s]}" invalid float exponent`;
      return;
    }
    if (s += 1, c = n.charCodeAt(s), (c === 43 || c === 45) && (s += 1), s < t && D(n.charCodeAt(s)))
      for (; s < t && D(n.charCodeAt(s)); )
        s += 1;
    else {
      e.err = `${k}: ${R} at index ${s}, "${n[s]}" invalid integer exponent`;
      return;
    }
  }
  e.index = s, e.param = +e.pathValue.slice(r, s);
}, se = (e) => [
  // Special spaces
  5760,
  6158,
  8192,
  8193,
  8194,
  8195,
  8196,
  8197,
  8198,
  8199,
  8200,
  8201,
  8202,
  8239,
  8287,
  12288,
  65279,
  // Line terminators
  10,
  13,
  8232,
  8233,
  // White spaces
  32,
  9,
  11,
  12,
  160
].includes(e), K = (e) => {
  const { pathValue: t, max: n } = e;
  for (; e.index < n && se(t.charCodeAt(e.index)); )
    e.index += 1;
}, re = (e) => {
  switch (e | 32) {
    case 109:
    case 122:
    case 108:
    case 104:
    case 118:
    case 99:
    case 115:
    case 113:
    case 116:
    case 97:
      return !0;
    default:
      return !1;
  }
}, ie = (e) => D(e) || e === 43 || e === 45 || e === 46, oe = (e) => (e | 32) === 97, zt = (e) => {
  const { max: t, pathValue: n, index: r } = e, s = n.charCodeAt(r), i = U[n[r].toLowerCase()];
  if (e.segmentStart = r, !re(s)) {
    e.err = `${k}: ${R} "${n[r]}" is not a path command`;
    return;
  }
  if (e.index += 1, K(e), e.data = [], !i) {
    Lt(e);
    return;
  }
  for (; ; ) {
    for (let o = i; o > 0; o -= 1) {
      if (oe(s) && (o === 3 || o === 4) ? ee(e) : ne(e), e.err.length)
        return;
      e.data.push(e.param), K(e), e.index < t && n.charCodeAt(e.index) === 44 && (e.index += 1, K(e));
    }
    if (e.index >= e.max || !ie(n.charCodeAt(e.index)))
      break;
  }
  Lt(e);
};
class It {
  constructor(t) {
    this.segments = [], this.pathValue = t, this.max = t.length, this.index = 0, this.param = 0, this.segmentStart = 0, this.data = [], this.err = "";
  }
}
const _ = (e) => Array.isArray(e) && e.every((t) => {
  const n = t[0].toLowerCase();
  return U[n] === t.length - 1 && "achlmqstvz".includes(n) && t.slice(1).every(Number.isFinite);
}) && e.length > 0, Z = (e) => {
  if (_(e))
    return [...e];
  const t = new It(e);
  for (K(t); t.index < t.max && !t.err.length; )
    zt(t);
  if (t.err && t.err.length)
    throw TypeError(t.err);
  return t.segments;
}, ce = (e) => {
  const t = e.length;
  let n = -1, r, s = e[t - 1], i = 0;
  for (; ++n < t; )
    r = s, s = e[n], i += r[1] * s[0] - r[0] * s[1];
  return i / 2;
}, W = (e, t) => Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1])), le = (e) => e.reduce((t, n, r) => r ? t + W(e[r - 1], n) : 0, 0);
var ae = Object.defineProperty, me = (e, t, n) => t in e ? ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, C = (e, t, n) => (me(e, typeof t != "symbol" ? t + "" : t, n), n);
const he = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 0,
  f: 0,
  m11: 1,
  m12: 0,
  m13: 0,
  m14: 0,
  m21: 0,
  m22: 1,
  m23: 0,
  m24: 0,
  m31: 0,
  m32: 0,
  m33: 1,
  m34: 0,
  m41: 0,
  m42: 0,
  m43: 0,
  m44: 1,
  is2D: !0,
  isIdentity: !0
}, Dt = (e) => (e instanceof Float64Array || e instanceof Float32Array || Array.isArray(e) && e.every((t) => typeof t == "number")) && [6, 16].some((t) => e.length === t), Zt = (e) => e instanceof DOMMatrix || e instanceof v || typeof e == "object" && Object.keys(he).every((t) => e && t in e), G = (e) => {
  const t = new v(), n = Array.from(e);
  if (!Dt(n))
    throw TypeError(`CSSMatrix: "${n.join(",")}" must be an array with 6/16 numbers.`);
  if (n.length === 16) {
    const [r, s, i, o, a, l, c, m, u, y, g, f, h, x, p, b] = n;
    t.m11 = r, t.a = r, t.m21 = a, t.c = a, t.m31 = u, t.m41 = h, t.e = h, t.m12 = s, t.b = s, t.m22 = l, t.d = l, t.m32 = y, t.m42 = x, t.f = x, t.m13 = i, t.m23 = c, t.m33 = g, t.m43 = p, t.m14 = o, t.m24 = m, t.m34 = f, t.m44 = b;
  } else if (n.length === 6) {
    const [r, s, i, o, a, l] = n;
    t.m11 = r, t.a = r, t.m12 = s, t.b = s, t.m21 = i, t.c = i, t.m22 = o, t.d = o, t.m41 = a, t.e = a, t.m42 = l, t.f = l;
  }
  return t;
}, Ft = (e) => {
  if (Zt(e))
    return G([
      e.m11,
      e.m12,
      e.m13,
      e.m14,
      e.m21,
      e.m22,
      e.m23,
      e.m24,
      e.m31,
      e.m32,
      e.m33,
      e.m34,
      e.m41,
      e.m42,
      e.m43,
      e.m44
    ]);
  throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a DOMMatrix / CSSMatrix / JSON compatible object.`);
}, Rt = (e) => {
  if (typeof e != "string")
    throw TypeError(`CSSMatrix: "${JSON.stringify(e)}" is not a string.`);
  const t = String(e).replace(/\s/g, "");
  let n = new v();
  const r = `CSSMatrix: invalid transform string "${e}"`;
  return t.split(")").filter((s) => s).forEach((s) => {
    const [i, o] = s.split("(");
    if (!o)
      throw TypeError(r);
    const a = o.split(",").map((f) => f.includes("rad") ? parseFloat(f) * (180 / Math.PI) : parseFloat(f)), [l, c, m, u] = a, y = [l, c, m], g = [l, c, m, u];
    if (i === "perspective" && l && [c, m].every((f) => f === void 0))
      n.m34 = -1 / l;
    else if (i.includes("matrix") && [6, 16].includes(a.length) && a.every((f) => !Number.isNaN(+f))) {
      const f = a.map((h) => Math.abs(h) < 1e-6 ? 0 : h);
      n = n.multiply(G(f));
    } else if (i === "translate3d" && y.every((f) => !Number.isNaN(+f)))
      n = n.translate(l, c, m);
    else if (i === "translate" && l && m === void 0)
      n = n.translate(l, c || 0, 0);
    else if (i === "rotate3d" && g.every((f) => !Number.isNaN(+f)) && u)
      n = n.rotateAxisAngle(l, c, m, u);
    else if (i === "rotate" && l && [c, m].every((f) => f === void 0))
      n = n.rotate(0, 0, l);
    else if (i === "scale3d" && y.every((f) => !Number.isNaN(+f)) && y.some((f) => f !== 1))
      n = n.scale(l, c, m);
    else if (i === "scale" && !Number.isNaN(l) && l !== 1 && m === void 0) {
      const f = Number.isNaN(+c) ? l : c;
      n = n.scale(l, f, 1);
    } else if (i === "skew" && (l || !Number.isNaN(l) && c) && m === void 0)
      n = n.skew(l, c || 0);
    else if (["translate", "rotate", "scale", "skew"].some((f) => i.includes(f)) && /[XYZ]/.test(i) && l && [c, m].every((f) => f === void 0))
      if (i === "skewX" || i === "skewY")
        n = n[i](l);
      else {
        const f = i.replace(/[XYZ]/, ""), h = i.replace(f, ""), x = ["X", "Y", "Z"].indexOf(h), p = f === "scale" ? 1 : 0, b = [x === 0 ? l : p, x === 1 ? l : p, x === 2 ? l : p];
        n = n[f](...b);
      }
    else
      throw TypeError(r);
  }), n;
}, bt = (e, t) => t ? [e.a, e.b, e.c, e.d, e.e, e.f] : [
  e.m11,
  e.m12,
  e.m13,
  e.m14,
  e.m21,
  e.m22,
  e.m23,
  e.m24,
  e.m31,
  e.m32,
  e.m33,
  e.m34,
  e.m41,
  e.m42,
  e.m43,
  e.m44
], Xt = (e, t, n) => {
  const r = new v();
  return r.m41 = e, r.e = e, r.m42 = t, r.f = t, r.m43 = n, r;
}, Qt = (e, t, n) => {
  const r = new v(), s = Math.PI / 180, i = e * s, o = t * s, a = n * s, l = Math.cos(i), c = -Math.sin(i), m = Math.cos(o), u = -Math.sin(o), y = Math.cos(a), g = -Math.sin(a), f = m * y, h = -m * g;
  r.m11 = f, r.a = f, r.m12 = h, r.b = h, r.m13 = u;
  const x = c * u * y + l * g;
  r.m21 = x, r.c = x;
  const p = l * y - c * u * g;
  return r.m22 = p, r.d = p, r.m23 = -c * m, r.m31 = c * g - l * u * y, r.m32 = c * y + l * u * g, r.m33 = l * m, r;
}, Ht = (e, t, n, r) => {
  const s = new v(), i = Math.sqrt(e * e + t * t + n * n);
  if (i === 0)
    return s;
  const o = e / i, a = t / i, l = n / i, c = r * (Math.PI / 360), m = Math.sin(c), u = Math.cos(c), y = m * m, g = o * o, f = a * a, h = l * l, x = 1 - 2 * (f + h) * y;
  s.m11 = x, s.a = x;
  const p = 2 * (o * a * y + l * m * u);
  s.m12 = p, s.b = p, s.m13 = 2 * (o * l * y - a * m * u);
  const b = 2 * (a * o * y - l * m * u);
  s.m21 = b, s.c = b;
  const A = 1 - 2 * (h + g) * y;
  return s.m22 = A, s.d = A, s.m23 = 2 * (a * l * y + o * m * u), s.m31 = 2 * (l * o * y + a * m * u), s.m32 = 2 * (l * a * y - o * m * u), s.m33 = 1 - 2 * (g + f) * y, s;
}, Yt = (e, t, n) => {
  const r = new v();
  return r.m11 = e, r.a = e, r.m22 = t, r.d = t, r.m33 = n, r;
}, ht = (e, t) => {
  const n = new v();
  if (e) {
    const r = e * Math.PI / 180, s = Math.tan(r);
    n.m21 = s, n.c = s;
  }
  if (t) {
    const r = t * Math.PI / 180, s = Math.tan(r);
    n.m12 = s, n.b = s;
  }
  return n;
}, Bt = (e) => ht(e, 0), Jt = (e) => ht(0, e), O = (e, t) => {
  const n = t.m11 * e.m11 + t.m12 * e.m21 + t.m13 * e.m31 + t.m14 * e.m41, r = t.m11 * e.m12 + t.m12 * e.m22 + t.m13 * e.m32 + t.m14 * e.m42, s = t.m11 * e.m13 + t.m12 * e.m23 + t.m13 * e.m33 + t.m14 * e.m43, i = t.m11 * e.m14 + t.m12 * e.m24 + t.m13 * e.m34 + t.m14 * e.m44, o = t.m21 * e.m11 + t.m22 * e.m21 + t.m23 * e.m31 + t.m24 * e.m41, a = t.m21 * e.m12 + t.m22 * e.m22 + t.m23 * e.m32 + t.m24 * e.m42, l = t.m21 * e.m13 + t.m22 * e.m23 + t.m23 * e.m33 + t.m24 * e.m43, c = t.m21 * e.m14 + t.m22 * e.m24 + t.m23 * e.m34 + t.m24 * e.m44, m = t.m31 * e.m11 + t.m32 * e.m21 + t.m33 * e.m31 + t.m34 * e.m41, u = t.m31 * e.m12 + t.m32 * e.m22 + t.m33 * e.m32 + t.m34 * e.m42, y = t.m31 * e.m13 + t.m32 * e.m23 + t.m33 * e.m33 + t.m34 * e.m43, g = t.m31 * e.m14 + t.m32 * e.m24 + t.m33 * e.m34 + t.m34 * e.m44, f = t.m41 * e.m11 + t.m42 * e.m21 + t.m43 * e.m31 + t.m44 * e.m41, h = t.m41 * e.m12 + t.m42 * e.m22 + t.m43 * e.m32 + t.m44 * e.m42, x = t.m41 * e.m13 + t.m42 * e.m23 + t.m43 * e.m33 + t.m44 * e.m43, p = t.m41 * e.m14 + t.m42 * e.m24 + t.m43 * e.m34 + t.m44 * e.m44;
  return G([n, r, s, i, o, a, l, c, m, u, y, g, f, h, x, p]);
};
class v {
  /**
   * @constructor
   * @param init accepts all parameter configurations:
   * * valid CSS transform string,
   * * CSSMatrix/DOMMatrix instance,
   * * a 6/16 elements *Array*.
   */
  constructor(t) {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.m11 = 1, this.m12 = 0, this.m13 = 0, this.m14 = 0, this.m21 = 0, this.m22 = 1, this.m23 = 0, this.m24 = 0, this.m31 = 0, this.m32 = 0, this.m33 = 1, this.m34 = 0, this.m41 = 0, this.m42 = 0, this.m43 = 0, this.m44 = 1, t ? this.setMatrixValue(t) : this;
  }
  /**
   * A `Boolean` whose value is `true` if the matrix is the identity matrix. The identity
   * matrix is one in which every value is 0 except those on the main diagonal from top-left
   * to bottom-right corner (in other words, where the offsets in each direction are equal).
   *
   * @return the current property value
   */
  get isIdentity() {
    return this.m11 === 1 && this.m12 === 0 && this.m13 === 0 && this.m14 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m41 === 0 && this.m42 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  /**
   * A `Boolean` flag whose value is `true` if the matrix was initialized as a 2D matrix
   * and `false` if the matrix is 3D.
   *
   * @return the current property value
   */
  get is2D() {
    return this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1;
  }
  /**
   * The `setMatrixValue` method replaces the existing matrix with one computed
   * in the browser. EG: `matrix(1,0.25,-0.25,1,0,0)`
   *
   * The method accepts any *Array* values, the result of
   * `DOMMatrix` instance method `toFloat64Array()` / `toFloat32Array()` calls
   * or `CSSMatrix` instance method `toArray()`.
   *
   * This method expects valid *matrix()* / *matrix3d()* string values, as well
   * as other transform functions like *translateX(10px)*.
   *
   * @param source
   * @return the matrix instance
   */
  setMatrixValue(t) {
    return typeof t == "string" && t.length && t !== "none" ? Rt(t) : Array.isArray(t) || t instanceof Float64Array || t instanceof Float32Array ? G(t) : typeof t == "object" ? Ft(t) : this;
  }
  /**
   * Returns a *Float32Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat32Array(t) {
    return Float32Array.from(bt(this, t));
  }
  /**
   * Returns a *Float64Array* containing elements which comprise the matrix.
   * The method can return either the 16 elements or the 6 elements
   * depending on the value of the `is2D` parameter.
   *
   * @param is2D *Array* representation of the matrix
   * @return an *Array* representation of the matrix
   */
  toFloat64Array(t) {
    return Float64Array.from(bt(this, t));
  }
  /**
   * Creates and returns a string representation of the matrix in `CSS` matrix syntax,
   * using the appropriate `CSS` matrix notation.
   *
   * matrix3d *matrix3d(m11, m12, m13, m14, m21, ...)*
   * matrix *matrix(a, b, c, d, e, f)*
   *
   * @return a string representation of the matrix
   */
  toString() {
    const { is2D: t } = this, n = this.toFloat64Array(t).join(", ");
    return `${t ? "matrix" : "matrix3d"}(${n})`;
  }
  /**
   * Returns a JSON representation of the `CSSMatrix` instance, a standard *Object*
   * that includes `{a,b,c,d,e,f}` and `{m11,m12,m13,..m44}` properties as well
   * as the `is2D` & `isIdentity` properties.
   *
   * The result can also be used as a second parameter for the `fromMatrix` static method
   * to load values into another matrix instance.
   *
   * @return an *Object* with all matrix values.
   */
  toJSON() {
    const { is2D: t, isIdentity: n } = this;
    return { ...this, is2D: t, isIdentity: n };
  }
  /**
   * The Multiply method returns a new CSSMatrix which is the result of this
   * matrix multiplied by the passed matrix, with the passed matrix to the right.
   * This matrix is not modified.
   *
   * @param m2 CSSMatrix
   * @return The resulted matrix.
   */
  multiply(t) {
    return O(this, t);
  }
  /**
   * The translate method returns a new matrix which is this matrix post
   * multiplied by a translation matrix containing the passed values. If the z
   * component is undefined, a 0 value is used in its place. This matrix is not
   * modified.
   *
   * @param x X component of the translation value.
   * @param y Y component of the translation value.
   * @param z Z component of the translation value.
   * @return The resulted matrix
   */
  translate(t, n, r) {
    const s = t;
    let i = n, o = r;
    return typeof i > "u" && (i = 0), typeof o > "u" && (o = 0), O(this, Xt(s, i, o));
  }
  /**
   * The scale method returns a new matrix which is this matrix post multiplied by
   * a scale matrix containing the passed values. If the z component is undefined,
   * a 1 value is used in its place. If the y component is undefined, the x
   * component value is used in its place. This matrix is not modified.
   *
   * @param x The X component of the scale value.
   * @param y The Y component of the scale value.
   * @param z The Z component of the scale value.
   * @return The resulted matrix
   */
  scale(t, n, r) {
    const s = t;
    let i = n, o = r;
    return typeof i > "u" && (i = t), typeof o > "u" && (o = 1), O(this, Yt(s, i, o));
  }
  /**
   * The rotate method returns a new matrix which is this matrix post multiplied
   * by each of 3 rotation matrices about the major axes, first X, then Y, then Z.
   * If the y and z components are undefined, the x value is used to rotate the
   * object about the z axis, as though the vector (0,0,x) were passed. All
   * rotation values are in degrees. This matrix is not modified.
   *
   * @param rx The X component of the rotation, or Z if Y and Z are null.
   * @param ry The (optional) Y component of the rotation value.
   * @param rz The (optional) Z component of the rotation value.
   * @return The resulted matrix
   */
  rotate(t, n, r) {
    let s = t, i = n || 0, o = r || 0;
    return typeof t == "number" && typeof n > "u" && typeof r > "u" && (o = s, s = 0, i = 0), O(this, Qt(s, i, o));
  }
  /**
   * The rotateAxisAngle method returns a new matrix which is this matrix post
   * multiplied by a rotation matrix with the given axis and `angle`. The right-hand
   * rule is used to determine the direction of rotation. All rotation values are
   * in degrees. This matrix is not modified.
   *
   * @param x The X component of the axis vector.
   * @param y The Y component of the axis vector.
   * @param z The Z component of the axis vector.
   * @param angle The angle of rotation about the axis vector, in degrees.
   * @return The resulted matrix
   */
  rotateAxisAngle(t, n, r, s) {
    if ([t, n, r, s].some((i) => Number.isNaN(+i)))
      throw new TypeError("CSSMatrix: expecting 4 values");
    return O(this, Ht(t, n, r, s));
  }
  /**
   * Specifies a skew transformation along the `x-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewX(t) {
    return O(this, Bt(t));
  }
  /**
   * Specifies a skew transformation along the `y-axis` by the given angle.
   * This matrix is not modified.
   *
   * @param angle The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skewY(t) {
    return O(this, Jt(t));
  }
  /**
   * Specifies a skew transformation along both the `x-axis` and `y-axis`.
   * This matrix is not modified.
   *
   * @param angleX The X-angle amount in degrees to skew.
   * @param angleY The angle amount in degrees to skew.
   * @return The resulted matrix
   */
  skew(t, n) {
    return O(this, ht(t, n));
  }
  /**
   * Transforms a specified vector using the matrix, returning a new
   * {x,y,z,w} Tuple *Object* comprising the transformed vector.
   * Neither the matrix nor the original vector are altered.
   *
   * The method is equivalent with `transformPoint()` method
   * of the `DOMMatrix` constructor.
   *
   * @param t Tuple with `{x,y,z,w}` components
   * @return the resulting Tuple
   */
  transformPoint(t) {
    const n = this.m11 * t.x + this.m21 * t.y + this.m31 * t.z + this.m41 * t.w, r = this.m12 * t.x + this.m22 * t.y + this.m32 * t.z + this.m42 * t.w, s = this.m13 * t.x + this.m23 * t.y + this.m33 * t.z + this.m43 * t.w, i = this.m14 * t.x + this.m24 * t.y + this.m34 * t.z + this.m44 * t.w;
    return t instanceof DOMPoint ? new DOMPoint(n, r, s, i) : {
      x: n,
      y: r,
      z: s,
      w: i
    };
  }
}
C(v, "Translate", Xt), C(v, "Rotate", Qt), C(v, "RotateAxisAngle", Ht), C(v, "Scale", Yt), C(v, "SkewX", Bt), C(v, "SkewY", Jt), C(v, "Skew", ht), C(v, "Multiply", O), C(v, "fromArray", G), C(v, "fromMatrix", Ft), C(v, "fromString", Rt), C(v, "toArray", bt), C(v, "isCompatibleArray", Dt), C(v, "isCompatibleObject", Zt);
const wt = (e) => _(e) && // `isPathArray` also checks if it's `Array`
e.every(([t]) => t === t.toUpperCase()), Q = (e) => {
  if (wt(e))
    return [...e];
  const t = Z(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((o) => {
    const a = o.slice(1).map(Number), [l] = o, c = l.toUpperCase();
    if (l === "M")
      return [n, r] = a, s = n, i = r, ["M", n, r];
    let m = [];
    if (l !== c)
      if (c === "A")
        m = [
          c,
          a[0],
          a[1],
          a[2],
          a[3],
          a[4],
          a[5] + n,
          a[6] + r
        ];
      else if (c === "V")
        m = [c, a[0] + r];
      else if (c === "H")
        m = [c, a[0] + n];
      else {
        const u = a.map((y, g) => y + (g % 2 ? r : n));
        m = [c, ...u];
      }
    else
      m = [c, ...a];
    return c === "Z" ? (n = s, r = i) : c === "H" ? [, n] = m : c === "V" ? [, r] = m : ([n, r] = m.slice(-2), c === "M" && (s = n, i = r)), m;
  });
}, ue = (e, t) => {
  const [n] = e, { x1: r, y1: s, x2: i, y2: o } = t, a = e.slice(1).map(Number);
  let l = e;
  if ("TQ".includes(n) || (t.qx = null, t.qy = null), n === "H")
    l = ["L", e[1], s];
  else if (n === "V")
    l = ["L", r, e[1]];
  else if (n === "S") {
    const c = r * 2 - i, m = s * 2 - o;
    t.x1 = c, t.y1 = m, l = ["C", c, m, ...a];
  } else if (n === "T") {
    const c = r * 2 - (t.qx ? t.qx : (
      /* istanbul ignore next */
      0
    )), m = s * 2 - (t.qy ? t.qy : (
      /* istanbul ignore next */
      0
    ));
    t.qx = c, t.qy = m, l = ["Q", c, m, ...a];
  } else if (n === "Q") {
    const [c, m] = a;
    t.qx = c, t.qy = m;
  }
  return l;
}, vt = (e) => wt(e) && e.every(([t]) => "ACLMQZ".includes(t)), ut = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null
}, z = (e) => {
  if (vt(e))
    return [...e];
  const t = Q(e), n = { ...ut }, r = t.length;
  for (let s = 0; s < r; s += 1) {
    t[s], t[s] = ue(t[s], n);
    const i = t[s], o = i.length;
    n.x1 = +i[o - 2], n.y1 = +i[o - 1], n.x2 = +i[o - 4] || n.x1, n.y2 = +i[o - 3] || n.y1;
  }
  return t;
}, j = (e, t, n) => {
  const [r, s] = e, [i, o] = t;
  return [r + (i - r) * n, s + (o - s) * n];
}, dt = (e, t, n, r, s) => {
  const i = W([e, t], [n, r]);
  let o = { x: 0, y: 0 };
  if (typeof s == "number")
    if (s <= 0)
      o = { x: e, y: t };
    else if (s >= i)
      o = { x: n, y: r };
    else {
      const [a, l] = j([e, t], [n, r], s / i);
      o = { x: a, y: l };
    }
  return {
    length: i,
    point: o,
    min: {
      x: Math.min(e, n),
      y: Math.min(t, r)
    },
    max: {
      x: Math.max(e, n),
      y: Math.max(t, r)
    }
  };
}, kt = (e, t) => {
  const { x: n, y: r } = e, { x: s, y: i } = t, o = n * s + r * i, a = Math.sqrt((n ** 2 + r ** 2) * (s ** 2 + i ** 2));
  return (n * i - r * s < 0 ? -1 : 1) * Math.acos(o / a);
}, fe = (e, t, n, r, s, i, o, a, l, c) => {
  const { abs: m, sin: u, cos: y, sqrt: g, PI: f } = Math;
  let h = m(n), x = m(r);
  const b = (s % 360 + 360) % 360 * (f / 180);
  if (e === a && t === l)
    return { x: e, y: t };
  if (h === 0 || x === 0)
    return dt(e, t, a, l, c).point;
  const A = (e - a) / 2, d = (t - l) / 2, M = {
    x: y(b) * A + u(b) * d,
    y: -u(b) * A + y(b) * d
  }, T = M.x ** 2 / h ** 2 + M.y ** 2 / x ** 2;
  T > 1 && (h *= g(T), x *= g(T));
  const E = h ** 2 * x ** 2 - h ** 2 * M.y ** 2 - x ** 2 * M.x ** 2, H = h ** 2 * M.y ** 2 + x ** 2 * M.x ** 2;
  let F = E / H;
  F = F < 0 ? 0 : F;
  const tt = (i !== o ? 1 : -1) * g(F), $ = {
    x: tt * (h * M.y / x),
    y: tt * (-(x * M.x) / h)
  }, et = {
    x: y(b) * $.x - u(b) * $.y + (e + a) / 2,
    y: u(b) * $.x + y(b) * $.y + (t + l) / 2
  }, Y = {
    x: (M.x - $.x) / h,
    y: (M.y - $.y) / x
  }, nt = kt({ x: 1, y: 0 }, Y), st = {
    x: (-M.x - $.x) / h,
    y: (-M.y - $.y) / x
  };
  let S = kt(Y, st);
  !o && S > 0 ? S -= 2 * f : o && S < 0 && (S += 2 * f), S %= 2 * f;
  const q = nt + S * c, B = h * y(q), J = x * u(q);
  return {
    x: y(b) * B - u(b) * J + et.x,
    y: u(b) * B + y(b) * J + et.y
  };
}, ye = (e, t, n, r, s, i, o, a, l, c) => {
  const m = typeof c == "number";
  let u = e, y = t, g = 0, f = [u, y, g], h = [u, y], x = 0, p = { x: 0, y: 0 }, b = [{ x: u, y }];
  m && c <= 0 && (p = { x: u, y });
  const A = 300;
  for (let d = 0; d <= A; d += 1) {
    if (x = d / A, { x: u, y } = fe(e, t, n, r, s, i, o, a, l, x), b = [...b, { x: u, y }], g += W(h, [u, y]), h = [u, y], m && g > c && c > f[2]) {
      const M = (g - c) / (g - f[2]);
      p = {
        x: h[0] * (1 - M) + f[0] * M,
        y: h[1] * (1 - M) + f[1] * M
      };
    }
    f = [u, y, g];
  }
  return m && c >= g && (p = { x: a, y: l }), {
    length: g,
    point: p,
    min: {
      x: Math.min(...b.map((d) => d.x)),
      y: Math.min(...b.map((d) => d.y))
    },
    max: {
      x: Math.max(...b.map((d) => d.x)),
      y: Math.max(...b.map((d) => d.y))
    }
  };
}, ge = (e, t, n, r, s, i, o, a, l) => {
  const c = 1 - l;
  return {
    x: c ** 3 * e + 3 * c ** 2 * l * n + 3 * c * l ** 2 * s + l ** 3 * o,
    y: c ** 3 * t + 3 * c ** 2 * l * r + 3 * c * l ** 2 * i + l ** 3 * a
  };
}, xe = (e, t, n, r, s, i, o, a, l) => {
  const c = typeof l == "number";
  let m = e, u = t, y = 0, g = [m, u, y], f = [m, u], h = 0, x = { x: 0, y: 0 }, p = [{ x: m, y: u }];
  c && l <= 0 && (x = { x: m, y: u });
  const b = 300;
  for (let A = 0; A <= b; A += 1) {
    if (h = A / b, { x: m, y: u } = ge(e, t, n, r, s, i, o, a, h), p = [...p, { x: m, y: u }], y += W(f, [m, u]), f = [m, u], c && y > l && l > g[2]) {
      const d = (y - l) / (y - g[2]);
      x = {
        x: f[0] * (1 - d) + g[0] * d,
        y: f[1] * (1 - d) + g[1] * d
      };
    }
    g = [m, u, y];
  }
  return c && l >= y && (x = { x: o, y: a }), {
    length: y,
    point: x,
    min: {
      x: Math.min(...p.map((A) => A.x)),
      y: Math.min(...p.map((A) => A.y))
    },
    max: {
      x: Math.max(...p.map((A) => A.x)),
      y: Math.max(...p.map((A) => A.y))
    }
  };
}, pe = (e, t, n, r, s, i, o) => {
  const a = 1 - o;
  return {
    x: a ** 2 * e + 2 * a * o * n + o ** 2 * s,
    y: a ** 2 * t + 2 * a * o * r + o ** 2 * i
  };
}, be = (e, t, n, r, s, i, o) => {
  const a = typeof o == "number";
  let l = e, c = t, m = 0, u = [l, c, m], y = [l, c], g = 0, f = { x: 0, y: 0 }, h = [{ x: l, y: c }];
  a && o <= 0 && (f = { x: l, y: c });
  const x = 300;
  for (let p = 0; p <= x; p += 1) {
    if (g = p / x, { x: l, y: c } = pe(e, t, n, r, s, i, g), h = [...h, { x: l, y: c }], m += W(y, [l, c]), y = [l, c], a && m > o && o > u[2]) {
      const b = (m - o) / (m - u[2]);
      f = {
        x: y[0] * (1 - b) + u[0] * b,
        y: y[1] * (1 - b) + u[1] * b
      };
    }
    u = [l, c, m];
  }
  return a && o >= m && (f = { x: s, y: i }), {
    length: m,
    point: f,
    min: {
      x: Math.min(...h.map((p) => p.x)),
      y: Math.min(...h.map((p) => p.y))
    },
    max: {
      x: Math.max(...h.map((p) => p.x)),
      y: Math.max(...h.map((p) => p.y))
    }
  };
}, ft = (e, t) => {
  const n = z(e), r = typeof t == "number";
  let s, i = [], o, a = 0, l = 0, c = 0, m = 0, u, y = [], g = [], f = 0, h = { x: 0, y: 0 }, x = h, p = h, b = h, A = 0;
  for (let d = 0, M = n.length; d < M; d += 1)
    u = n[d], [o] = u, s = o === "M", i = s ? i : [a, l, ...u.slice(1)], s ? ([, c, m] = u, h = { x: c, y: m }, x = h, f = 0, r && t < 1e-3 && (b = h)) : o === "L" ? { length: f, min: h, max: x, point: p } = dt(
      ...i,
      (t || 0) - A
    ) : o === "A" ? { length: f, min: h, max: x, point: p } = ye(
      ...i,
      (t || 0) - A
    ) : o === "C" ? { length: f, min: h, max: x, point: p } = xe(
      ...i,
      (t || 0) - A
    ) : o === "Q" ? { length: f, min: h, max: x, point: p } = be(
      ...i,
      (t || 0) - A
    ) : o === "Z" && (i = [a, l, c, m], { length: f, min: h, max: x, point: p } = dt(
      ...i,
      (t || 0) - A
    )), r && A < t && A + f >= t && (b = p), g = [...g, x], y = [...y, h], A += f, [a, l] = o !== "Z" ? u.slice(-2) : [c, m];
  return r && t >= A && (b = { x: a, y: l }), {
    length: A,
    point: b,
    min: {
      x: Math.min(...y.map((d) => d.x)),
      y: Math.min(...y.map((d) => d.y))
    },
    max: {
      x: Math.max(...g.map((d) => d.x)),
      y: Math.max(...g.map((d) => d.y))
    }
  };
}, $t = (e) => {
  if (!e)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0
    };
  const {
    min: { x: t, y: n },
    max: { x: r, y: s }
  } = ft(e), i = r - t, o = s - n;
  return {
    width: i,
    height: o,
    x: t,
    y: n,
    x2: r,
    y2: s,
    cx: t + i / 2,
    cy: n + o / 2,
    // an estimted guess
    cz: Math.max(i, o) + Math.min(i, o) / 2
  };
}, Mt = (e, t, n) => {
  if (e[n].length > 7) {
    e[n].shift();
    const r = e[n];
    let s = n;
    for (; r.length; )
      t[n] = "A", e.splice(s += 1, 0, ["C", ...r.splice(0, 6)]);
    e.splice(n, 1);
  }
}, Ut = (e) => vt(e) && e.every(([t]) => "MC".includes(t)), rt = (e, t, n) => {
  const r = e * Math.cos(n) - t * Math.sin(n), s = e * Math.sin(n) + t * Math.cos(n);
  return { x: r, y: s };
}, Pt = (e, t, n, r, s, i, o, a, l, c) => {
  let m = e, u = t, y = n, g = r, f = a, h = l;
  const x = Math.PI * 120 / 180, p = Math.PI / 180 * (+s || 0);
  let b = [], A, d, M, T, E;
  if (c)
    [d, M, T, E] = c;
  else {
    A = rt(m, u, -p), m = A.x, u = A.y, A = rt(f, h, -p), f = A.x, h = A.y;
    const P = (m - f) / 2, L = (u - h) / 2;
    let I = P * P / (y * y) + L * L / (g * g);
    I > 1 && (I = Math.sqrt(I), y *= I, g *= I);
    const xt = y * y, pt = g * g, Tt = (i === o ? -1 : 1) * Math.sqrt(Math.abs((xt * pt - xt * L * L - pt * P * P) / (xt * L * L + pt * P * P)));
    T = Tt * y * L / g + (m + f) / 2, E = Tt * -g * P / y + (u + h) / 2, d = Math.asin(((u - E) / g * 10 ** 9 >> 0) / 10 ** 9), M = Math.asin(((h - E) / g * 10 ** 9 >> 0) / 10 ** 9), d = m < T ? Math.PI - d : d, M = f < T ? Math.PI - M : M, d < 0 && (d = Math.PI * 2 + d), M < 0 && (M = Math.PI * 2 + M), o && d > M && (d -= Math.PI * 2), !o && M > d && (M -= Math.PI * 2);
  }
  let H = M - d;
  if (Math.abs(H) > x) {
    const P = M, L = f, I = h;
    M = d + x * (o && M > d ? 1 : -1), f = T + y * Math.cos(M), h = E + g * Math.sin(M), b = Pt(f, h, y, g, s, 0, o, L, I, [M, P, T, E]);
  }
  H = M - d;
  const F = Math.cos(d), tt = Math.sin(d), $ = Math.cos(M), et = Math.sin(M), Y = Math.tan(H / 4), nt = 4 / 3 * y * Y, st = 4 / 3 * g * Y, S = [m, u], q = [m + nt * tt, u - st * F], B = [f + nt * et, h - st * $], J = [f, h];
  if (q[0] = 2 * S[0] - q[0], q[1] = 2 * S[1] - q[1], c)
    return [...q, ...B, ...J, ...b];
  b = [...q, ...B, ...J, ...b];
  const gt = [];
  for (let P = 0, L = b.length; P < L; P += 1)
    gt[P] = P % 2 ? rt(b[P - 1], b[P], p).y : rt(b[P], b[P + 1], p).x;
  return gt;
}, de = (e, t, n, r, s, i) => {
  const o = 0.3333333333333333, a = 2 / 3;
  return [
    o * e + a * n,
    // cpx1
    o * t + a * r,
    // cpy1
    o * s + a * n,
    // cpx2
    o * i + a * r,
    // cpy2
    s,
    i
    // x,y
  ];
}, St = (e, t, n, r) => [...j([e, t], [n, r], 0.5), n, r, n, r], ot = (e, t) => {
  const [n] = e, r = e.slice(1).map(Number), [s, i] = r;
  let o;
  const { x1: a, y1: l, x: c, y: m } = t;
  return "TQ".includes(n) || (t.qx = null, t.qy = null), n === "M" ? (t.x = s, t.y = i, e) : n === "A" ? (o = [a, l, ...r], ["C", ...Pt(...o)]) : n === "Q" ? (t.qx = s, t.qy = i, o = [a, l, ...r], ["C", ...de(...o)]) : n === "L" ? ["C", ...St(a, l, s, i)] : n === "Z" ? ["C", ...St(a, l, c, m)] : e;
}, ct = (e) => {
  if (Ut(e))
    return [...e];
  const t = z(e), n = { ...ut }, r = [];
  let s = "", i = t.length;
  for (let o = 0; o < i; o += 1) {
    [s] = t[o], r[o] = s, t[o] = ot(t[o], n), Mt(t, r, o), i = t.length;
    const a = t[o], l = a.length;
    n.x1 = +a[l - 2], n.y1 = +a[l - 1], n.x2 = +a[l - 4] || n.x1, n.y2 = +a[l - 3] || n.y1;
  }
  return t;
}, Me = (e, t, n, r, s, i, o, a) => 3 * ((a - t) * (n + s) - (o - e) * (r + i) + r * (e - s) - n * (t - i) + a * (s + e / 3) - o * (i + t / 3)) / 20, Kt = (e) => {
  let t = 0, n = 0, r = 0;
  return ct(e).map((s) => {
    switch (s[0]) {
      case "M":
        return [, t, n] = s, 0;
      default:
        return r = Me(t, n, ...s.slice(1)), [t, n] = s.slice(-2), r;
    }
  }).reduce((s, i) => s + i, 0);
}, X = (e) => ft(e).length, Ae = (e) => Kt(ct(e)) >= 0, V = (e, t) => ft(e, t).point, Ct = (e, t) => {
  const n = Z(e);
  let r = [...n], s = X(r), i = r.length - 1, o = 0, a = 0, l = n[0];
  const [c, m] = l.slice(-2), u = { x: c, y: m };
  if (i <= 0 || !t || !Number.isFinite(t))
    return {
      segment: l,
      index: 0,
      length: a,
      point: u,
      lengthAtSegment: o
    };
  if (t >= s)
    return r = n.slice(0, -1), o = X(r), a = s - o, {
      segment: n[i],
      index: i,
      length: a,
      lengthAtSegment: o
    };
  const y = [];
  for (; i > 0; )
    l = r[i], r = r.slice(0, -1), o = X(r), a = s - o, s = o, y.push({
      segment: l,
      index: i,
      length: a,
      lengthAtSegment: o
    }), i -= 1;
  return y.find(({ lengthAtSegment: g }) => g <= t);
}, yt = (e, t) => {
  const n = Z(e), r = z(n), s = X(n), i = (d) => {
    const M = d.x - t.x, T = d.y - t.y;
    return M * M + T * T;
  };
  let o = 8, a, l = { x: 0, y: 0 }, c = 0, m = 0, u = 1 / 0;
  for (let d = 0; d <= s; d += o)
    a = V(r, d), c = i(a), c < u && (l = a, m = d, u = c);
  o /= 2;
  let y, g, f = 0, h = 0, x = 0, p = 0;
  for (; o > 0.5; )
    f = m - o, y = V(r, f), x = i(y), h = m + o, g = V(r, h), p = i(g), f >= 0 && x < u ? (l = y, m = f, u = x) : h <= s && p < u ? (l = g, m = h, u = p) : o /= 2;
  const b = Ct(n, m), A = Math.sqrt(u);
  return { closest: l, distance: A, segment: b };
}, Ne = (e, t) => yt(e, t).closest, we = (e, t) => yt(e, t).segment, ve = (e, t) => Ct(e, t).segment, Pe = (e, t) => {
  const { distance: n } = yt(e, t);
  return Math.abs(n) < 1e-3;
}, Vt = (e) => {
  if (typeof e != "string" || !e.length)
    return !1;
  const t = new It(e);
  for (K(t); t.index < t.max && !t.err.length; )
    zt(t);
  return !t.err.length && "mM".includes(t.segments[0][0]);
}, _t = (e) => _(e) && // `isPathArray` checks if it's `Array`
e.slice(1).every(([t]) => t === t.toLowerCase()), lt = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"]
}, Ce = (e) => {
  let { x1: t, y1: n, x2: r, y2: s } = e;
  return [t, n, r, s] = [t, n, r, s].map((i) => +i), [
    ["M", t, n],
    ["L", r, s]
  ];
}, Te = (e) => {
  const t = [], n = (e.points || "").trim().split(/[\s|,]/).map((s) => +s);
  let r = 0;
  for (; r < n.length; )
    t.push([r ? "L" : "M", n[r], n[r + 1]]), r += 2;
  return e.type === "polygon" ? [...t, ["z"]] : t;
}, Le = (e) => {
  let { cx: t, cy: n, r } = e;
  return [t, n, r] = [t, n, r].map((s) => +s), [
    ["M", t - r, n],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0]
  ];
}, ke = (e) => {
  let { cx: t, cy: n } = e, r = e.rx || 0, s = e.ry || r;
  return [t, n, r, s] = [t, n, r, s].map((i) => +i), [
    ["M", t - r, n],
    ["a", r, s, 0, 1, 0, 2 * r, 0],
    ["a", r, s, 0, 1, 0, -2 * r, 0]
  ];
}, $e = (e) => {
  const t = +e.x || 0, n = +e.y || 0, r = +e.width, s = +e.height;
  let i = +(e.rx || 0), o = +(e.ry || i);
  return i || o ? (i * 2 > r && (i -= (i * 2 - r) / 2), o * 2 > s && (o -= (o * 2 - s) / 2), [
    ["M", t + i, n],
    ["h", r - i * 2],
    ["s", i, 0, i, o],
    ["v", s - o * 2],
    ["s", 0, o, -i, o],
    ["h", -r + i * 2],
    ["s", -i, 0, -i, -o],
    ["v", -s + o * 2],
    ["s", 0, -o, i, -o]
  ]) : [["M", t, n], ["h", r], ["v", s], ["H", t], ["Z"]];
}, Wt = (e, t) => {
  const r = (t || document).defaultView || /* istanbul ignore next */
  window, s = Object.keys(lt), i = e instanceof r.SVGElement, o = i ? e.tagName : null;
  if (o && [...s, "path"].every((u) => o !== u))
    throw TypeError(`${k}: "${o}" is not SVGElement`);
  const a = i ? o : e.type, l = lt[a], c = { type: a };
  i ? l.forEach((u) => {
    c[u] = e.getAttribute(u);
  }) : Object.assign(c, e);
  let m = [];
  return a === "circle" ? m = Le(c) : a === "ellipse" ? m = ke(c) : ["polyline", "polygon"].includes(a) ? m = Te(c) : a === "rect" ? m = $e(c) : a === "line" ? m = Ce(c) : ["glyph", "path"].includes(a) && (m = Z(i ? e.getAttribute("d") || "" : e.d || "")), _(m) && m.length ? m : !1;
}, at = (e, t) => {
  let { round: n } = mt;
  if (t === "off" || n === "off")
    return [...e];
  n = typeof t == "number" && t >= 0 ? t : n;
  const r = typeof n == "number" && n >= 1 ? 10 ** n : 1;
  return e.map((s) => {
    const i = s.slice(1).map(Number).map((o) => n ? Math.round(o * r) / r : Math.round(o));
    return [s[0], ...i];
  });
}, At = (e, t) => at(e, t).map((n) => n[0] + n.slice(1).join(" ")).join(""), Se = (e, t, n) => {
  const r = n || document, s = r.defaultView || /* istanbul ignore next */
  window, i = Object.keys(lt), o = e instanceof s.SVGElement, a = o ? e.tagName : null;
  if (a === "path")
    throw TypeError(`${k}: "${a}" is already SVGPathElement`);
  if (a && i.every((h) => a !== h))
    throw TypeError(`${k}: "${a}" is not SVGElement`);
  const l = r.createElementNS("http://www.w3.org/2000/svg", "path"), c = o ? a : e.type, m = lt[c], u = { type: c }, y = mt.round, g = Wt(e, r), f = g && g.length ? At(g, y) : "";
  return o ? (m.forEach((h) => {
    u[h] = e.getAttribute(h);
  }), Object.values(e.attributes).forEach(({ name: h, value: x }) => {
    m.includes(h) || l.setAttribute(h, x);
  })) : (Object.assign(u, e), Object.keys(u).forEach((h) => {
    !m.includes(h) && h !== "type" && l.setAttribute(
      h.replace(/[A-Z]/g, (x) => `-${x.toLowerCase()}`),
      u[h]
    );
  })), Vt(f) ? (l.setAttribute("d", f), t && o && (e.before(l, e), e.remove()), l) : !1;
}, qt = (e) => {
  const t = [];
  let n, r = -1;
  return e.forEach((s) => {
    s[0] === "M" ? (n = [s], r += 1) : n = [...n, s], t[r] = n;
  }), t;
}, Nt = (e) => {
  if (_t(e))
    return [...e];
  const t = Z(e);
  let n = 0, r = 0, s = 0, i = 0;
  return t.map((o) => {
    const a = o.slice(1).map(Number), [l] = o, c = l.toLowerCase();
    if (l === "M")
      return [n, r] = a, s = n, i = r, ["M", n, r];
    let m = [];
    if (l !== c)
      if (c === "a")
        m = [
          c,
          a[0],
          a[1],
          a[2],
          a[3],
          a[4],
          a[5] - n,
          a[6] - r
        ];
      else if (c === "v")
        m = [c, a[0] - r];
      else if (c === "h")
        m = [c, a[0] - n];
      else {
        const y = a.map((g, f) => g - (f % 2 ? r : n));
        m = [c, ...y];
      }
    else
      l === "m" && (s = a[0] + n, i = a[1] + r), m = [c, ...a];
    const u = m.length;
    return c === "z" ? (n = s, r = i) : c === "h" ? n += m[1] : c === "v" ? r += m[1] : (n += m[u - 2], r += m[u - 1]), m;
  });
}, qe = (e, t, n, r) => {
  const [s] = e, i = (p) => Math.round(p * 10 ** 4) / 10 ** 4, o = e.slice(1).map((p) => +p), a = t.slice(1).map((p) => +p), { x1: l, y1: c, x2: m, y2: u, x: y, y: g } = n;
  let f = e;
  const [h, x] = a.slice(-2);
  if ("TQ".includes(s) || (n.qx = null, n.qy = null), ["V", "H", "S", "T", "Z"].includes(s))
    f = [s, ...o];
  else if (s === "L")
    i(y) === i(h) ? f = ["V", x] : i(g) === i(x) && (f = ["H", h]);
  else if (s === "C") {
    const [p, b] = a;
    "CS".includes(r) && (i(p) === i(l * 2 - m) && i(b) === i(c * 2 - u) || i(l) === i(m * 2 - y) && i(c) === i(u * 2 - g)) && (f = ["S", ...a.slice(-4)]), n.x1 = p, n.y1 = b;
  } else if (s === "Q") {
    const [p, b] = a;
    n.qx = p, n.qy = b, "QT".includes(r) && (i(p) === i(l * 2 - m) && i(b) === i(c * 2 - u) || i(l) === i(m * 2 - y) && i(c) === i(u * 2 - g)) && (f = ["T", ...a.slice(-2)]);
  }
  return f;
}, Ot = (e, t) => {
  const n = Q(e), r = z(n), s = { ...ut }, i = [], o = n.length;
  let a = "", l = "", c = 0, m = 0, u = 0, y = 0;
  for (let h = 0; h < o; h += 1) {
    [a] = n[h], i[h] = a, h && (l = i[h - 1]), n[h] = qe(n[h], r[h], s, l);
    const x = n[h], p = x.length;
    switch (s.x1 = +x[p - 2], s.y1 = +x[p - 1], s.x2 = +x[p - 4] || s.x1, s.y2 = +x[p - 3] || s.y1, a) {
      case "Z":
        c = u, m = y;
        break;
      case "H":
        [, c] = x;
        break;
      case "V":
        [, m] = x;
        break;
      default:
        [c, m] = x.slice(-2).map(Number), a === "M" && (u = c, y = m);
    }
    s.x = c, s.y = m;
  }
  const g = at(n, t), f = at(Nt(n), t);
  return g.map((h, x) => x ? h.join("").length < f[x].join("").length ? h : f[x] : h);
}, Oe = (e) => {
  const t = e.slice(1).map(
    (n, r, s) => r ? [...s[r - 1].slice(-2), ...n.slice(1)] : [...e[0].slice(1), ...n.slice(1)]
  ).map((n) => n.map((r, s) => n[n.length - s - 2 * (1 - s % 2)])).reverse();
  return [["M", ...t[0].slice(0, 2)], ...t.map((n) => ["C", ...n.slice(2)])];
}, it = (e) => {
  const t = Q(e), n = t.slice(-1)[0][0] === "Z", r = z(t).map((s, i) => {
    const [o, a] = s.slice(-2).map(Number);
    return {
      seg: t[i],
      // absolute
      n: s,
      // normalized
      c: t[i][0],
      // pathCommand
      x: o,
      // x
      y: a
      // y
    };
  }).map((s, i, o) => {
    const a = s.seg, l = s.n, c = i && o[i - 1], m = o[i + 1], u = s.c, y = o.length, g = i ? o[i - 1].x : o[y - 1].x, f = i ? o[i - 1].y : o[y - 1].y;
    let h = [];
    switch (u) {
      case "M":
        h = n ? ["Z"] : [u, g, f];
        break;
      case "A":
        h = [u, ...a.slice(1, -3), a[5] === 1 ? 0 : 1, g, f];
        break;
      case "C":
        m && m.c === "S" ? h = ["S", a[1], a[2], g, f] : h = [u, a[3], a[4], a[1], a[2], g, f];
        break;
      case "S":
        c && "CS".includes(c.c) && (!m || m.c !== "S") ? h = ["C", l[3], l[4], l[1], l[2], g, f] : h = [u, l[1], l[2], g, f];
        break;
      case "Q":
        m && m.c === "T" ? h = ["T", g, f] : h = [u, ...a.slice(1, -2), g, f];
        break;
      case "T":
        c && "QT".includes(c.c) && (!m || m.c !== "T") ? h = ["Q", l[1], l[2], g, f] : h = [u, g, f];
        break;
      case "Z":
        h = ["M", g, f];
        break;
      case "H":
        h = [u, g];
        break;
      case "V":
        h = [u, f];
        break;
      default:
        h = [u, ...a.slice(1, -2), g, f];
    }
    return h;
  });
  return n ? r.reverse() : [r[0], ...r.slice(1).reverse()];
}, Ee = (e) => {
  let t = new v();
  const { origin: n } = e, [r, s] = n, { translate: i } = e, { rotate: o } = e, { skew: a } = e, { scale: l } = e;
  return Array.isArray(i) && i.length >= 2 && i.every((c) => !Number.isNaN(+c)) && i.some((c) => c !== 0) ? t = t.translate(...i) : typeof i == "number" && !Number.isNaN(i) && (t = t.translate(i)), (o || a || l) && (t = t.translate(r, s), Array.isArray(o) && o.length >= 2 && o.every((c) => !Number.isNaN(+c)) && o.some((c) => c !== 0) ? t = t.rotate(...o) : typeof o == "number" && !Number.isNaN(o) && (t = t.rotate(o)), Array.isArray(a) && a.length === 2 && a.every((c) => !Number.isNaN(+c)) && a.some((c) => c !== 0) ? (t = a[0] ? t.skewX(a[0]) : t, t = a[1] ? t.skewY(a[1]) : t) : typeof a == "number" && !Number.isNaN(a) && (t = t.skewX(a)), Array.isArray(l) && l.length >= 2 && l.every((c) => !Number.isNaN(+c)) && l.some((c) => c !== 1) ? t = t.scale(...l) : typeof l == "number" && !Number.isNaN(l) && (t = t.scale(l)), t = t.translate(-r, -s)), t;
}, je = (e, t) => {
  let n = v.Translate(...t.slice(0, -1));
  return [, , , n.m44] = t, n = e.multiply(n), [n.m41, n.m42, n.m43, n.m44];
}, Et = (e, t, n) => {
  const [r, s, i] = n, [o, a, l] = je(e, [...t, 0, 1]), c = o - r, m = a - s, u = l - i;
  return [
    // protect against division by ZERO
    c * (Math.abs(i) / Math.abs(u) || 1) + r,
    m * (Math.abs(i) / Math.abs(u) || 1) + s
  ];
}, jt = (e, t) => {
  let n = 0, r = 0, s, i, o, a, l, c;
  const m = Q(e), u = t && Object.keys(t);
  if (!t || u && !u.length)
    return [...m];
  const y = z(m);
  if (!t.origin) {
    const { origin: M } = mt;
    Object.assign(t, { origin: M });
  }
  const g = Ee(t), { origin: f } = t, h = { ...ut };
  let x = [], p = 0, b = "", A = [];
  const d = [];
  if (!g.isIdentity) {
    for (s = 0, o = m.length; s < o; s += 1) {
      x = m[s], m[s] && ([b] = x), d[s] = b, b === "A" && (x = ot(y[s], h), m[s] = ot(y[s], h), Mt(m, d, s), y[s] = ot(y[s], h), Mt(y, d, s), o = Math.max(m.length, y.length)), x = y[s], p = x.length, h.x1 = +x[p - 2], h.y1 = +x[p - 1], h.x2 = +x[p - 4] || h.x1, h.y2 = +x[p - 3] || h.y1;
      const M = {
        s: m[s],
        c: m[s][0],
        x: h.x1,
        y: h.y1
      };
      A = [...A, M];
    }
    return A.map((M) => {
      if (b = M.c, x = M.s, b === "L" || b === "H" || b === "V")
        return [l, c] = Et(g, [M.x, M.y], f), n !== l && r !== c ? x = ["L", l, c] : r === c ? x = ["H", l] : n === l && (x = ["V", c]), n = l, r = c, x;
      for (i = 1, a = x.length; i < a; i += 2)
        [n, r] = Et(g, [+x[i], +x[i + 1]], f), x[i] = n, x[i + 1] = r;
      return x;
    });
  }
  return [...m];
}, ze = (e) => {
  const n = e.slice(0, 2), r = e.slice(2, 4), s = e.slice(4, 6), i = e.slice(6, 8), o = j(n, r, 0.5), a = j(r, s, 0.5), l = j(s, i, 0.5), c = j(o, a, 0.5), m = j(a, l, 0.5), u = j(c, m, 0.5);
  return [
    ["C", ...o, ...c, ...u],
    ["C", ...m, ...l, ...i]
  ];
};
class w {
  /**
   * @constructor
   * @param {string} pathValue the path string
   * @param {any} config instance options
   */
  constructor(t, n) {
    const r = n || {}, s = typeof t > "u";
    if (s || !t.length)
      throw TypeError(`${k}: "pathValue" is ${s ? "undefined" : "empty"}`);
    const i = Z(t);
    this.segments = i;
    const { width: o, height: a, cx: l, cy: c, cz: m } = this.getBBox(), { round: u, origin: y } = r;
    let g;
    if (u === "auto") {
      const h = `${Math.floor(Math.max(o, a))}`.length;
      g = h >= 4 ? 0 : 4 - h;
    } else
      Number.isInteger(u) || u === "off" ? g = u : g = mt.round;
    let f;
    if (Array.isArray(y) && y.length >= 2) {
      const [h, x, p] = y.map(Number);
      f = [
        Number.isNaN(h) ? l : h,
        Number.isNaN(x) ? c : x,
        Number.isNaN(p) ? m : p
      ];
    } else
      f = [l, c, m];
    return this.round = g, this.origin = f, this;
  }
  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  getBBox() {
    return $t(this.segments);
  }
  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength() {
    return X(this.segments);
  }
  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @returns the requested point
   */
  getPointAtLength(t) {
    return V(this.segments, t);
  }
  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments: t } = this;
    return this.segments = Q(t), this;
  }
  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments: t } = this;
    return this.segments = Nt(t), this;
  }
  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments: t } = this;
    return this.segments = ct(t), this;
  }
  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(t) {
    this.toAbsolute();
    const { segments: n } = this, r = qt(n), s = r.length > 1 ? r : !1, i = s ? [...s].map((a, l) => t ? l ? it(a) : [...a] : it(a)) : [...n];
    let o = [];
    return s ? o = i.flat(1) : o = t ? n : it(n), this.segments = [...o], this;
  }
  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @public
   */
  normalize() {
    const { segments: t } = this;
    return this.segments = z(t), this;
  }
  /**
   * Optimize `pathArray` values:
   * * convert segments to absolute and/or relative values
   * * select segments with shortest resulted string
   * * round values to the specified `decimals` option value
   *
   * @public
   */
  optimize() {
    const { segments: t } = this;
    return this.segments = Ot(t, this.round), this;
  }
  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick refference
   *
   * @param source a `transformObject`as described above
   * @public
   */
  transform(t) {
    if (!t || typeof t != "object" || typeof t == "object" && !["translate", "rotate", "skew", "scale"].some((l) => l in t))
      return this;
    const {
      segments: n,
      origin: [r, s, i]
    } = this, o = {};
    for (const [l, c] of Object.entries(t))
      l === "skew" && Array.isArray(c) || (l === "rotate" || l === "translate" || l === "origin" || l === "scale") && Array.isArray(c) ? o[l] = c.map(Number) : l !== "origin" && typeof Number(c) == "number" && (o[l] = Number(c));
    const { origin: a } = o;
    if (Array.isArray(a) && a.length >= 2) {
      const [l, c, m] = a.map(Number);
      o.origin = [Number.isNaN(l) ? r : l, Number.isNaN(c) ? s : c, m || i];
    } else
      o.origin = [r, s, i];
    return this.segments = jt(n, o), this;
  }
  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    return this.transform({ rotate: [0, 180, 0] }), this;
  }
  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    return this.transform({ rotate: [180, 0, 0] }), this;
  }
  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return At(this.segments, this.round);
  }
}
// bring main utilities to front
N(w, "CSSMatrix", v), N(w, "getPathBBox", $t), N(w, "getPathArea", Kt), N(w, "getTotalLength", X), N(w, "getDrawDirection", Ae), N(w, "getPointAtLength", V), N(w, "pathLengthFactory", ft), N(w, "getPropertiesAtLength", Ct), N(w, "getPropertiesAtPoint", yt), N(w, "polygonLength", le), N(w, "polygonArea", ce), N(w, "getClosestPoint", Ne), N(w, "getSegmentOfPoint", we), N(w, "getSegmentAtLength", ve), N(w, "isPointInStroke", Pe), N(w, "isValidPath", Vt), N(w, "isPathArray", _), N(w, "isAbsoluteArray", wt), N(w, "isRelativeArray", _t), N(w, "isCurveArray", Ut), N(w, "isNormalizedArray", vt), N(w, "shapeToPath", Se), N(w, "shapeToPathArray", Wt), N(w, "parsePathString", Z), N(w, "roundPath", at), N(w, "splitPath", qt), N(w, "splitCubic", ze), N(w, "optimizePath", Ot), N(w, "reverseCurve", Oe), N(w, "reversePath", it), N(w, "normalizePath", z), N(w, "transformPath", jt), N(w, "pathToAbsolute", Q), N(w, "pathToRelative", Nt), N(w, "pathToCurve", ct), N(w, "pathToString", At), N(w, "arcToCubic", Pt);
export {
  w as default
};
//# sourceMappingURL=svg-path-commander.mjs.map

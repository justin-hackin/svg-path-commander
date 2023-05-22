import { PathArray, TransformObjectValues } from './types';
import { Options, PathBBox, TransformEntries, TransformObject } from './interface';
import defaultOptions from './options/options';

import error from './parser/error';
import parsePathString from './parser/parsePathString';

import polygonArea from './math/polygonArea';
import polygonLength from './math/polygonLength';

import CSSMatrix from '@thednp/dommatrix';
import getPathBBox from './util/getPathBBox';
import getPathArea from './util/getPathArea';
import getTotalLength from './util/getTotalLength';
import getDrawDirection from './util/getDrawDirection';
import getPointAtLength from './util/getPointAtLength';
import pathLengthFactory from './util/pathLengthFactory';

import getPropertiesAtLength from './util/getPropertiesAtLength';
import getPropertiesAtPoint from './util/getPropertiesAtPoint';
import getClosestPoint from './util/getClosestPoint';
import getSegmentOfPoint from './util/getSegmentOfPoint';
import getSegmentAtLength from './util/getSegmentAtLength';
import isPointInStroke from './util/isPointInStroke';

import isValidPath from './util/isValidPath';
import isPathArray from './util/isPathArray';
import isAbsoluteArray from './util/isAbsoluteArray';
import isRelativeArray from './util/isRelativeArray';
import isCurveArray from './util/isCurveArray';
import isNormalizedArray from './util/isNormalizedArray';
import shapeToPathArray from './util/shapeToPathArray';
import shapeToPath from './util/shapeToPath';

import roundPath from './process/roundPath';
import splitPath from './process/splitPath';
import optimizePath from './process/optimizePath';
import reverseCurve from './process/reverseCurve';
import reversePath from './process/reversePath';
import normalizePath from './process/normalizePath';
import transformPath from './process/transformPath';
import splitCubic from './process/splitCubic';
import arcToCubic from './process/arcToCubic';

import pathToAbsolute from './convert/pathToAbsolute';
import pathToRelative from './convert/pathToRelative';
import pathToCurve from './convert/pathToCurve';
import pathToString from './convert/pathToString';

/**
 * Creates a new SVGPathCommander instance with the following properties:
 * * segments: `pathArray`
 * * round: number
 * * origin: [number, number, number?]
 *
 * @class
 * @author thednp <https://github.com/thednp/svg-path-commander>
 * @returns {SVGPathCommander} a new SVGPathCommander instance
 */
class SVGPathCommander {
  // bring main utilities to front
  public static CSSMatrix = CSSMatrix;
  public static getPathBBox = getPathBBox;
  public static getPathArea = getPathArea;
  public static getTotalLength = getTotalLength;
  public static getDrawDirection = getDrawDirection;
  public static getPointAtLength = getPointAtLength;
  public static pathLengthFactory = pathLengthFactory;
  public static getPropertiesAtLength = getPropertiesAtLength;
  public static getPropertiesAtPoint = getPropertiesAtPoint;
  public static polygonLength = polygonLength;
  public static polygonArea = polygonArea;
  public static getClosestPoint = getClosestPoint;
  public static getSegmentOfPoint = getSegmentOfPoint;
  public static getSegmentAtLength = getSegmentAtLength;
  public static isPointInStroke = isPointInStroke;
  public static isValidPath = isValidPath;
  public static isPathArray = isPathArray;
  public static isAbsoluteArray = isAbsoluteArray;
  public static isRelativeArray = isRelativeArray;
  public static isCurveArray = isCurveArray;
  public static isNormalizedArray = isNormalizedArray;
  public static shapeToPath = shapeToPath;
  public static shapeToPathArray = shapeToPathArray;
  public static parsePathString = parsePathString;
  public static roundPath = roundPath;
  public static splitPath = splitPath;
  public static splitCubic = splitCubic;
  public static optimizePath = optimizePath;
  public static reverseCurve = reverseCurve;
  public static reversePath = reversePath;
  public static normalizePath = normalizePath;
  public static transformPath = transformPath;
  public static pathToAbsolute = pathToAbsolute;
  public static pathToRelative = pathToRelative;
  public static pathToCurve = pathToCurve;
  public static pathToString = pathToString;
  public static arcToCubic = arcToCubic;
  // declare class properties
  declare segments: PathArray;
  declare round: number | 'off';
  declare origin: [number, number, number];

  /**
   * @constructor
   * @param {string} pathValue the path string
   * @param {any} config instance options
   */
  constructor(pathValue: string, config?: Partial<Options>) {
    const instanceOptions = config || {};
    const undefPath = typeof pathValue === 'undefined';

    if (undefPath || !pathValue.length) {
      throw TypeError(`${error}: "pathValue" is ${undefPath ? 'undefined' : 'empty'}`);
    }

    const segments = parsePathString(pathValue);
    // if (typeof segments === 'string') {
    //   throw TypeError(segments);
    // }

    this.segments = segments;

    const { width, height, cx, cy, cz } = this.getBBox();

    // set instance options.round
    const { round: roundOption, origin: originOption } = instanceOptions;
    let round: number | 'off';

    if (roundOption === 'auto') {
      const pathScale = `${Math.floor(Math.max(width, height))}`.length;
      round = pathScale >= 4 ? 0 : 4 - pathScale;
    } else if (Number.isInteger(roundOption) || roundOption === 'off') {
      round = roundOption as number | 'off';
    } else {
      round = defaultOptions.round as number;
    }

    // set instance options.origin
    // the SVGPathCommander class will always override the default origin
    let origin: [number, number, number];
    if (Array.isArray(originOption) && originOption.length >= 2) {
      const [originX, originY, originZ] = originOption.map(Number);
      origin = [
        !Number.isNaN(originX) ? originX : cx,
        !Number.isNaN(originY) ? originY : cy,
        !Number.isNaN(originZ) ? originZ : cz,
      ];
    } else {
      origin = [cx, cy, cz];
    }

    this.round = round;
    this.origin = origin;

    return this;
  }

  /**
   * Returns the path bounding box, equivalent to native `path.getBBox()`.
   *
   * @public
   * @returns the pathBBox
   */
  getBBox(): PathBBox {
    return getPathBBox(this.segments);
  }

  /**
   * Returns the total path length, equivalent to native `path.getTotalLength()`.
   *
   * @public
   * @returns the path total length
   */
  getTotalLength() {
    return getTotalLength(this.segments);
  }

  /**
   * Returns an `{x,y}` point in the path stroke at a given length,
   * equivalent to the native `path.getPointAtLength()`.
   *
   * @public
   * @param length the length
   * @returns the requested point
   */
  getPointAtLength(length: number): { x: number; y: number } {
    return getPointAtLength(this.segments, length);
  }

  /**
   * Convert path to absolute values
   *
   * @public
   */
  toAbsolute() {
    const { segments } = this;
    this.segments = pathToAbsolute(segments);
    return this;
  }

  /**
   * Convert path to relative values
   *
   * @public
   */
  toRelative() {
    const { segments } = this;
    this.segments = pathToRelative(segments);
    return this;
  }

  /**
   * Convert path to cubic-bezier values. In addition, un-necessary `Z`
   * segment is removed if previous segment extends to the `M` segment.
   *
   * @public
   */
  toCurve() {
    const { segments } = this;
    this.segments = pathToCurve(segments);
    return this;
  }

  /**
   * Reverse the order of the segments and their values.
   *
   * @param onlySubpath option to reverse all sub-paths except first
   * @public
   */
  reverse(onlySubpath?: boolean) {
    this.toAbsolute();

    const { segments } = this;
    const split = splitPath(segments);
    const subPath = split.length > 1 ? split : false;

    const absoluteMultiPath = subPath
      ? [...subPath].map((x, i) => {
          if (onlySubpath) {
            // return i ? reversePath(x) : parsePathString(x);
            return i ? reversePath(x) : [...x];
          }
          return reversePath(x);
        })
      : [...segments];

    let path = [];
    if (subPath) {
      path = absoluteMultiPath.flat(1);
    } else {
      path = onlySubpath ? segments : reversePath(segments);
    }

    this.segments = [...path] as PathArray;
    return this;
  }

  /**
   * Normalize path in 2 steps:
   * * convert `pathArray`(s) to absolute values
   * * convert shorthand notation to standard notation
   *
   * @public
   */
  normalize() {
    const { segments } = this;
    this.segments = normalizePath(segments);
    return this;
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
    const { segments } = this;

    this.segments = optimizePath(segments, this.round);
    return this;
  }

  /**
   * Transform path using values from an `Object` defined as `transformObject`.
   *
   * @see TransformObject for a quick refference
   *
   * @param source a `transformObject`as described above
   * @public
   */
  transform(source?: Partial<TransformObject>) {
    if (
      !source ||
      typeof source !== 'object' ||
      (typeof source === 'object' && !['translate', 'rotate', 'skew', 'scale'].some(x => x in source))
    )
      return this;

    const {
      segments,
      origin: [cx, cy, cz],
    } = this;
    const transform = {} as TransformObjectValues;
    for (const [k, v] of Object.entries(source) as TransformEntries) {
      if (k === 'skew' && Array.isArray(v)) {
        transform[k] = v.map(Number) as [number, number];
      } else if ((k === 'rotate' || k === 'translate' || k === 'origin' || k === 'scale') && Array.isArray(v)) {
        transform[k] = v.map(Number) as [number, number, number];
      } else if (k !== 'origin' && typeof Number(v) === 'number') transform[k] = Number(v);
    }

    // if origin is not specified
    // it's important that we have one
    const { origin } = transform;

    if (Array.isArray(origin) && origin.length >= 2) {
      const [originX, originY, originZ] = origin.map(Number);
      transform.origin = [!Number.isNaN(originX) ? originX : cx, !Number.isNaN(originY) ? originY : cy, originZ || cz];
    } else {
      transform.origin = [cx, cy, cz];
    }

    this.segments = transformPath(segments, transform);
    return this;
  }

  /**
   * Rotate path 180deg vertically
   *
   * @public
   */
  flipX() {
    this.transform({ rotate: [0, 180, 0] });
    return this;
  }

  /**
   * Rotate path 180deg horizontally
   *
   * @public
   */
  flipY() {
    this.transform({ rotate: [180, 0, 0] });
    return this;
  }

  /**
   * Export the current path to be used
   * for the `d` (description) attribute.
   *
   * @public
   * @return the path string
   */
  toString() {
    return pathToString(this.segments, this.round);
  }
}

export default SVGPathCommander;

# SVG Path Commander

[![SVG Path Commander](img/apple-touch-icon.png)](https://thednp.github.io/svg-path-commander/)

A modern set of ES6/ES7 JavaScript tools for manipulating *SVGPathElement* `d` (description) attribute, developed to solve over-optimized path strings and provide a solid solution for parsing, normalizing, converting, transforming and reversing *SVGPathElement* draw direction and produce reusable path strings with lossless quality.

*SVGPathCommander* implements the [DOMMatrix API](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) on a modern browser and falls back to an updated [CSSMatrix shim](https://github.com/arian/CSSMatrix/) on older browsers as well as Node.js environment. The reasons for this implementation:
* WebKitCSSMatrix and SVGMatrix APIs will merge into DOMMatrix and this modern API calls for modern implementations;
* in the future we might actually be able to apply a [3D transformation](https://github.com/ndebeiss/svg3d) matrix to SVG path commands;
* most tools available are outdated and inefficient for relying on older APIs or incompatible with today's modern web.

This library is available on [CDN](https://www.jsdelivr.com/package/npm/svg-path-commander) and [npm](https://www.npmjs.com/package/svg-path-commander). 

[![NPM Version](https://img.shields.io/npm/v/svg-path-commander.svg?style=flat-square)](https://www.npmjs.com/package/svg-path-commander)
[![NPM Downloads](https://img.shields.io/npm/dm/svg-path-commander.svg?style=flat-square)](http://npm-stat.com/charts.html?svg-path-commander)
[![jsDeliver](https://data.jsdelivr.com/v1/package/npm/svg-path-commander/badge)](https://www.jsdelivr.com/package/npm/svg-path-commander)


# What is it for?

* converting and optimizing *SVGPathElement* for use on third party application; our [KUTE.js](https://github.com/thednp/kute.js) animation engine is using it to process *SVGPathElement* coordinates for [SVG morphing](https://thednp.github.io/kute.js/svgMorph.html) and [SVG cubic morphing](https://thednp.github.io/kute.js/svgCubicMorph.html);
* animators that work with SVGs and need to normalize, convert or optimize path strings;
* creators of font-icons can use it to normalize, reverse, transform and optimize SVG path strings in both Node.js and browser applications.


# Install

```
npm install svg-path-commander
```

# CDN

Find ***SVGPathCommander*** on [jsDelivr](https://www.jsdelivr.com/package/npm/svg-path-commander).


# ES6/ES7 Usage

On a regular basis, you can import, initialize and access methods, or return the values right away.

```js
// import the constructor
import SVGPathCommander from 'svg-path-commander'

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ]
}
*/
```


# Node.js

```js
// import the constructor
let SVGPathCommander = require('svg-path-commander')

let pathString = 'M0 0l50 0l50 50z';

// initializing
let mySVGPathCommanderInit = new SVGPathCommander(pathString);
/* returns => {
  segments: [ ['M',0,0], ['l',50,0], ['l',50,50], ['z'] ]
}
*/
```


# Instance Methods

The SVGPathCommander construct comes with some instance methods you can call:

* ***.toAbsolute()*** - will convert all path commands of a *SVGPathElement* with or without sub-path to ***absolute*** values; in addition it will convert `O` or shorthand `U` (ellipse) to `A` (arc) path commands, as well as `R` (catmulRom) path commands to `C` (cubicBezier), since the absolute path is used by all other tools for specific processing
* ***.toRelative()*** - will convert all path commands of a shape with or without sub-path to ***relative*** values 
* ***.reverse(onlySubpath)*** - will reverse the shape draw direction by changing the order of all path segments and their coordinates; when the `onlySubpath` option is true, it will only reverse the draw direction of subpath shapes
* ***.normalize()*** - will convert path command values to absolute and convert shorthand `S`, `T`, `H`, `V` to `C`, `Q` and `L` respectivelly
* ***.optimize()*** - will compute two `pathArray`s one with absolute and the other with relative values, then update the `pathArray` segments using the values that convert to shortest string
* ***.transform(transformObject)*** - will normalize all path commands and apply a 2D transformation matrix to all path commands
* ***.flipX()*** - will call the above `transform()` method to apply a 180deg rotation on the X axis
* ***.flipY()*** - will call the above `transform()` method to apply a 180deg rotation on the Y axis
* ***.toString()*** - will return the `pathString` of the current `pathArray`

***Examples***
```js
// reuse same init object to call different methods
// for instance convert to ABSOLUTE and return the initialization object
mySVGPathCommanderInit.toAbsolute()

// or convert to RELATIVE and return the string path directly
mySVGPathCommanderInit.toRelative().toString()

// reverse and return the string path
mySVGPathCommanderInit.reverse().toString()

// ONLY reverse subpaths and return the string path
// if the shape has no sub-path, this call will produce no effect
mySVGPathCommanderInit.reverse(1).toString()

// converts to both absolute and relative then return the shorter segment string
mySVGPathCommanderInit.optimize().toString()

// or return directly what you need
// reverse subpaths and return the optimized pathString
let myReversedPath = new SVGPathCommander(pathString).reverse(1).optimize().toString()

// flip the shape vertically and return the pathString
mySVGPathCommanderInit.flipX().toString()

// apply a skew transformation and return the pathString
mySVGPathCommanderInit.transform({skew:25}).toString()
```


# Instance Options
* `round` *Boolean* - option to enable/disable value rounding for the processing output; the default value is *TRUE*
* `decimals` *Number* - option to set a certain amount of decimals to round values to; the default value is *3*
* `origin` *Object* - `{x:Number, y:Number}` - option to set a transform origin for the transformation, by default `50% 50%` of the shape's bounding box is used; ***absolute values*** relative to a parent `SVGElement` are expected

***Example***
```js 
// disable rounding values
let mySVGPath = new SVGPathCommander('M0 0L0 0',{
  round: 0
})
// OR set a certain amount of decimals
let mySVGPath = new SVGPathCommander('M0 0L0 0',{
  decimals: 4
})

// Apply a 45deg rotation on Z axis and use a custom transform origin 
let mySVGPath = new SVGPathCommander(
    'M0 0L0 0',           // the pathString
    {
      origin: {x:50,y:50} // origin option
    }
    ).transform(
      {
        rotate:[0,0,45]   // equivalent to rotate:45
      }) 
```


# Transform Object
You can either use the *SVGPathCommander* methods to call `flipX()` or `flipY()` or sometimes you want to set some custom properties, in which case you can provide a `transformObject` *Object*

***Example***

```js
// define properties you want to transform
let transformObject = {
  scale: 0.3,
  translate: 20,
  rotate:45,
  skew:20
}

// the above is equivalent with the following
let transformObject = {
  scale: [0.3,0.3,0.3], // all axes scale
  translate: [20,0,0],  // translateX
  rotate:[0,0,45],      // rotateZ
  skew:[20,0]           // skewX
}

let myPathString = new SVGPathCommander('M0 0L0 0').transform(transformObject).toString()
```
As you can see we've provided all X, Y, Z axes values for most transform functions, but SVG currently only supports 2D transform functions. That is because again, this library implements the DOMMatrix API for calculating the values we need but have no worry, the library will make sure to get the most of it.

For simplicity reasons and other considerations, we've decided not to include support for axis specific transform functions like `rotateX` or `scaleY`, since DOMMatrix and older WebKitCSSMatrix APIs both support shorthand functions and would not make sense to .


# Advanced Usage

In most cases, you can import only the tools you need, without importing the entire library.

```js
import pathToAbsolute from 'svg-path-commander/src/convert/pathToAbsolute.js'
import pathToString from 'svg-path-commander/src/convert/pathToString.js'

let mySVGAbsolutePath = pathToString(pathToAbsolute(pathString))
```

# Determine Shape Draw Direction
When reversing path strings, you might want to know their draw direction first:

```js
import pathToCurve from 'svg-path-commander/src/convert/pathToCurve.js'
import getDrawDirection from 'svg-path-commander/src/util/getDrawDirection.js'

// init
let shapeDrawDirection = getDrawDirection(pathToCurve(pathString))
// => returns TRUE if shape draw direction is clockwise or FALSE otherwise
```


# Tools

When using the library as a module, type in "SVGPathCommander." in your browser console and have a look, there are a wide range of tools to play with. 
Here are some notable utilities:

* `SVGPathCommander.parsePathString(pathString,decimals)` - returns a *pathArray* which is used by all of ***SVGPathCommander*** processing tools;
* `SVGPathCommander.pathToAbsolute(pathString|pathArray,decimals)` - returns a new *pathArray* having all path commands as **absolute** coordinates;
* `SVGPathCommander.pathToRelative(pathString|pathArray,decimals)` - returns a new *pathArray* having all path commands as **relative** coordinates;
* `SVGPathCommander.pathToCurve(pathString|pathArray,decimals)` - returns a new *pathArray* having all path commands converted to cubicBezier (`C`) and absolute values;
* `SVGPathCommander.clonePath(pathArray)` - returns a **deep clone** of a *pathArray*, which is the result of any of the above functions;
* `SVGPathCommander.roundPath(pathArray,decimals)` - returns a new *pathArray* with all float path command values rounded to 3 decimals by default, or provide a number to be used as the amount of decimals to round values to;
* `SVGPathCommander.reversePath(pathString|pathArray,decimals)` - returns a new *pathArray* with all path commands having absolute values and in reverse order, but only for a single M->Z shape, for paths having sub-path(s) you need to use `pathToAbsolute` -> `pathToString` -> `splitPath` -> `reversePath` for each subpath;
* `SVGPathCommander.optimizePath(pathArray)` - returns a new *pathArray* with all segments that have the shortest strings from either absolute or relative `pathArray` segments
* `SVGPathCommander.normalizePath(pathString|pathArray,decimals)` - returns a new *pathArray* with all shorthand path command segments such as `S`, `T` are converted to `C` and `Q` respectively, `V` and `H` to `L`, all in absolute values; the utility is used by `pathToCurve` and `reversePath`;
* `SVGPathCommander.getDrawDirection(pathCurveArray)` - returns **TRUE** if a shape draw direction is **clockwise**, it should not be used for shapes with sub-paths, but each path/sub-path individually;
* `SVGPathCommander.getPathBBox(pathCurveArray)` - returns the bounding box of a shape in the form of the following object: `{x1,y1, x2,y2, width,height, cx,cy}`, where *cx* &amp; *cy* are the shape's center point;
* `SVGPathCommander.splitPath(pathString)` - returns an *Array* of sub-path strings;
*There are other tools not exported to SVGPathCommander object, some of which would like to have access to a mockup browser.*


# Custom Builds
You can now build your own custom builds, go to the root of `svg-path-commander` and type

`npm run custom-build INPUTFILE:src/index-custom.js,OUTPUTFILE:path-to/svg-path-commander-custom.js,FORMAT:umd,MIN:false`

* *INPUTFILE* - specify your custom build path, (create a copy of `src/index.js` to `src/index-custom.js` with your desired version);
* *OUTPUTFILE* - specify the path to the file you want to build into;
* *FORMAT* - specify either `umd`,`cjs`,`iife`, you know the thing;
* *MIN* - set `TRUE`/`FALSE` to minify the output or NOT.


# Technical Considerations
* as mentioned above, the `optimize()` method will not simplify/merge the path commands or determine and create shorthand notations; you might need [SVGO](https://github.com/svg/svgo) and its `convertPathData` plugin;
* all tools processing path segments will always round float values to 3 decimals, remember: ***only float numbers***; EG: 0.5666 => 0.566, 0.50 => 0.5, 5 => 5; you can change the default option with `SVGPathCommander.options.decimals = 2` or remove the value rounding all together with `SVGPathCommander.options.round = 0`;
* the `getSVGMatrix` utility will always compute the matrix by applying the transform functions in the following order: `translate`, `rotate`, `skew` and `scale`, which is the default composition/recomposition order specified in the W3C draft;
* other processing you might use, not included with *SVGPathCommander*, may require the `SVGMatrix` or `SVGPathElement` APIs (those that do are not exported to global), these will likelly need a mockup browser in Node.js environment;
* this script is very fast and superior to its ancestors in many ways


# Special Thanks

* Dmitry Baranovskiy for his [Raphael.js](https://dmitrybaranovskiy.github.io/raphael/)
* Vitaly Puzrin & Alex Kocharin for their [SvgPath](https://github.com/fontello/svgpath)
* Jürg Lehni & Jonathan Puckey for their [Paper.js](https://github.com/paperjs/paper.js/)
* Andrew Willems for his [awesome guide](https://stackoverflow.com/users/5218951/andrew-willems)
* Mike 'Pomax' Kamermans for his awesome [svg-path-reverse](https://github.com/Pomax/svg-path-reverse) and [bezierjs](https://github.com/Pomax/bezierjs)

# License
SVGPathCommander is released under [MIT Licence](https://github.com/thednp/svg-path-commander/blob/master/LICENSE).
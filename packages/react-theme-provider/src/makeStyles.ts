import hashString from '@emotion/hash';
import { Properties as CSSProperties } from 'csstype';
// @ts-ignore
import { expand } from 'inline-style-expand-shorthand';
import { convertProperty } from 'rtl-css-js/core';

import { compileCSS, hyphenateProperty } from './runtime/compileCSS';
import { insertStyles } from './insertStyles';

// /make-styles
//   /babel - contains babel plugin/preset for built time - 0 kb
//   /runtime - in dev contains all required utils, in prod - noop i.e. 0kb
//   /runtime-ie11 - in dev - alias to runtime, in prod - optimized runtime 20kb

//
//
//

export type Renderer = {
  cache: Record<string, [string, string]>;
  node: HTMLStyleElement;
  index: number;
};
const targets = new WeakMap<Document, Renderer>();

export function createTarget(targetDocument: Document): Renderer {
  let target = targets.get(targetDocument);

  if (target) {
    return target;
  }

  const node = targetDocument.createElement('style');

  node.setAttribute('FCSS', 'RULE');
  targetDocument.head.appendChild(node);

  target = { cache: {}, node, index: 0 };

  targets.set(targetDocument, target);

  return target;
}

//
//
//

function isObject(val: any) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

//
//
//

const canUseCSSVariables = window.CSS && CSS.supports('color', 'var(--c)');

//
// IE11 specific
//

// Create graph of inputs to map to output.
const graph = new Map();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const graphGet = (graphNode: Map<any, any>, path: any[]): any | undefined => {
  for (const key of path) {
    graphNode = graphNode.get(key);

    if (!graphNode) {
      return;
    }
  }

  return graphNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const graphSet = (graphNode: Map<any, any>, path: any[], value: any) => {
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];

    let current = graphNode.get(key);

    if (!current) {
      current = new Map();

      graphNode.set(key, current);
    }

    graphNode = current;
  }

  graphNode.set(path[path.length - 1], value);
};

//
//
//

const regex = /^(:|\[|>|&)/;

function isNestedSelector(property: string): boolean {
  return regex.test(property);
}

function isMediaQuery(property: string): boolean {
  return property.substr(0, 6) === '@media';
}

function normalizeNestedProperty(nestedProperty: string): string {
  if (nestedProperty.charAt(0) === '&') {
    return nestedProperty.slice(1);
  }

  return nestedProperty;
}

function createCSSVariablesProxy(tokens: any) {
  const g = {
    // @ts-ignore
    get(target: any, key: any) {
      if (isObject(target[key])) {
        return new Proxy({ ...target[key], value: (target.value ?? '') + '-' + key }, g);
      }

      return `var(--theme${target.value ?? ''}-${key})`;
    },
  };

  return new Proxy(tokens, g);
}

const HASH_PREFIX = 'a';

//
//
//

function cssifyObject(style: any) {
  let css = '';

  for (const property in style) {
    const value = style[property];

    if (typeof value !== 'string' && typeof value !== 'number') {
      continue;
    }

    // prevents the semicolon after
    // the last rule declaration
    if (css) {
      css += ';';
    }

    css += hyphenateProperty(property) + ':' + value;
  }

  return css;
}

function objectReduce(obj, reducer, initialValue) {
  for (var key in obj) {
    initialValue = reducer(initialValue, obj[key], key, obj);
  }

  return initialValue;
}

function cssifyKeyframeRule(frames: Object) {
  return objectReduce(frames, (css, frame, percentage) => `${css}${percentage}{${cssifyObject(frame)}}`, '');
}

function resolveStyles(styles: any, selector = '', result: any = {}): any {
  const expandedStyles = expand(styles);
  const properties = Object.keys(expandedStyles) as (keyof CSSProperties)[];

  properties.forEach(propName => {
    const propValue = expandedStyles[propName];

    if (propValue == null) {
    } else if (isObject(propValue)) {
      if (isNestedSelector(propName)) {
        // console.log(
        //   'nested selectors',
        //   propName,
        //   propValue,
        // );
        resolveStyles(propValue, selector + normalizeNestedProperty(propName), result);
      } else if (isMediaQuery(propName)) {
        resolveStyles(propValue, selector + propName, result);
      } else if (propName === 'animationName') {
        const keyframe = cssifyKeyframeRule(propValue); // TODO: support RTL!
        const animationName = HASH_PREFIX + hashString(keyframe);

        // TODO call Stylis for prefixing
        const keyframeCSS = `@keyframes ${animationName}{${keyframe}}`;

        result[animationName] = [animationName, keyframeCSS /* rtlCSS */];

        console.log('prop', propName, propValue, `@keyframes ${animationName}{${keyframe}}`);

        resolveStyles({ animationName }, selector, result);
      }
      // TODO: support support queries
    } else if (typeof propValue === 'string' || typeof propValue === 'number') {
      // uniq key based on property & selector, used for merging later
      const key = selector + propName;

      const className = HASH_PREFIX + hashString(selector + propName + propValue);
      const css = compileCSS(className, selector, propName, propValue);

      const rtl = convertProperty(propName, propValue);
      const flippedInRtl = rtl.key !== propName || rtl.value !== propValue;

      if (flippedInRtl) {
        const rtlCSS = compileCSS('r' + className, selector, rtl.key, rtl.value);

        // There is no sense to store RTL className as it's "r" + regular className
        result[key] = [className, css, rtlCSS];
      } else {
        result[key] = [className, css];
      }

      // console.log('EVAL', selector, propName, propValue);
      // console.log('KEY', key);
      // console.log('CSS', css);

      // }
    }
  });

  return result;
}

function resolveStylesToClasses(definitions: any[], tokens: any) {
  const resolvedStyles = definitions.map((definition, i) => {
    const matchers = definition[0];
    const styles = definition[1];
    const resolvedStyles = definition[2];

    const areTokenDependantStyles = typeof styles === 'function';

    if (canUseCSSVariables) {
      // we can always use prebuilt styles in this case and static cache in runtime

      if (resolvedStyles) {
        return [matchers, null, resolvedStyles];
      }

      // if static cache is not present, eval it and mutate original object
      definitions[i][2] = resolveStyles(areTokenDependantStyles ? styles(tokens) : styles);

      return [matchers, null, definition[2]];
    }

    // if CSS variables are not supported we have to re-eval only functions, otherwise static cache can be reused
    if (areTokenDependantStyles) {
      // An additional level of cache based on tokens to avoid style computation for IE11

      const path = [tokens, styles];
      const resolvedStyles = graphGet(graph, path);

      if (resolvedStyles) {
        return [matchers, resolvedStyles];
      }

      const resolveStyles1 = resolveStyles(styles(tokens));
      graphSet(graph, path, resolveStyles1);

      return [matchers, null, resolveStyles1];
    }

    if (resolvedStyles) {
      return [matchers, null, resolvedStyles];
    }

    definitions[i][2] = resolveStyles(styles);

    return [matchers, null, definition[2]];
  });

  // @ts-ignore
  resolvedStyles.mapping = definitions.mapping;

  return resolvedStyles;
}

/**
 * TODO: Update it with something proper...
 * CAN WORK WITHOUT REACT!
 */
export function makeNonReactStyles(styles: any) {
  const cxCache: Record<string, string> = {};

  return function ___(selectors: any, options: any, ...classNames: (string | undefined)[]): string {
    // If CSS variables are present we can use CSS variables proxy like in build time

    let tokens;
    let resolvedStyles;

    if (process.env.NODE_ENV === 'production') {
      tokens = canUseCSSVariables ? null : options.tokens;
      resolvedStyles = canUseCSSVariables ? styles : resolveStylesToClasses(styles, tokens);
    } else {
      tokens = canUseCSSVariables ? createCSSVariablesProxy(options.tokens) : options.tokens;
      resolvedStyles = resolveStylesToClasses(styles, tokens);
    }

    // Dumper for static styles
    // @ts-ignore
    // console.log(JSON.stringify(resolvedStyles.map(d => [d[0], null, d[1]])));
    // @ts-ignore
    // console.log(JSON.stringify(resolvedStyles.mapping));

    let nonMakeClasses: string = '';
    const overrides: any = {};
    let overridesCx = '';

    classNames.forEach(className => {
      if (typeof className === 'string') {
        if (className === '') {
          return;
        }

        className.split(' ').forEach(cName => {
          if (options.target.cache[cName] !== undefined) {
            overrides[options.target.cache[cName][0]] = options.target.cache[cName][1];
            overridesCx += cName;
          } else {
            nonMakeClasses += cName + ' ';
          }
        });
      }
    });

    // @ts-ignore
    // const selectorsMask = selectorsToBits(resolvedStyles.mapping, selectors);

    let matchedIndexes = '';

    const matchedDefinitions = resolvedStyles.reduce((acc: any, definition: any, i: any) => {
      const matcherFn = definition[0];

      if (matcherFn === null || matcherFn(selectors)) {
        acc.push(definition[2]);
        matchedIndexes += i;
      }

      return acc;
    }, []);

    const overridesHash = overridesCx === '' ? '' : overridesCx;
    const cxCacheKey = matchedIndexes + '' + overridesHash;

    if (canUseCSSVariables && cxCache[cxCacheKey] !== undefined) {
      // TODO: OOPS, Does not support MW
      return nonMakeClasses + cxCache[cxCacheKey];
    }

    const resultDefinitions = Object.assign({}, ...matchedDefinitions, overrides);
    const resultClasses = insertStyles(resultDefinitions, options.rtl, options.target);

    cxCache[cxCacheKey] = resultClasses;

    return nonMakeClasses + resultClasses;
  };
}

const defaultTarget = createTarget(document);

/*
 * A wrapper to connect to a React context. SHOULD USE unified context!!!
 */
export function makeStyles(styles: any) {
  const result = makeNonReactStyles(styles);

  return function ___(selectors: any = {}, ...classNames: string[]): string {
    return result(selectors, { rtl: false, tokens: {}, target: defaultTarget }, ...classNames);
  };
}

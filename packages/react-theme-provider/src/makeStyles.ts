import hashString from '@emotion/hash';
// @ts-ignore
import { useFluentContext } from '@fluentui/react-bindings';
import { Properties as CSSProperties } from 'csstype';
// @ts-ignore
import { expand } from 'inline-style-expand-shorthand';
// @ts-ignore
import * as _Stylis from 'stylis';
import { convertProperty } from 'rtl-css-js/core';

import { cssifyDeclaration } from './cssifyDeclaration';
import { insertStyles } from './insertStyles';

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
//
//

const Stylis = (_Stylis as any).default || _Stylis;

const stylis = new Stylis({
  cascade: false,
  compress: false,
  global: false,
  keyframe: false,
  preserve: false,
  semicolon: false,
});

//
//
//

const regex = /^(:|\[|>|&)/;

export default function isNestedSelector(property: string): boolean {
  return regex.test(property);
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

function resolveStyles(styles: any[], selector = '', result: any = {}): any {
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
      }
      // TODO: support media queries
    } else if (typeof propValue === 'string' || typeof propValue === 'number') {
      const className = HASH_PREFIX + hashString(selector + propName + propValue);

      // cssfied union of property & value, i.e. `{ color: "red" }`
      const declaration = cssifyDeclaration(propName, propValue);
      const css = stylis('', `.${className}${selector}{${declaration}}`);

      // uniq key based on property & selector, used for merging later
      const key = selector + propName;

      // TODO: what can actually flip in RTL?!
      const rtl = convertProperty(propName, propValue);
      const flippedInRtl = rtl.key !== propName || rtl.value !== propValue;

      if (flippedInRtl) {
        const declaration = cssifyDeclaration(rtl.key, rtl.value);
        const rtlCSS = stylis('', `.r${className}${selector}{${declaration}}`);

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

// function resolveMatches(styles, selectors) {
//   const matchedStyles = styles.reduce((acc, definition) => {
//
//   })
// }

function matchesSelectors(matcher: any, selectors: any): boolean {
  let matches = true;

  if (isObject(matcher)) {
    Object.keys(matcher).forEach(matcherName => {
      const matcherValue = matcher[matcherName];
      const matchesSelector =
        matcherValue == selectors[matcherName] ||
        // https://stackoverflow.com/a/19277873/6488546
        // find less tricky way
        (matcherValue === false && selectors[matcherName] == null);

      if (!matchesSelector) {
        matches = false;
      }
    });
  }

  return matches;
}

function resolveStylesToClasses(definitions: any[], tokens: any) {
  return definitions.map(definition => {
    const matchers = definition[0];
    const styles = definition[1];
    const resolvedStyles = definition[2];

    const areTokenDependantStyles = typeof styles === 'function';

    if (canUseCSSVariables) {
      // we can always use prebuilt styles in this case and static cache in runtime

      if (resolvedStyles) {
        return [matchers, resolvedStyles];
      }

      // if static cache is not present, eval it and mutate original object

      definition[2] = resolveStyles(areTokenDependantStyles ? styles(tokens) : styles);

      return [matchers, definition[2]];
    }

    // if CSS variables are not supported we have to re-eval only functions, otherwise static cache can be reused

    if (areTokenDependantStyles) {
      return [matchers, resolveStyles(styles(tokens))];
    }

    if (resolvedStyles) {
      return [matchers, resolvedStyles];
    }

    definition[2] = resolveStyles(styles);

    return [matchers, definition[2]];
  });
}

const DEFINITION_CACHE: Record<string, [string, string]> = {};

/**
 * TODO: Update it with something proper...
 * CAN WORK WITHOUT REACT!
 */
export function makeNonReactStyles(styles: any) {
  return function ___(selectors: any, options: any, ...classNames: (string | undefined)[]): string {
    // If CSS variables are present we can use CSS variables proxy like in build time
    const tokens = canUseCSSVariables ? createCSSVariablesProxy(options.tokens) : options.tokens;
    const resolvedStyles = resolveStylesToClasses(styles, tokens);

    const nonMakeClasses: string[] = [];
    const overrides: any = {};

    classNames.forEach(className => {
      if (typeof className === 'string') {
        className.split(' ').forEach(className => {
          if (DEFINITION_CACHE[className] !== undefined) {
            overrides[DEFINITION_CACHE[className][0]] = DEFINITION_CACHE[className][1];
          } else {
            nonMakeClasses.push(className);
          }
        });
      }
    });

    // console.log('classNames', classNames);
    // console.log('overrides', overrides);
    // console.log('resolvedClasses', resolvedClasses);

    // console.log(classNames, resolvedClasses, overrides);

    // TODO: make me faster???

    const matchedDefinitions = resolvedStyles.reduce((acc, definition) => {
      if (matchesSelectors(definition[0], selectors)) {
        return Object.assign(acc, definition[1]);
      }

      return acc;
    }, {});
    const resultDefinitions = { ...matchedDefinitions, ...overrides };

    return nonMakeClasses.join(' ') + insertStyles(resultDefinitions, DEFINITION_CACHE, options.rtl, options.target);
  };
}

/*
 * A wrapper to connect to a React context. SHOULD USE unified context!!!
 */
export function makeStyles(styles: any) {
  const result = makeNonReactStyles(styles);

  return function ___(selectors: any = {}, ...classNames: string[]): string {
    const { rtl, theme, target } = useFluentContext();

    return result(selectors, { rtl, tokens: theme.siteVariables, target }, ...classNames);
  };
}

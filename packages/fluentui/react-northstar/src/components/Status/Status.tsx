import { Accessibility, statusBehavior, StatusBehaviorProps } from '@fluentui/accessibility';
import {
  ComponentWithAs,
  getElementType,
  makeStyles,
  useUnhandledProps,
  useAccessibility,
  useTelemetry,
  useFluentContext,
} from '@fluentui/react-bindings';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { createShorthandFactory, UIComponentProps, commonPropTypes, SizeValue, pxToRem } from '../../utils';
import { ShorthandValue, FluentComponentStaticProps } from '../../types';
import { Box, BoxProps } from '../Box/Box';

export interface StatusProps extends UIComponentProps {
  /** Accessibility behavior if overridden by the user. */
  accessibility?: Accessibility<StatusBehaviorProps>;

  /** A custom color. */
  color?: string;

  /** Shorthand for the icon, to provide customizing status */
  icon?: ShorthandValue<BoxProps>;

  /** Size multiplier */
  size?: SizeValue;

  /** The pre-defined state values which can be consumed directly. */
  state?: 'success' | 'info' | 'warning' | 'error' | 'unknown';
}

export type StatusStylesProps = Pick<StatusProps, 'color' | 'size' | 'state'>;
export const statusClassName = 'ui-status';

const useStatusStyles = makeStyles([
  [
    null,
    tokens => ({
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
      verticalAlign: 'middle',

      borderRadius: '9999px',

      backgroundColor: tokens.colorScheme.default.background5,
    }),
  ],

  [{ state: 'success' }, tokens => ({ backgroundColor: tokens.colorScheme.green.background })],
  [{ state: 'info' }, tokens => ({ backgroundColor: tokens.colorScheme.brand.background })],
  [{ state: 'warning' }, tokens => ({ backgroundColor: tokens.colorScheme.yellow.background })],
  [{ state: 'error' }, tokens => ({ backgroundColor: tokens.colorScheme.red.background })],

  [{ size: 'smallest' }, { width: pxToRem(6), height: pxToRem(6) }],
  [{ size: 'smaller' }, { width: pxToRem(10), height: pxToRem(10) }],
  [{ size: 'small' }, { width: pxToRem(10), height: pxToRem(10) }],
  [{ size: 'medium' }, { width: pxToRem(10), height: pxToRem(10) }],
  [{ size: 'large' }, { width: pxToRem(10), height: pxToRem(10) }],
  [{ size: 'larger' }, { width: pxToRem(16), height: pxToRem(16) }],
  [{ size: 'largest' }, { width: 0, height: 0 }],
]);

const staticStatusStyles = [
  [
    null,
    null,
    {
      alignItems: [
        'a122n59',
        '.a122n59{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}',
      ],
      display: [
        'atuwxu6',
        '.atuwxu6{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}',
      ],
      justifyContent: [
        'a4d9j23',
        '.a4d9j23{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}',
      ],
      verticalAlign: ['amrv4ls', '.amrv4ls{vertical-align:middle;}'],
      borderRadius: ['a1chkv5c', '.a1chkv5c{border-radius:9999px;}'],
    },
  ],
  [
    null,
    tokens => ({ backgroundColor: tokens.colorScheme.default.background5 }),
    { backgroundColor: ['a55zrps', '.a55zrps{background-color:var(--theme-colorScheme-default-background5);}'] },
  ],

  [
    { state: 'success' },
    tokens => ({ backgroundColor: tokens.colorScheme.green.background }),
    { backgroundColor: ['a109hrsy', '.a109hrsy{background-color:var(--theme-colorScheme-green-background);}'] },
  ],
  [
    { state: 'info' },
    tokens => ({ backgroundColor: tokens.colorScheme.brand.background }),
    { backgroundColor: ['a1qyxj3v', '.a1qyxj3v{background-color:var(--theme-colorScheme-brand-background);}'] },
  ],
  [
    { state: 'warning' },
    tokens => ({ backgroundColor: tokens.colorScheme.yellow.background }),
    { backgroundColor: ['a1hm9uc3', '.a1hm9uc3{background-color:var(--theme-colorScheme-yellow-background);}'] },
  ],
  [
    { state: 'error' },
    tokens => ({ backgroundColor: tokens.colorScheme.red.background }),
    { backgroundColor: ['ao0oefl', '.ao0oefl{background-color:var(--theme-colorScheme-red-background);}'] },
  ],

  [
    { size: 'smallest' },
    null,
    { width: ['a1h7vuc3', '.a1h7vuc3{width:0.4286rem;}'], height: ['ac65nva', '.ac65nva{height:0.4286rem;}'] },
  ],
  [
    { size: 'smaller' },
    null,
    { width: ['a17zuqj1', '.a17zuqj1{width:0.7143rem;}'], height: ['af2ublo', '.af2ublo{height:0.7143rem;}'] },
  ],
  [
    { size: 'small' },
    null,
    { width: ['a17zuqj1', '.a17zuqj1{width:0.7143rem;}'], height: ['af2ublo', '.af2ublo{height:0.7143rem;}'] },
  ],
  [
    { size: 'medium' },
    null,
    { width: ['a17zuqj1', '.a17zuqj1{width:0.7143rem;}'], height: ['af2ublo', '.af2ublo{height:0.7143rem;}'] },
  ],
  [
    { size: 'large' },
    null,
    { width: ['a17zuqj1', '.a17zuqj1{width:0.7143rem;}'], height: ['af2ublo', '.af2ublo{height:0.7143rem;}'] },
  ],
  [
    { size: 'larger' },
    null,
    { width: ['asxa7o6', '.asxa7o6{width:1.1429rem;}'], height: ['awdvutt', '.awdvutt{height:1.1429rem;}'] },
  ],
  [{ size: 'largest' }, null, { width: ['a3tsq5r', '.a3tsq5r{width:0;}'], height: ['aniina8', '.aniina8{height:0;}'] }],
];
const useStaticStatusStyles = makeStyles(staticStatusStyles);

const useStatusIconStyles = makeStyles([
  [
    null,
    tokens => ({
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',

      color: tokens.colorScheme.default.foreground4,

      width: pxToRem(7),
      height: pxToRem(7),

      '& > :first-child': {
        height: '100%',
        width: '100%',

        '& svg': {
          height: '100%',
          width: '100%',
        },
      },
    }),
  ],

  [{ state: 'success' }, tokens => ({ color: tokens.colorScheme.green.foreground1 })],
  [{ state: 'info' }, tokens => ({ color: tokens.colorScheme.default.foreground2 })],
  [{ state: 'warning' }, tokens => ({ color: tokens.colorScheme.yellow.foreground2 })],
  [{ state: 'error' }, tokens => ({ color: tokens.colorScheme.red.foreground2 })],
]);

const staticStatusIconStyles = [
  [
    null,
    null,
    {
      alignItems: [
        'a122n59',
        '.a122n59{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}',
      ],
      display: [
        'atuwxu6',
        '.atuwxu6{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}',
      ],
      justifyContent: [
        'a4d9j23',
        '.a4d9j23{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}',
      ],
      width: ['apgmy0i', '.apgmy0i{width:0.5rem;}'],
      height: ['a1pvjp0k', '.a1pvjp0k{height:0.5rem;}'],
      ' > :first-childheight': ['afvh450', '.afvh450>:first-child{height:100%;}'],
      ' > :first-childwidth': ['a1u2zova', '.a1u2zova>:first-child{width:100%;}'],
      ' > :first-child svgheight': ['a11pmm19', '.a11pmm19>:first-child svg{height:100%;}'],
      ' > :first-child svgwidth': ['a101b0fn', '.a101b0fn>:first-child svg{width:100%;}'],
    },
  ],
  [
    null,
    tokens => ({ color: tokens.colorScheme.default.foreground4 }),
    { color: ['afnwo96', '.afnwo96{color:var(--theme-colorScheme-default-foreground4);}'] },
  ],

  [
    { state: 'success' },
    tokens => ({ color: tokens.colorScheme.green.foreground1 }),
    { color: ['a1uyxhfx', '.a1uyxhfx{color:var(--theme-colorScheme-green-foreground1);}'] },
  ],
  [
    { state: 'info' },
    tokens => ({ color: tokens.colorScheme.default.foreground2 }),
    { color: ['a19vcx5o', '.a19vcx5o{color:var(--theme-colorScheme-default-foreground2);}'] },
  ],
  [
    { state: 'warning' },
    tokens => ({ color: tokens.colorScheme.yellow.foreground2 }),
    { color: ['a17vukj9', '.a17vukj9{color:var(--theme-colorScheme-yellow-foreground2);}'] },
  ],
  [
    { state: 'error' },
    tokens => ({ color: tokens.colorScheme.red.foreground2 }),
    { color: ['a1j0lmpl', '.a1j0lmpl{color:var(--theme-colorScheme-red-foreground2);}'] },
  ],
];
const useStaticStatusIconStyles = makeStyles(staticStatusIconStyles);

/**
 * A Status represents someone's or something's state.
 *
 * @accessibility
 * Implements [ARIA img](https://www.w3.org/TR/wai-aria-1.1/#img) role.
 */
export const Status: ComponentWithAs<'span', StatusProps> & FluentComponentStaticProps = props => {
  const context = useFluentContext();
  const { setStart, setEnd } = useTelemetry(Status.displayName, context.telemetry);
  setStart();

  const { className, icon, size, state } = props;

  const rootClassName = useStatusStyles({ size, state }, statusClassName, className);
  const iconClassName = useStatusIconStyles({ size, state });

  const getA11Props = useAccessibility(props.accessibility, {
    debugName: Status.displayName,
    rtl: context.rtl,
  });
  const ElementType = getElementType(props);
  const unhandledProps = useUnhandledProps(Status.handledProps, props);

  const iconElement = Box.create(icon, {
    defaultProps: () =>
      getA11Props('icon', {
        className: iconClassName,
        as: 'span',
      }),
  });

  const element = (
    <ElementType {...getA11Props('root', { className: rootClassName, ...unhandledProps })}>{iconElement}</ElementType>
  );
  setEnd();

  return element;
};

Status.displayName = 'Status';
Status.propTypes = {
  ...commonPropTypes.createCommon({
    children: false,
    content: false,
  }),
  color: PropTypes.string,
  icon: customPropTypes.shorthandAllowingChildren,
  size: customPropTypes.size,
  state: PropTypes.oneOf(['success', 'info', 'warning', 'error', 'unknown']),
};
Status.handledProps = Object.keys(Status.propTypes) as any;
Status.defaultProps = {
  accessibility: statusBehavior,
  as: 'span',
  size: 'medium',
  state: 'unknown',
};

Status.create = createShorthandFactory({ Component: Status, mappedProp: 'state' });

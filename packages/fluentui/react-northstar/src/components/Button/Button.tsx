import { Accessibility, buttonBehavior } from '@fluentui/accessibility';
import {
  compose,
  ComponentWithAs,
  getElementType,
  makeStyles,
  useAccessibility,
  useFluentContext,
  useStyles,
  useTelemetry,
  useUnhandledProps,
  ShorthandConfig,
} from '@fluentui/react-bindings';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  childrenExist,
  createShorthandFactory,
  UIComponentProps,
  ContentComponentProps,
  ChildrenComponentProps,
  commonPropTypes,
  rtlTextContainer,
  SizeValue,
  ShorthandFactory,
  createShorthand,
  pxToRem,
} from '../../utils';
import { Box, BoxProps } from '../Box/Box';
import { Loader, LoaderProps } from '../Loader/Loader';
import { ComponentEventHandler, ShorthandValue } from '../../types';
import { ButtonGroup } from './ButtonGroup';
import { ButtonContent, ButtonContentProps } from './ButtonContent';
import { faster, ultraFast } from '../../themes/teams/animations/durations';

export interface ButtonProps
  extends UIComponentProps,
    ContentComponentProps<ShorthandValue<ButtonContentProps>>,
    ChildrenComponentProps {
  /** Accessibility behavior if overridden by the user. */
  accessibility?: Accessibility;

  /** A button can appear circular. */
  circular?: boolean;

  /** A button can show that it cannot be interacted with. */
  disabled?: boolean;

  /** A button can fill the width of its container. */
  fluid?: boolean;

  /** A button can have an icon. */
  icon?: ShorthandValue<BoxProps>;

  /** A button can contain only an icon. */
  iconOnly?: boolean;

  /** An icon button can format its Icon to appear before or after its content */
  iconPosition?: 'before' | 'after';

  /** A button that inherits its background and has a subtle appearance */
  inverted?: boolean;

  /** Shorthand to customize a button's loader. */
  loader?: ShorthandValue<LoaderProps>;

  /** A button can show a loading indicator. */
  loading?: boolean;

  /**
   * Called after a user clicks the button.
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onClick?: ComponentEventHandler<ButtonProps>;

  /**
   * Called after a user focuses the button.
   * @param event - React's original SyntheticEvent.
   * @param data - All props.
   */
  onFocus?: ComponentEventHandler<ButtonProps>;

  /** A button can emphasize that it represents the primary action. */
  primary?: boolean;

  /** A button can be formatted to show only text in order to indicate a less-pronounced action. */
  text?: boolean;

  /** A button can emphasize that it represents an alternative action. */
  secondary?: boolean;

  /** A button can be sized. */
  size?: SizeValue;
}

export type ButtonStylesProps = Pick<
  ButtonProps,
  'text' | 'primary' | 'disabled' | 'circular' | 'size' | 'loading' | 'inverted' | 'iconOnly' | 'fluid' | 'iconPosition'
> & {
  hasContent?: boolean;
};

type GetBorderFocusStylesOptions = {
  padding: string;
  radius: string;
  width: string;

  innerColor: string;
  outerColor: string;

  zIndex: string;
};

function getBorderFocusStyles(options: GetBorderFocusStylesOptions) {
  return {
    borderColor: 'transparent',

    ':before': {
      content: '""',
      position: 'absolute',
      borderStyle: 'solid',
      pointerEvents: 'none',

      borderColor: options.innerColor,
      borderRadius: options.radius,
      borderWidth: options.width,

      zIndex: options.zIndex,

      top: `calc(0px - ${options.padding})`,
      bottom: `calc(0px - ${options.padding})`,
      left: `calc(0px - ${options.padding})`,
      right: `calc(0px - ${options.padding})`,
    },

    ':after': {
      content: '""',
      position: 'absolute',
      borderStyle: 'solid',
      pointerEvents: 'none',

      borderColor: options.outerColor,
      borderRadius: options.radius,
      borderWidth: options.width,

      zIndex: options.zIndex,

      top: `calc(0px - ${options.padding} - ${options.width})`,
      bottom: `calc(0px - ${options.padding} - ${options.width})`,
      left: `calc(0px - ${options.padding} - ${options.width})`,
      right: `calc(0px - ${options.padding} - ${options.width})`,
    },
  };
}

const useButtonStyles = makeStyles([
  [
    null,
    tokens => ({
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
      position: 'relative',
      verticalAlign: 'middle',

      cursor: 'pointer',
      transition: faster,

      padding: `0 ${pxToRem(20)}`,
      height: pxToRem(32),
      minWidth: pxToRem(96),
      maxWidth: pxToRem(280),

      backgroundColor: tokens.colorScheme.default.background,
      borderColor: tokens.colorScheme.default.border,
      borderRadius: tokens.borderRadius,
      borderStyle: 'solid',
      borderWidth: tokens.borderWidth,
      boxShadow: tokens.shadowLevel1,
      color: tokens.colorScheme.default.foreground,
      outline: 0,

      '--button-border-radius': tokens.borderWidth,

      ':hover': {
        backgroundColor: tokens.colorScheme.default.backgroundHover1,
        borderColor: tokens.colorScheme.default.borderHover,
        color: tokens.colorScheme.default.foregroundHover,
      },

      ':active': {
        backgroundColor: tokens.colorScheme.default.backgroundPressed,
        borderColor: tokens.colorScheme.default.borderPressed,
        boxShadow: 'none',
        color: tokens.colorScheme.default.foregroundPressed,
        transition: ultraFast,
      },

      ':focus': { outline: 'none' },
      ':focus-visible': {
        ...getBorderFocusStyles({
          innerColor: tokens.focusInnerBorderColor,
          outerColor: tokens.focusOuterBorderColor,

          padding: 'var(--button-border-radius)',
          radius: tokens.borderRadius,
          width: tokens.borderWidth,

          zIndex: tokens.zIndexes.foreground,
        }),

        // backgroundColor: v.backgroundColorFocus,
        // borderColor: v.borderColorFocus,
        borderWidth: tokens.borderWidth,
        // color: v.colorFocus,

        ':hover': {
          borderColor: tokens.colorScheme.default.borderHover,
        },
      },
    }),
  ],

  [p => p.circular, { '--button-border-radius': pxToRem(4) }],
  [p => p.loading, { minWidth: pxToRem(118) }],

  [
    p => p.size === 'small',
    {
      boxShadow: 'none',
      height: pxToRem(24),
      minWidth: pxToRem(72),
      padding: `0 ${pxToRem(8)}`,
    },
  ],

  [p => p.size === 'small', { boxShadow: 'none' }],

  [
    p => p.primary,
    tokens => ({
      backgroundColor: tokens.colorScheme.brand.background,
      borderColor: 'transparent',
      boxShadow: tokens.shadowLevel1Dark,
      color: tokens.colorScheme.brand.foreground4,

      ':active': {
        backgroundColor: tokens.colorScheme.brand.backgroundPressed,
        boxShadow: 'none',
        transition: ultraFast,
      },

      ':focus': { outline: 'none' },
      ':focus-visible': {
        ...getBorderFocusStyles({
          innerColor: tokens.focusInnerBorderColor,
          outerColor: tokens.focusOuterBorderColor,

          padding: 'var(--button-border-radius)',
          radius: tokens.borderRadius,
          width: tokens.borderWidth,

          zIndex: tokens.zIndexes.foreground,
        }),

        // backgroundColor: v.primaryBackgroundColorFocus,
      },

      ':hover': {
        backgroundColor: tokens.colorScheme.brand.backgroundHover,
        color: tokens.colorScheme.brand.foreground4,
      },
    }),
  ],

  [
    p => p.disabled,
    tokens => ({
      cursor: 'default',
      pointerEvents: 'none',

      boxShadow: 'none',

      backgroundColor: tokens.colorScheme.default.backgroundDisabled,
      borderColor: 'transparent',
      color: tokens.colorScheme.brand.foregroundDisabled,

      ':hover': {
        color: tokens.colorScheme.brand.foregroundDisabled,
      },
    }),
  ],
  [
    p => p.disabled && p.text,
    tokens => ({
      color: tokens.colorScheme.brand.foregroundDisabled1,
      backgroundColor: 'transparent',

      ':hover': {
        color: tokens.colorScheme.brand.foregroundDisabled1,
      },
    }),
  ],

  [p => p.fluid, { width: '100%', maxWidth: '100%' }],
]);
const useButtonContentStyles = makeStyles([
  [
    null,
    {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  ],
  [
    null,
    tokens => ({
      fontSize: tokens.fontSizes.medium,
      fontWeight: tokens.fontWeightSemibold,
      lineHeight: tokens.lineHeightMedium,
    }),
  ],

  [
    p => p.size === 'small',
    tokens => ({
      fontSize: tokens.fontSizes.small,
      lineHeight: tokens.lineHeightSmall,
    }),
  ],
]);
const useButtonIconStyles = makeStyles([
  // [
  //   null,
  //   ({ props: p, variables: v }) => ({
  //     alignItems: 'center',
  //     display: 'inline-flex',
  //     justifyContent: 'center',
  //
  //     width: v.iconSize,
  //     height: v.iconSize,
  //
  //     // when loading, hide the icon
  //     ...(p.loading && {
  //       margin: 0,
  //       opacity: 0,
  //       width: 0,
  //     }),
  //
  //     ...(p.hasContent && {
  //       margin: `0 ${pxToRem(10)} 0 0`,
  //       ...(p.iconPosition === 'after' && {
  //         margin: `0 0 0 ${pxToRem(10)}`,
  //       }),
  //     }),
  //   }),
  // ],
]);

export const buttonClassName = 'ui-button';

/**
 * A Button enables users to take an action, such as submitting a form, opening a dialog, etc.
 *
 * @accessibility
 * Implements [ARIA Button](https://www.w3.org/TR/wai-aria-practices-1.1/#button) design pattern.
 */
export const Button = compose<'button', ButtonProps, ButtonStylesProps, {}, {}>(
  (props, ref, composeOptions) => {
    const context = useFluentContext();
    const { setStart, setEnd } = useTelemetry(composeOptions.displayName, context.telemetry);
    setStart();

    const {
      accessibility,
      // @ts-ignore
      active,
      as,
      children,
      content,
      icon,
      loader,
      disabled,
      iconPosition,
      loading,
      text,
      primary,
      inverted,
      size,
      iconOnly,
      fluid,
      circular,
      className,
      styles,
      variables,
      design,
    } = props;

    const hasChildren = childrenExist(children);

    const getA11yProps = useAccessibility(accessibility, {
      debugName: composeOptions.displayName,
      mapPropsToBehavior: () => ({
        as,
        active,
        disabled,
        loading,
      }),
      actionHandlers: {
        performClick: event => {
          event.preventDefault();
          handleClick(event);
        },
      },
      rtl: context.rtl,
    });

    const rootClassName = useButtonStyles(
      {
        text,
        primary,
        disabled,
        circular,
        size,
        loading,
        inverted,
        iconOnly,
        iconPosition,
        fluid,
      },
      buttonClassName,
      className,
    );
    const contentClassName = useButtonContentStyles({ size });

    const { styles: resolvedStyles } = useStyles<ButtonStylesProps>(composeOptions.displayName, {
      className: composeOptions.className,
      mapPropsToStyles: () => ({
        text,
        primary,
        disabled,
        circular,
        size,
        loading,
        inverted,
        iconOnly,
        iconPosition,
        fluid,
        hasContent: !!content,
      }),
      mapPropsToInlineStyles: () => ({
        className,
        design,
        styles,
        variables,
      }),
      rtl: context.rtl,
      composeOptions,
      unstable_props: props,
    });

    const slotProps = composeOptions.resolveSlotProps<ButtonProps>(props);

    const unhandledProps = useUnhandledProps(composeOptions.handledProps, props);
    const ElementType = getElementType(props);

    const renderIcon = () => {
      return createShorthand(composeOptions.slots.icon, icon, {
        defaultProps: () =>
          getA11yProps('icon', {
            styles: resolvedStyles.icon,
            ...slotProps.icon,
          }),
      });
    };

    const renderLoader = () => {
      return createShorthand(composeOptions.slots.loader, loader || {}, {
        defaultProps: () =>
          getA11yProps('loader', {
            styles: resolvedStyles.loader,
            ...slotProps.loader,
          }),
      });
    };

    const contentElement = createShorthand('span', content, {
      defaultProps: () => getA11yProps('content', { className: contentClassName }),
    });

    const handleClick = (e: React.SyntheticEvent) => {
      if (disabled) {
        e.preventDefault();
        return;
      }

      _.invoke(props, 'onClick', e, props);
    };

    const handleFocus = (e: React.SyntheticEvent) => {
      _.invoke(props, 'onFocus', e, props);
    };

    const result = (
      <ElementType
        {...rtlTextContainer.getAttributes({ forElements: [children] })}
        {...getA11yProps('root', {
          onClick: handleClick,
          className: rootClassName,
          onFocus: handleFocus,
          ref,
          ...unhandledProps,
        })}
      >
        {hasChildren ? (
          children
        ) : (
          <>
            {loading && renderLoader()}
            {iconPosition !== 'after' && renderIcon()}
            {contentElement}
            {iconPosition === 'after' && renderIcon()}
          </>
        )}
      </ElementType>
    );

    setEnd();

    return result;
  },
  {
    className: buttonClassName,
    displayName: 'Button',

    slots: {
      content: ButtonContent,
      icon: Box,
      loader: Loader,
    },
    slotProps: props => ({
      content: {
        size: props.size,
      },
      loader: {
        role: undefined,
      },
    }),

    shorthandConfig: {
      mappedProp: 'content',
    },
    handledProps: [
      'accessibility',
      'as',
      'children',
      'circular',
      'className',
      'content',
      'design',
      'disabled',
      'fluid',
      'icon',
      'iconOnly',
      'iconPosition',
      'inverted',
      'loader',
      'loading',
      'onClick',
      'onFocus',
      'primary',
      'text',
      'secondary',
      'size',
      'styles',
      'variables',
    ],
  },
) as ComponentWithAs<'button', ButtonProps> & {
  create: ShorthandFactory<ButtonProps>;
  shorthandConfig: ShorthandConfig<ButtonProps>;
  Content: typeof ButtonContent;
  Group: typeof ButtonGroup;
};

Button.defaultProps = {
  as: 'button',
  accessibility: buttonBehavior,
  size: 'medium',
};

Button.propTypes = {
  ...commonPropTypes.createCommon({
    content: 'shorthand',
  }),
  circular: PropTypes.bool,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  icon: customPropTypes.shorthandAllowingChildren,
  iconOnly: PropTypes.bool,
  iconPosition: PropTypes.oneOf(['before', 'after']),
  inverted: PropTypes.bool,
  loader: customPropTypes.itemShorthandWithoutJSX,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  primary: customPropTypes.every([customPropTypes.disallow(['secondary']), PropTypes.bool]),
  text: PropTypes.bool,
  secondary: customPropTypes.every([customPropTypes.disallow(['primary']), PropTypes.bool]),
  size: customPropTypes.size,
};

Button.Group = ButtonGroup;
Button.Content = ButtonContent;

Button.create = createShorthandFactory({ Component: Button, mappedProp: 'content' });

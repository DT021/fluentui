import { Accessibility } from '@fluentui/accessibility';
import {
  ComponentWithAs,
  getElementType,
  makeStyles,
  useUnhandledProps,
  useAccessibility,
  useFluentContext,
  useTelemetry,
} from '@fluentui/react-bindings';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  childrenExist,
  createShorthandFactory,
  UIComponentProps,
  ChildrenComponentProps,
  ContentComponentProps,
  commonPropTypes,
  ColorComponentProps,
  rtlTextContainer,
  pxToRem,
} from '../../utils';

import { Image, ImageProps } from '../Image/Image';
import { Box, BoxProps } from '../Box/Box';

import { ShorthandValue, FluentComponentStaticProps } from '../../types';
import { ICSSInJSStyle } from '@fluentui/styles';

export interface LabelProps
  extends UIComponentProps,
    ChildrenComponentProps,
    ContentComponentProps<ShorthandValue<BoxProps>>,
    ColorComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   */
  accessibility?: Accessibility<never>;

  /** A Label can be circular. */
  circular?: boolean;

  /** A Label can take up the width of its container. */
  fluid?: boolean;

  /** A Label can have an icon. */
  icon?: ShorthandValue<BoxProps>;

  /** A Label can position its Icon at the start or end of the layout. */
  iconPosition?: 'start' | 'end';

  /** A Label can contain an image. */
  image?: ShorthandValue<ImageProps>;

  /** A Label can position its image at the start or end of the layout. */
  imagePosition?: 'start' | 'end';
}

export type LabelStylesProps = Pick<LabelProps, 'circular' | 'color' | 'imagePosition' | 'iconPosition'> & {
  hasImage: boolean;
  hasIcon: boolean;
  hasActionableIcon: boolean;
};
export const labelClassName = 'ui-label';

const useLabelStyles = makeStyles([
  [
    null,
    {
      alignItems: 'center',
      display: 'inline-flex',
      overflow: 'hidden',

      height: pxToRem(16),
      lineHeight: pxToRem(16),

      backgroundColor: 'rgb(232, 232, 232)',
      color: 'rgba(0, 0, 0, 0.6)',

      fontSize: pxToRem(14),
      borderRadius: pxToRem(3),
      padding: `0 ${pxToRem(4)} 0 ${pxToRem(4)}`,
    },
  ],

  [{ hasImage: true }, { paddingRight: '0px' }],
  [{ hasImage: true, imagePosition: 'start' }, { paddingLeft: '0px' }],

  [{ circular: true }, { borderRadius: pxToRem(9999) }],
]);

const staticLabelStyles = [
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
      overflow: ['a1a3p1vp', '.a1a3p1vp{overflow:hidden;}'],
      height: ['awdvutt', '.awdvutt{height:1.1429rem;}'],
      lineHeight: ['a1u5z64k', '.a1u5z64k{line-height:1.1429rem;}'],
      backgroundColor: ['a1sgdawc', '.a1sgdawc{background-color:rgb(232,232,232);}'],
      color: ['akiz4jv', '.akiz4jv{color:rgba(0,0,0,0.6);}'],
      fontSize: ['adm3o16', '.adm3o16{font-size:1rem;}'],
      borderRadius: ['a1dms8l0', '.a1dms8l0{border-radius:0.2143rem;}'],
      paddingTop: ['a1g0x7ka', '.a1g0x7ka{padding-top:0;}'],
      paddingRight: ['a166lo76', '.a166lo76{padding-right:0.2857rem;}', '.ra166lo76{padding-left:0.2857rem;}'],
      paddingBottom: ['a1qch9an', '.a1qch9an{padding-bottom:0;}'],
      paddingLeft: ['akptv0n', '.akptv0n{padding-left:0.2857rem;}', '.rakptv0n{padding-right:0.2857rem;}'],
    },
  ],

  [
    { hasImage: true },
    null,
    { paddingRight: ['aifp7yv', '.aifp7yv{padding-right:0px;}', '.raifp7yv{padding-left:0px;}'] },
  ],

  [
    { hasImage: true, imagePosition: 'start' },
    null,
    { paddingLeft: ['a1asdtw4', '.a1asdtw4{padding-left:0px;}', '.ra1asdtw4{padding-right:0px;}'] },
  ],

  [{ circular: true }, null, { borderRadius: ['a10yvfpk', '.a10yvfpk{border-radius:714.2143rem;}'] }],
];
const useStaticLabelStyles = makeStyles(staticLabelStyles);

const useLabelContentStyles = makeStyles([
  [{ hasStartElement: true }, { marginLeft: pxToRem(3) }],
  [{ hasEndElement: true }, { marginRight: pxToRem(3) }],
]);

const staticLabelContentStyles = [
  [
    { hasStartElement: true },
    null,
    { marginLeft: ['a1kdtsql', '.a1kdtsql{margin-left:0.2143rem;}', '.ra1kdtsql{margin-right:0.2143rem;}'] },
  ],
  [
    { hasEndElement: true },
    null,
    { marginRight: ['ald2d31', '.ald2d31{margin-right:0.2143rem;}', '.rald2d31{margin-left:0.2143rem;}'] },
  ],
];
const useStaticLabelContentStyles = makeStyles(staticLabelContentStyles);

const useLabelIconStyles = makeStyles([
  [
    null,
    {
      alignItems: 'center',
      display: 'inline-flex',
      justifyContent: 'center',

      width: pxToRem(16),
      height: pxToRem(16),

      '& > :first-child': {
        height: '100%',
        width: '100%',

        '& svg': { height: '100%', width: '100%' },
      },
    },
  ],
  [{ hasActionableIcon: true }, { cursor: 'pointer' }],
]);

const staticLabelIconStyles = [
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
      width: ['asxa7o6', '.asxa7o6{width:1.1429rem;}'],
      height: ['awdvutt', '.awdvutt{height:1.1429rem;}'],
      ' > :first-childheight': ['afvh450', '.afvh450>:first-child{height:100%;}'],
      ' > :first-childwidth': ['a1u2zova', '.a1u2zova>:first-child{width:100%;}'],
      ' > :first-child svgheight': ['a11pmm19', '.a11pmm19>:first-child svg{height:100%;}'],
      ' > :first-child svgwidth': ['a101b0fn', '.a101b0fn>:first-child svg{width:100%;}'],
    },
  ],
  [{ hasActionableIcon: true }, { cursor: ['a1k6fduh', '.a1k6fduh{cursor:pointer;}'] }],
];

const useStaticLabelIconStyles = makeStyles(staticLabelIconStyles);

const useLabelImageStyles = makeStyles([[null, { height: pxToRem(20), width: pxToRem(20) }]]);

const staticLabelImageStyles = [
  [
    null,
    null,
    { height: ['ah012zl', '.ah012zl{height:1.4286rem;}'], width: ['a19ec5sb', '.a19ec5sb{width:1.4286rem;}'] },
  ],
];
const useStaticLabelImageStyles = makeStyles(staticLabelImageStyles);

/**
 * A Label allows user to classify content.
 */
export const Label: ComponentWithAs<'span', LabelProps> & FluentComponentStaticProps = props => {
  const context = useFluentContext();
  const { setStart, setEnd } = useTelemetry(Label.displayName, context.telemetry);
  setStart();

  const {
    accessibility,
    children,
    circular,
    className,
    color,
    content,
    icon,
    iconPosition,
    image,
    imagePosition,
  } = props;

  const getA11Props = useAccessibility(accessibility, {
    debugName: Label.displayName,
    rtl: context.rtl,
  });

  const hasImage = !!image;
  const hasIcon = !!icon;

  const rootClassName = useLabelStyles({ color, hasImage, circular, imagePosition }, labelClassName, className);
  const contentClassName = useLabelContentStyles({
    hasStartElement: (hasImage && imagePosition === 'start') || (hasIcon && iconPosition === 'start'),
    hasEndElement: (hasImage && imagePosition === 'end') || (hasIcon && iconPosition === 'end'),
  });
  const iconClassName = useLabelIconStyles({ hasActionableIcon: _.has(icon, 'onClick') });
  const imageClassName = useLabelImageStyles();

  const ElementType = getElementType(props);
  const unhandledProps = useUnhandledProps(Label.handledProps, props);

  if (childrenExist(children)) {
    const element = (
      <ElementType
        {...getA11Props('root', {
          className: rootClassName,
          ...rtlTextContainer.getAttributes({ forElements: [children] }),
          ...unhandledProps,
        })}
      >
        {children}
      </ElementType>
    );
    setEnd();

    return element;
  }

  const imageElement = Image.create(image, {
    defaultProps: () => ({ className: imageClassName }),
  });
  const iconElement = Box.create(icon, {
    defaultProps: () => ({ className: iconClassName }),
  });
  const contentElement = Box.create(content, {
    defaultProps: () => ({ className: contentClassName }),
  });

  const startImage = imagePosition === 'start' && imageElement;
  const startIcon = iconPosition === 'start' && iconElement;
  const endIcon = iconPosition === 'end' && iconElement;
  const endImage = imagePosition === 'end' && imageElement;

  const element = (
    <ElementType
      {...getA11Props('root', {
        className: rootClassName,
        ...unhandledProps,
      })}
    >
      {startImage}
      {startIcon}
      {contentElement}
      {endIcon}
      {endImage}
    </ElementType>
  );
  setEnd();

  return element;
};

Label.displayName = 'Label';

Label.propTypes = {
  ...commonPropTypes.createCommon({ color: true, content: 'shorthand' }),
  circular: PropTypes.bool,
  icon: customPropTypes.shorthandAllowingChildren,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  image: customPropTypes.itemShorthandWithoutJSX,
  imagePosition: PropTypes.oneOf(['start', 'end']),
  fluid: PropTypes.bool,
};
Label.handledProps = Object.keys(Label.propTypes) as any;

Label.defaultProps = {
  as: 'span',
  imagePosition: 'start',
  iconPosition: 'end',
};

Label.create = createShorthandFactory({ Component: Label, mappedProp: 'content' });

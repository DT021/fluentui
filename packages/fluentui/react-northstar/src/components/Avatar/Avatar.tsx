import { Accessibility } from '@fluentui/accessibility';
import {
  ComponentWithAs,
  getElementType,
  useUnhandledProps,
  useAccessibility,
  useFluentContext,
  useTelemetry,
} from '@fluentui/react-bindings';
import * as customPropTypes from '@fluentui/react-proptypes';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { makeStyles } from '@fluentui/react-theme-provider';

import { Box, BoxProps } from '../Box/Box';
import { Image, ImageProps } from '../Image/Image';
import { Label, LabelProps } from '../Label/Label';
import { Status, StatusProps } from '../Status/Status';
import { ShorthandValue, FluentComponentStaticProps } from '../../types';
import { createShorthandFactory, UIComponentProps, commonPropTypes, SizeValue, pxToRem } from '../../utils';

const useAvatarStyles = makeStyles([
  [
    null,
    {
      backgroundColor: 'inherit',

      display: 'inline-block',
      position: 'relative',
      verticalAlign: 'middle',
    },
  ],

  [{ size: 'smallest' }, { height: pxToRem(20), width: pxToRem(20) }],
  [{ size: 'smaller' }, { height: pxToRem(24), width: pxToRem(24) }],
  [{ size: 'small' }, { height: pxToRem(28), width: pxToRem(28) }],
  [{ size: 'medium' }, { height: pxToRem(32), width: pxToRem(32) }],
  [{ size: 'large' }, { height: pxToRem(44), width: pxToRem(44) }],
  [{ size: 'larger' }, { height: pxToRem(64), width: pxToRem(64) }],
  [{ size: 'largest' }, { height: pxToRem(96), width: pxToRem(96) }],
]);

const staticAvatarStyles = [
  [
    null,
    null,
    {
      backgroundColor: ['a1u2r49w', '.a1u2r49w{background-color:inherit;}'],
      display: ['a14t3ns0', '.a14t3ns0{display:inline-block;}'],
      position: ['a10pi13n', '.a10pi13n{position:relative;}'],
      verticalAlign: ['amrv4ls', '.amrv4ls{vertical-align:middle;}'],
    },
  ],
  [
    { size: 'smallest' },
    null,
    { height: ['ah012zl', '.ah012zl{height:1.4286rem;}'], width: ['a19ec5sb', '.a19ec5sb{width:1.4286rem;}'] },
  ],
  [
    { size: 'smaller' },
    null,
    { height: ['avq1clm', '.avq1clm{height:1.7143rem;}'], width: ['a1kgoap5', '.a1kgoap5{width:1.7143rem;}'] },
  ],
  [
    { size: 'small' },
    null,
    { height: ['a1xpi36y', '.a1xpi36y{height:2rem;}'], width: ['a137enl0', '.a137enl0{width:2rem;}'] },
  ],
  [
    { size: 'medium' },
    null,
    { height: ['as51yi9', '.as51yi9{height:2.2857rem;}'], width: ['a10vq2gu', '.a10vq2gu{width:2.2857rem;}'] },
  ],
  [
    { size: 'large' },
    null,
    { height: ['avonqzr', '.avonqzr{height:3.1429rem;}'], width: ['aexyc64', '.aexyc64{width:3.1429rem;}'] },
  ],
  [
    { size: 'larger' },
    null,
    { height: ['amsujci', '.amsujci{height:4.5714rem;}'], width: ['aoni65q', '.aoni65q{width:4.5714rem;}'] },
  ],
  [
    { size: 'largest' },
    null,
    { height: ['a4c4g8p', '.a4c4g8p{height:6.8571rem;}'], width: ['a1uudkc', '.a1uudkc{width:6.8571rem;}'] },
  ],
];

const useStaticAvatarStyles = makeStyles(staticAvatarStyles);

const useAvatarIconStyles = makeStyles([
  [
    null,
    tokens => ({
      alignItems: 'center',
      borderRadius: '50%',
      display: 'inline-flex',

      backgroundColor: tokens.colors.brand[600],
      color: tokens.colors.white,

      '& > :first-child': {
        margin: '0 auto',

        '& svg': {
          width: '100%',
          height: '100%',
        },
      },
    }),
  ],

  [{ square: true }, { borderRadius: pxToRem(3) }],

  [
    { size: 'smallest' },
    { height: pxToRem(20), width: pxToRem(20), '& > :first-child': { height: pxToRem(10), width: pxToRem(10) } },
  ],
  [
    { size: 'smaller' },
    { height: pxToRem(24), width: pxToRem(24), '& > :first-child': { height: pxToRem(12), width: pxToRem(12) } },
  ],
  [
    { size: 'small' },
    { height: pxToRem(28), width: pxToRem(28), '& > :first-child': { height: pxToRem(16), width: pxToRem(16) } },
  ],
  [
    { size: 'medium' },
    { height: pxToRem(32), width: pxToRem(32), '& > :first-child': { height: pxToRem(16), width: pxToRem(16) } },
  ],
  [
    { size: 'large' },
    { height: pxToRem(44), width: pxToRem(44), '& > :first-child': { height: pxToRem(20), width: pxToRem(20) } },
  ],
  [
    { size: 'larger' },
    { height: pxToRem(64), width: pxToRem(64), '& > :first-child': { height: pxToRem(32), width: pxToRem(32) } },
  ],
  [
    { size: 'largest' },
    { height: pxToRem(96), width: pxToRem(96), '& > :first-child': { height: pxToRem(40), width: pxToRem(40) } },
  ],
]);

const staticAvatarIconStyles = [
  [
    null,
    null,
    {
      alignItems: [
        'a122n59',
        '.a122n59{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}',
      ],
      borderRadius: ['a5q2cvs', '.a5q2cvs{border-radius:50%;}'],
      display: [
        'atuwxu6',
        '.atuwxu6{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}',
      ],
      ' > :first-child svgwidth': ['a101b0fn', '.a101b0fn>:first-child svg{width:100%;}'],
      ' > :first-child svgheight': ['a11pmm19', '.a11pmm19>:first-child svg{height:100%;}'],
      ' > :first-childmarginTop': ['a1o5f4y', '.a1o5f4y>:first-child{margin-top:0;}'],
      ' > :first-childmarginRight': [
        'a1gmyx0h',
        '.a1gmyx0h>:first-child{margin-right:auto;}',
        '.ra1gmyx0h>:first-child{margin-left:auto;}',
      ],
      ' > :first-childmarginBottom': ['auqjp8h', '.auqjp8h>:first-child{margin-bottom:0;}'],
      ' > :first-childmarginLeft': [
        'a1bbr70j',
        '.a1bbr70j>:first-child{margin-left:auto;}',
        '.ra1bbr70j>:first-child{margin-right:auto;}',
      ],
    },
  ],

  [
    null,
    tokens => ({ color: tokens.colors.white, background: tokens.colors.brand[600] }),
    {
      color: ['aptray4', '.aptray4{color:var(--theme-colors-white);}'],
      background: ['a68jo5u', '.a68jo5u{background:var(--theme-colors-brand-600);}'],
    },
  ],

  [{ square: true }, null, { borderRadius: ['a1dms8l0', '.a1dms8l0{border-radius:0.2143rem;}'] }],

  [
    { size: 'smallest' },
    null,
    {
      height: ['ah012zl', '.ah012zl{height:1.4286rem;}'],
      width: ['a19ec5sb', '.a19ec5sb{width:1.4286rem;}'],
      ' > :first-childheight': ['ad83pmv', '.ad83pmv>:first-child{height:0.7143rem;}'],
      ' > :first-childwidth': ['atbb0uo', '.atbb0uo>:first-child{width:0.7143rem;}'],
    },
  ],
  [
    { size: 'smaller' },
    null,
    {
      height: ['avq1clm', '.avq1clm{height:1.7143rem;}'],
      width: ['a1kgoap5', '.a1kgoap5{width:1.7143rem;}'],
      ' > :first-childheight': ['a1vao2w3', '.a1vao2w3>:first-child{height:0.8571rem;}'],
      ' > :first-childwidth': ['ak768y', '.ak768y>:first-child{width:0.8571rem;}'],
    },
  ],
  [
    { size: 'small' },
    null,
    {
      height: ['a1xpi36y', '.a1xpi36y{height:2rem;}'],
      width: ['a137enl0', '.a137enl0{width:2rem;}'],
      ' > :first-childheight': ['a39l5mr', '.a39l5mr>:first-child{height:1.1429rem;}'],
      ' > :first-childwidth': ['a149sfh9', '.a149sfh9>:first-child{width:1.1429rem;}'],
    },
  ],
  [
    { size: 'medium' },
    null,
    {
      height: ['as51yi9', '.as51yi9{height:2.2857rem;}'],
      width: ['a10vq2gu', '.a10vq2gu{width:2.2857rem;}'],
      ' > :first-childheight': ['a39l5mr', '.a39l5mr>:first-child{height:1.1429rem;}'],
      ' > :first-childwidth': ['a149sfh9', '.a149sfh9>:first-child{width:1.1429rem;}'],
    },
  ],
  [
    { size: 'large' },
    null,
    {
      height: ['avonqzr', '.avonqzr{height:3.1429rem;}'],
      width: ['aexyc64', '.aexyc64{width:3.1429rem;}'],
      ' > :first-childheight': ['a7sjl0d', '.a7sjl0d>:first-child{height:1.4286rem;}'],
      ' > :first-childwidth': ['a1vb1kh1', '.a1vb1kh1>:first-child{width:1.4286rem;}'],
    },
  ],
  [
    { size: 'larger' },
    null,
    {
      height: ['amsujci', '.amsujci{height:4.5714rem;}'],
      width: ['aoni65q', '.aoni65q{width:4.5714rem;}'],
      ' > :first-childheight': ['a10mronk', '.a10mronk>:first-child{height:2.2857rem;}'],
      ' > :first-childwidth': ['a1j31c6', '.a1j31c6>:first-child{width:2.2857rem;}'],
    },
  ],
  [
    { size: 'largest' },
    null,
    {
      height: ['a4c4g8p', '.a4c4g8p{height:6.8571rem;}'],
      width: ['a1uudkc', '.a1uudkc{width:6.8571rem;}'],
      ' > :first-childheight': ['aktkh3k', '.aktkh3k>:first-child{height:2.8571rem;}'],
      ' > :first-childwidth': ['a19quazw', '.a19quazw>:first-child{width:2.8571rem;}'],
    },
  ],
];
const useStaticAvatarIconStyles = makeStyles(staticAvatarIconStyles);

const useAvatarImageStyles = makeStyles([
  [
    null,
    {
      height: '100%',
      objectFit: 'cover',
      verticalAlign: 'top',
      width: '100%',
    },
  ],
  [{ square: true }, { borderRadius: pxToRem(3) }],
]);

const staticAvatarImageStyles = [
  [
    null,
    null,
    {
      height: ['a1l02sjl', '.a1l02sjl{height:100%;}'],
      objectFit: ['a1ps3kmd', '.a1ps3kmd{object-fit:cover;}'],
      verticalAlign: ['a12kltsn', '.a12kltsn{vertical-align:top;}'],
      width: ['aly5x3f', '.aly5x3f{width:100%;}'],
    },
  ],
  [{ square: true }, null, { borderRadius: ['a1dms8l0', '.a1dms8l0{border-radius:0.2143rem;}'] }],
];
const useStaticAvatarImageStyles = makeStyles(staticAvatarImageStyles);

const useAvatarLabelStyles = makeStyles([
  [
    null,
    {
      display: 'inline-block',
      textAlign: 'center',
      padding: '0',
      verticalAlign: 'top',
    },
  ],

  [{ square: true }, { borderRadius: pxToRem(3) }],

  [
    { size: 'smallest' },
    { fontSize: pxToRem(20 / 2.333), lineHeight: pxToRem(20), height: pxToRem(20), width: pxToRem(20) },
  ],
  [
    { size: 'smaller' },
    { fontSize: pxToRem(24 / 2.333), lineHeight: pxToRem(24), height: pxToRem(24), width: pxToRem(24) },
  ],
  [
    { size: 'small' },
    { fontSize: pxToRem(28 / 2.333), lineHeight: pxToRem(28), height: pxToRem(28), width: pxToRem(28) },
  ],
  [
    { size: 'medium' },
    { fontSize: pxToRem(32 / 2.333), lineHeight: pxToRem(32), height: pxToRem(32), width: pxToRem(32) },
  ],
  [
    { size: 'large' },
    { fontSize: pxToRem(44 / 2.333), lineHeight: pxToRem(44), height: pxToRem(44), width: pxToRem(44) },
  ],
  [
    { size: 'larger' },
    { fontSize: pxToRem(64 / 2.333), lineHeight: pxToRem(64), height: pxToRem(64), width: pxToRem(64) },
  ],
  [
    { size: 'largest' },
    { fontSize: pxToRem(96 / 2.333), lineHeight: pxToRem(96), height: pxToRem(96), width: pxToRem(96) },
  ],
]);

const staticLabelStyles = [
  [
    null,
    null,
    {
      display: ['a14t3ns0', '.a14t3ns0{display:inline-block;}'],
      textAlign: ['a17mccla', '.a17mccla{text-align:center;}'],
      verticalAlign: ['a12kltsn', '.a12kltsn{vertical-align:top;}'],
      paddingTop: ['a1g0x7ka', '.a1g0x7ka{padding-top:0;}'],
      paddingRight: ['ahxju0i', '.ahxju0i{padding-right:0;}', '.rahxju0i{padding-left:0;}'],
      paddingBottom: ['a1qch9an', '.a1qch9an{padding-bottom:0;}'],
      paddingLeft: ['a1cnd47f', '.a1cnd47f{padding-left:0;}', '.ra1cnd47f{padding-right:0;}'],
    },
  ],
  [{ square: true }, null, { borderRadius: ['a1dms8l0', '.a1dms8l0{border-radius:0.2143rem;}'] }],
  [
    { size: 'smallest' },
    null,
    {
      fontSize: ['a1n3tkqd', '.a1n3tkqd{font-size:0.6123rem;}'],
      lineHeight: ['aqn99f', '.aqn99f{line-height:1.4286rem;}'],
      height: ['ah012zl', '.ah012zl{height:1.4286rem;}'],
      width: ['a19ec5sb', '.a19ec5sb{width:1.4286rem;}'],
    },
  ],
  [
    { size: 'smaller' },
    null,
    {
      fontSize: ['a5uuiz6', '.a5uuiz6{font-size:0.7348rem;}'],
      lineHeight: ['a1ldra9i', '.a1ldra9i{line-height:1.7143rem;}'],
      height: ['avq1clm', '.avq1clm{height:1.7143rem;}'],
      width: ['a1kgoap5', '.a1kgoap5{width:1.7143rem;}'],
    },
  ],
  [
    { size: 'small' },
    null,
    {
      fontSize: ['a140ezmv', '.a140ezmv{font-size:0.8573rem;}'],
      lineHeight: ['a15qi916', '.a15qi916{line-height:2rem;}'],
      height: ['a1xpi36y', '.a1xpi36y{height:2rem;}'],
      width: ['a137enl0', '.a137enl0{width:2rem;}'],
    },
  ],
  [
    { size: 'medium' },
    null,
    {
      fontSize: ['a880ecx', '.a880ecx{font-size:0.9797rem;}'],
      lineHeight: ['a1ppau6d', '.a1ppau6d{line-height:2.2857rem;}'],
      height: ['as51yi9', '.as51yi9{height:2.2857rem;}'],
      width: ['a10vq2gu', '.a10vq2gu{width:2.2857rem;}'],
    },
  ],
  [
    { size: 'large' },
    null,
    {
      fontSize: ['ab33vjb', '.ab33vjb{font-size:1.3471rem;}'],
      lineHeight: ['a7itntz', '.a7itntz{line-height:3.1429rem;}'],
      height: ['avonqzr', '.avonqzr{height:3.1429rem;}'],
      width: ['aexyc64', '.aexyc64{width:3.1429rem;}'],
    },
  ],
  [
    { size: 'larger' },
    null,
    {
      fontSize: ['ajt7aj5', '.ajt7aj5{font-size:1.9595rem;}'],
      lineHeight: ['a1oeme7e', '.a1oeme7e{line-height:4.5714rem;}'],
      height: ['amsujci', '.amsujci{height:4.5714rem;}'],
      width: ['aoni65q', '.aoni65q{width:4.5714rem;}'],
    },
  ],
  [
    { size: 'largest' },
    null,
    {
      fontSize: ['ag7k9p2', '.ag7k9p2{font-size:2.9392rem;}'],
      lineHeight: ['a11fhega', '.a11fhega{line-height:6.8571rem;}'],
      height: ['a4c4g8p', '.a4c4g8p{height:6.8571rem;}'],
      width: ['a1uudkc', '.a1uudkc{width:6.8571rem;}'],
    },
  ],
];
const useStaticAvatarLabelStyles = makeStyles(staticLabelStyles);

const useAvatarStatusStyles = makeStyles([
  [
    null,
    tokens => ({
      position: 'absolute',
      bottom: 0,
      right: 0,
      boxShadow: `0 0 0 2px ${tokens.bodyBackground}`,
    }),
  ],
]);

const staticAvatarStatusStyles = [
  [
    null,
    null,
    {
      position: ['a1euv43f', '.a1euv43f{position:absolute;}'],
      bottom: ['a1yab3r1', '.a1yab3r1{bottom:0;}'],
      right: ['a1e31b4d', '.a1e31b4d{right:0;}', '.ra1e31b4d{left:0;}'],
    },
  ],
  [
    null,
    tokens => ({ boxShadow: `0 0 0 2px ${tokens.bodyBackground}` }),
    { boxShadow: ['a1e58ze0', '.a1e58ze0{box-shadow:0 0 0 2px var(--theme-bodyBackground);}'] },
  ],
];

const useStaticAvatarStatusStyles = makeStyles(staticAvatarStatusStyles);

export interface AvatarProps extends UIComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   */
  accessibility?: Accessibility<never>;

  /** Avatar can contain icon. It will be rendered only if the image is not present. */
  icon?: ShorthandValue<BoxProps>;

  /** Shorthand for the image. */
  image?: ShorthandValue<ImageProps>;

  /** Shorthand for the label. */
  label?: ShorthandValue<LabelProps>;

  /** The name used for displaying the initials of the avatar if the image is not provided. */
  name?: string;

  /** The avatar can have a square shape. */
  square?: boolean;

  /** Size multiplier. */
  size?: SizeValue;

  /** Shorthand for the status of the user. */
  status?: ShorthandValue<StatusProps>;

  /** Custom method for generating the initials from the name property, which is shown if no image is provided. */
  getInitials?: (name: string) => string;
}

export type AvatarStylesProps = Pick<AvatarProps, 'size' | 'square'>;
export const avatarClassName = 'ui-avatar';

/**
 * An Avatar is a graphical representation of a user.
 */
export const Avatar: ComponentWithAs<'div', AvatarProps> & FluentComponentStaticProps<AvatarProps> = props => {
  const context = useFluentContext();
  const { setStart, setEnd } = useTelemetry(Avatar.displayName, context.telemetry);
  setStart();

  const { accessibility, className, getInitials, label, icon, image, name, square, size, status } = props;

  const getA11Props = useAccessibility(accessibility, {
    debugName: Avatar.displayName,
    rtl: context.rtl,
  });

  const rootClassName = useStaticAvatarStyles({ size }, avatarClassName, className);
  const iconClassName = useStaticAvatarIconStyles({ square, size });
  const imageClassName = useStaticAvatarImageStyles({ square });
  const labelClassName = useStaticAvatarLabelStyles({ square, size });
  const statusClassName = useStaticAvatarStatusStyles();

  const ElementType = getElementType(props);
  const unhandledProps = useUnhandledProps(Avatar.handledProps, props);

  const imageElement = Image.create(image, {
    defaultProps: () =>
      getA11Props('image', {
        className: imageClassName,
        fluid: true,
        avatar: !square,
        title: name,
      }),
  });

  const iconElement = Box.create(icon, {
    defaultProps: () =>
      getA11Props('icon', {
        className: iconClassName,
        title: name,
      }),
  });

  const labelElement = Label.create(label || {}, {
    defaultProps: () =>
      getA11Props('label', {
        className: labelClassName,
        content: getInitials(name),
        circular: !square,
        title: name,
      }),
  });

  const hasGlyph = !!image || !!icon;

  const result = (
    <ElementType {...getA11Props('root', { className: rootClassName, ...unhandledProps })}>
      {hasGlyph && (imageElement || iconElement)}
      {!hasGlyph && labelElement}
      {Status.create(status, {
        defaultProps: () =>
          getA11Props('status', {
            className: statusClassName,
            size,
          }),
      })}
    </ElementType>
  );

  setEnd();

  return result;
};

Avatar.displayName = 'Avatar';

Avatar.defaultProps = {
  size: 'medium',
  getInitials(name: string) {
    if (!name) {
      return '';
    }

    const reducedName = name
      .replace(/\s+/g, ' ')
      .replace(/\s*\(.*?\)\s*/g, ' ')
      .replace(/\s*{.*?}\s*/g, ' ')
      .replace(/\s*\[.*?]\s*/g, ' ');

    const initials = reducedName
      .split(' ')
      .filter(item => item !== '')
      .map(item => item.charAt(0))
      .reduce((accumulator, currentValue) => accumulator + currentValue, '');

    if (initials.length > 2) {
      return initials.charAt(0) + initials.charAt(initials.length - 1);
    }
    return initials;
  },
};

Avatar.propTypes = {
  ...commonPropTypes.createCommon({
    children: false,
    content: false,
  }),
  name: PropTypes.string,
  icon: customPropTypes.shorthandAllowingChildren,
  image: customPropTypes.itemShorthandWithoutJSX,
  label: customPropTypes.itemShorthand,
  square: PropTypes.bool,
  size: customPropTypes.size,
  status: customPropTypes.itemShorthand,
  getInitials: PropTypes.func,
};
Avatar.handledProps = Object.keys(Avatar.propTypes) as any;

Avatar.create = createShorthandFactory({ Component: Avatar, mappedProp: 'name' });

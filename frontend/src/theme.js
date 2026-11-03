/* Shared design tokens for styled-components.
   Import { colors, radii, breakpoints, mq } instead of hardcoding hex values.
   Mirrors the CSS vars in index.css so JS and CSS never drift apart. */

export const colors = {
  cream: '#FAF7F2',
  cream2: '#F5F2EE',
  ink: '#2A1F10',
  inkSoft: '#4A4A4A',
  muted: '#8A7B6D',
  muted2: '#A89B87',
  line: '#EAE3D6',
  line2: '#E6D5B8',
  gold: '#B8935A',
  goldDeep: '#B38E46',
  goldSoft: '#C5A059',
  danger: '#C53030',
  dangerBg: '#FFF5F5',
  card: '#FFFFFF',
};

export const radii = {
  sm: '10px',
  md: '14px',
  lg: '20px',
  xl: '32px',
};

/* Mobile-first breakpoints. Use mq.mobile / mq.tablet / mq.desktop. */
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
};

export const mq = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  laptop: `@media (max-width: ${breakpoints.laptop})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
};

/* Narrow page container used by customer pages. */
export const container = '1200px';

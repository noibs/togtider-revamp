import React from 'react';

const Loading = (styles: { styles: string }) => {
  return (
    <div className={styles.styles}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 500"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        style={{
          fillRule: 'evenodd',
          clipRule: 'evenodd',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeMiterlimit: 1.5,
        }}
      >
        <g transform="matrix(1,0,0,1,-27.2482,-9.53238)">
          <path d="M289.784,134.439C285.618,134.022 281.435,133.813 277.248,133.813C207.862,133.813 151.529,190.146 151.529,259.532C151.529,328.919 207.862,385.252 277.248,385.252C346.681,385.252 402.968,328.965 402.968,259.532C402.968,328.965 346.681,385.252 277.248,385.252C207.862,385.252 151.529,328.919 151.529,259.532C151.529,190.146 207.862,133.813 277.248,133.813C281.435,133.813 285.618,134.022 289.784,134.439Z" />
        </g>
      </svg>
    </div>
  );
};

export default Loading;

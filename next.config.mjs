import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  reloadOnOnline: true,
  disable: false,
});

export default withPWA({});

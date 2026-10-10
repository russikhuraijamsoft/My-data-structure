module.exports = {
  appId: 'com.talkos.erp',
  productName: 'TalkOS ERP',
  directories: {
    output: 'release-builds',
  },
  files: [
    'dist/**/*',
    'electron/**/*',
    'package.json',
    '!**/*.map',
  ],
  extraMetadata: {
    main: 'electron/main.cjs',
  },
  win: {
    target: ['nsis'],
  },
  mac: {
    target: ['dmg'],
  },
  linux: {
    target: ['AppImage'],
  },
};

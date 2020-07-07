module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: [
      ['module-resolver', {
        alias: {
          '@entities': './src/entities',
          '@controllers': './src/controllers',
          "@config/*": "./src/config/*",
          "@repositories/*": "./src/repositories/*",
          "@database/*": "./src/database/*",
          "@src/*": "./src/*",
          "@root/*": "./*"
        }
      }]
    ],
    ignore: [
      '**/*.spec.ts'
    ]
  }
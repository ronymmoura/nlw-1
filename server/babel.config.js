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
          '@config': './src/config',
          '@models': './src/models',
          '@controllers': './src/controllers',
          "@config/*": "./src/config/*",
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
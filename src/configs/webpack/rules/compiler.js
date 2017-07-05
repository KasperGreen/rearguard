import path from 'path';
import { context, isDevelopment, isMobx, isTS } from '../../prepare.build-tools.config';

export default ({
                  babel: {
                    presets = [],
                    plugins = [],
                    envPreset = [],
                  },
                  exclude = [/node_modules/],
                }) => {
  const common = {
    test: isTS ? /\.(ts|tsx)?$/ : /\.(js|jsx)?$/,
    exclude,
    include: [context],
  };
  const babelQuery = {
    // https://github.com/babel/babel-loader#options
    cacheDirectory: isDevelopment,

    // https://babeljs.io/docs/usage/options/
    babelrc: false,
    // TODO как заработает внедрить https://github.com/mobxjs/babel-plugin-mobx-deep-action/issues/5
    //passPerPreset: true,
    presets: [
      // TODO как заработает внедрить https://github.com/mobxjs/babel-plugin-mobx-deep-action/issues/5
      //...isMobx ? [{ plugins: ['transform-regenerator', 'mobx-deep-action'] }] : [],
      envPreset,
      // Stage 2: draft
      // https://babeljs.io/docs/plugins/preset-stage-2/
      'stage-2',
      ...presets
    ],
    plugins: [
      ...isMobx ? ['transform-decorators-legacy'] : [],
      ...plugins
    ],
  };

  if (isTS) {
    return [
      {
        ...common,
        use: [
          {
            loader: 'babel-loader',
            query: babelQuery,
          },
          {
            loader: 'ts-loader',
            options: {
              configFileName: path.resolve(__dirname, '../../../../tmp/tsconfig.json'),
            },
          }
        ],
      },
      {
        test: /\.js$/,
        exclude,
        include: [context],
        enforce: 'pre',
        loader: 'source-map-loader',
      },
    ];
  } else {
    return [
      {
        ...common,
        loader: 'babel-loader',
        query: babelQuery,
      },
    ];
  }
}

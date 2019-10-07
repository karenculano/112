/**
 * Copyright IBM Corp. 2015, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

'use strict';

require('core-js/features/array/flat-map');

const { reporter } = require('@carbon/cli-reporter');
const { types: t, generate } = require('@carbon/scss-generator');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { formatTokenName, themes, tokens } = require('../lib');

const FILE_BANNER = t.Comment(` Code generated by @rocketsoftware/themes. DO NOT EDIT.

 Copyright IBM Corp. 2018, 2018

 This source code is licensed under the Apache-2.0 license found in the
 LICENSE file in the root directory of this source tree.
`);

const defaultTheme = 'white';
const defaultThemeMapName = 'carbon--theme';

async function build() {
  reporter.info('Building scss files for themes...');

  const METADATA_FILE = path.resolve(__dirname, '../metadata.yml');
  const metadata = transformMetadata(
    yaml.safeLoad(fs.readFileSync(METADATA_FILE, 'utf8'))
  );

  const SCSS_DIR = path.resolve(__dirname, '../scss/generated');
  const files = [
    {
      filepath: path.join(SCSS_DIR, '_tokens.scss'),
      builder() {
        return buildTokensFile(tokens, metadata, themes[defaultTheme]);
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_themes.scss'),
      builder() {
        return buildThemesFile(themes, tokens);
      },
    },
    {
      filepath: path.join(SCSS_DIR, '_mixins.scss'),
      builder() {
        return buildMixinsFile();
      },
    },
  ];

  await fs.ensureDir(SCSS_DIR);
  for (const { filepath, builder } of files) {
    const { code } = generate(builder());
    await fs.writeFile(filepath, code);
  }

  reporter.success('Done! 🎉');
}

/**
 * Build the AST for a _tokens.scss file with a structure similar to:
 *
 * $token-name-01: <some-value>;
 * $token-name-02: <some-value>;
 *
 * By default, these tokens are assigned to their value in the given
 * `defaultTheme`
 * @param {object} tokens
 * @param {object} metadata
 * @param {object} defaultTheme
 * @returns {SassAST}
 */
function buildTokensFile(tokens, metadata, defaultTheme) {
  const assignments = Object.keys(tokens).flatMap(group => {
    return tokens[group].flatMap(token => {
      const name = formatTokenName(token);
      const tokenData =
        (metadata.tokens &&
          metadata.tokens.find(tok => {
            return tok.name === token;
          })) ||
        {};

      return [
        t.Newline(),
        tokenData.role && t.Comment(`/ ${tokenData.role.join('; ')}`),
        t.Comment(`/ @type Color
/ @access public
/ @group @carbon/themes`),
        tokenData.alias && t.Comment(`/ @alias ${tokenData.alias}`),
        tokenData.deprecated && t.Comment(`/ @deprecated`),
        t.Assignment({
          id: t.Identifier(name),
          init: t.SassFunctionCall(t.Identifier('if'), [
            t.LogicalExpression({
              left: t.SassFunctionCall(t.Identifier('global-variable-exists'), [
                t.SassString('carbon--theme'),
              ]),
              operator: 'and',
              right: t.SassFunctionCall(t.Identifier('map-has-key'), [
                t.Identifier('carbon--theme'),
                t.SassString(name),
              ]),
            }),
            t.SassFunctionCall(t.Identifier('map-get'), [
              t.Identifier('carbon--theme'),
              t.SassString(name),
            ]),
            primitive(defaultTheme[token]),
          ]),
          // init: ,
          default: true,
        }),
      ].filter(Boolean);
    });
  });

  return t.StyleSheet([FILE_BANNER, t.Newline(), ...assignments]);
}

function buildThemesFile(themes, tokens) {
  // Create maps for each theme:
  // $carbon--theme--name: (
  //   token-name: token-value
  // ) !default;
  const themeMaps = Object.keys(themes).flatMap(name => {
    const theme = themes[name];
    const comment = t.Comment(`/ Carbon's ${name} color theme
/ @type Map
/ @access public
/ @group @rocketsoftware/themes`);
    const variable = t.Assignment({
      id: t.Identifier(`carbon--theme--${name}`),
      init: t.SassMap({
        properties: Object.keys(theme).map(token =>
          t.SassMapProperty(
            t.Identifier(formatTokenName(token)),
            primitive(theme[token])
          )
        ),
      }),
      default: true,
    });
    return [t.Newline(), comment, variable];
  });

  const carbonTheme = t.Assignment({
    id: t.Identifier(defaultThemeMapName),
    init: t.SassMap({
      properties: Object.keys(tokens).flatMap(group => {
        return tokens[group].flatMap(token => {
          const name = formatTokenName(token);
          return t.SassMapProperty(
            t.Identifier(name),
            t.SassFunctionCall(t.Identifier('if'), [
              t.SassFunctionCall(t.Identifier('global-variable-exists'), [
                t.SassString(name),
              ]),
              t.Identifier(name),
              t.SassFunctionCall(t.Identifier('map-get'), [
                t.Identifier('carbon--theme--white'),
                t.SassString(name),
              ]),
            ])
          );
        });
      }),
    }),
    default: true,
  });

  return t.StyleSheet([
    FILE_BANNER,
    t.Newline(),
    ...themeMaps,
    t.Newline(),
    t.Comment(`/ Carbon's default theme
/ @type Map
/ @access public
/ @alias carbon--theme--${defaultTheme}
/ @group @carbon/themes`),
    carbonTheme,
  ]);
}

function buildMixinsFile() {
  const comment = t.Comment(`/ Define theme variables from a map of tokens
/ @access public
/ @param {Map} $theme [$${defaultThemeMapName}] - Map of theme tokens
/ @param {Bool} $emit-custom-properties [false] - Output CSS Custom Properties for theme tokens
/ @content Pass in your custom declaration blocks to be used after the token maps set theming variables.
/
/ @example scss
/   // Default usage
/   @include carbon--theme();
/
/   // Alternate styling (not white theme)
/   @include carbon--theme($carbon--theme--g90) {
/     // declarations...
/   }
/
/   // Inline styling
/   @include carbon--theme($carbon--theme--g90) {
/     .my-dark-theme {
/       // declarations...
/     }
/   }
/
/ @group @carbon/themes`);

  // Create carbon--theme mixin, takes a theme as input and assigns all theme
  // variables using the `!global` flag before resetting at the end of the
  // function block
  const mixin = t.SassMixin({
    id: t.Identifier('carbon--theme'),
    params: [
      t.AssignmentPattern({
        left: t.Identifier('theme'),
        right: t.Identifier(defaultThemeMapName),
      }),
      t.AssignmentPattern({
        left: t.Identifier('emit-custom-properties'),
        right: t.SassBoolean(false),
      }),
      t.AssignmentPattern({
        left: t.Identifier('emit-difference'),
        right: t.SassBoolean(false),
      }),
    ],
    body: t.BlockStatement({
      body: [
        ...Object.keys(tokens).flatMap(group => {
          return tokens[group].flatMap(token => {
            const name = formatTokenName(token);

            return t.Assignment({
              id: t.Identifier(name),
              init: t.CallExpression({
                callee: t.Identifier('map-get'),
                arguments: [t.Identifier('theme'), t.SassString(name)],
              }),
              global: true,
            });
          });
        }),
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.SassFunctionCall(t.Identifier('global-variable-exists'), [
              t.SassString('feature-flags'),
            ]),
            operator: 'and',
            right: t.SassFunctionCall(t.Identifier('map-get'), [
              t.Identifier('feature-flags'),
              t.SassString('enable-css-custom-properties'),
            ]),
          }),
          consequent: t.BlockStatement(
            Object.keys(tokens).flatMap(group => {
              return tokens[group]
                .filter(token => {
                  // We don't want to inline CSS Custom Properties for tokens
                  // that are maps, we'll need to use a corresponding mixin for
                  // that token to embed CSS Custom Properties
                  return typeof themes[defaultTheme][token] !== 'object';
                })
                .flatMap(token => {
                  const name = formatTokenName(token);
                  return t.Assignment({
                    id: t.Identifier(name),
                    init: t.CallExpression({
                      callee: t.Identifier('var'),
                      arguments: [
                        t.SassValue({
                          value: `--#{$custom-property-prefix}-${name}`,
                        }),
                        t.CallExpression({
                          callee: t.Identifier('map-get'),
                          arguments: [
                            t.Identifier('theme'),
                            t.SassString(name),
                          ],
                        }),
                      ],
                    }),
                    global: true,
                  });
                });
            })
          ),
        }),
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.Identifier('emit-custom-properties'),
            operator: '==',
            right: t.SassBoolean(true),
          }),
          consequent: t.BlockStatement(
            Object.keys(tokens).flatMap(group => {
              return tokens[group].flatMap(token => {
                const name = formatTokenName(token);
                return [
                  t.Newline(),
                  t.IfStatement({
                    test: t.SassFunctionCall(t.Identifier('should-emit'), [
                      t.Identifier('theme'),
                      t.Identifier('carbon--theme'),
                      t.SassString(name),
                      t.Identifier('emit-difference'),
                    ]),
                    consequent: t.BlockStatement([
                      t.SassMixinCall(t.Identifier('custom-property'), [
                        t.SassString(name),
                        t.SassFunctionCall(t.Identifier('map-get'), [
                          t.Identifier('theme'),
                          t.SassString(name),
                        ]),
                      ]),
                    ]),
                  }),
                ];
              });
            })
          ),
        }),
        t.AtContent(),
        t.Comment(' Reset to default theme after apply in content'),
        t.IfStatement({
          test: t.LogicalExpression({
            left: t.Identifier('theme'),
            operator: '!=',
            right: t.Identifier(defaultThemeMapName),
          }),
          consequent: t.BlockStatement([
            t.SassMixinCall(t.Identifier('carbon--theme')),
          ]),
        }),
      ],
    }),
  });

  return t.StyleSheet([
    FILE_BANNER,
    t.Newline(),
    t.SassImport('./themes'),
    t.Newline(),
    comment,
    mixin,
  ]);
}

/**
 * Transform token names to formats expected by Sassdoc for descriptions and
 * aliases
 * @param {object} metadata - token metadata
 * @returns {object} token metadata
 */
function transformMetadata(metadata) {
  const namesRegEx = new RegExp(
    metadata.tokens.map(token => token.name).join('|'),
    'g'
  );

  const replaceMap = {};
  metadata.tokens.map(token => {
    replaceMap[token.name] = formatTokenName(token.name);
  });

  metadata.tokens.forEach((token, i) => {
    // interactive01 to `$interactive-01`
    if (token.role) {
      token.role.forEach((role, j) => {
        metadata.tokens[i].role[j] = role.replace(namesRegEx, match => {
          return '`$' + replaceMap[match] + '`';
        });
      });
    }

    // brand01 to brand-01
    if (token.alias) {
      token.alias = formatTokenName(token.alias);
    }
  });

  return metadata;
}

function primitive(value) {
  if (typeof value === 'string') {
    if (value[0] === '#') {
      return t.SassColor(value);
    }
    return t.SassValue(value);
  } else if (typeof value === 'number') {
    return t.SassNumber(value);
  } else if (Array.isArray(value)) {
    return t.SassList({
      elements: value.map(primitive),
    });
  } else if (typeof value === 'object') {
    return t.SassMap({
      properties: Object.keys(value).map(key => {
        const quoted = key.includes(' ');
        const identifier = quoted
          ? t.Identifier(key)
          : t.Identifier(formatTokenName(key));
        return t.SassMapProperty({
          key: identifier,
          value: primitive(value[key]),
          quoted,
        });
      }),
    });
  }

  throw new Error(`Unknown primitive type for ${typeof value}`);
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});

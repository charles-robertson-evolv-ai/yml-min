# yml-min

Applies post-processing and minification to scripts and styles contained in Evolv metamodel files.

## Post Processing

### JS

- Babel
- Terser

### CSS

- Post CSS
- sort-media-queries plugin
- cssnano plugin

## Getting started

Install from NPM

```shell
npm install @charles-evolv/yml-min
```

## Usage

After running you will find your minified yml in the `min` directory. A folder will also be created with all the code for all of your contexts and variants can be found there for easy code review.

### Run once

```shell
npx yml-min <metamodel.yml>
```

### Watch for changes

`yml-min` installs with `nodemon` by default, to automatically update paste this into the `scripts` section of your `package.json` file.

```json
"watch": "nodemon --watch <metamodel.yml> --exec \"yml-min <metamodel.yml>\""
```


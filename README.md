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

## Usage:

```shell
yml-min <metamodel.yml>
```

You will find your minified yml in the `min` directory. A folder will also be created with your filename and the code for all of your contexts and variants can be found there for easy code review.
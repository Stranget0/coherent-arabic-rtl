# gameface-arabic-rtl2
This is a helper function for Arabic language support in [Coherent Gameface](https://coherent-labs.com/products/coherent-gameface/). Since it [does not support](https://coherent-labs.com/Documentation/cpp-gameface/d3/d46/complex-text-layout.html) Arabic out of the box at the moment.

### Installation
```
npm i gameface-arabic-rtl2
```

### Example
###### Without gameface-arabic-rtl
![Without gameface-arabic-rtl](/examples/example_wrong.png)
###### With gameface-arabic-rtl
![With gameface-arabic-rtl](/examples/example_right.png)

### Dependencies
I use [Abdulla Saeed's code](https://github.com/6f5/rtl-arabic). But had to manually rewrite it for ES5 due to the fact that on some platforms for the babel-loader, conversion to ES5 for node_modules is disabled.

### Usage
_gameface-arabic-rtl_ is declared as a [Universal Module](https://github.com/umdjs/umd) (UMD), meaning it can be used with all conventional Javascript module systems:

###### ES6
```
import { process } from 'gameface-arabic-rtl';

const text = 'مرحبا بالعالم';
const translateNumbers = true;
const convertedText = process(text, translateNumbers);
```

###### CommonJS
```
const GamefaceArabicRtl = require('gameface-arabic-rtl/dist/gameface-arabic-rtl.min.js');

const text = 'مرحبا بالعالم';
const translateNumbers = true;
const convertedText = process(text, translateNumbers);
```

###### RequireJS
```
require(['GamefaceArabicRtl'], (GamefaceArabicRtl) => {
    const text = 'مرحبا بالعالم';
    const translateNumbers = true;
    const convertedText = process(text, translateNumbers);
});
```

###### HTML5 `<script>` tag
```
<script src="gameface-arabic-rtl.min.js"></script>
<script>
    const text = 'مرحبا بالعالم';
    const translateNumbers = true;
    const convertedText = process(text, translateNumbers);
</script>
```

### Known issues
Since Coherent Gameface does not support OpenType [GSUB](https://docs.microsoft.com/en-us/typography/opentype/spec/gsub) Table lookup, the required glyphs must be present in the font. For example:
```
'ﺖ'.codePointAt(0); // must NOT return undefined
```
Script was tested on __Tahoma__ font.

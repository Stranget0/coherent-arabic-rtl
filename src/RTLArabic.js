import { defineProperty } from "./utils";
import RTLChar from "./RTLChar";

const charSet = {
  alfmd: ["ﺁ", "ﺁ", "ﺂ", "ﺂ"],
  alfhz: ["ﺃ", "ﺃ", "ﺄ", "ﺄ"],
  wowhz: ["ﺅ", "ﺅ", "ﺆ", "ﺆ"],
  alfxr: ["ﺇ", "ﺇ", "ﺈ", "ﺈ"],
  hamzk: ["ﺉ", "ﺋ", "ﺌ", "ﺊ"],
  alfff: ["ﺍ", "ﺍ", "ﺎ", "ﺎ"],
  baaaa: ["ﺏ", "ﺑ", "ﺒ", "ﺐ"],
  tamrb: ["ﺓ", "ﺓ", "ﺔ", "ﺔ"],
  taaaa: ["ﺕ", "ﺗ", "ﺘ", "ﺖ"],
  thaaa: ["ﺙ", "ﺛ", "ﺜ", "ﺚ"],
  geeem: ["ﺝ", "ﺟ", "ﺠ", "ﺞ"],
  haaaa: ["ﺡ", "ﺣ", "ﺤ", "ﺢ"],
  khaaa: ["ﺥ", "ﺧ", "ﺨ", "ﺦ"],
  daaal: ["ﺩ", "ﺩ", "ﺪ", "ﺪ"],
  thaal: ["ﺫ", "ﺫ", "ﺬ", "ﺬ"],
  raaaa: ["ﺭ", "ﺭ", "ﺮ", "ﺮ"],
  zaaai: ["ﺯ", "ﺯ", "ﺰ", "ﺰ"],
  seeen: ["ﺱ", "ﺳ", "ﺴ", "ﺲ"],
  sheen: ["ﺵ", "ﺷ", "ﺸ", "ﺶ"],
  saaad: ["ﺹ", "ﺻ", "ﺼ", "ﺺ"],
  daaad: ["ﺽ", "ﺿ", "ﻀ", "ﺾ"],
  taaah: ["ﻁ", "ﻃ", "ﻄ", "ﻂ"],
  daaah: ["ﻅ", "ﻇ", "ﻈ", "ﻆ"],
  aayen: ["ﻉ", "ﻋ", "ﻌ", "ﻊ"],
  gayen: ["ﻍ", "ﻏ", "ﻐ", "ﻎ"],
  faaaa: ["ﻑ", "ﻓ", "ﻔ", "ﻒ"],
  qaaaf: ["ﻕ", "ﻗ", "ﻘ", "ﻖ"],
  kaaaf: ["ﻙ", "ﻛ", "ﻜ", "ﻚ"],
  laaam: ["ﻝ", "ﻟ", "ﻠ", "ﻞ"],
  meeem: ["ﻡ", "ﻣ", "ﻤ", "ﻢ"],
  nooon: ["ﻥ", "ﻧ", "ﻨ", "ﻦ"],
  hhhhh: ["ﻩ", "ﻫ", "ﻬ", "ﻪ"],
  wowww: ["ﻭ", "ﻭ", "ﻮ", "ﻮ"],
  yaamd: ["ﻯ", "ﻯ", "ﻰ", "ﻰ"],
  yaaaa: ["ﻱ", "ﻳ", "ﻴ", "ﻲ"],
  laamd: ["ﻵ", "ﻵ", "ﻶ", "ﻶ"],
  laahz: ["ﻷ", "ﻷ", "ﻸ", "ﻸ"],
  laaxr: ["ﻹ", "ﻹ", "ﻺ", "ﻺ"],
  laaaa: ["ﻻ", "ﻻ", "ﻼ", "ﻼ"],
};

class RTLArabic extends String {
  constructor(str, config = {}) {
    super(str === null || str === void 0 ? void 0 : str.trim()); // Config/Options

    this.config = config; // List of str characters

    this.chars = str.split(""); // Converted Arabic String

    this.convertedStr = "";
    this.pos = 0;
    this.engStr = "";
    this.init();
  }

  init() {
    if (typeof this.config !== "object") {
      throw new Error("Config must be an object");
    }

    this.config = {
      harakat: true,
      numbers: false,
      ...this.config,
    };
  }

  convertNumbers() {
    const numberToArabic = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
    let result = "";
    for (let i = 0; i < this.chars.length; i++) {
      const letter = this.chars[i];
      const arabicNumber =
        numberToArabic[isNan(letter) ? -1 : parseInt(letter)];
      result += arabicNumber || letter;
    }
    this.chars = result.split();
  }

  ignoreHarakat(before, after, index) {
    let char = new RTLChar(this.chars[index - before]);

    while ((_char = char) !== null && _char !== void 0 && _char.isHaraka()) {
      var _char;

      before++;
      char = new RTLChar(this.chars[index - before]);
    }

    char = new RTLChar(this.chars[index + after]);

    while ((_char2 = char) !== null && _char2 !== void 0 && _char2.isHaraka()) {
      var _char2;

      after++;
      char = new RTLChar(this.chars[index + after]);
    }

    return [before, after];
  }

  addEngChar(index) {
    // Add english letters, numbers, and symbols as is
    while (
      RTLArabic.arabic.indexOf(this.chars[index]) < 0 &&
      RTLArabic.unicode.indexOf(this.chars[index]) < 0 &&
      this.chars[index] !== undefined
    ) {
      this.engStr += this.chars[index];
      index++;

      if (this.chars[index] == "\n") {
        break;
      }
    } // Add spaces

    let engChars = this.engStr.split("");
    let lastCharPos = engChars.length - 1;

    if (lastCharPos === 1 && engChars[1] === " ") {
      // Make sure spaces between arabic and english text displays correctly
      this.engStr = " " + engChars[0];
    } else {
      while (engChars[lastCharPos] === " ") {
        this.engStr = " " + this.engStr.substring(0, this.engStr.length - 1);
        lastCharPos -= 1;
      }
    } // Put together the arabic and english text

    this.convertedStr = this.engStr + this.convertedStr;
    this.engStr = ""; // set the loop pointer to the first char after the english text.

    index--;
    return index;
  }

  addChar(char) {
    this.convertedStr = char + this.convertedStr;
  }

  handleEOL(char) {
    if (char === "\r") return; // Add new line character to converted text as is

    this.convertedStr = "\n" + this.convertedStr;
  }

  getChar(key) {
    return charSet[key][this.pos];
  }

  runTests(char, index) {
    if (char.isEOL()) {
      this.handleEOL(char);
    } else if (char.isBracket()) {
      index = this.addEngChar(index);
    } else if (char == "ء") {
      this.addChar(String.fromCodePoint(1569));
    } else if (char == "آ") {
      //dealing with letters, output each letter with its right position
      this.addChar(this.getChar("alfmd"));
    } else if (char == "أ") {
      this.addChar(this.getChar("alfhz"));
    } else if (char == "ؤ") {
      this.addChar(this.getChar("wowhz"));
    } else if (char == "إ") {
      this.addChar(this.getChar("alfxr"));
    } else if (char == "ئ") {
      this.addChar(this.getChar("hamzk"));
    } else if (char == "ا") {
      this.addChar(this.getChar("alfff"));
    } else if (char == "ب") {
      this.addChar(this.getChar("baaaa"));
    } else if (char == "ة") {
      this.addChar(this.getChar("tamrb"));
    } else if (char == "ت") {
      this.addChar(this.getChar("taaaa"));
    } else if (char == "ث") {
      this.addChar(this.getChar("thaaa"));
    } else if (char == "ج") {
      this.addChar(this.getChar("geeem"));
    } else if (char == "ح") {
      this.addChar(this.getChar("haaaa"));
    } else if (char == "خ") {
      this.addChar(this.getChar("khaaa"));
    } else if (char == "د") {
      this.addChar(this.getChar("daaal"));
    } else if (char == "ذ") {
      this.addChar(this.getChar("thaal"));
    } else if (char == "ر") {
      this.addChar(this.getChar("raaaa"));
    } else if (char == "ز") {
      this.addChar(this.getChar("zaaai"));
    } else if (char == "س") {
      this.addChar(this.getChar("seeen"));
    } else if (char == "ش") {
      this.addChar(this.getChar("sheen"));
    } else if (char == "ص") {
      this.addChar(this.getChar("saaad"));
    } else if (char == "ض") {
      this.addChar(this.getChar("daaad"));
    } else if (char == "ط") {
      this.addChar(this.getChar("taaah"));
    } else if (char == "ظ") {
      this.addChar(this.getChar("daaah"));
    } else if (char == "ع") {
      this.addChar(this.getChar("aayen"));
    } else if (char == "غ") {
      this.addChar(this.getChar("gayen"));
    } else if (char == "ف") {
      this.addChar(this.getChar("faaaa"));
    } else if (char == "ق") {
      this.addChar(this.getChar("qaaaf"));
    } else if (char == "ك") {
      this.addChar(this.getChar("kaaaf"));
    } else if (char == "ل") {
      index++; //dealing with la combination

      if (this.chars[index] == "ا") {
        this.addChar(this.getChar("laaaa"));
      } else if (this.chars[index] == "أ") {
        this.addChar(this.getChar("laahz"));
      } else if (this.chars[index] == "إ") {
        this.addChar(this.getChar("laaxr"));
      } else if (this.chars[index] == "آ") {
        this.addChar(this.getChar("laamd"));
      } else {
        index--;
        this.addChar(this.getChar("laaam"));
      }
    } else if (char == "م") {
      this.addChar(this.getChar("meeem"));
    } else if (char == "ن") {
      this.addChar(this.getChar("nooon"));
    } else if (char == "ه") {
      this.addChar(this.getChar("hhhhh"));
    } else if (char == "و") {
      this.addChar(this.getChar("wowww"));
    } else if (char == "ى") {
      this.addChar(this.getChar("yaamd"));
    } else if (char == "ي") {
      this.addChar(this.getChar("yaaaa"));
    } else if (char == "لآ") {
      this.addChar(this.getChar("laamd"));
    } else if (char == "لأ") {
      this.addChar(this.getChar("laahz"));
    } else if (char == "لإ") {
      this.addChar(this.getChar("laaxr"));
    } else if (char == "لا") {
      this.addChar(this.getChar("laaaa"));
    } else if (char.isSymbol()) {
      //if the char is a symbol, add it
      this.addChar(char);
    } else if (RTLArabic.unicode.indexOf(char) >= 0) {
      //if the char is an arabic reversed letter, reverse it back!
      this.addChar(char); //if the char is none of the above, then treat it as english text (dont reverse)
    } else {
      index = this.addEngChar(index);
    }

    return index;
  }

  convert() {
    if (this.config.numbers) {
      this.convertNumbers();
    }

    const len = this.chars.length;

    for (let i = 0; i < len; i++) {
      const CURRENT_CHAR = new RTLChar(this.chars[i]);
      let before = 1;
      let after = 1;

      if (this.config.harakat) {
        // ignore harakat
        [before, after] = this.ignoreHarakat(before, after, i);
      }

      // Get character position
      let charBefore = new RTLChar(this.chars[i - before]);
      let charAfter = new RTLChar(this.chars[i + after]);

      charBefore = charBefore != "undefined" ? charBefore : null;
      charAfter = charAfter != "undefined" ? charAfter : null;

      this.pos = CURRENT_CHAR.getPos(charBefore, charAfter);

      i = this.runTests(CURRENT_CHAR, i);
    }

    return this.convertedStr;
  }
}

// Unicode
defineProperty(
  RTLArabic,
  "unicode",
  "ﺁﺁﺂﺂﺃﺃﺄﺄﺅﺅﺆﺆﺇﺇﺈﺈﺉﺋﺌﺊﺍﺍﺎﺎﺏﺑﺒﺐﺓﺓﺔﺔﺕﺗﺘﺖﺙﺛﺜﺚﺝﺟﺠﺞﺡﺣﺤﺢﺥﺧﺨﺦﺩﺩﺪﺪﺫﺫﺬﺬﺭﺭﺮﺮﺯﺯﺰﺰﺱﺳﺴﺲﺵﺷﺸﺶﺹﺻﺼﺺﺽﺿﻀﺾﻁﻃﻄﻂﻅﻇﻈﻆﻉﻋﻌﻊﻍﻏﻐﻎﻑﻓﻔﻒﻕﻗﻘﻖﻙﻛﻜﻚﻝﻟﻠﻞﻡﻣﻤﻢﻥﻧﻨﻦﻩﻫﻬﻪﻭﻭﻮﻮﻯﻯﻰﻰﻱﻳﻴﻲﻵﻵﻶﻶﻷﻷﻸﻸﻹﻹﻺﻺﻻﻻﻼﻼ"
);
// All Arabic letters, harakat and symbols
defineProperty(
  RTLArabic,
  "arabic",
  "ًٌٍَُِّْْئءؤرلاىةوزظشسيبلاتنمكطضصثقفغعهخحجدذْلآآلأأـلإإ،؟"
);
// Arabic, English numbers
defineProperty(RTLArabic, "numbers", "0123456789٠١٢٣٤٥٦٧٨٩");

export default RTLArabic;

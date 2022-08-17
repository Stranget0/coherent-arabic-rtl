import RTLArabic from "./src/RTLArabic";

function process(sentence, numbers = false) {
  const options = {
    harakat: true,
    numbers,
  };

  return new RTLArabic(sentence, options).convert();
}

export { process };

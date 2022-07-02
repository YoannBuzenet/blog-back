const slateConstants = {
  paragraph: "paragraph",
  blockQuote: "block-quote",
  h1: "heading-one",
  h2: "heading-two",
  numberedList: "numbered-list",
  bulletList: "bulleted-list",
};

const createBlock = ({ type, children }) => {
  //if children is not an array, just put it
  if (!Array.isArray(children)) {
    return `{ "type":"${slateConstants[type]}", "children": [{"text" :"${children}"}]}`;
  }

  return `{ "type": "${slateConstants[type]}", "children": [${children.map(
    (child) => createChild({ text: child.text, options: child.options })
  )}]}`;
};

const createChild = ({ text, options }) => {
  const objectToStringify = { text };

  if (Array.isArray(options)) {
    for (const style of options) {
      objectToStringify[style] = true;
    }
  } else {
    objectToStringify[options] = true;
  }

  const objectStringified = JSON.stringify(objectToStringify);

  return objectStringified;
};

// Slate wants its strigified tree-formated style
// https://docs.slatejs.org/v/v0.47/walkthroughs/saving-to-a-database

// One depth level with one child tree node : the simplest form
const formatSimple = (text) => {
  return `[${createBlock({ type: "paragraph", children: text })}]`;
};

const formatComplex = (array) => {
  let newArrayForSlate = [];

  // mapper l'array, créer des blocks avec leurs enfants

  for (let i = 0; i < array.length; i++) {
    newArrayForSlate = [...newArrayForSlate, JSON.parse(createBlock(array[i]))];
  }

  const stringifiedArray = JSON.stringify(newArrayForSlate);

  return stringifiedArray;
};

module.exports = { formatSimple, formatComplex };

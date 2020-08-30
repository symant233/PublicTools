// case convert (string)

const camelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => {
    return `_${letter.toLowerCase()}`;
  });
};

const camelToKebabCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => {
    return `-${letter.toLowerCase()}`;
  });
};

const toCamel = (str) => {
  return str.replace(/(-|_)./g, (comb) => {
    return `${comb.toUpperCase()[1]}`;
  });
};

let t1 = "oneCamelCase";
let t3 = "combine-two_cases";

console.log(camelToSnakeCase(t1)); // one_camel_case
console.log(camelToKebabCase(t1)); // one-camel-case
console.log(toCamel(t3)); // combineTwoCases

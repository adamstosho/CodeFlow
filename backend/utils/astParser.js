const acorn = require('acorn');

function parseJavaScript(code) {
  return acorn.parse(code, { ecmaVersion: 'latest' });
}

module.exports = { parseJavaScript }; 
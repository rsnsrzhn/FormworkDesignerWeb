const ts = require("typescript");
module.exports = function (source) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
    fileName: this.resourcePath,
  });
  return result.outputText;
};

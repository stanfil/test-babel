const parser = require('@babel/parser');
const { callExpression } = require('@babel/types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');

const code = `const x = (a, b) => { console.log(a + b); return a + b; }`

const ast = parser.parse(code)

traverse(ast, {
  ArrowFunctionExpression (path) {


    // const body = t.blockStatement([
    //   t.returnStatement(path.node.body)
    // ])

    console.log(path.node.body.type)

    const sourceBodyType = path.node.body.type;

    const body = sourceBodyType === 'BlockStatement' ? path.node.body
      : t.blockStatement([
        t.returnStatement(path.node.body)
      ])
    path.replaceWith(
      t.functionExpression(
        null,
        path.node.params,
        body,
        false,
        false
      )
    )
  },
  
  CallExpression(path) {
    const callee = path.node.callee

    if (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.object, { name: 'console' }) &&
      t.isIdentifier(callee.property, { name: 'log' })
    ) {

      if (t.isExpressionStatement(path.parentPath.node)) {
        path.parentPath.remove();
      } else {
        path.remove();
      }
    }
  }
})

const output = generator(ast)

console.log(output.code);


// Converts a JS AST to Mermaid flowchart syntax (Mermaid-safe: correct node label brackets)
let nodeId = 0;
function getId() {
  return `N${nodeId++}`;
}

function safeLabel(label, type = 'rect') {
  if (!label) label = '';
  // Replace problematic characters
  const clean = String(label).replace(/"/g, "'").replace(/[\[\]{}]/g, '').replace(/[:]/g, ' -').replace(/[()]/g, '').replace(/\n/g, ' ');
  if (type === 'diamond') return `{\"${clean}\"}`;
  return `[\"${clean}\"]`;
}

function astToMermaid(ast) {
  nodeId = 0;
  let lines = ['graph TD'];
  let entry = getId();
  lines.push(`${entry}${safeLabel('Start')}`);
  let last = walk(ast, entry, lines, {});
  if (last && last !== entry) {
    lines.push(`${last}-->End${safeLabel('End')}`);
  } else {
    lines.push(`${entry}-->End${safeLabel('End')}`);
  }
  return lines.join('\n');
}

function walk(node, parent, lines, ctx) {
  if (!node) return parent;
  if (Array.isArray(node)) {
    let last = parent;
    for (const n of node) {
      last = walk(n, last, lines, ctx);
    }
    return last;
  }
  switch (node.type) {
    case 'Program':
      return walk(node.body, parent, lines, ctx);
    case 'FunctionDeclaration':
    case 'FunctionExpression':
    case 'ArrowFunctionExpression': {
      const funcId = getId();
      const params = node.params.map(getSource).join(', ');
      let label = node.type === 'ArrowFunctionExpression' ? 'Function arrow' : 'Function';
      if (node.generator) label += ' generator';
      if (node.async) label += ' async';
      label += ` ${node.id ? node.id.name : (node.type === 'FunctionDeclaration' ? 'anonymous' : '')} ${params}`;
      lines.push(`${parent}-->${funcId}${safeLabel(label)}`);
      return walk(node.body, funcId, lines, { ...ctx, currentFunction: node.id ? node.id.name : 'anonymous' });
    }
    case 'BlockStatement':
      return walk(node.body, parent, lines, ctx);
    case 'IfStatement': {
      const ifId = getId();
      lines.push(`${parent}-->${ifId}${safeLabel('If ' + getSource(node.test), 'diamond')}`);
      const thenId = walk(node.consequent, ifId, lines, ctx);
      let elseId = ifId;
      if (node.alternate) {
        elseId = walk(node.alternate, ifId, lines, ctx);
      }
      return [thenId, elseId].filter(Boolean).pop() || ifId;
    }
    case 'ReturnStatement': {
      const retId = getId();
      lines.push(`${parent}-->${retId}${safeLabel('Return ' + getSource(node.argument))}`);
      return retId;
    }
    case 'ForStatement': {
      const forId = getId();
      lines.push(`${parent}-->${forId}${safeLabel('For ' + getSource(node.test))}`);
      const bodyId = walk(node.body, forId, lines, ctx);
      lines.push(`${bodyId}-->${forId}`); // loop back
      return forId;
    }
    case 'WhileStatement': {
      const whileId = getId();
      lines.push(`${parent}-->${whileId}${safeLabel('While ' + getSource(node.test))}`);
      const bodyId = walk(node.body, whileId, lines, ctx);
      lines.push(`${bodyId}-->${whileId}`); // loop back
      return whileId;
    }
    case 'DoWhileStatement': {
      const doId = getId();
      lines.push(`${parent}-->${doId}${safeLabel('DoWhile ' + getSource(node.test))}`);
      const bodyId = walk(node.body, doId, lines, ctx);
      lines.push(`${bodyId}-->${doId}`); // loop back
      return doId;
    }
    case 'SwitchStatement': {
      const switchId = getId();
      lines.push(`${parent}-->${switchId}${safeLabel('Switch ' + getSource(node.discriminant), 'diamond')}`);
      let last = switchId;
      for (const cs of node.cases) {
        const caseId = getId();
        const label = cs.test ? 'Case ' + getSource(cs.test) : 'Default';
        lines.push(`${switchId}-->${caseId}${safeLabel(label)}`);
        last = walk(cs.consequent, caseId, lines, ctx);
      }
      return last;
    }
    case 'TryStatement': {
      const tryId = getId();
      lines.push(`${parent}-->${tryId}${safeLabel('Try')}`);
      let last = walk(node.block, tryId, lines, ctx);
      if (node.handler) {
        const catchId = getId();
        lines.push(`${tryId}-->${catchId}${safeLabel('Catch ' + (node.handler.param ? getSource(node.handler.param) : ''))}`);
        last = walk(node.handler.body, catchId, lines, ctx);
      }
      if (node.finalizer) {
        const finallyId = getId();
        lines.push(`${tryId}-->${finallyId}${safeLabel('Finally')}`);
        last = walk(node.finalizer, finallyId, lines, ctx);
      }
      return last;
    }
    case 'ThrowStatement': {
      const throwId = getId();
      lines.push(`${parent}-->${throwId}${safeLabel('Throw ' + getSource(node.argument))}`);
      return throwId;
    }
    case 'BreakStatement': {
      const breakId = getId();
      lines.push(`${parent}-->${breakId}${safeLabel('Break')}`);
      return breakId;
    }
    case 'ContinueStatement': {
      const contId = getId();
      lines.push(`${parent}-->${contId}${safeLabel('Continue')}`);
      return contId;
    }
    case 'AwaitExpression': {
      const awaitId = getId();
      lines.push(`${parent}-->${awaitId}${safeLabel('Await ' + getSource(node.argument))}`);
      return awaitId;
    }
    case 'ExpressionStatement': {
      if (node.expression.type === 'CallExpression') {
        let callNode = node.expression;
        let prevId = parent;
        while (callNode && callNode.type === 'CallExpression') {
          const callId = getId();
          const callee = getSource(callNode.callee);
          const args = callNode.arguments.map(getSource).join(', ');
          const isRecursion = ctx.currentFunction && callee === ctx.currentFunction;
          const label = isRecursion ? `Recursive Call ${callee} ${args}` : `Call ${callee} ${args}`;
          lines.push(`${prevId}-->${callId}${safeLabel(label)}`);
          prevId = callId;
          callNode = callNode.callee && callNode.callee.type === 'CallExpression' ? callNode.callee : null;
        }
        return prevId;
      }
      if (node.expression.type === 'AssignmentExpression') {
        const assignId = getId();
        lines.push(`${parent}-->${assignId}${safeLabel('Assign ' + getSource(node.expression.left) + ' = ' + getSource(node.expression.right))}`);
        return assignId;
      }
      if (node.expression.type === 'UpdateExpression') {
        const updId = getId();
        lines.push(`${parent}-->${updId}${safeLabel('Update ' + getSource(node.expression.argument) + node.expression.operator)}`);
        return updId;
      }
      if (node.expression.type === 'AwaitExpression') {
        const awaitId = getId();
        lines.push(`${parent}-->${awaitId}${safeLabel('Await ' + getSource(node.expression.argument))}`);
        return awaitId;
      }
      if (node.expression.type === 'LogicalExpression') {
        const logicId = getId();
        lines.push(`${parent}-->${logicId}${safeLabel('Logic ' + getSource(node.expression), 'diamond')}`);
        const leftId = walk(node.expression.left, logicId, lines, ctx);
        const rightId = walk(node.expression.right, logicId, lines, ctx);
        return [leftId, rightId].filter(Boolean).pop() || logicId;
      }
      return parent;
    }
    case 'VariableDeclaration': {
      let last = parent;
      for (const decl of node.declarations) {
        const varId = getId();
        const value = decl.init ? getSource(decl.init) : '';
        lines.push(`${last}-->${varId}${safeLabel('Var ' + decl.id.name + (value ? ' = ' + value : ''))}`);
        last = varId;
      }
      return last;
    }
    case 'AssignmentExpression': {
      const assignId = getId();
      lines.push(`${parent}-->${assignId}${safeLabel('Assign ' + getSource(node.left) + ' = ' + getSource(node.right))}`);
      return assignId;
    }
    case 'UpdateExpression': {
      const updId = getId();
      lines.push(`${parent}-->${updId}${safeLabel('Update ' + getSource(node.argument) + node.operator)}`);
      return updId;
    }
    case 'LogicalExpression':
    case 'BinaryExpression':
    case 'UnaryExpression':
    case 'ArrayExpression':
    case 'ObjectExpression':
    case 'SequenceExpression': {
      const exprId = getId();
      lines.push(`${parent}-->${exprId}${safeLabel('Expr ' + getSource(node))}`);
      return exprId;
    }
    default:
      if (node.body) return walk(node.body, parent, lines, ctx);
      if (node.expression) return walk(node.expression, parent, lines, ctx);
      const unknownId = getId();
      lines.push(`${parent}-->${unknownId}${safeLabel('Unknown ' + node.type)}`);
      return unknownId;
  }
}

function getSource(node) {
  if (!node) return '';
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'Literal') return node.raw || String(node.value);
  if (node.type === 'MemberExpression') {
    return getSource(node.object) + '.' + getSource(node.property);
  }
  if (node.type === 'CallExpression') {
    return getSource(node.callee) + '(' + node.arguments.map(getSource).join(', ') + ')';
  }
  if (node.type === 'BinaryExpression') {
    return `${getSource(node.left)} ${node.operator} ${getSource(node.right)}`;
  }
  if (node.type === 'UnaryExpression') {
    return node.operator + getSource(node.argument);
  }
  if (node.type === 'AssignmentExpression') {
    return `${getSource(node.left)} = ${getSource(node.right)}`;
  }
  if (node.type === 'UpdateExpression') {
    return `${getSource(node.argument)}${node.operator}`;
  }
  if (node.type === 'LogicalExpression') {
    return `${getSource(node.left)} ${node.operator} ${getSource(node.right)}`;
  }
  if (node.type === 'ArrayExpression') {
    return '[' + node.elements.map(getSource).join(', ') + ']';
  }
  if (node.type === 'ObjectExpression') {
    return '{' + node.properties.map(p => `${getSource(p.key)}: ${getSource(p.value)}`).join(', ') + '}';
  }
  if (node.type === 'SequenceExpression') {
    return node.expressions.map(getSource).join(', ');
  }
  if (node.type === 'AwaitExpression') {
    return 'await ' + getSource(node.argument);
  }
  return node.type;
}

module.exports = astToMermaid;
import * as ts from 'typescript';
import * as Lint from 'tslint';

export function isParameterProperty(node: ts.ParameterDeclaration): boolean {
    return Lint.hasModifier(node.modifiers,
                            ts.SyntaxKind.PublicKeyword,
                            ts.SyntaxKind.ProtectedKeyword,
                            ts.SyntaxKind.PrivateKeyword,
                            ts.SyntaxKind.ReadonlyKeyword);
}

export function hasAccessModifier(node: ts.Node): boolean {
    return Lint.hasModifier(node.modifiers,
                            ts.SyntaxKind.PublicKeyword,
                            ts.SyntaxKind.ProtectedKeyword,
                            ts.SyntaxKind.PrivateKeyword);
}

export function destructDeclarationContains(pattern: ts.BindingPattern, name: string, ignoreDefaults?: boolean): boolean {
    for (let element of pattern.elements) {
        if (element.kind !== ts.SyntaxKind.BindingElement)
            continue;

        const bindingElement = <ts.BindingElement>element;
        // defaulting to undefined is not really a default -> check for undefined and void initializer
        if (ignoreDefaults && bindingElement.initializer !== undefined && !isUndefined(bindingElement.initializer))
            continue;

        if (bindingNameContains(bindingElement.name, name))
            return true;
    }
    return false;
}

export function bindingNameContains(bindingName: ts.BindingName, name: string, ignoreDefaults?: boolean): boolean {
    return bindingName.kind === ts.SyntaxKind.Identifier ?
           (<ts.Identifier>bindingName).text === name :
           destructDeclarationContains(bindingName, name, ignoreDefaults);
}

export function isUndefined(expression: ts.Expression): boolean {
    return expression.kind === ts.SyntaxKind.Identifier && (<ts.Identifier>expression).text === 'undefined' ||
        expression.kind === ts.SyntaxKind.VoidExpression;
}

export function getPreviousStatement(statement: ts.Statement): ts.Statement|undefined {
    const parent = <ts.BlockLike>statement.parent;
    if (isBlockLike(parent)) {
        const index = parent.statements.indexOf(statement);
        if (index > 0)
            return parent.statements[index - 1];
    }
    return;
}

export function isBlockLike(node: ts.Node): node is ts.BlockLike {
    return 'statements' in node;
}

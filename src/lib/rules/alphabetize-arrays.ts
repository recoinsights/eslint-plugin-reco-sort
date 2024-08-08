export default {
    create(context: any): { ArrayExpression(node: any): void } {
        return {
            ArrayExpression(node: any): void {
                // Check if all elements are string literals
                if (
                    node.elements.every(
                        (element: any) => element && element.type === "Literal" && typeof element.value === "string",
                    )
                ) {
                    const elements = node.elements.map((element: any) => element.value);
                    const sortedElements = [...elements].sort();

                    if (elements.some((value: any, index: any) => value !== sortedElements[index])) {
                        context.report({
                            fix(fixer: any) {
                                const sourceCode = context.getSourceCode();
                                const arrayText = node.elements
                                    .map((element: any) => sourceCode.getText(element))
                                    .sort()
                                    .join(", ");

                                return fixer.replaceText(node, `[${arrayText}]`);
                            },
                            message: "Array elements should be in alphabetical order.",
                            node,
                        });
                    }
                }
            },
        };
    },
    meta: {
        docs: {
            category: "Stylistic Issues",
            description: "enforce arrays containing only strings to be alphabetically sorted",
            recommended: false,
        },
        fixable: "code",
        type: "suggestion",
    },
};

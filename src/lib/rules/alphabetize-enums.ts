export default {
    create(context: any): { TSEnumDeclaration(node: any): void } {
        return {
            TSEnumDeclaration(node: any): void {
                // Extract the names of the enum members
                const enumKeys = node.members.map((member: any) => member.id.name);
                // Get a sorted version of the enum keys
                const sortedKeys = [...enumKeys].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

                // Check if the original order matches the sorted order
                if (enumKeys.some((key: any, index: any) => key !== sortedKeys[index])) {
                    context.report({
                        fix(fixer: any) {
                            const sourceCode = context.getSourceCode();
                            // Generate the fixed enum string
                            const sortedEnumText = node.members
                                .map((_: any, index: any) => {
                                    const originalIndex = enumKeys.indexOf(sortedKeys[index]);
                                    return sourceCode.getText(node.members[originalIndex]);
                                })
                                .join(",\n");

                            return fixer.replaceTextRange(
                                [node.members[0].range[0], node.members[node.members.length - 1].range[1]],
                                sortedEnumText,
                            );
                        },
                        message: "Enum keys should be in alphabetical order.",
                        node,
                    });
                }
            },
        };
    },
    meta: {
        docs: {
            category: "Stylistic Issues",
            description: "enforce enum keys to be in alphabetical order",
            recommended: false,
        },
        fixable: "code",
        schema: [], // no options
        type: "suggestion",
    },
};

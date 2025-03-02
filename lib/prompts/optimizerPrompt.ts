export const getOptimizerPrompt = () => {
    return (`
        Instructions:
        - Remove all the comments and explanations from the code.
        - Do not use custom interface or types. Use predefined types like string, number etc.
    `);
}; 


declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
module.exports = {
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    moduleNameMapper: {
        // Add any necessary mappings here
    }
};

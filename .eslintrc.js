module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "prettier": [
                        true,
                        ".prettierrc"
                    ]
                }
            }
        ]
    }
};

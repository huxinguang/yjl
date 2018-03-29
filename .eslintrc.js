module.exports = {

    "env": {

        "browser": false,

        "commonjs": true,

        "es6": true,

        "node": true

    },

    "extends": ["eslint:recommended", "plugin:react/recommended"],

    "parser": "babel-eslint",

    "parserOptions": {

        "ecmaFeatures": {

            "experimentalObjectRestSpread": true,

            "jsx": true

        },

        "sourceType": "module"

    },

    "plugins": [

        "react",

        "react-native"

    ],

    "rules": {

        "indent": [

            "warn",

            4

        ],

        "linebreak-style": [

            "warn",

            "unix"

        ],

        "quotes": [

            "warn",

            "single"

        ],

        "semi": [

            "warn",

            "always"

        ],

        "react-native/no-unused-styles": 2,

        "react-native/split-platform-components": 2

    }

};
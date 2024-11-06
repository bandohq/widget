// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 2020,
      "sourceType": "module"
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "plugins": ["@typescript-eslint"]
  }
  
)

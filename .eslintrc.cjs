module.exports = {
  root: true,
  extends: [
    require.resolve('@vercel/style-guide/eslint/node'),
    require.resolve('@vercel/style-guide/eslint/typescript'),
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.cjs', 'vitest.config.ts'],
  parserOptions: {
    project: 'tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      },
    },
  },
  rules: {
    'no-console': 'off',
    'import/no-named-as-default-member': 'off'
  },
};

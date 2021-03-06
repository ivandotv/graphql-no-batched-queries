module.exports = {
  'packages/*/src/**/*.{js,jsx,ts,tsx,json,css,scss,md}': [
    'eslint --fix',
    'prettier --ignore-unknown --write'
  ],
  'tests/**/*.{js,jsx,ts,tsx,json}': [
    'eslint --fix',
    'prettier --ignore-unknown --write'
  ]
}

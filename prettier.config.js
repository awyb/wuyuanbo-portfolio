/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],

  // Tailwind 相关配置
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'tw'],

  // 通用格式化配置
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
};

module.exports = config;
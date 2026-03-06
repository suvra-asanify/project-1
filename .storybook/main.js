module.exports = {
  framework: {
    name: '@storybook/vue3-webpack5',
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  docs: {
    autodocs: 'tag',
  },
};

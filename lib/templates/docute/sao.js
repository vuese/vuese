module.exports = (options) => {
  const {title} = options
  const config = {
    data (answers) {
      return {
        title: title || answers.title,
        componentNames: options.componentNames,
        markdownDir: options.markdownDir
      }
    }
  }
  if (!title) config.prompts = {
    title: {
      type: 'input',
      message: 'Sidbar title:',
      default: 'Components'
    }
  }
  return config;
}

module.exports = (options) => {
  const { title, componentNames, markdownDir } = options
  const config = {
    data (answers) {
      return {
        title: title || answers.title,
        componentNames,
        markdownDir
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

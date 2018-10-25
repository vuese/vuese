module.exports = (options) => {
  return {
    prompts: {
      title: {
        type: 'input',
        message: 'Sidbar title:',
        default: 'Components'
      }
    },
    data (answers) {
      return {
        title: answers.title,
        componentNames: options.componentNames,
        markdownDir: options.markdownDir
      }
    }
  }
}
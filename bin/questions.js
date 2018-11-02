module.exports = [
  {
    type: 'list',
    name: 'genType',
    message: 'Select the target to generate',
    default: 'docute',
    choices: [
      {
        name:
          'Docute - The fastest way to create a documentation site for your project.',
        value: 'docute'
      },
      {
        name: 'Only markdown.',
        value: 'markdown'
      }
    ]
  }
]

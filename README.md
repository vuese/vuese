# vuese (processing)

*Your vue `SFC` is your document* - Parsing Vue `SFC` and generating documentation.

## Status

[![build status](https://badgen.net/circleci/github/HcySunYang/vuese/master)](https://circleci.com/gh/HcySunYang/vuese/tree/master)

## Install

```sh
yarn global add vuese
```

## Table of contents

<!-- toc -->

- [Features](#features)
- [Usage](#usage)
  * [Basic](#basic)
  * [Use configuration file](#use-configuration-file)
    + [include](#include)
    + [exclude](#exclude)
    + [outDir](#outdir)
    + [markdownDir](#markdowndir)
  * [Used in nodejs](#used-in-nodejs)
    + [parser](#parser)
      - [ParserResult](#parserresult)
      - [ParserOptions](#parseroptions)
    + [Render](#render)
      - [RenderResult](#renderresult)

<!-- tocstop -->

## Features

- [x] Identify `name`, `props`, `events`, `slots`, `methods` and generate corresponding markdown content.
- [x] Generate markdown files.
- [x] Document integration: generate a [docute](https://docute.org/) document.
- [x] Annotation enhancement (`@xxx`).
- [x] `cli` & `Core module` for nodejs.

- [ ] Support `ts` & [vue-class-component](https://github.com/vuejs/vue-class-component) & [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator)
- [ ] Support for `slots` in `render` function.
- [ ] Identify `v-model`

## Usage

### Basic

Previously: When you created a Vue component, you needed to manually write the documentation, including the components' props, events, slots, and some methods.

Now: If you created the following components.

```html
<template>
  <div>
    <!-- Form header -->
    <slot name="header">
      <!-- `<th>title</th>` -->
      <th>title</th>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    // The name of the form, up to 8 characters
    name: {
      type: [String, Number],
      required: true,
      validator () {}
    }
  },
  methods: {
    // @vuese
    // Used to manually clear the form
    clear () {
      // Fire when the form is cleared
      // @arg The argument is a boolean value representing xxx
      this.$emit('onclear', true)
    }
  }
}
</script>
```

We assume that the above component is `components/comp.vue`, then you only need to execute the following command:

```sh
vuese gen --include="components/*.vue"
```

Then you can choose which type of document to generate: just markdown or generate a [docute](https://docute.org/) document:

![](https://raw.githubusercontent.com/HcySunYang/vuese/master/imags/vuese-cli-gen.jepg)

If you choose to generate a [docute](https://docute.org/) document, the directory will be output in the directory where the command is executed. At this point you can execute the following command:

```sh
vuese serve --open
```

It will launch a document server and automatically open the browser, as shown below:

![](https://raw.githubusercontent.com/HcySunYang/vuese/master/imags/vuese-cli-serve.jepg)

### Use configuration file

`vuese` will search `vuese.config.js` or `.vueserc` or `vuese` property in `package.json` from your base directory. The following options can be used both on the command line and in the configuration file.

#### include

* Type: `string` `string[]`
* Default: `["**/*.vue"]`

Specify which `.vue` files need to be generated, and by default include all `.vue` files in the current directory and subdirectories.

#### exclude

* Type: `string` `string[]`
* Default: `[]`

Specify which `.vue` files do not need to be documented. Note: `node_modules/**/*.vue` is excluded by default.

#### outDir

* Type: `string`
* Default: `website`

Output directory of the [docute](https://docute.org/) document.

#### markdownDir

* Type: `string`
* Default: `components`

The output directory of the markdown file, note: `markdownDir` is based on `outdir`, which means that the markdown file will be output to the `website/components` directory.

### Used in nodejs

`vuese` exposes two modules: `parser` and `Render`.

#### parser

##### ParserResult

The `parser` function receives the contents of the .vue source file as the first argument, parses the string and gets the parsed result:

```js
const { parser } = require('vuese')
// Read .vue source files
fs.readFile(abs, 'utf-8')
  .then(source => {
    const parserRes = parser(source)
  })
```

```js
interface ParserResult {
  props?: PropsResult[]
  events?: EventResult[]
  slots?: SlotResult[]
  methods?: MethodResult[]
  name?: string
}
```

##### ParserOptions

You can pass the second argument as a parsing option:

```js
interface ParserOptions {
  onProp?: {
    (propsRes?: PropsResult[]): any
  }
  onEvent?: {
    (eventRes?: EventResult): any
  }
  onMethod?: {
    (methodRes?: MethodResult): any
  }
  onSlot?: {
    (slotRes?: SlotResult): any
  }
  onName?: {
    (name: string): any
  }
  babelParserPlugins?: ParserPlugin[]
}
```

The [default parsing option](https://github.com/HcySunYang/vuese/blob/master/src/parser/index.ts#L76) is: 

```js
const defaultOptions: ParserOptions = {
  onName(name: string) {
    res.name = name
  },
  onProp(propsRes?: PropsResult[]) {
    if (propsRes) {
      res.props = propsRes
    }
  },
  onEvent(eventsRes?: EventResult) {
    if (eventsRes) {
      ;(res.events || (res.events = [])).push(eventsRes)
    }
  },
  onSlot(slotRes?: SlotResult) {
    if (slotRes) {
      ;(res.slots || (res.slots = [])).push(slotRes)
    }
  },
  onMethod(methodRes?: MethodResult) {
    if (methodRes) {
      ;(res.methods || (res.methods = [])).push(methodRes)
    }
  },
  babelParserPlugins: ['objectRestSpread', 'dynamicImport']
}
```

#### Render

`Render` is a class that creates a render instance that receives the parsing result as a parameter:

```js
const r = new Render(parserRes)
const renderRes = r.render()
```

##### RenderResult

```js
interface RenderResult {
  props?: string
  slots?: string
  events?: string
  methods?: string
}
```


# vuese

*Your vue `SFC` is your document* - Parsing Vue `SFC` and generating documentation.

## Status

[![build status](https://badgen.net/circleci/github/HcySunYang/vuese/master)](https://circleci.com/gh/HcySunYang/vuese/tree/master)
[![](https://img.shields.io/npm/v/vuese.svg)](https://www.npmjs.com/package/vuese)
[![](https://img.shields.io/npm/l/vuese.svg)](https://www.npmjs.com/package/vuese)

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
    + [genType](#gentype)
    + [title](#title)
  * [Used in nodejs](#used-in-nodejs)
    + [parser](#parser)
      - [ParserResult](#parserresult)
      - [ParserOptions](#parseroptions)
    + [Render](#render)
      - [RenderResult](#renderresult)
  * [Write a document for your component](#write-a-document-for-your-component)
    + [props](#props)
    + [slots](#slots)
    + [events](#events)
    + [methods](#methods)
- [Contributing](#contributing)
- [Author](#author)

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

![](https://github.com/HcySunYang/vuese/blob/master/imgs/vuese-cli-gen.jpeg)

If you choose to generate a [docute](https://docute.org/) document, the document will be output in your command execution directory. At this point you can execute the following command:

```sh
vuese serve --open
```

It will launch a document server and automatically open the browser, as shown below:

![](https://github.com/HcySunYang/vuese/blob/master/imgs/vuese-cli-serve.jpeg)

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

#### genType

* Type: `string`
* Default: `''`

Select the target to generate, can be either `'docute'` or `'markdown'`, if you don't specify `genType`, vuese will ask you 😋.

#### title

* Type: `string`
* Default: `''`

If you want to generate a `docute` document, you need to specify the sidbar title, if you don't specify `title`, vuese will ask you too 😋.

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

### Write a document for your component

The process of writing a document is to write a comment for your code.

#### props

Assume we have a prop called `name`:

```js
props: {
  name: {
    type: String
  }
}
```

When there are no comments, the generated document is as follows:

|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|name|-|`String`|`false`|-|

We noticed that the prop named `name` is not described, in this case, we only need to add leading comments to the name attribute:

```js
props: {
  // The name of the form
  name: {
    type: String
  }
}
```

In this way, the description of the prop will be included in the document, as shown below:

|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|name|The name of the form|`String`|`false`|-|

In addition, we also notice that the `type` of prop called `name` is automatically obtained from the `type` attribute, but sometimes we need to show the user a more explicit choice, then we only need to add leading comments to the type attribute, as shown below:

```js
props: {
  // The name of the form
  name: {
    // `'TOP'` / `'BOTTOM'`
    type: String
  }
}
```

The generated document is as follows:

|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|name|The name of the form|`'TOP'` / `'BOTTOM'`|`false`|-|

Similarly, we can specify default values:

```js
props: {
  // The name of the form
  name: {
    // `'TOP'` / `'BOTTOM'`
    type: String,
    required: true,
    default: 'TOP'
  }
}
```

Then we get:

|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|name|The name of the form|`'TOP'` / `'BOTTOM'`|`true`|'TOP'|

**Note: You can also add leading comments to the `default` attribute.**

#### slots

Assume we have the following template which contains a named slot and default slot content:

```html
<slot name="header">
  <th>title</th>
</slot>
```

The generated document is as follows:

|Name|Description|Default Slot Content|
|---|---|---|
|header|-|-|

We can see that the slot called `header` is not described, and there is no description of the default slot content.

Then we add a comment to it:

```html
<!-- Form header -->
<slot name="header">
  <!-- `<th>title</th>` -->
  <th>title</th>
</slot>
```

Then we get:

|Name|Description|Default Slot Content|
|---|---|---|
|header|Form header|`<th>title</th>`|

Sometimes we will encounter nested slots:

```html
<!-- Form header -->
<slot name="header">
  <!-- `<th>title</th>` -->
  <slot name="defaultHeader"></slot>
</slot>
```

**Note: At this point, the comment content ``<!-- `<th>title</th>` -->`` is not a description of the slot called `defaultHeader`. It is still a description of the default slot contents of the slot called `header`.**

In order to add a description to the slot called `defaultHeader`, we need to add another comment:

```html
<!-- Form header -->
<slot name="header">
  <!-- `<th>title</th>` -->
  <!-- Custom form header -->
  <slot name="defaultHeader"></slot>
</slot>
```

Then we get:

|Name|Description|Default Slot Content|
|---|---|---|
|header|Form header|`<th>title</th>`|
|defaultHeader|Custom form header|-|

#### events

**Note: Vuese only treats `this.$emit()` as an event**

Assume we have the following code:

```js
methods: {
  clear () {
    this.$emit('onclear')
  }
}
```

The generated document is as follows:

|Event Name|Description|Parameters|
|---|---|---|
|onclear|-|-|

Just add leading comments to it:

```js
methods: {
  clear () {
    // Fire when the form is cleared
    this.$emit('onclear', true)
  }
}
```

Then we get:

|Event Name|Description|Parameters|
|---|---|---|
|onclear|Fire when the form is cleared|-|

If you want to describe the parameters further, you need to use the `@arg` identifier:

```js
methods: {
  clear () {
    // Fire when the form is cleared
    // @arg The argument is a boolean value representing xxx
    this.$emit('onclear', true)
  }
}
```

Then we get:

|Event Name|Description|Parameters|
|---|---|---|
|onclear|Fire when the form is cleared| The argument is a boolean value representing xxx|

#### methods

Similar to events, but with one difference, since not all methods need to be exposed to the developer, you need to use the `@vuese` flag to tell vuese which methods are needed to generate the document:

```js
methods: {
  /**
   * @vuese
   * Used to manually clear the form
   * @arg The argument is a boolean value representing xxx
   */
  clear (bol) {
    // ...
  }
}
```

Then we get:

|Method|Description|Parameters|
|---|---|---|
|clear|Used to manually clear the form|The argument is a boolean value representing xxx|

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**vuese** © [HcySunYang](https://github.com/HcySunYang), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by HcySunYang.

> [hcysun.me](https://hcysun.me) · GitHub [@HcySunYang](https://github.com/HcySunYang) · Twitter [@HcySunYang](https://twitter.com/HcySunYang)
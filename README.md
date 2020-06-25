<h1 align="center">vuese</h1>

<p align="center">
  <img width="200" src="https://user-images.githubusercontent.com/14146560/51301277-9712f100-1a69-11e9-8e3b-fec861c2f31c.png" />
</p>
<p align="center">One-stop solution for vue component documentation</p>
<p align="center">This project is supported by our <a href="./BACKERS.md">Backers</a></p>
<p align="center">
  <a href="https://github.com/vuese/vuese/actions"><img src="https://github.com/vuese/vuese/workflows/Node%20CI/badge.svg" alt="build status"/></a>
  <a href="https://github.com/vue-contrib/vuese/blob/monorepo/LICENSE"><img src="https://img.shields.io/github/license/vuese/vuese.svg" alt="License"/></a>
  <a href="https://github.com/vue-contrib/vuese/pull/new"><img src="https://img.shields.io/badge/PRs%20-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly"/></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code style"/></a>
  <a href="https://www.patreon.com/HcySunYang"><img src="https://badgen.net/badge/support%20me/donate/ff00ff" alt="Support me"/></a>
</p>

# Document

For detailed documentation: [vuese.org](http://vuese.org)

## Overview

[Vuese](http://vuese.org) Automatically generate documentation for your `vue` component, and provides a variety of solutions for generating component documentation to meet your different needs.

## @vuese/cli

[![](https://img.shields.io/npm/v/@vuese/cli.svg)](https://www.npmjs.com/package/@vuese/cli)
[![](https://img.shields.io/npm/dm/@vuese/cli.svg)](https://www.npmjs.com/package/@vuese/cli)

[@vuese/cli](http://vuese.org/cli/) is a command line tool that is very simple to use. If you want to quickly build a documentation site for your `vue` component or just want to generate `markdown` document for your `vue` component, then this tool might be a good choice. Please go to the details: [@vuese/cli](http://vuese.org/cli/)

## @vuese/parser

[![](https://img.shields.io/npm/v/@vuese/parser.svg)](https://www.npmjs.com/package/@vuese/parser)
[![](https://img.shields.io/npm/dm/@vuese/parser.svg)](https://www.npmjs.com/package/@vuese/parser)

The [@vuese/parser](http://vuese.org/parser/) module is the parser for the `vue` component, [@vuese/cli](http://vuese.org/cli/) internally parsing the `vue` component via the [@vuese/parser](http://vuese.org/parser/) module and extract the information we want. You can do any more advanced things with the interface provided by the [@vuese/parser](http://vuese.org/parser/) module. For the `API` documentation, please go to [@vuese/parser](http://vuese.org/parser/)

### Online experience

Visit the following 👇 link to intuitively feel `@vuese/parser`:

[An online experience playground for vuese](https://vuese.github.io/vuese-explorer/)

## @vuese/markdown-render

[![](https://img.shields.io/npm/v/@vuese/markdown-render.svg)](https://www.npmjs.com/package/@vuese/markdown-render)
[![](https://img.shields.io/npm/dm/@vuese/markdown-render.svg)](https://www.npmjs.com/package/@vuese/markdown-render)

[@vuese/markdown-render](http://vuese.org/markdown-render/) receives the result of the Vue file parsed by [@vuese/parser](http://vuese.org/parser/) as a parameter, generate a `markdown` string. [@vuese/markdown-render](http://vuese.org/markdown-render/) is also used for [@vuese/cli](http://vuese.org/cli/)'s document generation, in other words, you can use [@vuese/markdown-render](http://vuese.org/markdown-render/) and [@vuese/parser](http://vuese.org/parser/) alone to write your own `CLI` tool to do something interesting.

## @vuese/loader

`@vuese/cli` is a tool for quickly creating document prototypes that don't have a more flexible documentation solution. So this is why `@vuese/loader` and `@vuese/webpack-plugin` are needed.

Our goal is to focus only on the parts that can be automated, and does not limit how your document project is organized and what document framework is used. Of course, we can also provide fast solutions.

[WIP][todo]

## @vuese/webpack-plugin

[WIP][todo]

## Roadmap

Planning for vuese2.x: [Read our roadmap](https://github.com/vuese/roadmap)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `yarn commit`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

### Developer Resources

<details><summary>Running a Local Build</summary>
<p>

In root directory of your Vuese project:

1. Run `yarn run build`
2. Run `yarn link`

In project that you want to use the libaries:

1. If `@vuese/cli` is not yet installed, add it: `yarn add @vuese/cli`
2. Run `yarn link vuese-monorepo`
3. Navigate to `node_modules/.bin` and open `vuese.cmd` and `vuese`
4. Change any instance of `@vuese` to `vuese-monorepo\packages` in both files

To generate the documentation locally, run the vuese binary from `node_modules/.bin` :

1. Run `node_modules\.bin\vuese gen` (cmd)
   or
1. Run `node_modules/.bin/vuese gen` (powershell)

</p>
</details>

<details><summary>Samples</summary>
<p>

#### Component Notation

1. [Samples/Components Folder](/samples/components)
2. [Vuese Explorer](https://vuese.github.io/vuese-explorer/)

#### Component Documentation

1. [Samples/Docs Folder](/samples/docs)

</p>
</details>

Get started immediately in a free online dev environment:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/vuese/vuese)

## Contributors

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://hcysun.me/homepage"><img src="https://avatars2.githubusercontent.com/u/14146560?v=4" width="100px;" alt=""/><br /><sub><b>HcySunYang</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/commits?author=HcySunYang" title="Code">💻</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=HcySunYang" title="Tests">⚠️</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=HcySunYang" title="Documentation">📖</a> <a href="#example-HcySunYang" title="Examples">💡</a></td>
    <td align="center"><a href="https://github.com/elevatebart"><img src="https://avatars1.githubusercontent.com/u/5592465?v=4" width="100px;" alt=""/><br /><sub><b>Barthélémy Ledoux</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/issues?q=author%3Aelevatebart" title="Bug reports">🐛</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=elevatebart" title="Code">💻</a></td>
    <td align="center"><a href="http://bernhardwittmann.com"><img src="https://avatars1.githubusercontent.com/u/17594215?v=4" width="100px;" alt=""/><br /><sub><b>Bernhard Wittmann</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/commits?author=BerniWittmann" title="Code">💻</a> <a href="#ideas-BerniWittmann" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://buptsteve.github.io"><img src="https://avatars2.githubusercontent.com/u/11501493?v=4" width="100px;" alt=""/><br /><sub><b>Steve Young</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/issues?q=author%3ABuptStEve" title="Bug reports">🐛</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=BuptStEve" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/wulunyi"><img src="https://avatars3.githubusercontent.com/u/15170275?v=4" width="100px;" alt=""/><br /><sub><b>wulunyi</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/commits?author=wulunyi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Estelle00"><img src="https://avatars2.githubusercontent.com/u/5432828?v=4" width="100px;" alt=""/><br /><sub><b>Estelle00</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/commits?author=Estelle00" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/roxburghm"><img src="https://avatars2.githubusercontent.com/u/8364818?v=4" width="100px;" alt=""/><br /><sub><b>Matt Roxburgh</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/issues?q=author%3Aroxburghm" title="Bug reports">🐛</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=roxburghm" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ghuser.io/jamesgeorge007"><img src="https://avatars2.githubusercontent.com/u/25279263?v=4" width="100px;" alt=""/><br /><sub><b>James George</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/commits?author=jamesgeorge007" title="Code">💻</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=jamesgeorge007" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/IWANABETHATGUY"><img src="https://avatars1.githubusercontent.com/u/17974631?v=4" width="100px;" alt=""/><br /><sub><b>IWANABETHATGUY</b></sub></a><br /><a href="https://github.com/shuidi-fed/vuese/commits?author=IWANABETHATGUY" title="Code">💻</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=IWANABETHATGUY" title="Tests">⚠️</a> <a href="https://github.com/shuidi-fed/vuese/commits?author=IWANABETHATGUY" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Author

**Vuese** © [HcySunYang](https://github.com/HcySunYang), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by HcySunYang.

> [homepage](http://hcysun.me/homepage/) · GitHub [@HcySunYang](https://github.com/HcySunYang) · Twitter [@HcySunYang](https://twitter.com/HcySunYang).

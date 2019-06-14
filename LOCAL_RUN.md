# Running the libraries locally

1. Run `yarn run build`
2. Run `yarn link`

In project that you want to use the libaries:  

3. If `@vuese/cli` is not yet installed, add it: `yarn add @vuese/cli`
4. Run `yarn link vuese-monorepo`
5. Navigate to `node_modules/.bin` and open `vuese.cmd`
6. Change any instance of `@vuese` to `vuese-monorepo\packages`

To generate the documentation locally, run the vuese binary from `node_modules/.bin` :  
  
7. Run `node_modules/.bin/vuese gen`
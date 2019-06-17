# Component

Component item

## Props

<!-- @vuese:Component:props:start -->

| Name  | Description         | Type     | Required | Default |
| ----- | ------------------- | -------- | -------- | ------- |
| title | The component title | `String` | `false`  | -       |

<!-- @vuese:Component:props:end -->

## Methods

<!-- @vuese:Component:methods:start -->

| Method        | Description  | Parameters      |
| ------------- | ------------ | --------------- |
| OnDoSomething | Do something | val - the value |

<!-- @vuese:Component:methods:end -->

## Computed

<!-- @vuese:Component:computed:start -->

| Computed        | Type    | Description                | From Store |
| --------------- | ------- | -------------------------- | ---------- |
| reversedMessage | `Array` | Reverses string            | No         |
| storeValue      | `Array` | Returns a value from store | Yes        |

<!-- @vuese:Component:computed:end -->

## Data

<!-- @vuese:Component:data:start -->

| Name          | Type       | Description                        | Default |
| ------------- | ---------- | ---------------------------------- | ------- |
| vueStringData | `String`   | A string value that does something | data    |
| localFunction | `Function` | A function that does nothing       | -       |

<!-- @vuese:Component:data:end -->

## Watch

<!-- @vuese:Component:watch:start -->

| Name     | Description      | Parameters      |
| -------- | ---------------- | --------------- |
| question | Watches question | val - the value |

<!-- @vuese:Component:watch:end -->

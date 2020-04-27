<template>
  <div>
    <FooBar v-slot="{ foo }">
      <!-- Some header -->
      <slot name="header">Title</slot>
    </FooBar>
    <template #searchSlot>
      <!-- search slot -->
      <slot name="searchSlot"></slot>
    </template>
  </div>
</template>

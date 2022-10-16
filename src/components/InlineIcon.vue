<template>
  <i>
    <component :is="dynamicComponent"/>
  </i>
</template>

<script>
import { defineAsyncComponent} from 'vue';

export default({
  props: {
    name: {
        type: String,
        required: true,
    },
  },
  computed: {
    dynamicComponent() {
      const name = this.name;

      return defineAsyncComponent(() => import(`./icons/${name}.vue`));
    },
  },
  setup() {
  }
})

</script>

<template>
  <div class="check-button" :class="{ checked: isChecked }">
    <img src="~/assets/img/cart/tick.svg" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.check-button {
  border-radius: 50%;
  border: 2px solid #aaa;
}

.checked {
  background: red;
  border: 2px solid rgb(216, 46, 46);
}
</style> 
<template>
  <div class="loading-animation">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </div>
</template>

<style scoped lang="scss">
.loading-animation span {
  letter-spacing: 2px;
  font-size: 1.15em;
  color: #fff;
  animation: loading 600ms infinite alternate ease;

  &:nth-child(2) {
    animation-delay: 100ms;
  }

  &:nth-child(3) {
    animation-delay: 200ms;
  }
}

@keyframes loading {
  from {
    opacity: 1;
  }

  to {
    opacity: 0.2;
  }
}
</style>
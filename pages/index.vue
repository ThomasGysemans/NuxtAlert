<script setup lang="ts">
const nuxtAlert = useNuxtAlert();
const state = reactive({
  theme: 'default',
})

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showSuccess() {
  nuxtAlert.fire({
    title: "Success Message",
    message: "This is a successful message",
    icon: "success",
    showDenyButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    onConfirm: async () => {
      await sleep(1500);
    },
    then: (decision, r) => {
      nuxtAlert.fire({
        title: decision.confirmed ? 'Confirmed' : (decision.denied ? 'Denied' : 'Cancelled'),
        message: "Again, another message to confirm the decision you already confirmed by clicking on the button",
        icon: "success",
      });
    },
  });
}

function showWarning() {
  nuxtAlert.fire({
    title: "Test warning",
    icon: "warning",
  });
}

function showError() {
  nuxtAlert.fire({
    title: "Test error",
    icon: "error",
  });
}

function showQuestion() {
  nuxtAlert.fire({
    title: "Test question",
    icon: "question",
  });
}

function showInfo() {
  nuxtAlert.fire({
    title: "Test information",
    icon: "info",
  });
}
</script>

<template>
  <div>
    <NuxtAlert :theme="state.theme" />
    <div class="body">
      <h1>NuxtAlert for <span class="nuxt">NuxtJS 3</span></h1>
      <div>
        <select v-model="state.theme">
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="borderless">Borderless</option>
        </select>
      </div>
      <div class="container-test-buttons">
        <button @click="showSuccess">Success Message</button>
        <button @click="showWarning">Warning Message</button>
        <button @click="showError">Error Message</button>
        <button @click="showQuestion">Question Message</button>
        <button @click="showInfo">Info Message</button>
      </div>
      <span class="inspired-by">Inspired by <a href="https://sweetalert2.github.io/" target="_blank">SweetAlert2</a>, but not available for Nuxt3</span>
    </div>
  </div>
</template>

<style scoped>
* {
  color: #444;
  font-family: -apple-system, sans-serif;
}

a,
.nuxt {
  color: #00DC82;
}

a:active,
a:visited {
  color: #00844E;
}

.body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

h1 {
  color: #444;
  font-weight: normal;
  margin: 0;
}

select {
  margin: 30px 0;
}

.container-test-buttons {
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

button {
  background-color: transparent;
  border: 1px solid #00DC82;
  color: #00DC82;
  font-weight: bold;
  border-radius: 5px;
  max-width: 250px;
  width: 100%;
  height: 50px;
  cursor: pointer;
  margin: 0 20px 20px 20px;
}

button:hover {
  background-color: rgba(0, 220, 130, 0.1);
}

.inspired-by {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 0.9em;
}
</style>
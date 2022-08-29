<script setup lang="ts">
const nuxtAlert = useNuxtAlert();
const state = reactive({
  theme: 'default', // 'default', 'dark', 'borderless'
})

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
Here is a complex example on how to chain the popups.
The system is based on a stack of promises created every time you call `fire`.
This system allows you to chain as many popups as you need for your project while keeping the right order of callbacks.
 */
function showSuccess() {
  nuxtAlert.fire({
    title: "Success Message",
    message: "This is a successful message",
    icon: "success",
    showDenyButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    onConfirm: async () => {
      await sleep(500);
      await nuxtAlert.fire({
        title: "Wait, are you sure?",
        icon: "warning",
        showLoaderOnConfirm: true,
        onConfirm: async () => {
          await sleep(500);
          throw new Error("nested error");
          // An error here will also be caught by the `caught` method
        },
      });
      console.log("confirmed once again");
    },
    onDeny: () => {
      throw new Error("Denied !!!!");
    }
  }).then((result) => {
    nuxtAlert.fire({
      title: result.confirmed ? "Confirmed !" : (result.denied ? "Denied" : "Cancelled"),
      message: "Again, another message to confirm the decision you already confirmed by clicking on the button",
      icon: "success",
    });
  }).catch((result) => {
    console.log("caught", result.error);
    nuxtAlert.fire({
      title: "Erreur !",
      message: result.error.message,
      icon: "error",
    });
  });
}

/*
Very simple warning that needs to do asynchronous stuff on confirm.
 */
function showWarning() {
  nuxtAlert.fire({
    title: "Test warning",
    icon: "warning",
    showLoaderOnConfirm: true,
    onConfirm: async () => {
      await sleep(2000);
      console.log('slept for 2 seconds after confirmation');
    },
  });
}

/*
The most basic example
 */
function showError() {
  nuxtAlert.fire({
    title: "Test error",
    icon: "error",
  });
}

/*
Remember `fire` returns a promise, therefore you have two ways to get the response:
- via `then` property as showed in the success example
- by awaiting the function asynchronously
The response is an object: { confirmed: boolean, denied: boolean, cancelled: boolean, returnValue?: unknown }
 */
async function showQuestion() {
  const response = await nuxtAlert.fire({
    title: "Test question",
    icon: "question",
    showLoaderOnConfirm: true,
    onConfirm: async () => {
      await sleep(1000);
      return true;
    },
  });
  console.log("response =", response);
}

function showInfo() {
  nuxtAlert.fire({
    title: "Test information",
    icon: "info",
  });
}

/*
Create your own input and reference.
Set this input as a custom element with `customElement` property.
 */
const exampleInput = ref('');
function showInput() {
  nuxtAlert.fire({
    title: "Test with text input",
    icon: "question",
    message: "What's your name?",
    customElement: true,
  });
}
</script>

<template>
  <div>
    <NuxtAlert :theme="state.theme">
      <input class="input" :class="state.theme" type="text" placeholder="Your name" v-model="exampleInput" />
    </NuxtAlert>
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
        <button @click="showInput">With input</button>
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
  text-align: center;
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

/* for theme: default */
.input.default {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  font-family: inherit;
  outline: none;
  font-size: 1.0em;
}
.input.default:focus {
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 6%), 0 0 0 3px rgb(100 150 200 / 50%);
}

/* for theme: dark */
.input.dark {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  background-color: #323234;
  border-radius: 5px;
  padding: 10px;
  font-family: inherit;
  outline: none;
  font-size: 1.0em;
  color: #d9d9d9;
}
.input.dark:focus {
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 6%), 0 0 0 3px rgb(100 150 200 / 50%);
}
.input.borderless::placeholder {
  opacity: 0.5;
  color: #d9d9d9;
}

/* for theme: borderless */
.input.borderless {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  background-color: rgba(73, 94, 125, 0.99);
  border-radius: 5px;
  padding: 10px;
  font-family: inherit;
  outline: none;
  color: #d9d9d9;
  font-size: 1.0em;
}
.input.borderless:focus {
  box-shadow: inset 0 1px 1px rgb(0 0 0 / 6%), 0 0 0 3px rgb(100 150 200 / 50%);
}
.input.borderless::placeholder {
  opacity: 0.5;
  color: #d9d9d9;
}
</style>
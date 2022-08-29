# NuxtAlert 

A `SweetAlert2` alternative for NuxtJS 3.

This is not a package, see the source code to understand how it works if necessary. Copy-paste what needs to be used for your project and see the documentation here.

## How to use

See `pages/index.vue` for an example.

If you want to use `NuxtAlert` in a page, use the component `NuxtAlert` like that:

```vue
<template>
  <div>
    <NuxtAlert />
    <div class="my-page">
      <p>Welcome this is my website</p>
    </div>
  </div>
</template>
```

Then define functions that use the `fire` method from `useNuxtAlert` hook:

```vue
<script setup lang="ts">
const nuxtAlert = useNuxtAlert();

function showWarning() {
  nuxtAlert.fire({
    title: "This is a warning!",
    message: "This is a message, the content of the popup.",
    icon: "warning"
  });
}
</script>

<template>
  <div>
    <NuxtAlert />
    <button @click="showWarning">Show warning</button>
  </div>
</template>
```

The `fire` method takes as argument an object following the `Options` interface:

```typescript
// /types.d.ts

interface Options {
    title?: string; // empty by default
    message?: string; // empty by default
    icon?: "success" | "error" | "question" | "info" | "warning"; // none by default
    showConfirmButton?: boolean; // true by default
    confirmButtonText?: string; // "Confirm" by default
    showCancelButton?: boolean; // false by default
    cancelButtonText?: string; // "Cancel" by default
    showDenyButton?: boolean; // false by default
    denyButtonText?: string; // "Deny" by default
    allowOutsideClick?: boolean; // true by default
    onConfirm?: () => void;
    onDeny?: () => void;
    onCancel?: () => void;
    then?: (decision:CloseDecision) => void;
    showLoaderOnConfirm?: boolean; // false by default
    showLoaderOnDeny?: boolean; // false by default
    showLoaderOnCancel?: boolean; // false by default
    customElement?: boolean; // false by default
}
```

As this method doesn't return a promise unlike `Swal`, if you want to display another alert after a first one, use the `then` property:

```typescript
nuxtAlert.fire({
    title: "Do you like banana?",
    showConfirmButton: true,
    showDenyButton: true,
    showCancelButton: true,
    then: (decision:NuxtAlert.CloseDecision) => {
        if (decision.confirmed) {
            console.log("confirmed");
        } else if (decision.denied) {
            console.log("denied");
        } else if (decision.cancelled) {
            console.log("cancelled");
        } else {
            console.log("the popup has 'allowOutsideClick' set to true, and the user clicked outside of the popup.");
        }
    },
});
```

Fairly straightforward, `CloseDecision` is defined like this:

```typescript
interface CloseDecision {
    confirmed: boolean;
    denied: boolean;
    cancelled: boolean;
}
```

## Asynchronous action

Let's say you have a popup that needs to fetch data on the internet once the user has confirmed, you'd need to wait for the data to be ready. In such cases a loading animation comes in handy:

```vue
<script setup lang="ts">
const nuxtAlert = useNuxtAlert();

function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendMessage() {
  nuxtAlert.fire({
    title: "Are you sure you wanna send this message?",
    icon: "warning",
    confirmButtonText: "Send",
    showCancelButton: true,
    showLoaderOnConfirm: true,
    onConfirm: async () => {
      console.log("fetching data...");
      await sleep(5000);
      console.log("the data arrived after 5 seconds!");
      return true;
    },
    then: (decision, returnValue) => {
      if (decision.confirmed && returnValue === true) {
        nuxtAlert.fire({
          title: "Success",
          message: "The data was sent successfully according to the return value of `onConfirm` method.",
          icon: "success"
        });
      }
    }
  });
}
</script>

<template>
  <div>
    <NuxtAlert />
    <div>
      <button @click="sendMessage">send message</button>
    </div>
  </div>
</template>
```

## Some other details

The custom hook `useNuxtAlert` comes with `handlers`. From `nuxtAlert.handlers` there are 2 methods:

- `isOpen()`
- `close(decision:CloseDecision, returnValue?:unknown)`

> **NOTE**: Once the popup is closed, the options you previously gave via `fire()` are deleted.

> **NOTE**: To see all the types used in this project, see `types.d.ts` which defines the `NuxtAlert` namespace.

## Customisation

Using themes is very easy as it is a simple prop:

```vue
<template>
  <div>
    <Nuxtlert theme="dark" />
    <div class="my-dark-website"></div>
  </div>
</template>
```

There are 3 themes:

* `default`
* `dark`
* `borderless`

## Inputs

If you want to display custom elements such as inputs, use `customElement` property:

```vue
<script setup lang="ts">
const nuxtAlert = useNuxtAlert();
const inputValue = ref('');

function show() {
  nuxtAlert.fire({
    title: "What's your name",
    message: "I need this information",
    icon: "question",
    customElement: true, // important
  });
}
</script>

<template>
  <div>
    <NuxtAlert theme="borderless">
      <input v-model="inputValue" />
    </NuxtAlert>
    <button @click="show">Show popup</button>
  </div>
</template>
```

You will have to style these elements on your own. Examples are available in this repo at `/pages/index.vue`.

## License

MIT License.
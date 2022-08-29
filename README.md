# NuxtAlert 

A `SweetAlert2` alternative for NuxtJS 3 to show beautiful interactive popups.

This is not a package, see the source code to understand how it works if necessary. Copy-paste what needs to be used for your project and see the documentation here.

## How to use

See `pages/index.vue` for an example.

If you want to use `NuxtAlert` in a page, use the `NuxtAlert` component like that:

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
    showLoaderOnConfirm?: boolean; // false by default
    showLoaderOnDeny?: boolean; // false by default
    showLoaderOnCancel?: boolean; // false by default
    customElement?: boolean; // false by default
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
    }
  }).then((result) => {
    if (result.confirmed && result.returnValue === true) {
      nuxtAlert.fire({
        title: "Success",
        message: "The data was sent successfully according to the return value of `onConfirm` method.",
        icon: "success"
      });
    }
  })
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

> **NOTE**: The `fire` method returns a `Promise` which value follows this interface:

```typescript
interface PromiseResult {
    returnValue?: unknown;
    confirmed: boolean;
    denied: boolean;
    cancelled: boolean;
}
```

Using `async/await` feature, you can chain several popups asynchronously like this:

```typescript
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

nuxtAlert.fire({
    title: "Do you like banana?",
    icon: "question",
    showConfirmButton: true,
    showDenyButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    onConfirm: async () => {
        await sleep(5000);
        const result = await nuxtAlert.fire({
            title: "You've been sleeping for 5 seconds",
            icon: "warning"
        });
        if (result.confirmed) {
            console.log("The second popup was confirmed");
        } else if (result.denied) {
            console.log("The second popup was denied");
        } else if (result.cancelled) {
            console.log("The second popup was cancelled");
        }
    },
});
```

You can use `then` and `catch` methods if you prefer:

```typescript
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

nuxtAlert.fire({
    title: "Do you like banana?",
    icon: "question",
    showConfirmButton: true,
    showDenyButton: true,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    onConfirm: async () => {
        await sleep(5000);
    },
}).then((result) => {
    if (result.confirmed) {
        nuxtAlert.fire({
            title: "You've been sleeping for 5 seconds",
            icon: "warning"
        });
    }
});
```

The promise will be resolved once the user clicks on a button, or clicks outside the popup.

## Error handling

As `fire` returns a promise, you can easily catch the errors:

```vue
<script setup lang="ts">
const nuxtAlert = useNuxtAlert();

function show() {
  nuxtAlert.fire({
    title: 'Do you like bananas?',
    icon: "question",
    showDenyButton: true,
    onConfirm: () => {
      console.log("I don't care");
    },
    onDeny: () => {
      throw new Error("Robot detected");
    },
  }).catch((result) => {
    console.log("People clicked on", result.confirmed ? 'Confirm' : 'Deny'); // will be 'Deny'
    console.log("which threw the following error :", result.error); // which message is 'Robot detected'
  });
}
</script>

<template>
  <div>
    <NuxtAlert />
    <main>
      <button @click="show">THE GREAT QUESTION</button>
    </main>
  </div>
</template>
```

A much more complex example is available at `/pages/index.vue`.

## Some other details

The custom hook `useNuxtAlert` comes with `handlers`. From `nuxtAlert.handlers` there are 3 methods:

- `isOpen()`
- `close(decision:CloseDecision, returnValue?:unknown)`
- `clearStack()` to impede the next promises to be resolved.

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
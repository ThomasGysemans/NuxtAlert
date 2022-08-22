<script setup lang="ts">
enum Themes {
  DEFAULT = 'default',
  DARK = 'dark',
  BORDERLESS = 'borderless',
}

interface Props {
  theme?: Themes;
}

const state = reactive({
  loadingConfirm: false,
  loadingDeny: false,
  loadingCancel: false,
});
const props = defineProps<Props>();
const knownTheme = Object.values(Themes).includes(props.theme);

if (props.theme !== undefined && !knownTheme) {
  console.warn("Unknown theme was passed in: '" + props.theme + "', therefore using default one.");
}

const nuxtAlert = useNuxtAlert();

async function onConfirm() {
  if (isLoading()) return;
  if (nuxtAlert.getOptions().showLoaderOnConfirm) {
    state.loadingConfirm = true;
  }
  const r = await nuxtAlert.getOptions().onConfirm?.();
  nuxtAlert.handlers.close({ confirmed: true, denied: false, cancelled: false }, r);
  state.loadingConfirm = false;
}

async function onCancel() {
  if (isLoading()) return;
  if (nuxtAlert.getOptions().showLoaderOnCancel) {
    state.loadingCancel = true;
  }
  const r = await nuxtAlert.getOptions().onCancel?.();
  nuxtAlert.handlers.close({ confirmed: false, denied: false, cancelled: true }, r);
  state.loadingCancel = false;
}

async function onDeny() {
  if (isLoading()) return;
  if (nuxtAlert.getOptions().showLoaderOnDeny) {
    state.loadingDeny = true;
  }
  const r = await nuxtAlert.getOptions().onDeny?.();
  nuxtAlert.handlers.close({ confirmed: false, denied: true, cancelled: false }, r);
  state.loadingDeny = false;
}

function isLoading() {
  return state.loadingConfirm || state.loadingDeny || state.loadingCancel;
}

function getFocusableElements() {
  return Array.from(
      document
          .querySelector(".popup")
          .querySelectorAll("button, input, textarea, a")
  ) as HTMLElement[];
}

function keyboardHandler(e:KeyboardEvent) {
  if (!nuxtAlert.handlers.isOpen()) return;
  if (e.key === "Esc" || e.key === "Escape") {
    nuxtAlert.handlers.close({ confirmed: false, denied: false, cancelled: false });
  } else if (e.key === "Tab") {
    const allFocusable = getFocusableElements();
    if (allFocusable.length > 0) {
      e.preventDefault();
      let index = allFocusable.findIndex((v) => v.isEqualNode(document.querySelector(":focus")));
      if (e.shiftKey) index--;
      else index++;
      if (index >= allFocusable.length) index = 0;
      else if (index < 0) index = allFocusable.length - 1;
      allFocusable[index].focus();
    }
  }
}

onMounted(() => window.addEventListener('keydown', keyboardHandler));
onUnmounted(() => window.removeEventListener('keydown', keyboardHandler));

let activeElement;
watchEffect(() => {
  if (process.client) {
    const popup = document.querySelector(".popup");
    if (popup) {
      if (nuxtAlert.handlers.isOpen()) {
        const currentlyFocusedElement = document.querySelector(":focus") as HTMLElement;
        if (currentlyFocusedElement && !popup.contains(currentlyFocusedElement)) {
          activeElement = currentlyFocusedElement;
        }
        const firstFocusable = popup.querySelector("button, textarea, a, input") as HTMLElement;
        firstFocusable?.focus();
      } else {
        activeElement?.focus();
      }
    }
  }
});
</script>

<template>
  <div :class="theme === undefined || !knownTheme ? Themes.DEFAULT : theme">
    <div class="shader" :class="nuxtAlert.handlers.isOpen() ? 'open' : ''" @click="((nuxtAlert.getOptions().allowOutsideClick ?? true) && !isLoading()) ? nuxtAlert.handlers.close({confirmed:false,denied:false,cancelled:false}) : undefined" />
    <div class="popup" :class="nuxtAlert.handlers.isOpen() ? 'open' : ''" aria-modal="true" :aria-hidden="nuxtAlert.handlers.isOpen()" role="dialog" aria-labelledby="alert-title">
      <div class="container-icon">
        <div class="fade-icon" v-if="nuxtAlert.handlers.isOpen()">
          <svg v-if="nuxtAlert.getOptions().icon === 'success'" class="confirm-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" fill-rule="evenodd" style="stroke:#00B268;stroke-width:0.2mm;fill:transparent;">
            <g>
              <path vector-effect="non-scaling-stroke" d="M23.5 11.5C23.224 11.5 23 11.724 23 12C23 18.065 18.065 23 12 23C5.935 23 1 18.065 1 12C1 5.935 5.935 1 12 1C15.498 1 18.775 2.661 20.848 5.464L11.282 15.03L7.753 11.501C7.558 11.306 7.241 11.306 7.046 11.501C6.851 11.696 6.851 12.013 7.046 12.208L10.929 16.091C11.124 16.286 11.441 16.286 11.636 16.091L21.854 5.872C22.024 5.702 22.049 5.434 21.913 5.236C19.672 1.958 15.966 0 12 0C5.383 0 0 5.383 0 12C0 18.617 5.383 24 12 24C18.617 24 24 18.617 24 12C24 11.724 23.776 11.5 23.5 11.5Z"/>
            </g>
          </svg>
          <div v-else-if="nuxtAlert.getOptions().icon === 'warning'" class="rounded-icon warning-icon">
            <svg viewBox="0 0 6 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10C2.77157 10.0067 2.54774 9.93487 2.36579 9.79659C2.18385 9.65831 2.05475 9.46188 2 9.24L0.490001 3.18C0.399712 2.802 0.398797 2.40814 0.487327 2.02972C0.575857 1.6513 0.751395 1.29873 1 1C1.23982 0.699856 1.54411 0.457536 1.89033 0.291004C2.23655 0.124473 2.61581 0.038002 3 0.038002C3.38419 0.038002 3.76345 0.124473 4.10967 0.291004C4.45589 0.457536 4.76018 0.699856 5 1C5.24154 1.30421 5.40887 1.66052 5.48872 2.04066C5.56856 2.4208 5.55873 2.81432 5.46 3.19L4 9.24C3.94525 9.46188 3.81615 9.65831 3.63421 9.79659C3.45226 9.93487 3.22844 10.0067 3 10V10ZM3 2C2.91448 1.99921 2.82999 2.01874 2.75349 2.05699C2.677 2.09524 2.61068 2.15111 2.56 2.22C2.50515 2.28562 2.46732 2.36375 2.44988 2.44748C2.43243 2.5312 2.43591 2.61794 2.46 2.7L3 4.88L3.54 2.7C3.56409 2.61794 3.56757 2.5312 3.55013 2.44748C3.53268 2.36375 3.49486 2.28562 3.44 2.22C3.38932 2.15111 3.32301 2.09524 3.24651 2.05699C3.17001 2.01874 3.08552 1.99921 3 2V2Z" />
              <path d="M3 14C3.82843 14 4.5 13.3284 4.5 12.5C4.5 11.6716 3.82843 11 3 11C2.17157 11 1.5 11.6716 1.5 12.5C1.5 13.3284 2.17157 14 3 14Z" />
            </svg>
          </div>
          <div v-else-if="nuxtAlert.getOptions().icon === 'error'" class="rounded-icon error-icon">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.22178 16.7782C0.831183 16.3876 0.831183 15.7545 1.22178 15.3639L15.3639 1.2218C15.7544 0.8313 16.3876 0.8313 16.7781 1.2218C17.1686 1.6123 17.1686 2.2455 16.7781 2.636L2.63598 16.7782C2.24538 17.1687 1.61228 17.1687 1.22178 16.7782Z" />
              <path d="M1.22183 1.2218C1.61243 0.8313 2.24553 0.8313 2.63613 1.2218L16.7782 15.364C17.1687 15.7545 17.1687 16.3876 16.7782 16.7782C16.3877 17.1687 15.7545 17.1687 15.364 16.7782L1.22183 2.636C0.83133 2.2455 0.83133 1.6123 1.22183 1.2218Z" />
            </svg>
          </div>
          <div v-else-if="nuxtAlert.getOptions().icon === 'question'" class="rounded-icon question-icon">
            <svg viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4C1 3.20435 1.36875 2.44129 2.02513 1.87868C2.6815 1.31607 3.57174 1 4.5 1H5.5C6.42826 1 7.3185 1.31607 7.97487 1.87868C8.63125 2.44129 9 3.20435 9 4C9.03682 4.64925 8.86168 5.2929 8.50096 5.83398C8.14024 6.37506 7.61347 6.78428 7 7C6.38653 7.28763 5.85976 7.83326 5.49904 8.5547C5.13832 9.27614 4.96318 10.1343 5 11" />
              <path d="M5 15V15.01" />
            </svg>
          </div>
          <div v-else-if="nuxtAlert.getOptions().icon === 'info'" class="rounded-icon info-icon">
            <svg viewBox="0 0 4 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.3 1.69C1.20764 1.59889 1.1351 1.48969 1.08692 1.36924C1.03873 1.24878 1.01595 1.11967 1.02 0.990002C1.02 0.710002 1.11 0.470002 1.3 0.290002C1.49 0.110002 1.72 0.0100021 2 0.0100021C2.28 0.0100021 2.52 0.100002 2.7 0.290002C2.88 0.480002 2.98 0.710002 2.98 0.990002C2.98 1.27 2.89 1.51 2.7 1.69C2.51537 1.87842 2.26377 1.98624 2 1.99C1.72 1.99 1.48 1.88 1.3 1.69ZM3 3.99C2.98 3.74 2.89 3.51 2.69 3.3C2.49 3.11 2.27 3 2 2.99H1C0.73 3.01 0.52 3.12 0.31 3.3C0.11 3.5 0.01 3.74 0 3.99H1V6.99C1.02 7.26 1.11 7.49 1.31 7.68C1.51 7.88 1.73 7.99 2 7.99H3C3.27 7.99 3.48 7.88 3.69 7.68C3.89 7.49 3.99 7.26 4 6.99H3V3.98V3.99Z" />
            </svg>
          </div>
        </div>
      </div>
      <h1 id="alert-title">{{ nuxtAlert.getOptions().title ?? '' }}</h1>
      <p>{{ nuxtAlert.getOptions().message ?? '' }}</p>
      <div class="container-buttons">
        <button v-if="nuxtAlert.getOptions().showConfirmButton ?? true" class="confirm-button" :class="isLoading() ? 'disabled' : ''" :aria-disabled="isLoading()" @click="onConfirm"><LoadingNuxtAlert v-if="state.loadingConfirm" /><span v-else>{{ nuxtAlert.getOptions().confirmButtonText ?? 'OK' }}</span></button>
        <button v-if="nuxtAlert.getOptions().showDenyButton ?? false" class="deny-button" :class="isLoading() ? 'disabled' : ''" :aria-disabled="isLoading()" @click="onDeny"><LoadingNuxtAlert v-if="state.loadingDeny" /><span v-else>{{ nuxtAlert.getOptions().denyButtonText ?? 'Deny' }}</span></button>
        <button v-if="nuxtAlert.getOptions().showCancelButton ?? false" class="cancel-button" :class="isLoading() ? 'disabled' : ''" :aria-disabled="isLoading()" @click="onCancel"><LoadingNuxtAlert v-if="state.loadingCancel" /><span v-else>{{ nuxtAlert.getOptions().cancelButtonText ?? 'Cancel' }}</span></button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$default-confirm-button-color: #7066E0;
$default-deny-button-color: #DC3741;
$default-cancel-button-color: #6D7881;
$success-color: #00B268;
$warning-mark-color: #f8bb86;
$warning-border-color: #facea8;
$error-cross-color: #f27474;
$error-border-color: #f27474;
$question-border-color: #c9dae1;
$question-mark-color: #87adbd;
$info-border-color: #9de0f6;
$info-mark-color: #3fc3ee;
$iconSize: 110px;

@keyframes lineanim {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fillanim {
  from {
    fill: transparent;
  }

  to {
    fill: $success-color;
  }
}

.container-icon svg.confirm-icon path {
  stroke-dasharray: 800px;
  stroke-dashoffset: 800px;
  animation: lineanim 2.4s ease forwards;
}

.container-icon svg.confirm-icon g {
  animation: fillanim 300ms ease-in forwards 2.4s;
}

.popup * {
  font-family: "Avenir Next", "Helvetica Neue", Helvetica, sans-serif;
}

.default,
.dark,
.borderless {
  .popup h1 {
    font-weight: normal;
    font-size: 1.9rem;
    margin: 20px 0;
    text-align: center;
    max-width: 400px;
  }

  .popup p {
    font-weight: normal;
    font-size: 1.1rem;
    margin: 0 0 20px 0;
    text-align: center;
    max-width: 500px;
  }
}

.default,
.dark {
  .shader {
    position: fixed;
    z-index: 90;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    opacity: 0;
    pointer-events: none;
    background-color: transparent;
    transition-property: background-color, opacity;
    transition-duration: 300ms;

    &.open {
      opacity: 1;
      pointer-events: all;
      background-color: rgba(#000, 0.5);
    }
  }

  .popup.open {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    pointer-events: all;
  }
}

.default .popup {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(#666, 0.2);
  padding: 30px;
  box-sizing: border-box;
  max-width: 400px;
  width: 100%;
  height: auto;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition-property: transform, opacity;
  transition-duration: 300ms;

  h1 {
    color: #444;
  }

  p {
    color: #444;
  }
}

.dark .popup {
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background-color: #19191a;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(#666, 0.2);
  padding: 30px;
  box-sizing: border-box;
  max-width: 400px;
  width: 100%;
  height: auto;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition-property: transform, opacity;
  transition-duration: 300ms;

  h1 {
    color: #e1e1e1;
  }

  p {

    color: #e1e1e1;
  }
}

.borderless .shader {
  position: fixed;
  z-index: 990;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: transparent;
  transition-property: background-color, opacity;
  transition-duration: 250ms;

  &.open {
    background-color: rgba(54, 70, 93, 0.98);
    opacity: 1;
    pointer-events: all;
  }
}

.borderless .popup {
  width: 55%;
  box-sizing: border-box;
  background-color: transparent;
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 100ms;

  &.open {
    opacity: 1;
    pointer-events: all;
  }
}

.borderless .popup,
.dark .popup {
  h1 {
    color: #e1e1e1;
  }

  p {
    color: #e1e1e1;
  }
}

.container-buttons button {
  height: 45px;
  color: #fff;
  border-radius: 5px;
  padding: 5px 15px;
  box-sizing: border-box;
  font-weight: normal;
  font-size: 0.9rem;
  letter-spacing: 0.9px;
  cursor: pointer;
  border: none;
  outline: none;
  margin: 0 5px;

  &:disabled {
    cursor: default;
    pointer-events: none;
  }
}

$buttons: 'confirm-button' $default-confirm-button-color, 'deny-button' $default-deny-button-color, 'cancel-button' $default-cancel-button-color;

@each $button in $buttons {
  .#{nth($button, 1)} {
    background-color: nth($button, 2);

    &:hover {
      background-color: darken(nth($button, 2), 5%);
    }

    &:active {
      background-color: darken(nth($button, 2), 10%);
    }

    &:focus,
    &:active {
      box-shadow: 0 0 0 4px lighten(nth($button, 2), 20%);
    }
  }
}

.disabled {
  pointer-events: none;
  cursor: default;
}

.container-icon,
.container-icon .confirm-icon {
  width: $iconSize;
  height: $iconSize;
}

.fade-icon {
  animation: fadeIn 500ms forwards 1 ease-out;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

.rounded-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: $iconSize;
  height: $iconSize;
  border-radius: 50%;
  box-sizing: border-box;
  animation: flip 300ms 1 ease-in forwards;

  svg {
    width: $iconSize - 60px;
    height: $iconSize - 60px;
  }
}

.warning-icon {
  border: 5px solid $warning-border-color;

  svg {
    animation: bouncing 300ms 200ms 1 ease-out forwards;
  }

  path {
    fill: $warning-mark-color;
  }
}

.error-icon {
  border: 5px solid $error-border-color;

  svg {
    opacity: 0;
    transform: scale(0.5);
    animation: flashing 400ms 200ms 1 ease-out forwards;
  }

  path {
    fill: $error-cross-color;
  }
}

.question-icon {
  border: 5px solid $question-border-color;

  svg {
    opacity: 0;
    transform: rotateY(90deg);
    animation: rotate 400ms 200ms 1 ease-out forwards;
  }

  path {
    stroke: $question-mark-color;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.info-icon {
  border: 5px solid $info-border-color;

  svg {
    animation: bouncing 500ms 200ms 1 ease forwards;
  }

  path {
    fill: $info-mark-color;
  }
}

@keyframes flip {
  from {
    transform: rotateX(50deg);
  }

  to {
    transform: rotateX(0deg);
  }
}

@keyframes bouncing {
  from {
    transform: rotateZ(0deg);
  }

  20% {
    transform: rotateZ(10deg);
  }

  50% {
    transform: rotateZ(-10deg);
  }

  to {
    transform: rotateZ(0);
  }
}

@keyframes flashing {
  50% {
    opacity: 0.8;
  }

  60% {
    transform: scale(1.1);
  }

  to {
    opacity: 1;
    transform: scale(1.0);
  }
}

@keyframes rotate {
  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg);
  }
}
</style>
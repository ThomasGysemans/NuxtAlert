const useNuxtAlert = () => {
    const popup = useState<NuxtAlert.Options & {open:boolean}>("nuxtAlert", () => ({ open: false }));
    const close = (decision:NuxtAlert.CloseDecision, returnValue?:unknown) => {
        const then = popup.value.then;
        popup.value = { open: false };
        then?.(decision, returnValue);
    };
    const isOpen = () => popup.value.open === true;
    const getOptions = () => popup.value;
    const fire = (options:NuxtAlert.Options) => popup.value = { open: true, ...options };
    return {
        handlers: {
            close,
            isOpen,
        },
        getOptions,
        fire,
    } as NuxtAlert.Config;
};

export default useNuxtAlert;
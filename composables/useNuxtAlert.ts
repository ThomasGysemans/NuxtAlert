const useNuxtAlert = () => {
    const popup = useState<NuxtAlert.Options & {open:boolean}>("nuxtAlert", () => ({ open: false }));
    const close = async (decision:NuxtAlert.CloseDecision, returnValue?:unknown) => {
        await popup.value.then?.(decision, returnValue);
        popup.value = { open: false };
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
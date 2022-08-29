import OnClosePromise = NuxtAlert.PromiseResult;

interface HiddenProps {
    resolveStack?:((v:unknown)=>void)[];
    rejectStack?:((r?:any)=>void)[];
    open:boolean;
}

const useNuxtAlert = () => {
    const popup = useState<NuxtAlert.Options & HiddenProps>("nuxtAlert", () => ({ open: false }));
    const close = (decision:NuxtAlert.CloseDecision, returnValue?:unknown, error?:Error) => {
        let consequence;
        if (error !== undefined) {
            consequence = popup.value.rejectStack.at(-1);
        } else {
            consequence = popup.value.resolveStack.at(-1);
        }
        popup.value = { open: false, resolveStack: popup.value.resolveStack.slice(0, -1), rejectStack: popup.value.rejectStack.slice(0, -1) };
        consequence?.({...decision, returnValue, error});
    };
    const isOpen = () => popup.value.open === true;
    const clearStack = () => {popup.value.resolveStack = []; popup.value.rejectStack = [];};
    const getOptions = () => popup.value;
    const fire = (options:NuxtAlert.Options) => {
        return new Promise<OnClosePromise>((resolve, reject) => {
            popup.value = { open: true, resolveStack: [...(popup.value.resolveStack ?? []), resolve], rejectStack: [...(popup.value.rejectStack ?? []), reject], ...options };
        });
    }
    return {
        handlers: {
            close,
            isOpen,
            clearStack,
        },
        getOptions,
        fire,
    } as NuxtAlert.Config;
};

export default useNuxtAlert;
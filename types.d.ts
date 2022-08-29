namespace NuxtAlert {
    interface Options {
        title?: string;
        message?: string;
        icon?: "success" | "error" | "question" | "info" | "warning";
        showConfirmButton?: boolean;
        confirmButtonText?: string;
        showCancelButton?: boolean;
        cancelButtonText?: string;
        showDenyButton?: boolean;
        denyButtonText?: string;
        allowOutsideClick?: boolean;
        onConfirm?: () => void;
        onDeny?: () => void;
        onCancel?: () => void;
        then?: (decision:CloseDecision, returnValue?: unknown) => void;
        showLoaderOnConfirm?: boolean;
        showLoaderOnDeny?: boolean;
        showLoaderOnCancel?: boolean;
        customElement?: boolean;
    }

    interface Handlers {
        close: (decision:CloseDecision, returnValue?: unknown) => Promise<void>;
        isOpen: () => boolean;
    }

    interface Config {
        fire: (options: Options) => void;
        handlers: Handlers;
        getOptions: () => Options;
    }

    interface CloseDecision {
        confirmed: boolean;
        denied: boolean;
        cancelled: boolean;
    }
}
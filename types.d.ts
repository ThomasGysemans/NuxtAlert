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
        showLoaderOnConfirm?: boolean;
        showLoaderOnDeny?: boolean;
        showLoaderOnCancel?: boolean;
        customElement?: boolean;
    }

    interface Handlers {
        close: (decision: CloseDecision, returnValue?: unknown, error?: Error) => void;
        isOpen: () => boolean;
        clearStack: () => void;
    }

    interface CloseDecision {
        confirmed: boolean;
        denied: boolean;
        cancelled: boolean;
    }

    interface PromiseResult extends CloseDecision {
        returnValue?: unknown;
        error?: Error;
    }

    interface Config {
        fire: (options: Options) => Promise<PromiseResult>;
        handlers: Handlers;
        getOptions: () => Options;
    }
}

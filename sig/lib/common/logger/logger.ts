class Logger {
    private debugMode: boolean;
    private static instance: Logger;

    private constructor(debugMode: boolean) {
        this.debugMode = debugMode;
    }

    static getInstance(debugMode: boolean): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(debugMode);
        }
        return Logger.instance;
    }

    log(...args: Parameters<typeof console.log>): void {
        if (this.debugMode) {
            console.log(...args);
        }
    }
    
    warn(...args: Parameters<typeof console.warn>): void {
        if (this.debugMode) {
            console.warn(...args);
        }
    }

    error(...args: Parameters<typeof console.error>): void {
        console.error(...args);
    }
}

export default Logger.getInstance(false);
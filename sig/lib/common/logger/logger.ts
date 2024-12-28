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

    log(message: string): void {
        if (this.debugMode) {
            console.log(message);
        }
    }
    
    warn(message: string): void {
        if (this.debugMode) {
            console.warn(message);
        }
    }

    error(message: string): void {
        console.error(message);
    }
}

export default Logger.getInstance(true);

const providedAppConfig = globalThis?.env?.SIGJS_APP_CONFIG || {};


export const appConfig = Object.freeze({
  logLevel: (providedAppConfig.logLevel as string) || 'info',
  memoize: 'memoize' in providedAppConfig ? (providedAppConfig.memoize as boolean) : true,
});
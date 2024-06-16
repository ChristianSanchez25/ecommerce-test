export interface ILogger {
  debug(context: string, message: string): Promise<void>;
  log(context: string, message: string): Promise<void>;
  error(context: string, message: string, trace?: string): Promise<void>;
  warn(context: string, message: string): Promise<void>;
  verbose(context: string, message: string): Promise<void>;
}

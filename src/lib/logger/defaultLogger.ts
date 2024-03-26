import { config } from '@/config';
import { createLogger } from '@/lib/logger/logger';

export const defaultLogger = createLogger({ level: config.logLevel });

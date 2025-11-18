import { config } from '@/config';
import { createLogger } from '@/lib/logger/logger';

export const logger = createLogger({ level: config.logLevel });

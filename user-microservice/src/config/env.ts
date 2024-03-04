import { config } from 'dotenv'

import { resolve } from 'path'

// load environment variables
config({path: resolve(process.cwd(), '.env')});

export default function parseEnv(value: any, defaultValue: any = null): any {
    if (value === undefined) {
      return defaultValue;
    }
  
    if (typeof value !== 'string') {
      return value;
    }
  
    if (value.toLowerCase() === 'true') {
      return true;
    }
  
    if (value.toLowerCase() === 'false') {
      return false;
    }
  
    if (value.toLowerCase() === 'null') {
      return null;
    }
  
    if (!Number.isNaN(Number(value))) {
      return Number(value);
    }
  
    return value;
  }
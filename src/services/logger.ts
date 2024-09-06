import { ERROR_PREFIX, WARNING_PREFIX } from '../constants/errors.js';

export class LoggerService {
	private constructor() {}

	public static error(message: string) {
		console.log(`${ERROR_PREFIX} ${message}`);
	}

	public static warn(message: string) {
		console.log(`${WARNING_PREFIX} ${message}`);
	}
}

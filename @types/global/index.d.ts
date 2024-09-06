declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly AWS_REGION?: string;
		}
	}
}

export {};

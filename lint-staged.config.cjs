const config = {
	'./**/*.{ts,js,cjs,json,yaml}': 'prettier --write',
	'./**/*': 'inflint -c ./inflint.config.ts',
};

module.exports = config;

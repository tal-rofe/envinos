const config = {
	'./**/*.{ts,js,cjs,json,yaml}': 'prettier --write',
	'./**/*': ['inflint -c ./inflint.config.ts', 'cspell lint -c ./cspell.json --no-progress --no-summary'],
};

module.exports = config;

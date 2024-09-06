<p align="center">
    <img src="./assets/brand.png" width="350" />
</p>

<p align="center">
	<a href="https://github.com/tal-rofe/enversify">
    	<img src="https://img.shields.io/github/actions/workflow/status/tal-rofe/enversify/integrate.yaml?label=CI&logo=GitHub" alt="CI status">
  	</a>
	<a href="https://www.npmjs.com/package/enversify">
    	<img src="https://img.shields.io/npm/dm/enversify?logo=NPM" alt="npm downloads">
  	</a>
	<a href="https://github.com/tal-rofe/enversify">
    	<img src="https://img.shields.io/npm/l/enversify" alt="npm license">
  	</a>
	<a href="https://github.com/tal-rofe/enversify">
    	<img src="https://img.shields.io/npm/v/enversify?label=version" alt="version">
  	</a>
</p>

<hr />

Sync and share your local environment variables from AWS Secrets Manager service among developers

> [!NOTE]
> Currently only support AWS Secrets Manager, but in the future, may support other external stores with dedicated plugins

## Usage

To use the package you first need to install it as dev dependency:

```bash
npm i -D enversify
```

Then you need to configure your `package.json#scripts` with:

```json
{
	"postinstall": "enversify"
}
```

This will automatically sync the environment variables from AWS Secrets Manager service once any developer in the team will run `npm i`.

## Configuration

You can specify the configuration of Enversify through various options, but one must be provided.
Configuration can be set in the following files (can be configured in home directory or in the root folder of your project):

-   a `package.json` property: `"enversify": {...}` or in `~/package.json`, for example
-   a `.enversifyrc` file in JSON or YAML format
-   a `.enversifyrc.json`, `.enversifyrc.yaml`, `.enversifyrc.yml`, `.enversifyrc.js`, or `.enversifyrc.cjs` file
-   a `enversify.config.ts`, `enversify.config.js`, or `enversify.config.cjs` CommonJS module exporting an object

### Configuration Options

-   Secrets (**required**): an array of objects, where you configure multiple environment variables files.
-   skipKeyword (**optional**): sometimes, you have some environment variables that should be configured per each developer and not shared. You can set an explicit keyword, so Enversify won't override the variables with this keyword. For example, if you set it to "TODO" and set the value of variable "MY_ENV" in AWS Secrets Manager with value of "TODO" - Enversify won't override this variable "MY_ENV" (which might have been configured manually by the developer).
-   region (**optional**): A valid AWS region - where you store your secrets in the AWS Secrets Manager service. If you don't provide this field, Enversify will fail, **unless** you have `AWS_REGION` configured in the user environment variables.

<details>
  <summary><b>View JSONSchema of the configuration:</b></summary>

```json
{
	"$schema": "http://json-schema.org/draft-07/schema#",
	"$ref": "#/definitions/enversify",
	"definitions": {
		"enversify": {
			"description": "Enversify Configuration Schema",
			"type": "object",
			"properties": {
				"secrets": {
					"type": "array",
					"items": {
						"type": "object",
						"properties": { "label": { "type": "string" }, "filePath": { "type": "string" }, "key": { "type": "string" } },
						"required": ["filePath", "key"],
						"additionalProperties": false
					}
				},
				"skipKeyword": { "type": "string" },
				"region": { "type": "string" }
			},
			"required": ["secrets"],
			"additionalProperties": false
		}
	}
}
```

</details>

## Authors

<a href="https://github.com/tal-rofe">
    <img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/100444463?v=4&h=300&w=300&fit=cover&mask=circle&maxage=7d" height="50" />
</a>

## License

[MIT](https://choosealicense.com/licenses/mit/)

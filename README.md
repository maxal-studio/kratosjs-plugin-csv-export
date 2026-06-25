# @maxal_studio/kratosjs-plugin-csv-export

Adds an **Export CSV** button to every table in a KratosJs admin panel, so any
resource list can be downloaded as a CSV file. Works on both MongoDB and SQL.

## Install

```bash
npm install @maxal_studio/kratosjs-plugin-csv-export
```

> Testing against a local, unpublished build of KratosJs? See
> [Developing & Testing Plugins Locally](../../nodejs-kratosjs/docs/plugins/local-development.md).

## Register

**Server** (`src/index.ts`):

```ts
import { CsvExportPlugin } from '@maxal_studio/kratosjs-plugin-csv-export';

Panel.make('admin')
	// ...
	.plugins([new CsvExportPlugin()]);
```

The export button appears on every resource table automatically. This is a server-only
plugin (no client entry).

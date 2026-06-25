import { Plugin, Panel, TableBuilder, Action, BulkAction, t } from '@maxal_studio/kratosjs';
import { csvExporter } from './csvExporter';
import en from './lang/en';
import sq from './lang/sq';

/**
 * CSV Export plugin.
 *
 * Registers a CSV exporter and, via `TableBuilder.configureUsing()`, adds an
 * "Export" header button and an "Export selected" bulk action to every table in
 * the panel. Resources can opt out with `table().exportable(false)`.
 *
 * Backend-only: it relies on the core header-action + download-action support,
 * so no client bundle is required.
 */
export class CsvExportPlugin extends Plugin {
	getName(): string {
		return 'csv-export';
	}

	register(panel: Panel): void {
		panel.registerTranslations('csv-export', { en, sq });
		panel.registerExporter('csv', csvExporter);

		TableBuilder.configureUsing(table => {
			if (!table.isExportable()) {
				return;
			}

			const alreadyAdded = table.getHeaderActions().some(action => action.getName() === 'exportCsv');
			if (alreadyAdded) {
				return;
			}

			table.headerActions([
				...table.getHeaderActions(),
				Action.make('exportCsv').label(t('csv-export:action.export')).icon('Download').exportsTo('csv'),
			]);

			table.bulkActions([
				...table.getBulkActions(),
				BulkAction.make('exportCsvSelected')
					.label(t('csv-export:action.export_selected'))
					.icon('Download')
					.exportsTo('csv'),
			]);
		});
	}
}

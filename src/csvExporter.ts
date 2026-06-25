import type { Exporter } from '@maxal_studio/kratosjs';

/**
 * Escape a single CSV field per RFC 4180: wrap in double quotes when it contains
 * a comma, quote, or newline, doubling any interior quotes.
 */
function escapeCsvField(value: unknown): string {
	if (value === null || value === undefined) {
		return '';
	}

	let str: string;
	if (value instanceof Date) {
		str = value.toISOString();
	} else if (typeof value === 'object') {
		// Relations / arrays / nested objects → compact JSON.
		str = JSON.stringify(value);
	} else {
		str = String(value);
	}

	if (/[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function formatDate(date = new Date()): string {
	return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Serialize table rows into a CSV file. Header row uses each column's label
 * (falling back to its name); each row reads `row[column.name]`.
 */
export const csvExporter: Exporter = (rows, columns, ctx) => {
	const header = columns.map(col => escapeCsvField(col.label ?? col.name)).join(',');
	const body = rows
		.map(row => columns.map(col => escapeCsvField((row as Record<string, unknown>)[col.name])).join(','))
		.join('\n');

	const content = body ? `${header}\n${body}\n` : `${header}\n`;

	return {
		content,
		contentType: 'text/csv;charset=utf-8',
		filename: `${ctx.resourceSlug}-${formatDate()}.csv`,
	};
};

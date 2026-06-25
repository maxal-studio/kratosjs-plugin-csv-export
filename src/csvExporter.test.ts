import { describe, expect, it } from 'vitest';
import { csvExporter } from './csvExporter';

const columns = [
	{ type: 'text', name: 'name', label: 'Name' },
	{ type: 'text', name: 'email', label: 'Email' },
] as any;

const ctx = { resourceSlug: 'users', resourceLabel: 'User' };

describe('csvExporter', () => {
	it('builds a header row from column labels and one row per record', () => {
		const { content, contentType, filename } = csvExporter(
			[
				{ name: 'Ada', email: 'ada@example.com' },
				{ name: 'Alan', email: 'alan@example.com' },
			],
			columns,
			ctx,
		);

		expect(content).toBe('Name,Email\nAda,ada@example.com\nAlan,alan@example.com\n');
		expect(contentType).toBe('text/csv;charset=utf-8');
		expect(filename).toMatch(/^users-\d{4}-\d{2}-\d{2}\.csv$/);
	});

	it('escapes commas, quotes and newlines per RFC 4180', () => {
		const { content } = csvExporter([{ name: 'Doe, John', email: 'a "quote"\nnewline' }], columns, ctx);
		expect(content).toBe('Name,Email\n"Doe, John","a ""quote""\nnewline"\n');
	});

	it('renders null/undefined as empty and objects as JSON', () => {
		const { content } = csvExporter([{ name: null, email: { primary: 'x@y.z' } }], columns, ctx);
		expect(content).toBe('Name,Email\n,"{""primary"":""x@y.z""}"\n');
	});

	it('emits only the header row when there are no records', () => {
		const { content } = csvExporter([], columns, ctx);
		expect(content).toBe('Name,Email\n');
	});
});

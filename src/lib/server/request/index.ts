import baseHeaders from './headers';

export async function get(
	url: string,
	headers: Record<string, string>,
	res: 'text'
): Promise<string>;
export async function get<T>(url: string, headers: Record<string, string>, res: 'json'): Promise<T>;
export async function get(
	url: string,
	headers: Record<string, string> = {},
	res: 'text' | 'json' = 'text'
) {
	const response = await fetch(url, {
		headers: {
			...baseHeaders,
			...headers
		}
	});

	if (res === 'json') {
		return await response.json();
	} else {
		return await response.text();
	}
}

export async function function_timer<T>(funct: (...args: any[]) => Promise<T> | T, ...args: any[]): Promise<[T, number]> {
	const start = performance.now();
	let funct_return: T;

	funct_return = await (funct(...args) as Promise<T>);
	return ([funct_return, (performance.now() - start) / 1000]);
}

export function print_time_to_run(query_type: string, difference: number, funct_return: any = false): any {
	const difference_message = difference > 1 ? `${difference.toFixed(4)} s `.padStart(12) : `${(difference * 1000).toFixed(4)} ms`.padStart(12)
	console.log(`   ${query_type}:`.padEnd(23), difference_message);
	return (funct_return);
}

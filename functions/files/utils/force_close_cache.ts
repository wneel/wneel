import { writeFile } from "fs/promises";
import { getUserFileName } from "../../../utils";

export async function force_close_file(data: string[], cache_comment: string[]): Promise<void> {
	const filename = getUserFileName();
	await writeFile(filename, cache_comment.join("\n") + data.join("\n"));
	console.log(`There was an error while fetching all the data. The cache file: ${filename} has the partial data saved.`);
}

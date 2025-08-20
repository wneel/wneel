import { readFile } from "fs/promises";
import { getUserFileName } from "../../../utils";

async function commit_counter(comment_size: number): Promise<number> {
	let total_commits = 0;
	const filename = getUserFileName();
	const fileContent = await readFile(filename, "utf8");
	const data = fileContent.split("\n");
	const usefulData = data.slice(comment_size);
	for (const line of usefulData) {
		if (!line) continue;
		const parts = line.split(" ");
		if (parts.length > 2) {
			total_commits += parseInt(parts[2]);
		}
	}
	return (total_commits);
}

export default commit_counter;

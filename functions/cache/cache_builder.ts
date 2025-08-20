import { readFile, writeFile } from "fs/promises";
import { createHash } from "crypto";
import { getUserFileName } from "../../utils";
import { recursive_loc } from "../datas/lines_of_code/counter";


async function wipe_cache(edges: any[], filename: string, comment_size: number): Promise<void> {
	let data: string[] = [];
	if (comment_size > 0) {
		try {
			const fileContent = await readFile(filename, "utf8");
			data = fileContent.split("\n").slice(0, comment_size);
		} catch (error) {
			for (let i = 0; i < comment_size; i++) {
				data.push("//\n");
			}
		}
	}
	let content = data.join("\n");

	for (const node of edges) {
		content += "\n" + createHash("sha256").update(node.node.nameWithOwner).digest("hex") + " 0 0 0 0";
	}
	await writeFile(filename, content);
}

export async function cache_builder(edges: any[], comment_size: number, loc_add: number = 0, loc_del: number = 0): Promise<[number, number, number, boolean]> {
	let cached = true;
	const filename = getUserFileName();
	let cache: string[];
	try {
		const fileContent = await readFile(filename, "utf8");
		cache = fileContent.split("\n");
	} catch (error) {
		cache = [];
		if (comment_size > 0) {
			for (let i = 0; i < comment_size; i++) {
				cache.push("This line is a comment block. Write whatever you want here.\n");
			}
		}
		await writeFile(filename, cache.join("\n"));
	}
	if (cache.length - comment_size !== edges.length) {
		cached = false;
		await wipe_cache(edges, filename, comment_size);
		const fileContent = await readFile(filename, "utf8");
		cache = fileContent.split("\n");
	}

	const cache_comment = cache.slice(0, comment_size);
	cache = cache.slice(comment_size);

	for (let index = 0; index < edges.length; index++) {
		if (!cache[index]) {
			continue;
		}
		const [repo_hash, commit_count, ..._rest] = cache[index].split(" ");
		if (repo_hash === createHash("sha256").update(edges[index].node.nameWithOwner).digest("hex")) {
			try {
				if (parseInt(commit_count) !== edges[index].node.defaultBranchRef.target.history.totalCount) {
					const [owner, repo_name] = edges[index].node.nameWithOwner.split("/");
					const loc = await recursive_loc(owner, repo_name, cache, cache_comment) as [number, number, number];
					cache[index] += "\n"
					cache[index] = repo_hash + " " + edges[index].node.defaultBranchRef.target.history.totalCount + " " + loc[2] + " " + loc[0] + " " + loc[1];
				}
			} catch (error) {
				cache[index] += "\n"
				cache[index] = repo_hash + " 0 0 0 0";
			}
		}
	}
	await writeFile(filename, cache_comment.join("\n") + "\n" + cache.join("\n"));

	for (const line of cache) {
		if (!line) continue;
		const loc = line.split(" ");
		if (loc.length >= 5) {
			loc_add += parseInt(loc[3]);
			loc_del += parseInt(loc[4]);
		}
	}
	return [loc_add, loc_del, loc_add - loc_del, cached];
}

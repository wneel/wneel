import axios from "axios";
import { force_close_file } from "../../files/utils/force_close_cache"
import { commitNode } from "../../../types";
import { HEADERS, QUERY_COUNT, query_count, USER_ID } from "../../../utils";
import { recusrive_loc_query } from "./queries";

async function loc_counter_one_repo(owner: string, repo_name: string, data: string[], cache_comment: string[], history: any, addition_total: number, deletion_total: number, my_commits: number): Promise<[number, number, number]> {
	for (const node of history.edges) {
		const commit: commitNode = node.node;
		if (commit.author.user && commit.author.user.id === USER_ID) {
			my_commits += 1;
			addition_total += commit.additions;
			deletion_total += commit.deletions;
		} else {
		}
	}

	if (history.edges.length === 0 || !history.pageInfo.hasNextPage) {
		return [addition_total, deletion_total, my_commits];
	} else {
		return await recursive_loc(owner, repo_name, data, cache_comment, addition_total, deletion_total, my_commits, history.pageInfo.endCursor) as [number, number, number];
	}
}

export async function recursive_loc(owner: string, repo_name: string, data: string[], cache_comment: string[], addition_total: number = 0, deletion_total: number = 0, my_commits: number = 0, cursor: string | null = null): Promise<[number, number, number] | number> {
	query_count("recursive_loc");

	const variables = {"repo_name": repo_name, "owner": owner, "cursor": cursor};
	try {
		const response = await axios.post("https://api.github.com/graphql",
			{query: recusrive_loc_query, variables: variables},
			{headers: HEADERS}
		);
		if (response.status === 200) {
			if (response.data.data.repository.defaultBranchRef != null) {
				return loc_counter_one_repo(owner, repo_name, data, cache_comment, response.data.data.repository.defaultBranchRef.target.history, addition_total, deletion_total, my_commits);
			} else {
				return 0;
			}
		}
		await force_close_file(data, cache_comment);
		if (response.status === 403) {
			throw new Error("Too many requests in a short amount of time!\nNon-documented rate-limit reached!");
		}
		throw new Error(`recursive_loc() has failed with a ${response.status} ${response.statusText} ${JSON.stringify(QUERY_COUNT)}`);
	} catch (error) {
		await force_close_file(data, cache_comment);
		throw (error);
	}
}

import { query_count, USER_NAME } from "../../../utils";
import { simple_request } from "../request"

export function stars_counter(repositories: any[]): number {
	let total_stars = 0;
	for (const repo of repositories) {
		total_stars += repo.node.stargazers.totalCount;
	}
	return (total_stars);
}

export async function graph_repos_stars(count_type: "owner_count" | "contrib_count", owner_affiliation: string[], cursor: string | null = null): Promise<{stars: number, repos: number}> {
	query_count("graph_repos_stars");
	const query = `
	query ($owner_affiliation: [RepositoryAffiliation], $login: String!, $cursor: String) {
		user(login: $login) {
			repositories(first: 100, after: $cursor, ownerAffiliations: $owner_affiliation) {
				totalCount
				edges {
					node {
						... on Repository {
							nameWithOwner
							stargazers {
								totalCount
							}
						}
					}
				}
				pageInfo {
					endCursor
					hasNextPage
				}
			}
		}
	}`;
	const variables = {"owner_affiliation": owner_affiliation, "login": USER_NAME, "cursor": cursor};
	const request = await simple_request(graph_repos_stars.name, query, variables);
	if (request.status === 200) {
		const data = {
			repos: request.data.data.user.repositories.totalCount,
			stars: 0
		}
		if (count_type == "owner_count") {
			data["stars"] = stars_counter(request.data.data.user.repositories.edges);
		}
		return (data);
	}
	return {stars: 0, repos: 0};
}

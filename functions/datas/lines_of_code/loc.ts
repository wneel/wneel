import { simple_request } from "../request"
import { query_count, USER_NAME } from "../../../utils";
import { cache_builder } from "../../cache/cache_builder";

async function loc_query(owner_affiliation: string[], comment_size: number = 0, cursor: string | null = null, edges: any[] = []) {
	query_count("loc_query");
	const query = `
	query ($owner_affiliation: [RepositoryAffiliation], $login: String!, $cursor: String) {
		user(login: $login) {
			repositories(first: 50, after: $cursor, ownerAffiliations: $owner_affiliation) {
				edges {
					node {
						... on Repository {
							nameWithOwner
							defaultBranchRef {
								target {
									... on Commit {
										history {
											totalCount
										}
									}
								}
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
	const request = await simple_request(loc_query.name, query, variables);
	if (request.data.data.user.repositories.pageInfo.hasNextPage) {
		edges = edges.concat(request.data.data.user.repositories.edges);
		return loc_query(owner_affiliation, comment_size, request.data.data.user.repositories.pageInfo.endCursor, edges);
	} else {
		return cache_builder(edges.concat(request.data.data.user.repositories.edges), comment_size);
	}
}

export default loc_query;

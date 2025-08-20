export const recusrive_loc_query = `
	query ($repo_name: String!, $owner: String!, $cursor: String) {
		repository(name: $repo_name, owner: $owner) {
			defaultBranchRef {
				target {
					... on Commit {
						history(first: 100, after: $cursor) {
							totalCount
							edges {
								node {
									... on Commit {
										committedDate
									}
									author {
										user {
											id
										}
									}
									deletions
									additions
								}
							}
							pageInfo {
								endCursor
								hasNextPage
							}
						}
					}
				}
			}
		}
	}
`;

import { simple_request } from "../request";
import { query_count } from "../../../utils";

async function follower_getter(username: string): Promise<number> {
	query_count("follower_getter");
	const query = `
	query($login: String!){
		user(login: $login) {
			followers {
				totalCount
			}
		}
	}`;
	const request = await simple_request(follower_getter.name, query, {"login": username});
	return parseInt(request.data.data.user.followers.totalCount);
}

export default follower_getter;

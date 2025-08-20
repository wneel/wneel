import { query_count } from "../../../utils";
import { simple_request } from "../request";

export async function getUserId(username: string): Promise<string> {
	query_count("user_getter");
	const query = `
	query($login: String!){
		user(login: $login) {
			id
		}
	}`;
	const variables = {"login": username};
	const request = await simple_request(getUserId.name, query, variables);
	return (request.data.data.user.id);
}

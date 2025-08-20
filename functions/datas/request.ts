import axios from "axios";
import { HEADERS, QUERY_COUNT } from "../../utils";

export async function simple_request(func_name: string, query: string, variables: any): Promise<any> {
	try {
		const response = await axios.post("https://api.github.com/graphql",
			{query: query, variables: variables},
			{headers: HEADERS}
		);
		if (response.status === 200) {
			return (response);
		}
		throw new Error(`${func_name} has failed with a ${response.status} ${response.statusText} ${JSON.stringify(QUERY_COUNT)}`);
	} catch (error) {
		throw new Error(`${func_name} request failed: ${error.message}`);
	}
}

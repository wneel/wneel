import { createHash } from "crypto";
import { config } from "dotenv";

config();

export const BIRTH_YEAR = 2005;
export const BIRTH_MONTH = 3;
export const COMMENT_SIZE = 7;


export const USER_NAME = process.env.USER_NAME || "no user name"; // "wneel" / "Andrew6rant"
export const USER_ID = process.env.USER_ID || "no user id"; // "MDQ6VXNlcjY2MjYzNjMz"
export const HEADERS = {"authorization": "token " + process.env.ACCESS_TOKEN};

export const QUERY_COUNT: Record<string, number> = {"user_getter": 0, "follower_getter": 0, "graph_repos_stars": 0, "recursive_loc": 0, "graph_commits": 0, "loc_query": 0};

export function query_count(funct_id: string): void {
	QUERY_COUNT[funct_id] += 1;
}

export function getUserFileName() {
	const filename = "cache/" + createHash("sha256").update(USER_NAME).digest("hex") + ".txt";
	return (filename);
}

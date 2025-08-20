import { config } from "dotenv";
import getAgeData from "./functions/datas/age/age";
import { graph_repos_stars } from "./functions/datas/stars/stars";
import { COMMENT_SIZE, QUERY_COUNT, USER_NAME } from "./utils";
import follower_getter from "./functions/datas/followers/followers";
import commit_counter from "./functions/datas/commits/commits";
import svg_overwrite from "./functions/files/svg/write";
import loc_query from "./functions/datas/lines_of_code/loc";
import { function_timer, print_time_to_run } from "./functions/infos/perfs";

config();

async function main(): Promise<void> {
	console.log("Calculation times:");

	const [age_data, age_time] = await function_timer<number>(getAgeData);
	print_time_to_run("age calculation", age_time);

	const [total_loc, loc_time] = await function_timer<any[]>(loc_query, ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"], COMMENT_SIZE);
	total_loc[3] ?
		print_time_to_run("LOC (cached)", loc_time)
	:
		print_time_to_run("LOC (no cache)", loc_time);

	let [commit_data, commit_time] = await function_timer<number>(commit_counter, COMMENT_SIZE);
	print_time_to_run("get commits count", commit_time);

	const [star_and_repos_count, star_repo_time] = await function_timer<{stars: number, repos: number}>(graph_repos_stars, "owner_count", ["OWNER"]);
	print_time_to_run("get stars and repos", star_repo_time);

	const [contrib_data, contrib_time] = await function_timer<{stars: number, repos: number}>(graph_repos_stars, "contrib_data", ["OWNER", "COLLABORATOR", "ORGANIZATION_MEMBER"]);
	print_time_to_run("get contrib repos", contrib_time);

	const [follower_data, follower_time] = await function_timer<number>(follower_getter, USER_NAME);
	print_time_to_run("get followers count", follower_time);

	const loc_data = total_loc.slice(0, -1);

	for (let index = 0; index < loc_data.length; index++) {
		loc_data[index] = loc_data[index].toLocaleString();
	}

	await svg_overwrite("img/dark_mode.svg", age_data, commit_data, star_and_repos_count.stars, star_and_repos_count.repos, contrib_data.repos, follower_data, loc_data);
	await svg_overwrite("img/light_mode.svg", age_data, commit_data, star_and_repos_count.stars, star_and_repos_count.repos, contrib_data.repos, follower_data, loc_data);

	console.log("\nTotal function time:".padEnd(21), `${(age_time + loc_time + commit_time + star_repo_time + contrib_time + follower_time).toFixed(4)}s`.padStart(11));

	console.log("\nTotal GitHub GraphQL API calls:", `${Object.values(QUERY_COUNT).reduce((a, b) => a + b, 0)}`.padStart(3));
	for (const [funct_name, count] of Object.entries(QUERY_COUNT)) {
		console.log(`   ${funct_name}:`.padEnd(28), `${count}`.padStart(6));
	}
}

main();

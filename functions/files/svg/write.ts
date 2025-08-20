import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { readFile, writeFile } from "fs/promises";

function find_and_replace(root: any, element_id: string, new_text: string): void {
	const tree = root[1];
	const elements = tree.svg[7].text;
	for (const element of elements) {
		if (element && element[":@"]?.id === element_id) {
			if (!element.tspan.length) {
				element.tspan.push({"#text": ""});
			}
			element.tspan[0]["#text"] = new_text;
		}
	}
}

function svg_write(root: any, element_id: string, new_text: string | number, length: number = 0): void {
	new_text = new_text.toString();

	find_and_replace(root, element_id, new_text);
	const just_len = length - new_text.length;
	let dot_string: string;
	if (just_len == 0) {
		dot_string = ". ";
	} else if (just_len < 0) {
		dot_string = "";
	} else {
		dot_string = " " + (".".repeat(just_len)) + " ";
	}
	find_and_replace(root, `${element_id}_dots`, dot_string);
}

async function svg_overwrite(filename: string, age_data: number, commit_data: number, star_data: number, repo_data: number, contrib_data: number, follower_data: number, loc_data: string[]): Promise<void> {
	const fileContent = await readFile(filename, "utf8");
	const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "", trimValues: false, preserveOrder: true, processEntities: false });
	const root = parser.parse(fileContent);

	svg_write(root, "age_data", age_data, 22);
	svg_write(root, "age_data_plus", age_data - 10, 2);
	svg_write(root, "commit_data", commit_data, 22);
	svg_write(root, "star_data", star_data, 14);
	svg_write(root, "repo_data", repo_data, 7);
	svg_write(root, "contrib_data", contrib_data);
	svg_write(root, "follower_data", follower_data, 10);
	svg_write(root, "loc_data", loc_data[2], 7);
	svg_write(root, "loc_add", loc_data[0], 5);
	svg_write(root, "loc_del", loc_data[1], 5);

	const builder = new XMLBuilder({ format: false, ignoreAttributes: false, attributeNamePrefix: "", preserveOrder: true });
	const xmlContent = builder.build(root)
	.replace(/&amp;/g, "&");
	await writeFile(filename, xmlContent);
}

export default svg_overwrite;

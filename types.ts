export type OwnerID = { id: string };

export interface commitNode {
	committedDate: string;
	author: {
		user: {
			id: string;
		}
	};
	deletions: number;
	additions: number;
}

export type INotf = {
	type: "follow" | "comment";
	date: number;
	from: {
		id: string;
		name: string;
	};
	post?: {
		id: string;
		title: string;
	};
};

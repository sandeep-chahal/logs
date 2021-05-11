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

export type IHackerNews ={
  by: string,
  descendants: number,
  id: number,
  kids: array<number>,
  score: number,
  time: number,
  title: string,
  type: string,
  url: string
}
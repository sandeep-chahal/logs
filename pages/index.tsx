import { GetServerSideProps } from "next";

import { getLatest } from "../services/redis";
import Post, { IPost } from "../components/post";
import Tags from "../components/tags";

interface IProps {
	posts: null | IPost[];
}

const Home = ({ posts }: IProps) => {
	return (
		<div className="w-4/5 m-auto flex mt-5 items-baseline">
			<div className="w-1/5 relative">
				<Tags />
			</div>
			<div className="w-2/3 m-auto">
				<h1 className="text-3xl bg-white p-2 font-bold text-black ">
					Latest Posts
				</h1>
				{Array.isArray(posts) && posts.length > 0 ? (
					posts.map((post) => <Post key={post._id} post={post} />)
				) : (
					<div className="bg-white p-2 mt-3">No Posts Available!</div>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const posts = await getLatest();
	return {
		props: {
			posts: posts,
		},
	};
};

export default Home;

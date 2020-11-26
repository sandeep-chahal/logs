import { getLatest } from "../services/redis";
import Post from "../components/post";
const Home = ({ posts }) => {
	return (
		<div>
			{posts.map((post) => (
				<Post post={post} />
			))}
		</div>
	);
};

export const getServerSideProps = async () => {
	const posts = await getLatest();
	return {
		props: {
			posts: posts,
		},
	};
};

export default Home;

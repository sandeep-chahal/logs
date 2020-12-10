import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import {
	withMiddlewares,
	withPassport,
	withValidation,
} from "../../middlewares";
import Link from "next/link";
import getUserData from "../../services/getUserData";
import dbConnect from "../../config/mongodb";
import UserPost from "../../components/userPost";
import { useState } from "react";
import { deletePost, loadMorePostsByUser } from "../../utils/fetch/post";
import NProgress from "nprogress";
import Image from "next/image";

import { IUser } from "../../models/user";
import { IShortPost } from "../../models/post";

interface IProps {
	user: IUser;
	posts: IShortPost[];
	me: boolean;
}

const Profile: React.FC<IProps> = (props) => {
	const { user, me } = props;
	// const [isFollowing, setFollowing] = useState(props.isFollowing || false);
	const [isFollowing, setFollowing] = useState(false);
	const [posts, setPosts] = useState(props.posts || []);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);

	const handleDeletePost = (id: string) => {
		if (deleting) return alert("wait!");
		setDeleting(id);
		deletePost(id).then((data) => {
			if (data.error) {
				alert(`ERROR:(${data.code})` + data.msg);
			} else {
				setPosts((posts) => posts.filter((post) => post._id !== id));
			}
			setDeleting(null);
		});
	};

	const handleLoadMore = () => {
		if (loadingMore) return alert("wait");
		NProgress.start();
		loadMorePostsByUser(user._id, posts.length).then((res) => {
			if (!res.error) setPosts((prev) => [...prev, ...res.data]);
			setLoadingMore(false);
			NProgress.done();
		});
	};

	return (
		<div className="text-darkBlue mt-40 font-semibold">
			{/* header */}
			<div className="bg-white w-4/5 m-auto  relative">
				<div
					className="w-32 h-32 m-auto border-white rounded-full bg-gradient-1"
					style={{ transform: "translateY(-50%)", borderWidth: "10px" }}
				>
					<Image
						width="100px"
						height="100px"
						alt={user.name}
						src={user.photo}
						className="object-cover object-center rounded-full"
					/>
				</div>
				{/* follow , counts ,edit */}
				<div className="absolute top-0 right-0 p-8 flex flex-col">
					<div className="mb-2">Following: {user.following_counter}</div>

					{me ? (
						<Link href={`/profile/settings`}>
							<a className="block bg-secondary text-white text-center cursor-pointer p-1">
								Edit
							</a>
						</Link>
					) : (
						<button className={`bg-gradient-3 text-white py-1 px-2 pt-2`}>
							{me
								? "Edit"
								: (isFollowing ? `UnFollow` : `Follow`) +
								  ` ${user.follower_counter}`}
						</button>
					)}
				</div>
				<div style={{ transform: "translateY(-50px)" }} className="text-center">
					<h1 className="text-4xl font-extrabold capitalize">{user.name}</h1>
					<h3>{user.title ? user.title : "no title found"}</h3>
					<div className="m-auto inline-flex mt-3 font-medium">
						<div className="mx-2">{user.email}</div>
						{user.web ? (
							<a href={user.web} target="_blank">
								<img
									className="mx-2 w-6"
									alt="Perosnal Website"
									src="/icons/web.svg"
								/>
							</a>
						) : null}
						{user.github ? (
							<a href={user.github} target="_blank">
								<img
									className="mx-2 w-6"
									alt="Github Link"
									src="/icons/github.svg"
								/>
							</a>
						) : null}
						{user.linkedin ? (
							<a href={user.linkedin} target="_blank">
								<img
									className="mx-2 w-6"
									alt="Linkedin  Link"
									src="/icons/linkedin.svg"
								/>
							</a>
						) : null}
						{user.twitter ? (
							<a href={user.twitter} target="_blank">
								<img
									className="mx-2 w-6"
									alt="Twitter  Link"
									src="/icons/twitter.svg"
								/>
							</a>
						) : null}
					</div>
				</div>
			</div>
			{/* posts and some stats */}

			<div className="bg-white m-auto w-4/5 mt-20 p-6 mb-12">
				<div className="mb-6 text-2xl font-extrabold border-b-2 border-darkBlue border-opacity-50 inline-block">
					Posts
				</div>
				{posts && posts.length ? (
					<div>
						{posts.map((post) => (
							<UserPost
								me={me}
								post={post}
								author={user}
								deleting={deleting === post._id}
								handleDeletePost={handleDeletePost}
							/>
						))}
						<button
							className="bg-secondary text-white py-1 px-2 m-auto block font-semibold"
							disabled={loadingMore}
							onClick={handleLoadMore}
						>
							Load More
						</button>
					</div>
				) : (
					<div className="text-center">
						No posts from <span className="font-semibold">{user.name}</span>
					</div>
				)}
			</div>
		</div>
	);
};

interface CREQ extends NextApiRequest {
	user: IUser;
	isAuthenticated: () => boolean;
}
interface CGSSP {
	req: CREQ;
	res: NextApiResponse;
	params: { id: string };
}

export const getServerSideProps = async ({ params, req, res }: CGSSP) => {
	try {
		// connect to db
		await dbConnect();

		// check if user opens his own profile
		let me = params.id === "me";

		// map id from url to body [for validation]
		req.body = params;

		// run middleware's
		const result = await withMiddlewares(req, res, [
			me ? withValidation("valid-id") : () => {},
			withPassport,
		]);

		// if any error during validation
		if (result.error) return res.redirect("/error?error_code=" + result.code);

		// if not logged in
		if (me && !req.isAuthenticated())
			return res.redirect("/error?error_code=101");
		if (!me && req.isAuthenticated()) me = req.user._id === params.id;

		// get user personal data
		const data = JSON.parse(
			JSON.stringify(await getUserData(me ? req.user._id : params.id))
		);

		// if error when fetching user data from db
		if (data.error) return res.redirect("/error?error_code=" + data.code);

		return {
			props: {
				user: data.user,
				posts: data.posts,
				me: me,
			},
		};
	} catch (err) {
		console.error(err);
		return res.redirect("/error?error_code=106");
	}
};

export default Profile;

import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import withMiddlewares from "../../middlewares";
import Link from "next/link";
import getUserData from "../../services/getUserData";
import dbConnect from "../../config/mongodb";
import UserPost from "../../components/userPost";
import { useState, useEffect } from "react";
import { deletePost, loadMorePostsByUser } from "../../utils/fetch/post";
import { handleFollow } from "../../utils/fetch/user";
import NProgress from "nprogress";
import Image from "next/image";

import { IUser } from "../../models/user";
import { IShortPost } from "../../models/post";
import Head from "next/head";
import { useStore } from "../../store";
import { showModal } from "../../store/actions";

interface IProps {
	user: IUser;
	posts: IShortPost[];
	me: boolean;
	isFollowing: boolean;
}

const Profile: React.FC<IProps> = (props) => {
	const { me } = props;
	const [user, setUser] = useState(props.user);
	const [isFollowing, setFollowing] = useState(props.isFollowing);
	const [posts, setPosts] = useState(props.posts || []);
	const [deleting, setDeleting] = useState<string | null>(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const [followbtnDisable, setFollowbtnDisable] = useState(false);

	useEffect(() => {
		setUser(props.user);
		setFollowing(props.isFollowing);
		setPosts(props.posts || []);
	}, [props]);

	const [state, dispatch] = useStore();

	const showError = (msg: string) => {
		dispatch(
			showModal(true, {
				msg,
				type: "ERROR",
			})
		);
	};

	const handleDeletePost = (id: string) => {
		if (deleting) return showError("wait!");
		setDeleting(id);
		deletePost(id).then((data) => {
			if (data.error) {
				showError(`ERROR:(${data.code})` + data.msg);
			} else {
				setPosts((posts) => posts.filter((post) => post._id !== id));
			}
			setDeleting(null);
		});
	};

	const handleLoadMore = () => {
		if (loadingMore) return showError("wait");
		NProgress.start();
		loadMorePostsByUser(user._id, posts.length).then((res) => {
			if (!res.error) setPosts((prev) => [...prev, ...res.data]);
			setLoadingMore(false);
			NProgress.done();
		});
	};

	const handleFollowClick = async () => {
		if (me || followbtnDisable) return;
		if (!state.user) return showError("Login First To Follow!");
		const isF = isFollowing;
		setFollowing((s) => !s);
		setFollowbtnDisable(true);
		setUser((user) => {
			return {
				...user,
				follower_counter: isF
					? user.follower_counter - 1
					: user.follower_counter + 1,
			};
		});
		const res = await handleFollow(isF ? "unfollow" : "follow", user._id);
		setFollowbtnDisable(false);
		if (res.error) {
			setFollowing((s) => !s);
			setUser((user) => {
				return {
					...user,
					follower_counter: isF
						? user.follower_counter + 1
						: user.follower_counter - 1,
				};
			});
			return showError(res.msg || "Something went wrong!");
		}
	};

	return (
		<div className="text-darkBlue mt-40 font-semibold">
			<Head>
				<title>{user.name}</title>
				<meta
					name="description"
					content={
						user?.summary ||
						user?.title ||
						`Check out cool posts by ${user.name}`
					}
				/>
				<meta name="tags" content={`${user?.title || ""}, ${user.name}`} />
				<meta property="og:title" content={user.name + " profile"} />
				<meta
					property="og:description"
					content={
						user?.summary ||
						user?.title ||
						`Check out cool posts by ${user.name}`
					}
				/>
				<meta property="og:image" content={user.photo} />
			</Head>
			{/* header */}
			<div className="bg-white w-11/12 md:w-4/5 m-auto  relative">
				<div
					className="w-32 h-32 m-auto border-white rounded-full bg-gradient-1"
					style={{ transform: "translateY(-50%)", borderWidth: "10px" }}
				>
					{new Date(
						(props.user.subscription && props.user.subscription.expiresOn) || 0
					) > new Date() ? (
						<img
							width="70px"
							height="70px"
							className="z-10 absolute -mt-10 top-0 right-0 block transform rotate-45"
							src={"/icons/crown.png"}
						/>
					) : null}
					<div
						style={{
							backgroundImage: `url(${user.photo})`,
							width: "6.2rem",
							height: "6.2rem",
						}}
						// width="100px"
						// height="100px"
						title={user.name}
						// src={}
						className="rounded-full bg-cover"
					/>
				</div>

				<div style={{ transform: "translateY(-50px)" }} className="text-center">
					<h1 className="text-4xl font-extrabold capitalize">{user.name}</h1>
					<h3>{user.title ? user.title : "no title found"}</h3>
					<h4>{user.summary}</h4>
					<div className="m-auto md:inline-flex md:items-center mt-3 font-medium">
						<div className="mx-2">{user.email}</div>
						<div className="flex justify-center mt-3 md:mt-0">
							{user.web ? (
								<a href={user.web} target="_blank">
									<img
										className="mx-8 w-8 md:w-6"
										alt="Personal Website"
										src="/icons/web.svg"
									/>
								</a>
							) : null}
							{user.github ? (
								<a href={user.github} target="_blank">
									<img
										className="mx-8 w-8 md:w-6"
										alt="Github Link"
										src="/icons/github.svg"
									/>
								</a>
							) : null}
							{user.linkedin ? (
								<a href={user.linkedin} target="_blank">
									<img
										className="mx-8 w-8 md:w-6"
										alt="Linkedin  Link"
										src="/icons/linkedin.svg"
									/>
								</a>
							) : null}
							{user.twitter ? (
								<a href={user.twitter} target="_blank">
									<img
										className="mx-8 w-8 md:w-6"
										alt="Twitter  Link"
										src="/icons/twitter.svg"
									/>
								</a>
							) : null}
						</div>
					</div>
				</div>

				{/* followers */}
				<div className="md:absolute top-0 right-0 md:p-8 flex flex-col items-start pl-4 pb-4">
					<div className="mb-2 text-lg md:text-base">
						Following: {user.following_counter}
					</div>
					{/* follow/edit */}
					{me ? (
						<Link href={`/profile/settings`}>
							<a className="inline-block bg-secondary text-white text-center cursor-pointer p-1 px-12">
								Edit
							</a>
						</Link>
					) : (
						<button
							disabled={followbtnDisable}
							onClick={handleFollowClick}
							className={`bg-secondary text-white py-1 px-2 pt-2`}
						>
							{(isFollowing ? `UnFollow` : `Follow`) +
								` ${user.follower_counter}`}
						</button>
					)}
				</div>
			</div>
			{/* posts and some stats */}

			<div className="bg-white m-auto w-11/12 md:w-4/5 mt-20 p-3 md:p-6 mb-12">
				<div className="mb-6 text-2xl font-extrabold border-b-2 border-darkBlue border-opacity-50 inline-block">
					Posts
				</div>
				{posts && posts.length ? (
					<div>
						{posts.map((post) => (
							<UserPost
								key={post._id}
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
		console.log(params.id);

		// check if user opens his own profile
		let me = params.id === "me";

		// map id from url to body [for validation]
		req.body = params;

		// run middleware's
		const result = await withMiddlewares(
			req,
			res,
			"1 3",
			me ? "valid-id" : false
		);

		// if any error during validation
		if (result.error)
			return {
				redirect: {
					permanent: false,
					destination: `/error?error_code=${result.code}`,
				},
			};

		// if not logged in
		if (me && !req.isAuthenticated())
			return {
				redirect: {
					permanent: false,
					destination: `/error?error_code=101`,
				},
			};
		if (!me && req.isAuthenticated()) me = req.user._id === params.id;

		// get user personal data
		const data = JSON.parse(
			JSON.stringify(
				await getUserData(
					me ? req.user._id : params.id,
					req.user ? req.user._id : null
				)
			)
		);

		// if error when fetching user data from db
		if (data.error)
			return {
				redirect: {
					permanent: false,
					destination: `/error?error_code=${data.code}`,
				},
			};

		return {
			props: {
				user: data.user,
				posts: data.posts,
				me: me,
				isFollowing: data.isFollowing,
			},
		};
	} catch (err) {
		console.error(err);
		return {
			redirect: {
				permanent: false,
				destination: `/error?error_code=106`,
			},
		};
	}
};

export default Profile;

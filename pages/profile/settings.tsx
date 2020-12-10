import {
	withAuthentication,
	withMiddlewares,
	withPassport,
} from "../../middlewares";
import dbConnect from "../../config/mongodb";
import getUserProfile from "../../services/getUserProfile";

import { useState } from "react";
import { useStore } from "../../store";
import { setUser } from "../../store/actions";
import { setUser as setUserToLS } from "../../utils";
import { updateProfile } from "../../utils/fetch/user";
import Input from "../../components/input";
import { useRouter } from "next/router";
import uploadFile from "../../utils/fetch/uploadFile";

import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../models/user";

interface IProps {
	user: IUser;
}

type IError = {
	[k: string]: string;
};

const Settings = ({ user }: IProps) => {
	const [state, dispatch] = useStore();
	const router = useRouter();

	if (!state.isClient) return <div>Loading</div>;
	if (!user) {
		return router.push("/error?error_code=101");
	}

	const [error, setError] = useState<IError>({});
	const [loading, setLoading] = useState(false);
	const [photo, setPhoto] = useState(user.photo);
	const [title, setTitle] = useState(user.title);
	const [summary, setSummary] = useState(user.summary);
	const [location, setLocation] = useState(user.location);
	const [web, setWeb] = useState(user.web);
	const [linkedin, setLinkedin] = useState(user.linkedin);
	const [github, setGithub] = useState(user.github);
	const [twitter, setTwitter] = useState(user.twitter);

	const handleSave = () => {
		setLoading(true);
		setError({});
		// @ts-ignore
		updateProfile({
			photo,
			title,
			summary,
			location,
			web,
			linkedin,
			github,
			twitter,
		})
			.then((data) => {
				console.log("-user-".repeat(50));
				console.log(data);
				if (data && data.error) {
					setError(data.errors || {});
					setLoading(false);
				} else {
					//save user data to local storage
					dispatch(setUser(data.data));
					setUserToLS(data.data);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError({ other: "Something Went Wrong" });
				setLoading(false);
			});
	};

	const handlePhotoChange = (file: File) => {
		if (loading) return;
		setLoading(true);
		setError({});
		uploadFile(file).then((res) => {
			if (res.errors) {
				setError(res.errors);
			} else if (res.data) {
				setPhoto(res.data);
			}
			setLoading(false);
		});
	};

	return (
		<section className="w-2/4 m-auto mt-8 mb-8 text-darkBlue">
			<div className="bg-white p-8 mb-8">
				<h2 className="text-2xl font-extrabold mb-6">User</h2>
				<Input
					disabled={true}
					type="email"
					name="Email"
					value={state.user.email}
					setState={() => {}}
					placeholder="Email"
				/>
				<Input
					disabled={true}
					type="text"
					name="Name"
					value={state.user.name}
					setState={() => {}}
					placeholder="Name"
				/>
				<Input
					err={error["photo"]}
					disabled={loading}
					type="file"
					name="Photo"
					value={photo}
					setFile={handlePhotoChange}
					placeholder="Image"
				/>
			</div>

			<div className="bg-white p-8 mb-8">
				<h2 className="text-2xl font-extrabold mb-6">Bio</h2>
				<Input
					err={error["title"]}
					disabled={loading}
					type="text"
					name="Title"
					value={title || ""}
					setState={setTitle}
					placeholder="Web developer, Data science, etc"
				/>
				<Input
					err={error["summary"]}
					disabled={loading}
					type="textarea"
					name="Summary"
					value={summary || ""}
					setState={setSummary}
					placeholder={"A short summary about you..."}
				/>
				<Input
					err={error["location"]}
					disabled={loading}
					type="text"
					name="Location"
					value={location || ""}
					setState={setLocation}
					placeholder="City, State, Country"
				/>
			</div>
			<div className="bg-white p-8 mb-8">
				<h2 className="text-2xl font-extrabold mb-6">Socials</h2>
				<Input
					err={error["web"]}
					disabled={loading}
					type="text"
					name="Website"
					value={web || ""}
					setState={setWeb}
					placeholder={state.user.name.replaceAll(" ", "") + ".com"}
				/>
				<Input
					err={error["linkedin"]}
					disabled={loading}
					type="text"
					name="Linkedin"
					value={linkedin || ""}
					setState={setLinkedin}
					placeholder="Linkedin url"
				/>
				<Input
					err={error["github"]}
					disabled={loading}
					type="text"
					name="Github"
					value={github || ""}
					setState={setGithub}
					placeholder="Github url"
				/>
				<Input
					err={error["twitter"]}
					disabled={loading}
					type="text"
					name="Twitter"
					value={twitter || ""}
					setState={setTwitter}
					placeholder="Twitter url"
				/>
			</div>

			{/* other errors */}
			<div className="text-primary">{error["other"]}</div>

			<button
				onClick={handleSave}
				disabled={loading}
				className={`py-1 px-4 text-white ${
					loading ? "bg-gray-300 cursor-wait" : "bg-primary"
				} m-auto block`}
			>
				{loading ? "Wait" : "Save"}
			</button>
		</section>
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

export const getServerSideProps = async ({ req, res }: CGSSP) => {
	await dbConnect();

	const result = await withMiddlewares(req, res, [
		withPassport,
		withAuthentication,
	]);

	// if any error during validation
	if (result.error) return res.redirect("/error?error_code=" + result.code);

	// get user profile
	const data = await getUserProfile(req.user._id);
	if (data.error) return res.redirect("/error?error_code=" + data.code);

	return {
		props: {
			user: JSON.parse(JSON.stringify(data.user)),
		},
	};
};

export default Settings;

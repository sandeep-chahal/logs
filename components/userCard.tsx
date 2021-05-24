import Link from "next/link";
import { IUser } from "../models/user";
import { IFund } from "../models/fund";
import MiniFund from "./miniFund";

interface IProps {
	user: IUser;
	fund: IFund;
	className?: string;
}

const UserCard = ({ user, fund, className }: IProps) => {
	return (
		<div
			style={{ top: "120px", maxHeight: "70vh" }}
			className={`hidden md:block md:sticky text-center bg-white w-1/5 md:w-1/3 md:mr-12 overflow-y-auto rounded ${className}`}
		>
			<div className="bg-gray-100 p-4 flex items-center justify-evenly">
				<img
					src={user.photo}
					className="h-24 w-24 object-cover rounded-full m-auto"
				/>
			</div>
			<div className="px-4">
				<Link href={`/profile/${user._id}`}>
					<a href={`/profile/${user._id}`}>
						<h2 className="font-bold mt-2 text-2xl hover:text-primary">
							{user.name}
						</h2>
					</a>
				</Link>
				<h4 className="font-medium text-lg">{user.title}</h4>
				<p className="font-light">{user.summary}</p>
			</div>
			<div className="flex justify-center mt-2">
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
			<div className="mt-4 bg-gradient-1 p-4">
				<h2 className="text-center text-xl font-bold text-white mb-2">
					Recent Fund
				</h2>
				{fund ? (
					<MiniFund
						// @ts-ignore
						fund={fund}
						user={false}
						deadline
						raised
						className="w-full"
						barClasses="bg-white"
					/>
				) : (
					<div>No recent fund found!</div>
				)}
			</div>
		</div>
	);
};

export default UserCard;

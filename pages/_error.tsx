import Head from "next/head";
import { useRouter } from "next/router";

const ErrorPage = () => {
	const router = useRouter();
	const code = (router.query.error_code as string) || "106";
	const error = getErrorData(code);
	return (
		<div className="min-h-screen min-w-full text-center md:text-left">
			<Head>
				<title>DevLogs | Error</title>
				<meta name="description" content={error.info} />
			</Head>
			<div className="flex flex-col-reverse md:flex-row items-center md:w-1/2 m-auto">
				<div className="nd:w-4/5">
					<h2 className="text-4xl font-bold">{error.text}</h2>
					<p className="text-lg font-medium">{error.info}</p>
				</div>
				<img className="w-1/2" src={error.img} />
			</div>
		</div>
	);
};

function getErrorData(code: string) {
	switch (code) {
		case "101":
			return {
				img: "/no-connection.svg",
				text: "Who are you?",
				info: "You are not logged in. Do that first. Okay?",
			};
		case "102":
			return {
				img: "/fatal-error-2.svg",
				text: "What did you did?",
				info: "Congrats you got a validation error. Go fix it.",
			};
		case "103":
			return {
				img: "/fatal-error-3.svg",
				text: "You know you can't do that!",
				info:
					"You don't have permissions to do this task. Please ask you dad first.",
			};
		case "104":
			return {
				img: "/404-error.svg",
				text: "Looks like someone's lost!",
				info: "The page you are looking for is not available.",
			};
		case "105":
			return {
				img: "/fatal-error-4.svg",
				text: "Wrong address mate!",
				info:
					"The Id you were provided is not valid. Please go ask for the valid Id.",
			};
		default:
			return {
				img: "fatal-error-5.svg",
				text: "Wait, What?",
				info: "Something unknown happened, we don't know what it is.",
			};
	}
	return {
		img: "",
		text: "",
		info: "",
	};
}

export default ErrorPage;

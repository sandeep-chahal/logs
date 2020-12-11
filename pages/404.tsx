import Head from "next/head";

const ErrorPage = () => {
	return (
		<div className="min-h-screen min-w-full">
			<Head>
				<title>DevLogs | Error</title>
				<meta name="description" content="page not found" />
			</Head>
			<div className="flex items-center w-1/2 m-auto">
				<div className="w-4/5">
					<h2 className="text-4xl font-bold">Looks like someone's lost!</h2>
					<p className="text-lg font-medium">
						The page you are looking for is not available.
					</p>
				</div>
				<img className="w-1/2" src="/404-error.svg" />
			</div>
		</div>
	);
};

export default ErrorPage;

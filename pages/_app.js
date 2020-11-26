import { Provider } from "../store";
import Layout from "../components/layout";

import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress

import "../styles/tailwind.css";

NProgress.configure({
	showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
	return (
		<Provider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</Provider>
	);
}

export default MyApp;

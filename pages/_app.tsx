import type { AppProps } from "next/app";

import { Provider } from "../store";
import Layout from "../components/layout";

import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import Cursor from "../components/cursor";

import "../styles/tailwind.css";

NProgress.configure({
	showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Provider>
			<Layout>
				<Component {...pageProps} />
				<Cursor />
			</Layout>
		</Provider>
	);
}

export default MyApp;

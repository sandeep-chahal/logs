import { Provider } from "../store";
import Layout from "../components/layout";

import "../styles/tailwind.scss";

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

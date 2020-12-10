module.exports = {
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				black: "#504E4E",
				white: "#fff",
				grey: "#F8F8F8",
				primary: "#ff006e",
				secondary: "#8338ec",
				darkBlue: "#1c0044",
			},
			font: {
				overpass: "Overpass Mono",
			},
		},
	},
	variants: {},
	plugins: [],
};

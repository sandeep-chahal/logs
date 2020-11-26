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
				pureWhite: "#fff",
				white: "#F8F8F8",
				primary: "#FB8585",
			},
			font: {
				overpass: "Overpass Mono",
			},
		},
	},
	variants: {},
	plugins: [],
};

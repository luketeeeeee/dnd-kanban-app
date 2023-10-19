/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				mainBgColor: "#0D1117",
				columnBgColor: "#192026",
			},
		},
	},
	plugins: [],
};

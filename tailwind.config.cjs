// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--jakarta-font)", ...fontFamily.sans],
      },
      maxWidth: {
        "2/5": "40%",
      },
      colors: {
        "purple-9": "#090019",
        "purple-8": "#10002b",
        "purple-7": "#240046",
        "purple-6": "#3c096c",
        "purple-5": "#5a189a",
        "purple-4": "#7b2cbf",
        "purple-3": "#9d4edd",
        "purple-2": "#c77dff",
        "purple-1": "#e0aaff",
        "white-0-8": "rgba(white, 0.8)",
      },
    },
  },
  plugins: [],
};

module.exports = config;

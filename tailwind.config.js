module.exports = {
  content: ["./templates/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        main: "#1abc9c",
        background: "#202125",
        blue: "#0d3b66",
        yellow: "#f4d35e",
        orange: "#ee964b",
        red: "#f95738",
        cream: "#faf0ca",
      },
    },
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
      "2xl": "1600px",
    },
  },
  plugins: [],
};

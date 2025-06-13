// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <- esto es MUY importante
  ],
  theme: {
    extend: {
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

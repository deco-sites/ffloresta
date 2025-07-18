import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.9375rem",
        lg: "4rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1240px",
        "2xl": "1240px",
      },
    },

    extend: {
      maxWidth: {
        "8xl": "1240px", // Adiciona uma classe max-w-8xl como fallback
      },
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
};

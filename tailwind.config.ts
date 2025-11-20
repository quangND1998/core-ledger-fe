import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./app/components/**/*.{vue,js,ts,jsx,tsx}",
    "./app/pages/**/*.{vue,js,ts,jsx,tsx}",
    "./app/layouts/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "body-12-s-medium": "var(--body-12-s-medium-font-family)",
        "body-12-s-regular": "var(--body-12-s-regular-font-family)",
        "body-14-m-regular": "var(--body-14-m-regular-font-family)",
        "button-s-14-medium": "var(--button-s-14-medium-font-family)",
        "caption-l-12-medium": "var(--caption-l-12-medium-font-family)",
        "caption-l-12-semibold": "var(--caption-l-12-semibold-font-family)",
        "caption-m-10-semibold": "var(--caption-m-10-semibold-font-family)",
        "heading-XL-32-medium": "var(--heading-XL-32-medium-font-family)",
        "label-m-16-medium": "var(--label-m-16-medium-font-family)",
        "label-s-14-medium": "var(--label-s-14-medium-font-family)",
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    container: { 
      center: true, 
      padding: "2rem", 
      screens: { 
        "2xl": "1400px" 
      } 
    },
  },
  plugins: [],
  darkMode: ["class"],
} satisfies Config


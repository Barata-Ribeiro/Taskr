import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            container: { center: true, padding: "1rem" },
            screens: {
                xs: "475px",
            },
            fontSize: {
                sm: "0.750rem",
                base: "1rem",
                xl: "1.333rem",
                "2xl": "1.777rem",
                "3xl": "2.369rem",
                "4xl": "3.158rem",
                "5xl": "4.210rem",
            },
            fontFamily: {
                heading: ["var(--font-roboto)", "sans"],
                body: ["var(--font-nunito)", "sans"],
            },
            colors: {
                body: {
                    50: "hsl(251, 44%, 95%)",
                    100: "hsl(249, 41%, 90%)",
                    200: "hsl(250, 43%, 80%)",
                    300: "hsl(250, 42%, 70%)",
                    400: "hsl(250, 43%, 60%)",
                    500: "hsl(250, 43%, 50%)",
                    600: "hsl(250, 43%, 40%)",
                    700: "hsl(250, 42%, 30%)",
                    800: "hsl(250, 43%, 20%)",
                    900: "hsl(249, 41%, 10%)",
                    950: "hsl(251, 44%, 5%)",
                },
                background: {
                    50: "hsl(257, 54%, 95%)",
                    100: "hsl(258, 53%, 90%)",
                    200: "hsl(257, 55%, 80%)",
                    300: "hsl(257, 54%, 70%)",
                    400: "hsl(257, 54%, 60%)",
                    500: "hsl(257, 54%, 50%)",
                    600: "hsl(257, 54%, 40%)",
                    700: "hsl(257, 54%, 30%)",
                    800: "hsl(257, 55%, 20%)",
                    900: "hsl(258, 53%, 10%)",
                    950: "hsl(257, 54%, 5%)",
                },
                primary: {
                    50: "hsl(254, 68%, 95%)",
                    100: "hsl(255, 69%, 90%)",
                    200: "hsl(255, 69%, 80%)",
                    300: "hsl(255, 69%, 70%)",
                    400: "hsl(255, 68%, 60%)",
                    500: "hsl(255, 68%, 50%)",
                    600: "hsl(255, 68%, 40%)",
                    700: "hsl(255, 69%, 30%)",
                    800: "hsl(255, 69%, 20%)",
                    900: "hsl(255, 69%, 10%)",
                    950: "hsl(254, 68%, 5%)",
                },
                secondary: {
                    50: "hsl(255, 77%, 95%)",
                    100: "hsl(255, 76%, 90%)",
                    200: "hsl(255, 76%, 80%)",
                    300: "hsl(255, 76%, 70%)",
                    400: "hsl(255, 77%, 60%)",
                    500: "hsl(255, 77%, 50%)",
                    600: "hsl(255, 77%, 40%)",
                    700: "hsl(255, 76%, 30%)",
                    800: "hsl(255, 76%, 20%)",
                    900: "hsl(255, 76%, 10%)",
                    950: "hsl(255, 77%, 5%)",
                },
                accent: {
                    50: "hsl(256, 85%, 95%)",
                    100: "hsl(255, 84%, 90%)",
                    200: "hsl(255, 86%, 80%)",
                    300: "hsl(255, 86%, 70%)",
                    400: "hsl(255, 86%, 60%)",
                    500: "hsl(255, 86%, 50%)",
                    600: "hsl(255, 86%, 40%)",
                    700: "hsl(255, 86%, 30%)",
                    800: "hsl(255, 86%, 20%)",
                    900: "hsl(255, 84%, 10%)",
                    950: "hsl(254, 85%, 5%)",
                },
            },
            boxShadow: {
                standard:
                    "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08);",
                derek:
                    "    0px 0px 0px 1px rgb(0 0 0 / 0.06),\n" +
                    "      0px 1px 1px -0.5px rgb(0 0 0 / 0.06),\n" +
                    "      0px 3px 3px -1.5px rgb(0 0 0 / 0.06), \n" +
                    "      0px 6px 6px -3px rgb(0 0 0 / 0.06),\n" +
                    "      0px 12px 12px -6px rgb(0 0 0 / 0.06),\n" +
                    "      0px 24px 24px -12px rgb(0 0 0 / 0.06);",
                brutal: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;",
                nextJS: "0 8px 30px rgb(0,0,0,0.12);",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
}
export default config

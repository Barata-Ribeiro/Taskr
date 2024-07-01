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
                    50: "hsl(216, 38%, 5%)",
                    100: "hsl(214, 41%, 10%)",
                    200: "hsl(214, 41%, 20%)",
                    300: "hsl(214, 41%, 30%)",
                    400: "hsl(214, 41%, 40%)",
                    500: "hsl(214, 41%, 50%)",
                    600: "hsl(214, 41%, 60%)",
                    700: "hsl(214, 41%, 70%)",
                    800: "hsl(214, 41%, 80%)",
                    900: "hsl(214, 41%, 90%)",
                    950: "hsl(210, 38%, 95%)",
                },
                background: {
                    50: "hsl(208, 52%, 5%)",
                    100: "hsl(211, 49%, 10%)",
                    200: "hsl(210, 51%, 20%)",
                    300: "hsl(210, 50%, 30%)",
                    400: "hsl(210, 50%, 40%)",
                    500: "hsl(210, 50%, 50%)",
                    600: "hsl(210, 50%, 60%)",
                    700: "hsl(210, 50%, 70%)",
                    800: "hsl(211, 50%, 80%)",
                    900: "hsl(209, 49%, 90%)",
                    950: "hsl(212, 52%, 95%)",
                },
                primary: {
                    50: "hsl(214, 62%, 5%)",
                    100: "hsl(211, 61%, 10%)",
                    200: "hsl(211, 63%, 20%)",
                    300: "hsl(211, 62%, 30%)",
                    400: "hsl(211, 62%, 40%)",
                    500: "hsl(211, 62%, 50%)",
                    600: "hsl(211, 62%, 60%)",
                    700: "hsl(211, 62%, 70%)",
                    800: "hsl(211, 63%, 80%)",
                    900: "hsl(211, 61%, 90%)",
                    950: "hsl(210, 62%, 95%)",
                },
                secondary: {
                    50: "hsl(212, 76%, 5%)",
                    100: "hsl(211, 73%, 10%)",
                    200: "hsl(211, 73%, 20%)",
                    300: "hsl(211, 73%, 30%)",
                    400: "hsl(211, 73%, 40%)",
                    500: "hsl(211, 73%, 50%)",
                    600: "hsl(211, 73%, 60%)",
                    700: "hsl(211, 73%, 70%)",
                    800: "hsl(211, 73%, 80%)",
                    900: "hsl(211, 73%, 90%)",
                    950: "hsl(212, 76%, 95%)",
                },
                accent: {
                    50: "hsl(211, 84%, 5%)",
                    100: "hsl(211, 84%, 10%)",
                    200: "hsl(211, 84%, 20%)",
                    300: "hsl(211, 84%, 30%)",
                    400: "hsl(211, 84%, 40%)",
                    500: "hsl(211, 84%, 50%)",
                    600: "hsl(211, 84%, 60%)",
                    700: "hsl(211, 84%, 70%)",
                    800: "hsl(211, 84%, 80%)",
                    900: "hsl(211, 84%, 90%)",
                    950: "hsl(211, 84%, 95%)",
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

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
                ebony: {
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
                "english-holly": {
                    "50": "hsl(141, 100%, 97%)",
                    "100": "hsl(146, 100%, 92%)",
                    "200": "hsl(146, 97%, 85%)",
                    "300": "hsl(147, 96%, 73%)",
                    "400": "hsl(147, 86%, 58%)",
                    "500": "hsl(147, 88%, 45%)",
                    "600": "hsl(147, 95%, 36%)",
                    "700": "hsl(148, 89%, 29%)",
                    "800": "hsl(148, 80%, 24%)",
                    "900": "hsl(149, 77%, 20%)",
                    "950": "hsl(150, 100%, 7%)",
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
    safelist: ["fill-gray-500", "fill-red-500", "fill-green-500", "fill-yellow-500"],
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
}
export default config

import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript", "prettier")]

export default eslintConfig

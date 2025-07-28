import tw from "@/utils/tw"
import { ClassAttributes, TableHTMLAttributes } from "react"
import ReactMarkdown, { ExtraProps } from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { twMerge } from "tailwind-merge"

interface SafeMarkdownProps {
    markdown: string
    container?: boolean
}

type TableProps = ClassAttributes<HTMLTableElement> & TableHTMLAttributes<HTMLTableElement> & ExtraProps

function getMarkdownTable() {
    return {
        table: ({ node, ...props }: TableProps) => {
            if (!node?.children) return null
            return (
                <div className="overflow-x-auto">
                    <table {...props} className="w-full min-w-[600px] table-auto" />
                </div>
            )
        },
    }
}

export default function SafeMarkdown({ markdown, container = true }: Readonly<SafeMarkdownProps>) {
    const styles = {
        prose: tw`prose dark:prose-invert prose-gray prose-img:mx-auto prose-img:rounded-xl`,
        container: tw`my-6 w-full overflow-hidden border-y border-gray-200 py-6 dark:border-gray-700`,
    }

    const mergedStyles = container ? twMerge(styles.container, styles.prose) : styles.prose

    return (
        <div aria-label="markdown-content" className={mergedStyles}>
            <ReactMarkdown rehypePlugins={[rehypeSanitize]} remarkPlugins={[remarkGfm]} components={getMarkdownTable()}>
                {markdown}
            </ReactMarkdown>
        </div>
    )
}

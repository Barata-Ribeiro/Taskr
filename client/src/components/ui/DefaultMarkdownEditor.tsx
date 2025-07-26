"use client"

import tw from "@/utils/tw"
import { Description, Field, Label } from "@headlessui/react"
import dynamic from "next/dist/shared/lib/app-dynamic"
import { type Dispatch, type SetStateAction, type TextareaHTMLAttributes, useId } from "react"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

interface DefaultMarkdownEditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> {
    label?: string
    description?: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
})

export default function DefaultMarkdownEditor({
    label,
    description,
    value,
    setValue,
    ...props
}: Readonly<DefaultMarkdownEditorProps>) {
    const defaultId = useId()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { onScroll, ...restProps } = props

    const defaultStyles = {
        label: tw`block text-sm/6 font-medium data-disabled:opacity-50`,
        description: tw`text-sm/6 text-gray-500 data-disabled:opacity-50 dark:text-gray-400`,
    }

    return (
        <Field disabled={props.disabled}>
            {label && (
                <Label htmlFor={defaultId} className={defaultStyles.label}>
                    {label}
                </Label>
            )}

            {description && <Description className={defaultStyles.description}>{description}</Description>}

            <MDEditor
                className="mt-2 resize-none rounded-md whitespace-pre-wrap"
                value={value}
                onChange={value => {
                    if (value === undefined) return
                    setValue?.(value)
                }}
                height={300}
                preview="edit"
                hideToolbar={restProps.disabled}
                textareaProps={{ id: defaultId, ...restProps }}
                previewOptions={{ rehypePlugins: [[rehypeSanitize]], remarkPlugins: [[remarkGfm]] }}
            />
        </Field>
    )
}

import DefaultSkeleton from "@/components/ui/skeletons/DefaultSkeleton"

export default function MarkdownEditorSkeleton() {
    return (
        <div role="status" aria-label="Loading in progress... Please wait.">
            <DefaultSkeleton className="mb-2 h-5 w-32" />
            <DefaultSkeleton className="mb-3 h-4 w-48" />
            <DefaultSkeleton className="h-72 w-full rounded-md" />
        </div>
    )
}

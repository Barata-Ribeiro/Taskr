import { ReactNode } from "react"

interface DividerProps {
    children: ReactNode
}

export default function Divider({ children }: Readonly<DividerProps>) {
    return (
        <div className="relative my-2">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white px-2 text-gray-500">{children}</span>
            </div>
        </div>
    )
}

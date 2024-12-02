import { useEffect, useState } from "react"

export function useDebounce(value: string, delay: number): string {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        return () => clearTimeout(setTimeout(() => setDebouncedValue(value), delay))
    }, [value, delay])

    return debouncedValue
}

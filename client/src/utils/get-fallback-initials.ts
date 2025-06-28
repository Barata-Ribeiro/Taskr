export default function getFallbackInitials(name: string): string {
    const [first, second] = name.split(" ")

    if (!second) {
        const firstLetter = first.charAt(0).toUpperCase()
        const lastLetter = first.charAt(first.length - 1).toUpperCase()
        return `${firstLetter}${lastLetter}`
    }

    return `${first.charAt(0).toUpperCase()}${second.charAt(0).toUpperCase()}`
}

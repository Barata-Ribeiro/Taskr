export default function normalizeBadgeString(str: string): string {
    return str.replace(/_/g, " ").toLowerCase()
}

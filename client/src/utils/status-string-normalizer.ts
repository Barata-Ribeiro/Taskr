export default function statusStringNormalizer(status: string): string {
    return status.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase())
}

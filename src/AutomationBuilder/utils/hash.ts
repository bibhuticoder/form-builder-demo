/**
 * Simple deterministic hash function to generate a consistent ID from two strings.
 * Based on the Java String.hashCode() implementation.
 */
export function hashStrings(s1: string, s2: string): string {
    const str = `${s1}_${s2}`;
    let hash = 0;
    if (str.length === 0) return '0';
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

/**
 * Generates a standard edge ID by hashing the source and target node IDs.
 */
export function generateEdgeId(sourceId: string, targetId: string): string {
    return `edge_${hashStrings(sourceId, targetId)}`;
}

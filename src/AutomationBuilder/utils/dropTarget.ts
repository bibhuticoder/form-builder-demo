import type { Edge, Node } from "reactflow"

type DropPosition = { x: number; y: number }

export type DropCandidate = {
    node: Node
    depth: number
    distance: number
    x: number
    y: number
}

export type DropRule = (a: DropCandidate, b: DropCandidate) => number

export type DropTargetOptions = {
    directDistance?: number
    nearDistance?: number
    fallbackRules?: DropRule[]
}

const DEFAULT_ADD_STEP_WIDTH = 256
const DEFAULT_ADD_STEP_HEIGHT = 92

export const DEFAULT_FALLBACK_RULES: DropRule[] = [
    (a, b) => a.depth - b.depth,
    (a, b) => a.x - b.x,
    (a, b) => a.y - b.y,
    (a, b) => a.node.id.localeCompare(b.node.id),
]

function buildDepthMap(nodes: Node[], edges: Edge[]) {
    const depth = new Map<string, number>()
    const children = new Map<string, string[]>()

    edges.forEach((edge) => {
        if (edge.data?.isLoopBack) return
        if (!children.has(edge.source)) children.set(edge.source, [])
        children.get(edge.source)!.push(edge.target)
    })

    const targets = new Set(edges.filter((e) => !e.data?.isLoopBack).map((e) => e.target))
    let roots = nodes.filter((n) => !targets.has(n.id))
    if (roots.length === 0 && nodes.length > 0) {
        roots = [...nodes].sort((a, b) => a.position.y - b.position.y).slice(0, 1)
    }

    const queue: string[] = []
    roots.forEach((root) => {
        depth.set(root.id, 0)
        queue.push(root.id)
    })

    while (queue.length > 0) {
        const nodeId = queue.shift()!
        const nextDepth = (depth.get(nodeId) ?? 0) + 1
        const kids = children.get(nodeId) || []
        kids.forEach((kid) => {
            const current = depth.get(kid)
            if (current === undefined || nextDepth < current) {
                depth.set(kid, nextDepth)
                queue.push(kid)
            }
        })
    }

    return depth
}

function getAddStepCenter(node: Node) {
    const width = typeof node.width === "number" ? node.width : DEFAULT_ADD_STEP_WIDTH
    const height = typeof node.height === "number" ? node.height : DEFAULT_ADD_STEP_HEIGHT
    return {
        x: node.position.x + width / 2,
        y: node.position.y + height / 2,
    }
}

function applyRules(a: DropCandidate, b: DropCandidate, rules: DropRule[]) {
    for (const rule of rules) {
        const result = rule(a, b)
        if (result !== 0) return result
    }
    return 0
}

export function selectAddStepDropTarget(params: {
    nodes: Node[]
    edges: Edge[]
    position: DropPosition
    options?: DropTargetOptions
}) {
    const { nodes, edges, position, options } = params
    const directDistance = options?.directDistance ?? 80
    const nearDistance = options?.nearDistance ?? 120
    const fallbackRules = options?.fallbackRules ?? DEFAULT_FALLBACK_RULES

    const candidates = nodes.filter((node) => node.type === "addStep" && !node.data?.isBranchAdder)
    if (candidates.length === 0) return null

    const depthMap = buildDepthMap(nodes, edges)
    const ranked = candidates.map((node) => {
        const center = getAddStepCenter(node)
        const distance = Math.hypot(center.x - position.x, center.y - position.y)
        const depth = depthMap.get(node.id) ?? Math.round(node.position.y)
        return {
            node,
            distance,
            depth,
            x: node.position.x,
            y: node.position.y,
        }
    })

    const directHits = ranked
        .filter((candidate) => candidate.distance <= directDistance)
        .sort((a, b) => a.distance - b.distance)

    if (directHits.length > 0) {
        return directHits[0].node
    }

    const nearHits = ranked
        .filter((candidate) => candidate.distance <= nearDistance)
        .sort((a, b) => a.distance - b.distance)

    if (nearHits.length > 0) {
        return nearHits[0].node
    }

    ranked.sort((a, b) => applyRules(a, b, fallbackRules))
    return ranked[0]?.node ?? null
}

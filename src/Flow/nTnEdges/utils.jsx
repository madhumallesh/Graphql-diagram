import { Position } from "reactflow"

function getNodeIntersection(intersectioNode, targetNode) {
    const { width: intersectionNodeWidth, height: intersectionNodeHeight, positionAbsolute: intersectionNodePosition } = intersectioNode

    const targetPosition = targetNode.positionAbsolute

    const w = intersectionNodeWidth / 2
    const h = intersectionNodeHeight / 2

    const x2 = intersectionNodePosition.x + w
    const y2 = intersectionNodePosition.y + h
    const x1 = targetPosition.x + w;
    const y1 = targetPosition.y + h;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h)
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h)

    const a = 1 / (Math.abs(xx1) + Math.abs(yy1))
    const xx3 = a * xx1
    const yy3 = a * yy1

    const x = w * (xx3 + yy3) + x2
    const y = h * (-xx3 + yy3) + y2

    return { x, y }
}

function getEdgePosition(node, intersectionPoint, aa) {
    const n = { ...node.positionAbsolute, ...node }
    const nx = Math.round(n.x)
    const ny = Math.round(n.y)
    const px = Math.round(intersectionPoint.x)
    const py = Math.round(intersectionPoint.y)

    // console.log(aa, nx, ny, px, py);

    if (px <= nx + 1) {
        return Position.Left
    }
    if (px >= nx + n.width - 1) {
        return Position.Right
    }
    if (py <= ny + 1) {
        return Position.Top
    }
    if (py >= n.y + n.height - 1) {
        return Position.Bottom
    }

    return Position.Right
}

export function getEdgeparams(source, target) {
    const sourceIntersectionPoint = getNodeIntersection(source, target)
    const targetIntersectionPoint = getNodeIntersection(target, source)

    const sourcePos = getEdgePosition(source, sourceIntersectionPoint, "source")
    const targetPos = getEdgePosition(target, targetIntersectionPoint, "target")

    // console.log("ZZZZZZZZZZ", sourcePos, targetPos, sourceX, sourceY, sourceIntersectionPoint.x, sourceIntersectionPoint.y);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcepos: sourcePos,
        targetpos: targetPos
    }

}
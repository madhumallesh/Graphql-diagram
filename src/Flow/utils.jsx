import { Position, internalsSymbol } from "reactflow"

// const getNodeCenter = (node) => {
//     return {
//         x: node.positionAbsolute.x + node.width / 2,
//         y: node.positionAbsolute.y + node.height / 2,
//     }
// }
const getNodeCenter = (node) => {
    return {
        x: node.positionAbsolute.x + node.width / 2,
        y: node.positionAbsolute.y + node.height / 2,
    }
}

export function getParams(nodeA, nodeB, handleid) {

    const centerA = getNodeCenter(nodeA)
    const centerB = getNodeCenter(nodeB)

    const position = centerA.x + nodeB.width / 2 > centerB.x ? Position.Left : Position.Right

    const [x, y] = getHandleCoordsByPosition(nodeA, position, handleid)
    return [x, y, position]
}

const getHandleCoordsByPosition = (node, handlePosition, handleid) => {
    const handle = node[internalsSymbol].handleBounds.source.find(
        h => h.position == handlePosition && h.id == handleid
    )

    // console.log(handle, node[internalsSymbol].handleBounds);
    let offsetX = handle.width / 2
    let offsetY = handle.height / 2

    switch (handlePosition) {
        case Position.Left:
            offsetX = 0
            break;

        case Position.Right:
            offsetX = handle.width
            break
    }

    const x = node.positionAbsolute.x + handle.x + offsetX
    const y = node.positionAbsolute.y + handle.y + offsetY
    return [x, y]
}

const gethandle = (nodeid, index) => {
    const x = nodeid.split("@");
    const targethandle = x[2]
    const source = x[1].split("*")
    if (source[1] == "") {
        const sourcehandle = source[0]
        return { sourcehandle, targethandle }
    } else {
        const sourcehandle = source[1]
        return { sourcehandle, targethandle }
    }
}

export function getEdgeparams(source, target, id) {
    const s = gethandle(id, 1)
    // console.log(s);
    const [sx, sy, sourcepos] = getParams(source, target, s.sourcehandle)
    const [tx, ty, targetpos] = getParams(target, source, s.targethandle)
    return { sx: sx, sy: sy, tx: tx, ty: ty, sourcepos: sourcepos, targetpos: targetpos }
}

const getInterFaceHandles = (nodeid) => {
    const x = (nodeid.split("@"));
    const targethandle = x[2]
    const sourcehandle = x[1].split("*")[0]
    // console.log({ sourcehandle, targethandle });
    return { sourcehandle, targethandle }
}

export const getInterFaceEdge = (source, target, id) => {
    const s = getInterFaceHandles(id)
    const [sx, sy, sourcepos] = getParams(source, target, s.sourcehandle)
    const [tx, ty, targetpos] = getParams(target, source, s.targethandle)
    return { sx: sx, sy: sy, tx: tx, ty: ty, sourcepos: sourcepos, targetpos: targetpos }
}
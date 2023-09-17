import { Position } from "reactflow"

const getNodeCenter = (node) => {
    return {
        x: node.positionAbsolute.x + node.width / 2,
        y: node.positionAbsolute.y + node.height / 2,
    }
}

export function getParams(nodeA, nodeB) {
    const centerA = getNodeCenter(nodeA)
    const centerB = getNodeCenter(nodeB)

    const position = centerA.x + 80 > centerB.x ? Position.Left : Position.Right

    return position
}

export const getNode = (nodeid, index) => {
    const x = (nodeid.split("@"))[index].split("-");
    return { nodeid: x[0], selectid: x[1], edgeid: x[2] };
}

export const getEdgeNodes = edgeid => {
    const source = (edgeid.split("@"))[1].split("-")
    const target = (edgeid.split("@"))[2].split("-")
    // console.log(edgeid, source, target);
    return { source: source[0], sourceHandle: source[1], target: target[0], targetHandle: target[1] }
}

export const validateEdge = (data, edge) => {
    const validate1 = (data.source == edge.source && data.sourceHandle == edge.sourceHandle
        && data.target == edge.target && data.targetHandle == edge.targetHandle)
    const validate2 = (data.source == edge.target && data.sourceHandle == edge.targetHandle
        && data.target == edge.source && data.targetHandle == edge.sourceHandle)
    if (validate1 || validate2) {
        console.log("FOUND");
        return true
    }
    return false
}
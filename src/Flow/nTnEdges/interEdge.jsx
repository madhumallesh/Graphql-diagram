import React, { memo, useCallback, } from 'react'
import { useStore as flowStore, getBezierPath, getSimpleBezierPath, getSmoothStepPath, getStraightPath } from 'reactflow';
import { getEdgeparams } from './utils';



const customEdge = ({ id, source, target, }) => {
    const sourceNode = flowStore(useCallback((store) => store.nodeInternals.get(source), [source]))
    const targetNode = flowStore(useCallback((store) => store.nodeInternals.get(target), [target]))

    const s = getEdgeparams(sourceNode, targetNode)
    // console.log(s);

    const [edgePath, labelX, labelY] = getBezierPath({ sourceX: s.sx, sourceY: s.sy, sourcePosition: s.sourcepos, targetX: s.tx, targetY: s.ty, targetPosition: s.targetpos })

    return (
        <path id={id} d={edgePath} className="custom-edge-path stroke-red-500" strokeWidth={0.8} />
    )
}

export default memo(customEdge)
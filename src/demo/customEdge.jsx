import React, { memo, useCallback, useEffect, useState } from 'react'
import { getSmoothStepPath, useStore as flowStore, useUpdateNodeInternals, getBezierPath, BaseEdge, EdgeLabelRenderer } from 'reactflow';
import { getNode, getParams } from './utils2';
import { useDispatch } from 'react-redux';
import { changeNodeEdgePosition } from '../store/nodesReducer';


const customEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, source, target, selected }) => {
    const sourceNode = flowStore(useCallback((store) => store.nodeInternals.get(source), [source]))
    const targetNode = flowStore(useCallback((store) => store.nodeInternals.get(target), [target]))
    const dispatch = useDispatch()


    const sourcePos = getParams(sourceNode, targetNode)
    const targetPos = getParams(targetNode, sourceNode)

    useEffect(() => {
        dispatch(changeNodeEdgePosition({ ...getNode(id, 1), position: sourcePos }))
    }, [sourcePos])

    useEffect(() => {
        dispatch(changeNodeEdgePosition({ ...getNode(id, 2), position: targetPos }))
    }, [targetPos])

    const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

    return (
        // <path id={id} d={edgePath} className="react-flow__edge-path stroke-zinc-500" strokeWidth={0.3} onClick={() => console.log(id)} />
        <g>
            <path id={id} d={edgePath} className="react-flow__edge-path stroke-zinc-500" strokeWidth={0.3} onClick={() => console.log(id)} />
            {selected && <EdgeLabelRenderer >
                <div style={{
                    position: "absolute",
                    transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    width: "80px",
                    height: "15px",
                    fontSize: 10,
                    borderColor: "#224fa2",
                }} className='nopan nodrag border text-center bg-white'>
                    Hello
                </div>
            </EdgeLabelRenderer>}
        </g>
    )
}

export default memo(customEdge)

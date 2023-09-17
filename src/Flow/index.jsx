import React, { memo, useCallback, useEffect, useState } from 'react'
import { Background, ConnectionMode, MiniMap, Panel, ReactFlow, useEdgesState, useNodesState, useReactFlow, useStore } from 'reactflow'
import "reactflow/dist/base.css"
import { nodeTypes, edgeTypes, gql2 } from './consts'

import ELK from "elkjs/lib/elk.bundled.js"
import { useSelector } from 'react-redux'


import { FiGrid, FiMaximize, FiMinus, FiPlus } from "react-icons/fi"

import { generateEdges, generateEdges2, generateNodes, } from '../Converter'

const elkOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": "50",
    "elk.spacing.nodeNode": "109",
    "direaction": "vertical"
}

const getLayoutElements = (nodes, edges, options = {}) => {
    const elk = new ELK()

    const graph = {
        id: "root",
        layoutOptions: options,
        children: nodes.map(node => ({
            ...node,
            width: 130,
            height: 70,
        })),
        edges: edges
    }

    const res = elk.layout(graph).then(layoutGraph => ({
        nodes: layoutGraph.children.map((node) => ({
            ...node,
            position: { x: node.x, y: node.y }
        })),
        edges: layoutGraph.edges
    })).catch(console.error);

    return res
}

const getLayoutElements2 = (nodes, edges) => {
    const elkOptions = {
        "elk.algorithm": "layered",
        "elk.layered.spacing.nodeNodeBetweenLayers": "50",
        "elk.spacing.nodeNode": "70",
    }

    const elk = new ELK()

    const graph = {
        id: "root",
        layoutOptions: elkOptions,
        children: nodes,
        edges: edges
    }

    const res = elk.layout(graph).then(layoutGraph => ({
        nodes: layoutGraph.children.map((node) => ({
            ...node,
            position: { x: node.x, y: node.y }
        })),
        edges: layoutGraph.edges
    })).catch(console.error);

    return res
}


function Flow() {
    const { fitView, zoomIn, zoomOut } = useReactFlow()
    const [flownodes, setNodes, onNodesChange] = useNodesState()
    const [flowedges, setEdges, onEdgesChange] = useEdgesState()
    const zoomValue = useStore((store) => store.transform[2])

    const [error, setError] = useState("SYNTX")
    const minimap = useSelector(state => state.settings.miniMap)
    const connType = useSelector(state => state.settings.connType)
    const schemaStr = useSelector(state => state.schema.schemaString)

    const handlefitView = useCallback(() => fitView({ duration: 300 }), [fitView])

    const handleZoomIn = () => {
        zoomIn({ duration: 250 })
    }

    const handleZoomOut = () => {
        zoomOut({ duration: 250 })
    }

    const handleArrange = () => {
        getLayoutElements2(flownodes, flowedges).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            setNodes(layoutedNodes)
            setEdges(layoutedEdges)
        }).catch(console.error).finally(() => fitView({ duration: 150, maxZoom: 1.3 }))
    }

    useEffect(() => {
        const nodes = generateNodes(schemaStr)
        if (nodes.error) {
            setError(data2.error)
        } else {
            const edges = (connType == "NN") ? generateEdges2(nodes.nodes) : generateEdges(nodes.nodes)
            // console.log(connType, edges, edges.length);
            getLayoutElements(nodes.nodes, edges, elkOptions).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
                setNodes(layoutedNodes)
                setEdges(layoutedEdges)
            }).catch(console.error)
            setError("")
            fitView({ duration: 150, maxZoom: 1.3 })
        }
    }, [schemaStr, connType])



    return (
        <ReactFlow
            nodes={flownodes}
            edges={flowedges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            connectionMode={ConnectionMode.Loose}
            zoomOnScroll={false}
            maxZoom={3}
            minZoom={0.5}
            fitView
        >
            {error && <Panel position='top-left' className='text-red-500'>
                {error}</Panel>}
            <Panel position="top-right" className='bg-gray-700 pr-1 text-white'>
                <div className="flex justify-end items-center gap-[10px]">
                    <button onClick={handleZoomIn} className='px-1' title='zoomIn'>
                        <FiPlus />
                    </button>
                    <span>{Math.round(zoomValue * 50)}{"%"}</span>
                    <button onClick={handleZoomOut} title='zoomOut'>
                        <FiMinus />
                    </button>
                    <button onClick={handlefitView} title='fit view'>
                        <FiMaximize />
                    </button>
                    <button onClick={handleArrange} title='re arrange'>
                        <FiGrid />
                    </button>
                </div>
            </Panel>
            <Background variant='none' className='bg-slate-700' />
            {minimap && <MiniMap style={{ height: 100 }} zoomable pannable className='bg-slate-600' />}
        </ReactFlow>
    )
}

export default Flow
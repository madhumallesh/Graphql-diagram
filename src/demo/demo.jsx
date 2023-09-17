const randomEdgeId = customAlphabet("1234567890ABCDEFGHIJKLMNOPQrSTUVWXYZ", 5)

const onConnect = params => {
    const a = edges.find(e => {
        const res = getEdgeNodes(e.id)
        return validateEdge(res, params)
    })
    if (!a) {
        const sourceid = randomEdgeId()
        const targetid = randomEdgeId()
        dispatch(addNodeEdge({ ...params, sourceid, targetid }))
        const edge = { ...params, sourceHandle: sourceid, targetHandle: targetid, id: `edge@${params.source}-${params.sourceHandle}-${sourceid}@${params.target}-${params.targetHandle}-${targetid}` }
        console.log("Params", params, sourceid, targetid)
        dispatch(addEdge(edge))
        console.log("Edge is ", edge)
    };
}

useEffect(() => {
    setNodes(nodes)
    console.log("Nodes loaded", nodes);
}, [nodes])

useEffect(() => setEdges(edges), [edges])

const onNodeDragStop = () => {
    dispatch(applyNodesChange(flownodes))
}
import { createSlice } from '@reduxjs/toolkit'

export const nodeSlice = createSlice({
    initialState: {
        nodes: [
            {
                id: "A", type: "custom", data: {
                    label: "Node 1", selects: [
                        { id: "A1", name: "id", type: "int", edges: [{ id: "A12", position: "left" }] }
                    ]
                }, position: { x: 100, y: 100 }
            },
            {
                id: "B", type: "custom", data: {
                    label: "Node 2", selects: [
                        { id: "B1", name: "id", type: "int", edges: [{ id: "B11", position: "right" }, { id: "B12", position: "right" }] },
                        { id: "B2", name: "name", type: "str", edges: [] },
                    ]
                }, position: { x: 300, y: 300 }
            },
            {
                id: "C", type: "custom", data: {
                    label: "Node 3", selects: [
                        { id: "C1", name: "id", type: "int", edges: [{ id: "C11", position: "right" }] },
                    ]
                }, position: { x: 0, y: 300 }
            }
        ]
    },
    name: "nodes",
    reducers: {
        demo: (state) => {
            console.log("DEMO ", state.nodes);
        },
        applyNodesChange: (state, changes) => {
            state.nodes = changes.payload
        },
        changeNodeEdgePosition: (state, message) => {
            const attrs = message.payload
            state.nodes = state.nodes.map(node => {
                if (node.id == attrs.nodeid) {
                    node.data.selects.map(selectItem => {
                        if (selectItem.id == attrs.selectid) {
                            selectItem.edges.map(edgeItem => {
                                if (edgeItem.id == attrs.edgeid) {
                                    edgeItem.position = attrs.position
                                }
                            })
                        }
                    })
                    node.data = { ...node.data, ...node.data.selects }
                }
                return node
            })
        },
        addNodeEdge: (state, message) => {
            const attrs = message.payload
            state.nodes = state.nodes.map(node => {
                if (node.id == attrs.source || node.id == attrs.target) {
                    node.data.selects.map(selectItem => {
                        if (selectItem.id == attrs.sourceHandle) {
                            selectItem.edges = [...selectItem.edges, { id: attrs.sourceid, position: "right" }]
                        }
                        if (selectItem.id == attrs.targetHandle) {
                            selectItem.edges = [...selectItem.edges, { id: attrs.targetid, position: "left" }]
                        }
                    })
                    node.data = { ...node.data }
                }
                return node
            })
            console.log(attrs);
        }
    }
})

export const { demo, applyNodesChange, changeNodeEdgePosition, addNodeEdge } = nodeSlice.actions
export default nodeSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

export const edgeSlice = createSlice({
    initialState: {
        edges: [
            { source: 'A', sourceHandle: 'A12', target: 'B', targetHandle: 'B11', id: "edge@A-A1-A12@B-B1-B11" },
            { source: 'B', sourceHandle: 'B12', target: 'C', targetHandle: 'C11', id: "edge@B-B1-B12@C-C1-C11" },
        ]
    },
    name: "edges",
    reducers: {
        demo: (state) => {
            console.log("EDGES", state.edges);
        },
        addEdge: (state, edge) => {
            console.log(edge, "edge....");
            state.edges = [...state.edges, edge.payload]
        }
    }
})

export const { demo, addEdge } = edgeSlice.actions
export default edgeSlice.reducer
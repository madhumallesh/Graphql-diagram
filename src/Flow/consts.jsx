import customSchemaNode from "./Nodes/schemaNode";
import customTypeNode from "./Nodes/typeNode";
import enumNode from './Nodes/enumNode'
import inputNode from "./Nodes/inputNode";
import interfaceNode from "./Nodes/interfaceNode";
import unionNode from "./Nodes/unionNode";
import typeEdge from "./edges/typeEdge";
import schemaEdge from "./edges/schemaEdge";
import inputEdge from "./edges/inputEdge";
import interEdge from "./edges/interEdge";
import enumEdge from "./edges/enumEdge";
import unionEdge from "./edges/unionEdge";
import tempEdge from "./nTnEdges/tempEdge";
import { enumEdge2, inputEdge2, interEdge2, typeEdge2, unionEdge2 } from "./nTnEdges";

export const nodeTypes = {
    EnumTypeNode: enumNode,
    ObjectTypeNode: customTypeNode,
    InterfaceTypeNode: interfaceNode,
    InputObjectTypeNode: inputNode,
    UnionTypeNode: unionNode,
    schemaNode: customSchemaNode,

}

export const edgeTypes = {
    typeEdge: typeEdge,
    inputEdge: inputEdge,
    interEdge: interEdge,
    enumEdge: enumEdge,
    unionEdge: unionEdge,

    typeEdge2: typeEdge2,
    inputEdge2: inputEdge2,
    interEdge2: interEdge2,
    enumEdge2: enumEdge2,
    unionEdge2: unionEdge2
}


export const gql2 = `
scalar Date

type Demo {
    id(input:PostInput): ID!
}
interface Entity {
    id: ID!
    createAt: Date
}

type User implements Entity {
    name: String!
    email: String!
    id: ID!
    post: [Post]
}
type Post {
    title(input: PostInput): String!
    author: User
}
input PostInput {
    name: String
}
`
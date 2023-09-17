import { buildSchema, parse } from "graphql"
const gql = `
scalar Date
scalar DateTime

enum Status {
    ACTIVE
    INACTIVE
}
type Demo {
    name: String!
}
interface Entity {
    id: ID!
    createdAt(name:String!): Date!
    demo: Demo
}

type User implements Entity {
	id: ID
    name: String!
    email: String
    status: Status!
    registeredAt: DateTime
    posts: [Post]
}

type Post implements Entity {
    id: ID!
    title: String!
    content: String
    author: User!
    createdAt: DateTime
}

input PostInput {
    title: String!
    content: String
    authorId: ID!
}

type Mutation {
    createUser(name: String!, email:String!): User!
    createPost(input:PostInput): Post!
}

union SerchResult = User | Post

type Query {
	getUser(id: ID!): User
    getPost(id:ID!):Post
    listUser: [User!]!
    listPosts: [Post]!
    search(id:ID!): [SerchResult]
}

schema {
    query: PostInput
    mutation: Mutation
}

`

const getFieldType = (field) => {
    switch (field.kind) {
        case 'NamedType':
            return field.name.value
        case 'NonNullType':
            return getFieldType(field.type) + "!"
        case "ListType":
            return "[" + getFieldType(field.type) + "]"
    }
}

const getOnlyType = (field) => {
    if (field.kind == "NamedType") return field.name.value
    else return getOnlyType(field.type)
}


function BuildSchema(schemaSource) {
    var scalars = ["ID", "String", "Boolean", "Int", "Float"]
    var inputs = []
    var types = []
    var interfaces = []
    var unions = []
    var enums = []

    var Nodes = []

    try {
        buildSchema(schemaSource, { noLocation: true })
    } catch (error) {
        console.log(error.message);
        return { error: error.message }
    }

    try {
        var scheam = parse(schemaSource, { noLocation: true })
    } catch (error) {
        console.log(error.message);
        return { error: error.message }
    }

    const checkType = (value) => {
        if (scalars.includes(value, 0)) return "is-scalar"
        if (types.indexOf(value, 0) !== -1) return "is-type"
        if (inputs.indexOf(value, 0) !== -1) return "is-input"
        if (enums.indexOf(value, 0) !== -1) return "is-enum"
        if (interfaces.indexOf(value, 0) !== -1) return "is-interface"
        if (unions.indexOf(value, 0) !== -1) return "is-union"
    }

    const getField = (field) => {
        const args = field.arguments.map(argument => {
            return { key: argument.name.value, value: getFieldType(argument.type), valueType: checkType(getOnlyType(argument.type)) }
        });
        return { name: field.name.value, value: getFieldType(field.type), valueType: checkType(getOnlyType(field.type)), args: args }
    }

    scheam.definitions.map(item => {
        switch (item.kind) {
            case "ScalarTypeDefinition":
                scalars.push(item.name.value);
                break;
            case "InterfaceTypeDefinition":
                interfaces.push(item.name.value);
                break
            case "ObjectTypeDefinition":
                types.push(item.name.value);
                break
            case "InputObjectTypeDefinition":
                inputs.push(item.name.value)
                break
            case "EnumTypeDefinition":
                enums.push(item.name.value)
                break
            case "UnionTypeDefinition":
                unions.push(item.name.value);
                break
            default:
                console.log("New Kind", item.kind)
                break;
        }
    })

    const getObject = (type) => {
        const Name = type.name.value
        const fields = type.fields.map(field => {
            return getField(field)
        })
        const interfaces = type.interfaces.map(inter => inter.name.value)
        return { id: `type-${Name}`, data: { label: Name, fields: fields, interfaces: interfaces }, type: "ObjectTypeNode", position: { x: 100, y: 100 } }
    }

    const getInterFace = (type) => {
        const Name = type.name.value
        const fields = type.fields.map(field => {
            return getField(field)
        })
        const interfaces = type.interfaces.map(inter => inter.name.value)
        return { id: `interface-${Name}`, data: { label: Name, fields: fields, interfaces: interfaces }, type: "InterfaceTypeNode", position: { x: 100, y: 100 } }
    }

    const getSchema = (type) => {
        const fields = type.operationTypes.map(operation => {
            return { name: operation.operation, value: getFieldType(operation.type), valueType: checkType(getOnlyType(operation)) }
        });
        return { id: "schema", data: { label: "schema", fields: fields }, type: "schemaNode", position: { x: 100, y: 100 } };
    }

    const getInput = (type) => {
        const fields = type.fields.map(field => {
            return { key: field.name.value, value: getFieldType(field.type), valueType: checkType(getOnlyType(field)) }
        })
        return { id: `input-${type.name.value}`, data: { label: type.name.value, fields: fields }, type: "InputObjectTypeNode", position: { x: 100, y: 100 } };
    }

    const getEnum = (type) => {
        const values = type.values.map(value => value.name.value)
        return { id: `enum-${type.name.value}`, data: { label: type.name.value, values: values }, type: "EnumTypeNode", position: { x: 100, y: 100 } };
    }

    const getUnion = (type) => {
        const values = type.types.map(value => value.name.value)
        return { id: `union-${type.name.value}`, data: { label: type.name.value, values: values }, type: "UnionTypeNode", position: { x: 100, y: 100 } }
    }
    console.log(types, inputs, interfaces, enums, unions);

    scheam.definitions.map(type => {
        switch (type.kind) {
            case "ObjectTypeDefinition":
                Nodes.push(getObject(type))
                break;
            case "SchemaDefinition":
                Nodes.push(getSchema(type))
                break
            case "InputObjectTypeDefinition":
                Nodes.push(getInput(type))
                break
            case "InterfaceTypeDefinition":
                Nodes.push(getInterFace(type));
                break
            case "EnumTypeDefinition":
                Nodes.push(getEnum(type))
                break
            case "UnionTypeDefinition":
                Nodes.push(getUnion(type))
                break
            default:
                break;
        }
    })

    const getTheValueType = value => {
        return value.split("-")[1];
    }

    const getEdgeType = value => {
        if (value == "is-input") return "inputEdge"
        if (value == "is-type") return "typeEdge"
        if (value == "is-union") return "unionEdge"
    }

    const getInterfaceEdges = (node) => {
        console.log(node);
    }
    var Edges = []

    Nodes.map(node => {
        console.log(node.type);
        switch (node.type) {
            case "EnumTypeNode":
                break;
            case "InterfaceTypeNode":
                getInterfaceEdges(node.data.fields)
                break
            default:
                break;
        }
    })
    // Nodes.map(node => {
    //     switch (node.type) {
    //         case "SchemaDefinition":
    //             node.data.fields.map(field => {
    //                 const id = `edge@` + node.data.label + "*" + field.name + "@" + field.value
    //                 Edges.push({ id, source: node.data.label, sourceHandle: field.name, target: `${getTheValueType(field.valueType)}-${field.value}`, targetHandle: null, type: getEdgeType(field.valueType) });
    //             })
    //             break;
    //         case "ObjectTypeDefinition":
    //             console.log("Hello");
    //             node.data.fields.map(field => {
    //                 const id = `edge@` + node.data.label + "*" + field.name + "@" + field.value
    //                 Edges.push({ id, source: node.data.label, sourceHandle: field.name, target: `${getTheValueType(field.valueType)}-${field.value}`, targetHandle: null, type: getEdgeType(field.valueType) });
    //             })
    //             break;
    //         default:
    //             console.log(node.data.label);
    //             break;
    //     }
    // })

    return { nodes: Nodes }
};

export const data = BuildSchema(gql)

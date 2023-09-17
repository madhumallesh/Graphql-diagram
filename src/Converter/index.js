import { buildSchema, parse } from "graphql"

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


export function generateNodes(schemaSource) {
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
                // console.log("New Kind", item.kind)
                break;
        }
    })

    const getObject = (type) => {
        const Name = type.name.value
        const fields = type.fields.map(field => {
            return getField(field)
        })
        const interfaces = type.interfaces.map(inter => {
            return { value: inter.name.value, valueType: checkType(inter.name.value) }
        })
        return { id: `type-${Name}`, data: { label: Name, fields: fields, interfaces: interfaces }, type: "ObjectTypeNode" }
    }

    const getInterFace = (type) => {
        const Name = type.name.value
        const fields = type.fields.map(field => {
            return getField(field)
        })
        const interfaces = type.interfaces.map(inter => {
            return { value: inter.name.value, valueType: checkType(inter.name.value) }
        })
        return { id: `interface-${Name}`, data: { label: Name, fields: fields, interfaces: interfaces }, type: "InterfaceTypeNode" }
    }

    const getSchema = (type) => {
        const fields = type.operationTypes.map(operation => {
            return { name: operation.operation, value: getFieldType(operation.type), valueType: checkType(getOnlyType(operation)) }
        });
        return { id: "schema", data: { label: "schema", fields: fields }, type: "schemaNode" };
    }

    const getInput = (type) => {
        const fields = type.fields.map(field => {
            return { name: field.name.value, value: getFieldType(field.type), valueType: checkType(getOnlyType(field)) }
        })
        return { id: `input-${type.name.value}`, data: { label: type.name.value, fields: fields }, type: "InputObjectTypeNode" };
    }

    const getEnum = (type) => {
        const values = type.values.map(value => value.name.value)
        return { id: `enum-${type.name.value}`, data: { label: type.name.value, values: values }, type: "EnumTypeNode" };
    }

    const getUnion = (type) => {
        const values = type.types.map(value => {
            return { value: value.name.value, valueType: checkType(value.name.value) }
        })
        return { id: `union-${type.name.value}`, data: { label: type.name.value, fields: values }, type: "UnionTypeNode" }
    }

    scheam.definitions.forEach(type => {
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

    return { nodes: Nodes, }
};

export function generateEdges(Nodes) {

    const getTheValueType = valueType => {
        return valueType.split("-")[1];
    }

    const getEdgeType = value => {
        if (value == "is-input") return "inputEdge"
        if (value == "is-type") return "typeEdge"
        if (value == "is-union") return "unionEdge"
        if (value == "is-enum") return "enumEdge"
        if (value == "is-interface") return "interEdge"
    }

    const formatEdge = (edgeType, source, sourceHandle, target, targetHandle = null) => {
        const id = `edge@${source}*${sourceHandle ? sourceHandle : ""}@${target}${targetHandle ? "*" + targetHandle : ""}`
        return { id, source, sourceHandle, target, targetHandle, type: getEdgeType(edgeType) }
    }

    const formatTarget = (value) => {
        return value.replace("!]!", "").replace("[", "").replace("]", "").replace("!", "")
    }

    const edgeProcess = (source, field) => {
        const edges = []
        const sourceHandle = field.name
        if (field.args) {
            const a = edges.concat(edgeArgProcess(source, sourceHandle, field.args))
            a.map(item => edges.push(item))
        }
        if (field.valueType !== "is-scalar") {
            const target = getTheValueType(field.valueType) + "-" + formatTarget(field.value)
            if (source !== target) {
                edges.push(formatEdge(field.valueType, source, sourceHandle, target,));
            }
        }
        return edges
    }

    const edgeArgProcess = (source, sourceHandle, args) => {
        const argsedges = []
        args.map(arg => {
            if (arg.valueType !== "is-scalar") {
                const target = getTheValueType(arg.valueType) + "-" + formatTarget(arg.value)
                if (source !== target) {
                    argsedges.push(formatEdge(arg.valueType, source, sourceHandle, target))
                }
            }
        })
        return argsedges
    }

    const getFieldEdges = (node) => {
        const source = node.id
        const interedges = []
        node.data.fields.forEach(field => {
            const field_edges = edgeProcess(source, field)
            field_edges.forEach(item => interedges.push(item))
        })
        // console.log("Final Node Edge", source, interedges);
        return interedges
    }

    const getInterfaceEdges = (source, interFaces) => {
        const inter_edges = []
        interFaces.forEach(inter => {
            inter_edges.push(formatEdge(inter.valueType, source, null, getTheValueType(inter.valueType) + "-" + inter.value));
        })
        return inter_edges
    }

    const getUnionEdges = (node) => {
        const unionEdges = []
        const source = node.id
        node.data.fields.forEach(union => {
            if (union.valueType !== "is-scalar") {
                const sourceHandle = union.value
                const target = getTheValueType(union.valueType) + "-" + union.value
                unionEdges.push(formatEdge(union.valueType, source, sourceHandle, target))
            }
        })
        return unionEdges
    }

    let Edges = []

    Nodes.forEach(node => {
        switch (node.type) {
            case "EnumTypeNode":
                break;
            case "InterfaceTypeNode":
                const interface_fields = getFieldEdges(node)
                const interface_interfaces = getInterfaceEdges(node.id, node.data.interfaces)
                Edges = Edges.concat(interface_fields, interface_interfaces)
                break
            case "ObjectTypeNode":
                const object_interfaces = getInterfaceEdges(node.id, node.data.interfaces)
                const object_fields = getFieldEdges(node)
                Edges = Edges.concat(object_fields, object_interfaces)
                break;
            case "InputObjectTypeNode":
                const input_fields = getFieldEdges(node)
                // console.log(node, input_fields);
                Edges = Edges.concat(input_fields)
                break
            case "UnionTypeNode":
                var union_edges = getUnionEdges(node)
                break
            case "schemaNode":
                const schema_fields = getFieldEdges(node)
                // console.log(schema_fields);
                Edges = Edges.concat(schema_fields)
                break
            default:
                console.log(node.type, "Remainin");
                break;
        }
        // const res = Edges.concat(interface_fields, interface_interfaces, object_fields, object_interfaces)
        // console.log("RESULT ", node.id, res);
    })

    return Edges
}

export function generateEdges2(Nodes) {

    const getTheValueType = valueType => {
        return valueType.split("-")[1];
    }

    const getEdgeType = valueType => {
        if (valueType == "is-input") return "inputEdge"
        if (valueType == "is-type") return "typeEdge"
        if (valueType == "is-union") return "unionEdge"
        if (valueType == "is-enum") return "enumEdge"
        if (valueType == "is-interface") return "interEdge"
    }

    const formatEdge = (source, target, edgeType) => {
        const id = "edge@" + source + "@" + target
        return { id, source: source, sourceHandle: null, target: target, targetHandle: null, type: edgeType + "2" }
    }

    const formatTarget = (value) => {
        return value.replace("!]!", "").replace("[", "").replace("]", "").replace("!", "")
    }

    const getFieldArgsTargets = (source, args) => {
        const list_args = []
        args.forEach(argument => {
            if (argument.valueType !== "is-scalar") {
                const target = getTheValueType(argument.valueType) + "-" + formatTarget(argument.value)
                const edgeType = getEdgeType(argument.valueType)
                if (target !== source) list_args.push({ target, edgeType })
            }
        })
        return list_args
    }


    const getFieldTargets = node => {
        const source = node.id
        var list_targets = []
        node.data.fields.forEach(field => {
            if (field.args) {
                const fields = getFieldArgsTargets(source, field.args)
                list_targets = list_targets.concat(fields)
            }
            if (field.valueType !== "is-scalar") {
                const target = getTheValueType(field.valueType) + "-" + formatTarget(field.value)
                const edgeType = getEdgeType(field.valueType)
                if (target !== source) list_targets.push({ target, edgeType })
            }
        })
        // console.log("FIELD", list_targets);
        return list_targets
    }

    const getInterFaceTargets = node => {
        const source = node.id
        const list_targets = []
        node.data.interfaces.forEach(inter => {
            const target = getTheValueType(inter.valueType) + "-" + formatTarget(inter.value)
            const edgeType = getEdgeType(inter.valueType)
            list_targets.push({ target, edgeType })
        })

        return list_targets
    }

    let Temp = []

    Nodes.forEach(node => {
        const source = node.id
        switch (node.type) {
            case "EnumTypeNode":
                break;

            case "ObjectTypeNode":
                const object_targets = getFieldTargets(node)
                const object_interfaces = getInterFaceTargets(node)
                const targets = object_targets.concat(object_interfaces)
                Temp.push({ source, targets })
                break
            case "InterfaceTypeNode":
                const interface_targets = getFieldTargets(node)
                const interface_interfaces = getInterFaceTargets(node)
                Temp.push({ source, targets: interface_targets.concat(interface_interfaces) })
                break

            case "InputObjectTypeNode":
                const input_targets = getFieldTargets(node)
                Temp.push({ source, targets: input_targets })
                break

            case "UnionTypeNode":
                const union_targets = getFieldTargets(node)
                // Temp.push({ source, targets: union_targets })
                break
            case "schemaNode":
                const schema_targets = getFieldTargets(node)
                Temp.push({ source, targets: schema_targets });
                break
            default:
                console.log(node.type, "Remainin");
                break;
        }
    })

    const formatId = (source, target) => {
        return "edge@" + source + "@" + target
    }

    const convert = () => {
        const edges_existed = []
        const Edges = []

        Temp.forEach(temp_item => {
            const source = temp_item.source
            temp_item.targets.forEach(temp_target => {
                const target = temp_target.target
                const id1 = formatId(source, target)
                const id2 = formatId(target, source)
                if (!edges_existed.includes(id1, 0) && !edges_existed.includes(id2, 0)) {
                    edges_existed.push(id1)
                    Edges.push(formatEdge(source, target, temp_target.edgeType));
                }
            })
        })
        // console.log(edges_existed.length, Edges.length);
        return Edges
    }
    const Edges = convert()
    // console.log(Temp);
    return Edges
}

export const demoGql = `#Fragments Are Not Supported

scalar Date
scalar DateTime

enum Status {
    ACTIVE
    INACTIVE
}

interface Entity {
    id: ID!
    createdAt: Date!
}

type User implements Entity{
	id: ID
    name: String!
    email: String
    registeredAt: DateTime
    status: Status!
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
    listUsers: [User]!
    listPosts: [Post]!
    search(id:ID!): [SerchResult]
}

schema {
    query: Query
    mutation: Mutation
}
`

// const x = generateNodes(gql2)
// const e1 = generateEdges(x.nodes)
// const edges = generateEdges2(x.nodes)
// console.log(edges.length, e1.length);
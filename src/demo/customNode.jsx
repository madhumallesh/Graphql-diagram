import { memo, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";

const NodeItem = ({ type, name, edges }) => (
    <div className="custom-node__item">
        <div className="custom-node__left-items">
            {edges.map(left => (
                left.position == "left" && <Handle key={left.id} isConnectable={false} id={left.id} position={Position.Left} type="source" className="custom-node__left-edge" />
            ))}
        </div>
        <div className="w-full flex justify-between items-center font-medium">
            <span>id</span>
            <span>int</span>
        </div>
        <div className="custom-node__right-items">
            {edges.map(right => (
                right.position == "right" && <Handle key={right.id} isConnectable={false} id={right.id} position={Position.Right} type="source" className="custom-node__right-edge" />
            ))}
        </div>
    </div>
)

export default memo(({ id, data }) => {
    const updateNodeInternals = useUpdateNodeInternals()

    useEffect(() => {
        updateNodeInternals(id)
    }, [data.selects])

    return (
        <>
            <div className="custom-node font-serif">
                <div className="custom-node__header">{data.label}</div>
                {data.selects.map(item => (
                    <div className="custom-node__body" key={item.id}>
                        <Handle id={item.id} position={Position.Left} type="source" className="custom-node__default-edge custom-node__default-left" />
                        <NodeItem edges={item.edges} type={item.type} name={item.name} />
                        <Handle id={item.id} position={Position.Right} type="source" className="custom-node__default-edge custom-node__default-right" />
                    </div>
                ))}
            </div>
        </>
    )
})
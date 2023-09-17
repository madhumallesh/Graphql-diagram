import { memo, useCallback, useEffect } from "react";
import { Handle, useReactFlow, useUpdateNodeInternals } from "reactflow";

export default memo(({ id, data, selected, ...params }) => {
    const { fitView } = useReactFlow()
    const updateInternals = useUpdateNodeInternals()
    const handleTransform = useCallback(() => {
        fitView({ duration: 200, nodes: [{ id: id }], maxZoom: 2 })
    }, [selected])

    useEffect(() => updateInternals(id), [data])

    return (
        <div key={id} className={`custom-node text-xs p-1 tracking-wide ${selected && "ring-1 ring-emerald-600"}`} onClick={handleTransform}>
            <div className="custom-node__header">
                <Handle position="left" id={id} type="source" className="custom-node__header-handle" isConnectable={false} />
                <div className="flex justify-between text-custom-xs">
                    <div className="flex justify-start gap-1">
                        <span className=" font-semibold">{data.label}</span>
                        <span className="is-union font-light">union</span>
                    </div>
                </div>
                <Handle position="right" id={id} type="source" className="custom-node__header-handle" isConnectable={false} />
            </div>

            {data.fields.map(item => (
                <div className="text-type relative tracking-wide text-center" key={item.value}>
                    <span className={`font-normal ${item.valueType}`}>
                        {item.value}
                    </span>
                </div>
            ))}
        </div>
    )
})
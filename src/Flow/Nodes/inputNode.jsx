import { memo, useCallback, useEffect } from "react";
import { Handle, useReactFlow, useUpdateNodeInternals } from "reactflow";

export default memo(({ id, data, selected, }) => {
    const { fitView } = useReactFlow()
    const updateInternals = useUpdateNodeInternals()
    const handleTransform = useCallback(() => {
        fitView({ duration: 200, nodes: [{ id: id }], maxZoom: 2 })
    }, [selected])

    useEffect(() => {
        updateInternals(id)
    }, [data])

    return (<>
        <div key={id} className={`custom-node text-xs p-1 tracking-wide ${selected && "ring-1 ring-amber-500"}`} onClick={handleTransform}>
            <div className="custom-node__header">
                <Handle position="left" id={id} type="source" className="custom-node__header-handle" isConnectable={false} />
                <div className="flex justify-between text-custom-xs">
                    <div className="flex justify-start gap-1">
                        <span className=" font-semibold">{data.label}</span>
                        <span className="is-input font-light" >input</span>
                    </div>
                </div>
                <Handle position="right" id={id} type="source" className="custom-node__header-handle" isConnectable={false} />
            </div>

            {data.fields.map(field => (
                <div className="custom-node__item" key={field.name}>
                    <Handle id={field.name} position="left" isConnectable={false} type="source" className="custom-node__header-handle" />
                    <span className="custom-node__field-name">
                        {field.name}
                    </span>
                    <span className={`${field.valueType} custom-node__field-value`}>{field.value}</span>
                    <Handle id={field.name} position="right" type="source" className="custom-node__header-handle" isConnectable={false} />
                </div>
            ))}
        </div>
    </>)
})
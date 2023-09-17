import { memo, useCallback, useEffect } from "react";
import { Handle, useReactFlow, useUpdateNodeInternals } from "reactflow";

export default memo(({ id, data, selected, ...params }) => {
    const { fitView } = useReactFlow()
    const handleTransform = useCallback(() => {
        fitView({ duration: 200, nodes: [{ id: id }], maxZoom: 2 })
    }, [selected])

    const updateNodeInternals = useUpdateNodeInternals()

    useEffect(() => {
        updateNodeInternals(id)
    }, [data])
    // console.log(data);

    return (<>
        <div key={id} className={`custom-node text-xs p-1 ${selected && "ring-1 ring-pink-500"}`} onClick={handleTransform}>
            <div className="custom-node__header">
                <div className="flex justify-between text-custom-xs">
                    <div className="flex justify-start gap-1">
                        <span className=" font-semibold">{data.label}</span>
                        <span className="is-schema font-light">schema</span>
                    </div>
                </div>
            </div>

            {data.fields.map(field => (
                <div className="text-type flex justify-start gap-[5px] relative" key={field.name}>
                    <Handle id={field.name} position="left" isConnectable={false} type="source" className="custom-node__header-handle" />
                    <span className="text-slate-200 font-normal">
                        {field.name}
                    </span>
                    <span className={`${field.valueType} font-semibold`}>{field.value}</span>
                    <Handle id={field.name} position="right" type="source" className="custom-node__header-handle" isConnectable={false} />
                </div>
            ))}
        </div>
    </>)
})
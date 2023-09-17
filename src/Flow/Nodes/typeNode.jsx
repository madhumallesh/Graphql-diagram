import { memo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Handle, useReactFlow, useUpdateNodeInternals } from "reactflow";

export default memo(({ id, data, selected }) => {
    const { fitView } = useReactFlow()
    const updateNodeInternals = useUpdateNodeInternals()
    const fieldArgs = useSelector(state => state.settings.fieldArgs)

    useEffect(() => {
        updateNodeInternals(id)
    }, [data])

    const handleTransform = useCallback(() => {
        fitView({ duration: 200, nodes: [{ id: id }], maxZoom: 2 })
    }, [selected])

    return (<>
        <div className={`custom-node text-xs p-1 tracking-wide ${selected && "ring-1 ring-blue-600"}`} onClick={handleTransform}>
            <div className="custom-node__header">
                <Handle position="left" id={id} type="source" className="custom-node__header-handle" isConnectable={false} />
                <div className="flex justify-between text-custom-xs">
                    <div className="flex justify-start gap-1">
                        <span className=" font-semibold">{data.label}</span>
                        <span className="is-type font-light" >type</span>
                    </div>
                </div>
                <Handle position="right" id={id} type="source" className="custom-node__header-handle" isConnectable={false} />
            </div>

            {data.fields.map(field => (
                <div className="custom-node__item" key={field.name}>
                    <Handle id={field.name} position="left" type="source" className="custom-node__header-handle" />
                    <span className="custom-node__field-name">{field.name}
                        {fieldArgs && <>{field.args.length >= 1 && "("}
                            {field.args.map(arg =>
                                <span className="text-slate-400" key={arg.key}>{arg.key}:<span className={arg.valueType}>{arg.value}</span>
                                    {!(arg == field.args[(field.args.length - 1)]) && ", "}</span>
                            )}
                            {field.args.length >= 1 && ")"} </>}
                    </span>
                    <span className={`${field.valueType} custom-node__field-value`}>{field.value}</span>
                    <Handle id={field.name} position="right" type="source" className="custom-node__header-handle" isConnectable={false} />
                </div>
            ))}
        </div>
    </>)
})
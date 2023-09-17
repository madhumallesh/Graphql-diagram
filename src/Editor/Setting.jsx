import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleConnectionType, toggleFieldArgs, toggleMiniMap } from '../store/settingsReducer'

function Setting() {
    const settings = useSelector(state => state.settings)
    const dispatch = useDispatch()
    return (
        <div className='border-2 h-screen'>
            <div className='font-mono font-semibold text-lg ml-4'>
                <span>Settings</span>
            </div>
            <div className='p-2 font-mono text-base py-3'>
                <div>
                    <input type="checkbox" name="minimap" id="minimap"
                        checked={settings.miniMap} onChange={() => dispatch(toggleMiniMap())} />
                    <span>{" "}MiniMap</span>
                </div>
                <div>
                    <input type="checkbox" name="minimap" id="minimap"
                        checked={settings.fieldArgs} onChange={() => dispatch(toggleFieldArgs())} />
                    <span>{" "}Field Args</span>
                </div>
            </div>

            <div className='p-2 font-mono text-base'>
                <span className='font-semibold'>Connection Type </span>
                <div>
                    <input type="checkbox" name="conn" id="minimap"
                        checked={settings.connType == "NN"} onChange={() => dispatch(toggleConnectionType("NN"))} />
                    <span>{" "}Node-To-Node</span>
                </div>
                <div>
                    <input type="checkbox" name="conn" id="minimap"
                        checked={settings.connType == "FN"} onChange={() => dispatch(toggleConnectionType("FN"))} />
                    <span>{" "}Field-To-Node</span>
                </div>
            </div>
        </div>
    )
}

export default Setting
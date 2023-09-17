import { ReactFlowProvider } from 'reactflow'
import { VscCode, VscGear } from "react-icons/vsc"
import { Suspense, lazy, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import Setting from './Editor/Setting'
import Editor from './Editor'

const Flow = lazy(() => import('./Flow'))

function App() {
	const [sideBar, setSideBar] = useState(null)

	const handleSide = (data) => {
		if (!sideBar || sideBar !== data) {
			setSideBar(data)
		} else {
			setSideBar(null)
		}
	}
	return (
		<div className='w-full h-screen'>

			<div className="flex justify-start">
				<PanelGroup direction='horizontal'>
					<div className="w-[50px] flex flex-col gap-3 items-center bg-slate-700 h-screen text-white">
						<button className="" title='code' onClick={() => handleSide("editor")}>
							<VscCode size={"30"} className='p-1' />
						</button>
						<button className="hover:ring-1 ring-blue-500" title='settings' onClick={() => handleSide("settings")}>
							<VscGear size={"30"} className='p-1' />
						</button>
					</div>
					{sideBar && <Panel id={"sidebar"} order={1} defaultSize={30} minSize={15} maxSize={40} >
						{sideBar == "editor" && <Editor />}
						{sideBar == "settings" && <Setting />}
					</Panel>}
					{sideBar && <PanelResizeHandle className=" bg-neutral-800 focus:bg-sky-600 w-[3px]" />}
					<Panel id={"sidebar2"} order={2} minSize={50} collapsible={true} >
						<Suspense fallback={<div>Loading....</div>} >
							<ReactFlowProvider>
								<Flow />
							</ReactFlowProvider>
						</Suspense>
					</Panel>
				</PanelGroup>
			</div>

		</div>
	)
}

export default App

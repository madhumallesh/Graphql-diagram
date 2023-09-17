import { basicSetup, EditorView } from '@uiw/react-codemirror'

import React, { lazy, Suspense, useEffect, useState } from 'react'
import { buildSchema, validateSchema } from 'graphql'
import { useDispatch, useSelector } from 'react-redux'
import { updateSchema } from '../store/schemaReducer'

import { graphqlLanguage } from 'codemirror-lang-graphql'

const customTheme = EditorView.theme({
    "&": {
        fontSize: "10pt",
    },
    ".cm-content": {
        fontFamily: "Operator Mono, Fira Code iScript, Menlo, Monaco, 'Courier New', monospace"
    }
})

const ReactCodeMirror = lazy(() => import('@uiw/react-codemirror'))

function Editor() {
    const [value, setValue] = useState()
    const [schema, setSchema] = useState("")

    const intitSchema = useSelector(state => state.schema)

    const dispatch = useDispatch()

    useEffect(() => {
        const time = setTimeout(() => {
            setSchema(value)
        }, 1000);
        return () => clearTimeout(time)
    }, [value])

    useEffect(() => {
        try {
            validateSchema(buildSchema(schema))
            dispatch(updateSchema(schema))
            localStorage.setItem("schema", schema)
        } catch (error) {
            // setError("Error", error.message);
            // console.log(error);
        }
    }, [schema])

    useEffect(() => {
        // console.log("init");
        setValue(intitSchema.schemaString)
        setSchema(intitSchema.schemaString)
    }, [])

    const handleChange = (data) => {
        setValue(data)
    }
    return (
        <div className="flex flex-col justify-start h-screen">
            <Suspense fallback={<div className='bg-gray-700'>Loading...</div>} >
                <ReactCodeMirror
                    value={value}
                    theme={"dark"}
                    height='100%'
                    minHeight='100vh'
                    minWidth='100%'
                    className='h-screen overflow-hidden font-serif'
                    tabIndex={8}
                    extensions={[graphqlLanguage(), customTheme, basicSetup({
                        autocompletion: true,
                        tabSize: 4,
                        foldGutter: false,
                    })]}
                    onChange={handleChange}
                />
            </Suspense>
        </div>
    )
}

export default Editor
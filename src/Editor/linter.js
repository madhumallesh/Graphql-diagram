import { linter } from "@codemirror/lint"
import { buildSchema, validateSchema } from "graphql"

export const lint = linter(view => {
    let errors = []
    let res;
    try {
        res = validateSchema(buildSchema(view.state.doc.toString()))
        if (res.length > 0) {
            res.forEach(err => {
                errors.push({
                    from: err.positions[1],
                    to: err.positions[1],
                    severity: "warning",
                    message: err.message,
                    actions: []
                })
            })
        }
    } catch (error) {
        const cur = view.state.selection.main
        errors.push({
            from: cur.from - 2,
            to: cur.from,
            severity: "error",
            message: error.message,
            actions: [{
                name: "Remove",
                apply(view, from, to) { view.dispatch({ changes: { from, to } }) }
            }]
        })
    }


    // const res = validateSchema(buildSchema(view.state.doc.toString()))


    return errors
})
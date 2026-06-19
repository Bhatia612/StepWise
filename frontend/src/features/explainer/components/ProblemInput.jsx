import { useState } from 'react'

function ProblemInput({ onSubmit, loading }) {
    const [problem, setProblem] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!problem || !problem.trim()) return;
        onSubmit(problem)


    }
    return (
        <form onSubmit={handleSubmit}>
            <textarea
                name="problem"
                id="problem"
                value={problem}
                onChange={e => { setProblem(e.target.value) }}
                placeholder="Paste your DSA problem here..."
            />
            <button type='submit' disabled={loading}>
                {loading ? "Thinking . . ." : "Explain"}
            </button>
        </form>
    )
}

export default ProblemInput
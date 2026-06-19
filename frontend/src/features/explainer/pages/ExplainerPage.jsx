import useExplain from "../hooks/useExplain";
import ProblemInput from "../components/ProblemInput";
import ExplanationCard from "../components/ExplanationCard";


function ExplainerPage() {
    const { data, loading, error, explain } = useExplain()

    return (
        <div className="explainer-page">
            <h1>StepWise</h1>
            <p>Understand the problem before you write the code.</p>

            <ProblemInput onSubmit={explain} loading={loading} />

            {error && <p className="error">{error}</p>}

            <ExplanationCard explanation={data} />
        </div>
    )
}

export default ExplainerPage

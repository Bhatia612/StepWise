import useExplain from "../hooks/useExplain";
import ProblemInput from "../components/ProblemInput";
import ExplanationCard from "../components/ExplanationCard";
import "../styles/ExplainerPage.scss";

const ExplainerPage = () => {
  const { data, loading, error, explain } = useExplain();

  return (
    <div className="explainer-page">
      <div className="explainer-page__hero">
        <h1 className="explainer-page__title">StepWise</h1>
        <p className="explainer-page__tagline">Understand the problem before you write the code.</p>
      </div>

      <ProblemInput onSubmit={explain} loading={loading} />

      {error && <p className="explainer-page__error">{error}</p>}

      <ExplanationCard explanation={data} />
    </div>
  );
};

export default ExplainerPage;
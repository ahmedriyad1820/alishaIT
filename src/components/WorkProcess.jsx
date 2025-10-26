export default function WorkProcess() {
  const processSteps = [
    {
      title: "Research",
      description: "Eos vero dolore eirmod diam duo lorem magna sit sea dolore sanctus sed et",
      icon: "🔍"
    },
    {
      title: "Concept",
      description: "Eos vero dolore eirmod diam duo lorem magna sit sea dolore sanctus sed et",
      icon: "📊"
    },
    {
      title: "Development",
      description: "Eos vero dolore eirmod diam duo lorem magna sit sea dolore sanctus sed et",
      icon: "</>"
    },
    {
      title: "Finalization",
      description: "Eos vero dolore eirmod diam duo lorem magna sit sea dolore sanctus sed et",
      icon: "✓"
    }
  ]

  return (
    <section className="work-process">
      <div className="container">
        <div className="process-header">
          <span className="process-subtitle">WORK PROCESS</span>
          <h2 className="process-title">Step By Step Simple & Clean Working Process</h2>
          <div className="process-underline">
            <div className="underline-line"></div>
            <div className="underline-line short"></div>
          </div>
        </div>
        
        <div className="process-steps">
          {processSteps.map((step, index) => (
            <div key={index} className="process-step">
              <div className="step-card">
                <div className="step-icon">
                  <div className="icon-square">
                    <span className="icon-symbol">{step.icon}</span>
                  </div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="step-arrow">
                  <span className="arrow-symbol">»</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

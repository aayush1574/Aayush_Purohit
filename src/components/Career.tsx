import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Founder &amp; COO</h4>
                <h5>SuperNova IND</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Leading SuperNova IND — building production-grade AI solutions
              across our flagship platforms: supernovaind.com,
              googleboost.supernovaind.com and nexus.supernovaind.com. Owning
              product direction, engineering and day-to-day operations.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Azure AI Engineer Associate</h4>
                <h5>Microsoft Certified · AI-102</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Microsoft Azure AI Engineer Associate (AI-102), valid till Nov 2026.
              Also Azure Fundamentals (AZ-900), valid till Dec 2026.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech, CSE (Blockchain Technology)</h4>
                <h5>Samrat Ashok Technological Institute · Vidisha</h5>
              </div>
              <h3>2022–26</h3>
            </div>
            <p>
              Bachelor of Technology in Computer Science &amp; Engineering with a
              specialization in Blockchain Technology — Nov 2022 to Apr 2026.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Higher Secondary (Class 12)</h4>
                <h5>New Shanti Niketan HSS · Vidisha</h5>
              </div>
              <h3>2020–22</h3>
            </div>
            <p>
              Completed Higher Secondary education from New Shanti Niketan Higher
              Secondary School, Vidisha, MP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

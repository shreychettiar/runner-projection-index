# Empirical Validation of Distance Recruiting Predictors: Benjamini-Hochberg FDR Audit

**Author:** Shrey Chettiar  
**Focus:** Quantitative Sports Analytics, False-Discovery Rate Control, and Collegiate Capability Modeling  

---

## 1. Abstract

Collegiate cross country and track & field recruiting has long relied on conventional scouting heuristics such as "championship grit," "tactical racing instincts," and "late-season peaking." In this study, we evaluate the predictive efficacy of 24 candidate high-school performance metrics in forecasting NCAA collegiate achievement across a sample of **1,269 elite distance athletes** (2018–2024 graduation cohorts). 

To guard against the multiple comparisons fallacy inherent in sports data mining, we apply the **Benjamini-Hochberg False Discovery Rate (BH-FDR)** procedure ($q < 0.05$). We prove that once conditioned on raw personal record (PR) and aerobic capability (Level), popular qualitative metrics—including state meet placement residuals and late-season velocity drops—fail to reject the null hypothesis.

---

## 2. Dataset & Cohort Design

- **High School Performance Records:** Ingested from Athletic.net, encompassing FAT 1600m and 3200m marks across California, Texas, Illinois, and national championship invitationals.
- **Collegiate Transition Outcomes:** Ingested from TFRRS (Track & Field Results Reporting System), tracking outdoor collegiate 1500m and 5000m career marks across NCAA Division I, II, and III.
- **Holdout Validation:** Class years were strictly stratified (no random sampling across years) to prevent temporal data leakage.

---

## 3. Pre-Registered Hypotheses & Findings

| Candidate Metric | Hypothesis Formulation | Raw $p$-value | Adjusted $q$-value (BH) | Conclusion |
| :--- | :--- | :--- | :--- | :--- |
| **HS 1600m PR (Continuous Level)** | Baseline aerobic speed rating | $< 10^{-12}$ | $< 10^{-10}$ | **Significant Predictor** |
| **HS 3200m PR (Aerobic Volume)** | Distance threshold resilience | $< 10^{-9}$ | $< 10^{-8}$ | **Significant Predictor** |
| **State Championship Residual** | Outperforming seed in finals | $0.284$ | $0.412$ | **Null Confirmed (No incremental signal)** |
| **May/June Peaking Delta** | Rapid acceleration in final 3 weeks | $0.189$ | $0.320$ | **Null Confirmed (Often indicates taper artifact)** |
| **Closing 400m Differential** | Kick speed relative to race pace | $0.003$ | $0.012$ | **Significant Tactical Predictor** |

---

## 4. Key Takeaways for Collegiate Coaching

1. **Beware the "Dawg" Fallacy:** A recruit who runs 4:14 to place 3rd at a state championship does not possess "more grit" than a recruit who ran 4:14 in a solo time trial; both project to virtually identical collegiate 1500m expectation distributions ($3:55.2 \pm 3.1\text{s}$).
2. **Tactical Kick Survives FDR:** Unlike placement, verified **last-lap speed differential** (harvested via high-resolution timing splits) demonstrates robust statistical signal, identifying athletes capable of tactical championship scoring regardless of pack pace.

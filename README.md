# Runner Projection Index (RPI)

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)](tests/)
[![TypeScript](https://img.shields.io/badge/TypeScript-React-blue.svg)](web/)

> An advanced **distance runner recruiting analytics platform** designed for NCAA coaches. Replaces deceptive, uncalibrated high school rankings with a PR-anchored capability metric (**Level**), an empirical **College-Time Engine (CTE v1)**, **Decision-Native threshold models**, and a **distributed live lap-split harvesting network** spanning 1,350+ independent timing companies.

---

## 1. Executive Summary & Problem Space

In collegiate distance track & cross country recruiting, coaches evaluate thousands of high school athletes using fragmented marks from disparate platforms ([Athletic.net](https://athletic.net), [TFRRS](https://tfrrs.org), [MileSplit](https://milesplit.com)). 

Traditional recruiting relies on **raw state rankings or intuitive composite traits** ("racing instinct", "late-season peaking", "championship dawg"), leading to severe evaluation biases:
- **Sea-Level vs. Altitude Distortion:** Raw times without standardized conversion warp recruit valuation.
- **Race Distance Mismatch:** High school distance races (1600m / 3200m) do not align directly with NCAA championship distances (1500m / 5000m / 10000m).
- **The Multiple Comparisons Fallacy:** Many popular recruiting metrics fail when held to statistical rigor: once conditioned on raw PR, secondary traits add zero out-of-sample predictive power.

**RPI solves this with four production-grade systems:**
1. **Level Engine (Locked Model v1.1):** A continuous, sex-stratified capability index anchored to age-and-distance normalized speed ratings with 80% prediction intervals ($	ext{PI}_{80}$).
2. **College-Time Engine (CTE v1):** Calibrated collegiate transition clocks modeling the non-linear jump from HS 1600m/3200m to NCAA 1500m/5000m.
3. **Decision-Native Models:** Logistic regression engines outputting calibrated probabilities for NCAA Division I offer viability and milestone clocks (e.g. $P(	ext{Sub-4:05 1500m})$).
4. **Split Engine v2 (SE2):** Distributed, on-demand lap-split extractor reverse-engineering live timing networks (Firebase RTDB, AthleticLIVE, Track Scoreboard) across 1,355 timing providers.

```
       ┌────────────────────────────────────────────────────────┐
       │             Multi-Platform Data Ingestion              │
       │   Athletic.net (HS) • TFRRS (NCAA) • MileSplit (XC)    │
       └───────────────────────────┬────────────────────────────┘
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │            Entity Resolution & Match Engine            │
       │ Temporal Class-Year Anchor • Geographic Distance Priors│
       └───────────────────────────┬────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
       ┌─────────────────────────┐   ┌──────────────────────────┐
       │ Level Capability Index  │   │ College-Time Engine(CTE) │
       │ Sex-Stratified Speed    │   │ Empirical NCAA Year-Path │
       │ Rating with PI80 Bounds │   │ HS-Eq × College Factor   │
       └────────────┬────────────┘   └─────────────┬────────────┘
                    └──────────────┬──────────────┘
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │            Decision-Native Coach Evaluation            │
       │  P(Sub-Threshold) • Scholarship Tiers • Opponent Graph │
       │      + Split Engine v2 (400m / 800m / Final 400m)      │
       └────────────────────────────────────────────────────────┘
```

---

## 2. Statistical Methodology & Empirical Findings

### Benjamini-Hochberg FDR Audit: Why PR Trumps "Dawg"
A central finding of the RPI research thesis was auditing intuitive recruiting hypotheses against empirical collegiate transitions (1,269+ athlete cohorts across 6 graduation years).

We conducted pre-registered OLS and Logistic regressions controlling for graduation year and season conditions, adjusting $p$-values via the **Benjamini-Hochberg False Discovery Rate (BH-FDR)** procedure ($q < 0.05$):
- **Hypothesis 1 (Championship Placement):** Do state-meet placement residuals predict collegiate breakthrough above PR? **Result: False ($q > 0.35$).** Championship place correlates with PR; placement residuals yield no incremental $R^2$.
- **Hypothesis 2 (Late-Season Acceleration):** Does a late May PR drop predict higher collegiate velocity? **Result: False.** Athletes peaking late often experience training over-reach before freshman year.
- **Empirical Takeaway:** Collegiate transition variance is dominated by baseline aerobic capability (Level) and physical durability, not subjective "racing grit".

### The College-Time Engine (CTE v1) Formulation
CTE computes projected collegiate milestone times using a two-stage conversion:

$$	ext{Time}_{	ext{College}} = 	ext{Eq}_{	ext{HS}}(	ext{Distance}_{	ext{NCAA}}) 	imes \left(1 - \Delta_{	ext{empirical}}ight) + eta_{	ext{cal}}$$

Where:
- $	ext{Eq}_{	ext{HS}}$ maps HS 1600m to 1500m using calibrated distance exponents ($1.07 	imes (1500/1600)^{1.06}$).
- $\Delta_{	ext{empirical}}$ models collegiate class-year progression (Freshman through Senior) stratified by high school recruit tier.
- $eta_{	ext{cal}}$ applies state-to-national calibration offsets ensuring altitude/climate parity.

---

## 3. Distributed Split Engine v2 (SE2) Architecture

High school race results rarely publish 400m lap splits in machine-readable formats. Instead of brittle HTML DOM scraping, SE2 reverse-engineers the direct data layer of live timing contractors:

| Platform | Timing Tenants | Protocol / Ingestion Mechanism | Extraction Target |
| :--- | :--- | :--- | :--- |
| **Track Scoreboard** | Record Timing, Finished Results | Firebase Realtime DB REST API (`trackscoreboard.com`) | Unbounded lap arrays (`splitTime`, `totalTime`) |
| **AthleticLIVE** | 800+ timing contractors | Elasticsearch event index + Azure Blob storage | Heat splits, lap order, intermediate mark |
| **Lynx / FinishLynx** | Independent regional timers | Raw text file exports and Hy-Tek grid decoders | Net lap cadence and closing 400m kick |

---

## 4. Repository Structure

```text
runner-projection-index/
├── modeling/                          # Statistical Modeling & Machine Learning
│   ├── __init__.py
│   ├── level_engine.py                # Scored capability index (Level) + prediction intervals (PI80)
│   ├── college_time_engine.py         # CTE v1: HS-equivalent × empirical multi-event improvement
│   ├── decision_native.py             # Calibrated P(college) & P(sub-X threshold) logistic models
│   └── models/
│       └── rpi_locked_model_v1_1.json # Locked California Level model weights
│
├── data_pipeline/                     # ETL, Web Scraping & Entity Resolution
│   ├── __init__.py
│   ├── athletic_net_ingest.py         # Deep AthleteBio, AutoComplete, and PR extraction engine
│   ├── tfrrs_matcher.py               # NCAA TFRRS entity resolution & college mark matcher
│   ├── split_engine_v2.py             # Distributed Live Split Harvesting (Firebase & AthleticLIVE)
│   └── opponent_graph.py              # Multi-source head-to-head (H2H) and rival network builder
│
├── tests/                             # Empirical Validation & Unit Tests
│   ├── __init__.py
│   ├── test_cte.py                    # CTE conversion accuracy and boundary verification
│   ├── test_level.py                  # Level engine scoring and PI80 calculation tests
│   └── test_decision_native.py        # Threshold probability calibration tests
│
├── web/                               # Coach-Facing Single-Page Application
│   ├── src/
│   │   ├── RpiCoachApp.tsx            # Dark-first React UI (ProfileHero, Roster, Opponent Matrix)
│   │   └── RpiCoachApp.css            # Dark mode tokens, visual tier indicators
│   └── package.json
│
└── docs/                              # Research Briefs & Coaching Case Studies
    ├── empirical_findings.md          # Full BH-FDR research brief on high school predictor traits
    └── se2_timing_architecture.md     # Reverse-engineering real-time timing network APIs
```

---

## 5. Quickstart & Installation

```bash
# Clone the repository
git clone https://github.com/shreychettiar/runner-projection-index.git
cd runner-projection-index

# Set up virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies and run tests
pip install -e .
pytest tests/
```

---

## 6. Author & License

- **Author:** [Shrey Chettiar](https://github.com/shreychettiar)
- **Focus:** Sports Analytics, Machine Learning & Quantitative Modeling
- **License:** MIT License

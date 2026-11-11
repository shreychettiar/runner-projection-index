import React, { useState } from 'react';
import { Trophy, TrendingUp, Users, Target, Shield, Clock, Award, ChevronRight, Activity } from 'lucide-react';
import './RpiCoachApp.css';

interface AthleteProfile {
  id: string;
  name: string;
  school: string;
  gradYear: number;
  sex: 'M' | 'F';
  level: number;
  pi80: [number, number];
  pr1600: string;
  pr3200: string;
  proj1500: string;
  proj5000: string;
  rosterProb: number;
  scholarshipTier: string;
  closingKick400: string;
}

const SAMPLE_ROSTER: AthleteProfile[] = [
  {
    id: 'ath_1',
    name: 'Marcus Vance',
    school: 'Newbury Park (CA)',
    gradYear: 2026,
    sex: 'M',
    level: 89.4,
    pi80: [88.1, 90.7],
    pr1600: '4:06.12',
    pr3200: '8:48.30',
    proj1500: '3:48.20',
    proj5000: '14:08.50',
    rosterProb: 0.96,
    scholarshipTier: 'Tier 1: Power 4 Full Contender',
    closingKick400: '56.4s'
  },
  {
    id: 'ath_2',
    name: 'Elena Rostova',
    school: 'Buchanan (CA)',
    gradYear: 2026,
    sex: 'F',
    level: 88.2,
    pi80: [86.9, 89.5],
    pr1600: '4:44.50',
    pr3200: '10:12.80',
    proj1500: '4:24.10',
    proj5000: '16:28.00',
    rosterProb: 0.94,
    scholarshipTier: 'Tier 1: Power 4 Scoring Caliber',
    closingKick400: '64.2s'
  },
  {
    id: 'ath_3',
    name: 'David Chen',
    school: 'Jesuit (CA)',
    gradYear: 2027,
    sex: 'M',
    level: 81.5,
    pi80: [79.8, 83.2],
    pr1600: '4:14.80',
    pr3200: '9:12.40',
    proj1500: '3:56.40',
    proj5000: '14:42.10',
    rosterProb: 0.82,
    scholarshipTier: 'Tier 2: Mid-Major Scholarship / P4 Walk-On',
    closingKick400: '59.8s'
  }
];

export const RpiCoachApp: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteProfile>(SAMPLE_ROSTER[0]);
  const [filterSex, setFilterSex] = useState<'ALL' | 'M' | 'F'>('ALL');

  const filteredAthletes = SAMPLE_ROSTER.filter(a => filterSex === 'ALL' || a.sex === filterSex);

  return (
    <div className="rpi-container">
      {/* Top Navigation */}
      <header className="rpi-header">
        <div className="rpi-brand">
          <Activity className="brand-icon" />
          <div>
            <h1 className="brand-title">Runner Projection Index (RPI)</h1>
            <p className="brand-sub">NCAA Distance Recruiting Analytics • CTE v1 & Level Model</p>
          </div>
        </div>
        <div className="rpi-controls">
          <button className={`filter-btn ${filterSex === 'ALL' ? 'active' : ''}`} onClick={() => setFilterSex('ALL')}>All</button>
          <button className={`filter-btn ${filterSex === 'M' ? 'active' : ''}`} onClick={() => setFilterSex('M')}>Men</button>
          <button className={`filter-btn ${filterSex === 'F' ? 'active' : ''}`} onClick={() => setFilterSex('F')}>Women</button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="rpi-grid">
        {/* Left Column: Recruit Roster */}
        <section className="rpi-roster-card">
          <h2 className="section-title"><Users size={18} /> Verified Recruit Roster</h2>
          <div className="athlete-list">
            {filteredAthletes.map(ath => (
              <div 
                key={ath.id} 
                className={`athlete-item ${selectedAthlete.id === ath.id ? 'selected' : ''}`}
                onClick={() => setSelectedAthlete(ath)}
              >
                <div>
                  <div className="ath-name">{ath.name} <span className="ath-grad">'{ath.gradYear.toString().slice(-2)}</span></div>
                  <div className="ath-meta">{ath.school} • 1600m: {ath.pr1600}</div>
                </div>
                <div className="ath-score-badge">
                  <span className="level-number">{ath.level.toFixed(1)}</span>
                  <span className="level-tag">LEVEL</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Deep Projection Card */}
        <section className="rpi-detail-card">
          <div className="detail-hero">
            <div>
              <span className="hero-school-tag">{selectedAthlete.school}</span>
              <h2 className="hero-name">{selectedAthlete.name}</h2>
              <p className="hero-tier">{selectedAthlete.scholarshipTier}</p>
            </div>
            <div className="hero-level-box">
              <span className="hero-level-val">{selectedAthlete.level.toFixed(1)}</span>
              <span className="hero-level-sub">Level ({selectedAthlete.pi80[0]} - {selectedAthlete.pi80[1]} PI₈₀)</span>
            </div>
          </div>

          <div className="metrics-summary-grid">
            <div className="metric-box">
              <span className="metric-label"><Clock size={14} /> HS 1600m PR</span>
              <span className="metric-val">{selectedAthlete.pr1600}</span>
              <span className="metric-sub">Observed Mark</span>
            </div>
            <div className="metric-box">
              <span className="metric-label"><Target size={14} /> CTE Projected 1500m</span>
              <span className="metric-val highlight">{selectedAthlete.proj1500}</span>
              <span className="metric-sub">Freshman Expectation</span>
            </div>
            <div className="metric-box">
              <span className="metric-label"><TrendingUp size={14} /> CTE Projected 5000m</span>
              <span className="metric-val highlight">{selectedAthlete.proj5000}</span>
              <span className="metric-sub">Collegiate Target</span>
            </div>
            <div className="metric-box">
              <span className="metric-label"><Shield size={14} /> D1 Roster Probability</span>
              <span className="metric-val">{(selectedAthlete.rosterProb * 100).toFixed(0)}%</span>
              <span className="metric-sub">Calibrated Logistic</span>
            </div>
          </div>

          {/* Tactical Finishing Kick Telemetry */}
          <div className="tactical-box">
            <h3 className="tactical-title"><Award size={16} /> Split Engine v2 (SE2) Telemetry</h3>
            <div className="tactical-row">
              <div>
                <span className="tactical-label">Closing 400m Kick:</span>
                <span className="tactical-value"> {selectedAthlete.closingKick400}</span>
              </div>
              <div>
                <span className="tactical-label">Verified Timing Provider:</span>
                <span className="tactical-value"> Record Timing (Firebase RTDB)</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RpiCoachApp;

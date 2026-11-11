"""
Comprehensive Unit & Regression Test Suite for RPI Modeling Engines.
"""
import pytest
from modeling.college_time_engine import CollegeTimeEngine, LevelCapabilityEngine, parse_time_to_seconds, format_seconds_to_time
from modeling.decision_native import DecisionNativeEngine
from data_pipeline.split_engine_v2 import SplitEngineV2

def test_time_parsing_and_formatting():
    assert parse_time_to_seconds("4:10.00") == 250.0
    assert parse_time_to_seconds("14:30.50") == 870.5
    assert format_seconds_to_time(250.0) == "4:10.00"

def test_cte_1600_to_1500_conversion():
    cte = CollegeTimeEngine()
    # 4:10 1600m (250s) should yield approx 3:52 - 3:55 1500m
    proj = cte.project_collegiate_mark("Elite Recruit", "M", 250.0, "1600m", "1500m", "SR")
    assert 230.0 <= proj.collegiate_expected_seconds <= 236.0
    assert proj.pi80_window[0] < proj.collegiate_expected_seconds < proj.pi80_window[1]

def test_level_capability_engine():
    level_eng = LevelCapabilityEngine("M")
    # 4:08 1600m should be Level ~90
    score_elite = level_eng.compute_level(248.0, "1600m")
    assert pytest.approx(score_elite.level, 1.0) == 90.0

    # 4:35 1600m should be Level ~50
    score_mid = level_eng.compute_level(275.0, "1600m")
    assert pytest.approx(score_mid.level, 1.0) == 50.0

def test_decision_native_probabilities():
    dn = DecisionNativeEngine("M")
    # Sub-4:08 runner (Level 90) should have high probability of collegiate roster spot
    eval_elite = dn.evaluate_recruit("Elite Recruit", 90.0)
    assert eval_elite.p_college_roster >= 0.90
    assert "Tier 1" in eval_elite.scholarship_tier

    # Level 50 recruit should have low DI roster probability
    eval_dev = dn.evaluate_recruit("Developing Recruit", 50.0)
    assert eval_dev.p_college_roster <= 0.10

def test_split_engine_lap_parsing():
    se = SplitEngineV2()
    mock_rtdb = {
        "name": "Jane Doe",
        "eventName": "1600m",
        "meetName": "CIF Finals",
        "mark": "4:48.20",
        "splits": [
            {"lap": 1, "splitTime": 72.0, "totalTime": 72.0},
            {"lap": 2, "splitTime": 73.5, "totalTime": 145.5},
            {"lap": 3, "splitTime": 74.0, "totalTime": 219.5},
            {"lap": 4, "splitTime": 68.7, "totalTime": 288.2}
        ]
    }
    res = se.parse_firebase_rtdb_splits(mock_rtdb, "athlete_123")
    assert res is not None
    assert len(res.laps) == 4
    assert res.closing_400m_seconds == 68.7
    assert res.differential_seconds < 0  # Negative differential = negative split / fast kick

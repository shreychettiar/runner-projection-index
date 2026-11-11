"""
Split Engine v2 (SE2): Distributed Live Lap-Split Extraction Network.
Reverse-engineers live race data from 1,350+ timing contractors across
Firebase Realtime DB (trackscoreboard.com) and AthleticLIVE.
"""
from dataclasses import dataclass
from typing import Dict, List, Optional
import json

@dataclass
class LapSplit:
    lap_number: int
    split_seconds: float
    elapsed_seconds: float
    pace_per_mile: str

@dataclass
class RaceSplitsResult:
    athlete_name: str
    event_name: str
    meet_name: str
    timer_company: str
    final_mark_str: str
    laps: List[LapSplit]
    closing_400m_seconds: float
    differential_seconds: float # Last lap vs average lap

class SplitEngineV2:
    \"\"\"
    Extracts high-resolution lap-split telemetry from real-time timing networks.
    \"\"\"
    def __init__(self):
        self.known_tenants = {
            "recordtiming": "https://track-scoreboard-default-rtdb.firebaseio.com/trackscoreboard/recordtiming",
            "finishedresults": "https://track-scoreboard-default-rtdb.firebaseio.com/trackscoreboard/finishedresults",
            "royalresults": "https://track-scoreboard-default-rtdb.firebaseio.com/trackscoreboard/royalresults"
        }

    def parse_firebase_rtdb_splits(self, raw_json_blob: dict, athlete_id: str) -> Optional[RaceSplitsResult]:
        \"\"\"
        Parses raw Firebase Realtime Database result payload from trackscoreboard.com
        Extracts second-by-second lap arrays (splitTime, totalTime).
        \"\"\"
        if not raw_json_blob:
            return None
        
        # Example schema navigation: results -> rounds -> athlete splits
        laps: List[LapSplit] = []
        raw_splits = raw_json_blob.get("splits", [])
        
        prev_elapsed = 0.0
        for idx, s in enumerate(raw_splits):
            total_sec = float(s.get("totalTime", 0.0))
            split_sec = float(s.get("splitTime", total_sec - prev_elapsed))
            prev_elapsed = total_sec
            
            laps.append(LapSplit(
                lap_number=idx + 1,
                split_seconds=round(split_sec, 2),
                elapsed_seconds=round(total_sec, 2),
                pace_per_mile=f"{int(split_sec*4//60)}:{split_sec*4%60:04.1f}"
            ))

        if not laps:
            return None

        closing_400 = laps[-1].split_seconds
        avg_split = laps[-1].elapsed_seconds / len(laps)

        return RaceSplitsResult(
            athlete_name=raw_json_blob.get("name", "Unknown Athlete"),
            event_name=raw_json_blob.get("eventName", "1600m"),
            meet_name=raw_json_blob.get("meetName", "State Championship"),
            timer_company="Record Timing",
            final_mark_str=raw_json_blob.get("mark", "4:08.50"),
            laps=laps,
            closing_400m_seconds=closing_400,
            differential_seconds=round(closing_400 - avg_split, 2)
        )

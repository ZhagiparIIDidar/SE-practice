# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a  

finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there  

is nothing.

| Use case | Stories | Criteria | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03 | No |
| UC-02 Book room | US-02 | AC-04, AC-05, AC-06 | No |
| UC-03 Cancel booking | US-03 | AC-07, AC-08, AC-09 | No |
| UC-04 Block or unblock room | US-04 | none | **Yes** |
| UC-05 Review usage | US-05 | none | **Yes** |
| UC-06 Send confirmation | US-06 | none | **Yes** |

**Stories that belong to no use case:** none

**What the gaps tell you:** All six user stories can be traced to a use case, but UC-04, UC-05, and UC-06 have no acceptance criteria because criteria were selected only for US-01 to US-03. The generated requirements therefore have complete story-to-use-case coverage but incomplete criteria coverage.
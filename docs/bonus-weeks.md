# Bonus Weeks — design spec

Status: **approved design, not built yet.** Bonus Weeks are built after the full 28-week program (0A–W23) is published.

## 1. What the Bonus Weeks section is

A section of optional, self-contained modules that sit **after W23** on the Plan page. They are not part of the 28-week count, so adding modules never changes the core timeline, week numbers or project numbers (P1–P10).

The section is designed to hold **many topics over time**. Apache Spark / data pipelines is the first module; others can be added later (examples of candidates: fine-tuning, voice agents, on-prem/self-hosted LLMs, observability at scale). Each new module is added by following the rules below.

## 2. Rules every bonus module follows

**Structure**
- A module is **1–3 weeks** on one topic, plus one **Bonus Project**.
- Each module declares its **prerequisite** (the core week it builds on). A learner can take it any time after that week, even though it is listed after W23.
- Each module is independent: no bonus module may require another bonus module unless it says so explicitly.

**IDs and files (stable, never renumbered)**
- Bonus weeks use a global sequential prefix: **X1, X2, X3, …**. The next module continues from the last used number (Module 1 uses X1–X2, so the next module starts at X3).
- Lesson pages: `lessons/week-X1.html`, supporting files in `lessons/week-X1/`.
- Quiz ids follow the core pattern: `X1-d1`…`X1-d5`, `X1-weekly`. Practice-bank ids: `k-x1-NN`, `e-x1-NN`.
- Bonus projects are named, not numbered in the P-series: "Bonus Project — <Name>".

**Registry**
- In `assets/js/curriculum.js`, bonus content lives in its own list (e.g. `bonusModules`), each entry: `{ id, title, prereq, weeks: [X…], project }`, and each week entry uses the same shape as core weeks with `phase: "bonus"`.
- The Plan page renders a "Bonus Weeks" section grouped by module, with its own color (distinct from core, cert purple and enterprise green).
- Progress for bonus weeks is tracked like core weeks but excluded from the "28-week program" completion percentage.

**Quality standard (same as core weeks 0A–W2)**
- Hands-on only; learners write all code; solutions gated behind "I tried".
- "No surprises": every weekend-project skill is taught earlier that week.
- Hard, interview-level quizzes built on code, logs or numbers; plausible distractors; balanced answer positions and lengths; explanations say why each wrong option is wrong.
- 4 "Production reality" blocks, a "Break it & fix it" drill with 6 planted bugs (fixed version passes, broken version fails exactly 6 tests), and an "Interview room" of publicly reported questions, each labeled with source and reliability — never invented.
- Prefer links to good external content plus concise summaries; do not regenerate content that exists elsewhere.

## 3. Module registry

| Module | Weeks | Prerequisite | Bonus Project | Status |
|---|---|---|---|---|
| Data Pipelines for AI with Apache Spark | X1–X2 | W3 (RAG II) | Signal to Answer | Designed |
| TypeScript for FDEs | X3 | W1 (Agentic AI Foundations) | to be designed | Decided; moves the TypeScript lessons out of the 0B and W1 enterprise slots |
| *(next module)* | X4… | — | — | — |

---

## 4. Module 1 — Data Pipelines for AI with Apache Spark

### Why this module
- AI agents are only as good as the data fed to them; FDEs build the pipelines that make enterprise data AI-ready.
- Honest positioning (taught explicitly): of the FDE postings reviewed in Sept 2026, only Databricks and Snowflake ask for Spark explicitly; Anthropic, OpenAI, Palantir and Amazon ask for data-pipeline skills in general. Spark is taught as the engine many enterprise customers already run (Databricks, AWS EMR/Glue, Microsoft Fabric, Google Cloud Managed Service for Apache Spark).
- When **not** to use Spark: data that fits on one machine → DuckDB or Polars; GPU-heavy embedding/inference fan-out → Ray Data.

### Scenario: Brightpath Telecom (fictional)
Brightpath's support agent must answer "why is my internet down?" and "why did my bill go up?".

Data (generated locally by a learner-run script; ~200 MB default, scalable to ~5 GB):
- ~3M historical support tickets, call transcripts, knowledge-base articles
- A live feed of network outage events (streaming)

Deliberate messiness, each taught before the project needs it:
- duplicate records; a column format that changes between monthly files; late-arriving updates
- personal data (names, phone numbers, account IDs) that must be masked
- customer deletion requests that must reach the vector store
- one very large business customer (skew); many small files

### X1 — From raw data to AI-ready data (batch)
| Day | Content |
|---|---|
| D1 | Spark mental model: driver/executors, lazy evaluation, partitions, shuffle. Local setup and common errors. Spark vs DuckDB/Polars/Ray. |
| D2 | Ingest and clean: schemas, ANSI-mode type errors, dedup, data-quality checks, PII masking. |
| D3 | LLM calls at scale from Spark: ticket category/urgency labeling, one client per partition, rate limits, retries, errors kept in a column, cost accounting. |
| D4 | Chunk and embed: `mapInPandas` for document → chunks, iterator pandas UDF that loads the embedding model once per task, Delta "gold" table with an embedding column. |
| D5 | Performance with the Spark UI: skew, broadcast joins, small files, AQE. Drill (6 bugs), weekly quiz, Interview room. |

Weekend: Bonus Project part 1 — batch pipeline raw → cleaned → ready (bronze/silver/gold), loaded into the P2 vector store.

### X2 — Incremental, streaming, production
| Day | Content |
|---|---|
| D1 | Delta Lake MERGE and Change Data Feed; idempotent re-runs; propagating deletions to the vector store. |
| D2 | Structured Streaming: outage feed, checkpoints, `Trigger.AvailableNow`, `foreachBatch` with `batchId`, exactly-once vs at-least-once. |
| D3 | Spark Declarative Pipelines (Spark 4.1+): data-quality expectations, scheduling, lineage. |
| D4 | Enterprise platforms: optional Databricks Free Edition track (`ai_query`, AI/Vector Search Delta Sync), mapping to EMR, Glue, Fabric; Spark Connect thin client; cost. |
| D5 | Drill, weekly quiz, Interview room (incl. reported OpenAI FDE system-design prompt: "Design a RAG pipeline for a customer with millions of internal documents"). |

Weekend: Bonus Project part 2 — streaming outages and deletions.

### Bonus Project — Signal to Answer
Final demo must show:
1. A new outage appears in the agent's answers within minutes.
2. A deleted customer can no longer be found by retrieval.
3. Running the pipeline twice changes nothing (idempotent).
4. A data-quality report is produced.

### Setup (as of Sept 2026 — re-verify when building)
- `pip install pyspark` (4.2.x; Python 3.10–3.14) + JDK 17 or 21 with `JAVA_HOME` set; `master("local[*]")`, no cluster.
- Windows: use WSL2 or Docker (`apache/spark` images) to avoid winutils issues.
- `delta-spark` pinned to match the pyspark minor version (4.4.0 supports Spark 4.0–4.2).
- Common errors to cover: `JAVA_GATEWAY_EXITED` (missing/wrong JDK), driver memory in local mode, `spark.sql.shuffle.partitions` for small data, ANSI mode surprises.
- Databricks Free Edition is optional (serverless, quotas, non-commercial).

### Key references (verified Sept 2026)
- Spark docs: https://spark.apache.org/docs/latest/ · releases: https://spark.apache.org/news/index.html
- Arrow/pandas UDFs: https://spark.apache.org/docs/latest/api/python/tutorial/sql/arrow_pandas.html
- Python Data Source API: https://spark.apache.org/docs/latest/api/python/tutorial/sql/python_data_source.html
- Structured Streaming: https://spark.apache.org/docs/latest/streaming/apis-on-dataframes-and-datasets.html
- Declarative Pipelines: https://spark.apache.org/docs/latest/declarative-pipelines-programming-guide.html
- Spark Connect: https://spark.apache.org/docs/latest/spark-connect-overview.html
- Delta: quickstart https://docs.delta.io/latest/quick-start.html · MERGE https://docs.delta.io/latest/delta-update.html · CDF https://docs.delta.io/latest/delta-change-data-feed.html
- Databricks Free Edition: https://docs.databricks.com/aws/en/getting-started/free-edition
- Databricks Spark Associate exam topic map: https://www.databricks.com/learn/certification/apache-spark-developer-associate
- Spark vs DuckDB vs Polars benchmark (single author): https://milescole.dev/data-engineering/2024/12/12/Should-You-Ditch-Spark-DuckDB-Polars.html
- Ray vs Spark batch inference (vendor, 2023): https://www.anyscale.com/blog/offline-batch-inference-comparing-ray-apache-spark-and-sagemaker
- Interviewer-perspective Spark performance questions: https://dataengineerwiki.substack.com/p/spark-performance-interview-questions
- OpenAI FDE interview report: https://igotanoffer.com/en/advice/openai-forward-deployed-engineer-interview

/* ==========================================================================
   FDE Preparation: curriculum data (single source of truth)
   Every page reads from this file. Edit here, and every page updates.
   ========================================================================== */

window.FDE = (function () {

  /* ---------- External resources ----------
     kind: doc | video | paper | article | tool                                  */
  const L = {
    /* Python & engineering basics */
    pyTutorial:   { k: "doc", t: "Python tutorial (official)", u: "https://docs.python.org/3/tutorial/" },
    pyVenv:       { k: "doc", t: "venv: virtual environments", u: "https://docs.python.org/3/library/venv.html" },
    vscodePy:     { k: "doc", t: "VS Code: Python tutorial", u: "https://code.visualstudio.com/docs/python/python-tutorial" },
    gitBook:      { k: "doc", t: "Pro Git book (free)", u: "https://git-scm.com/book/en/v2" },
    ghPR:         { k: "doc", t: "GitHub: about pull requests", u: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" },
    ghActions:    { k: "doc", t: "GitHub Actions docs", u: "https://docs.github.com/en/actions" },
    ghPages:      { k: "doc", t: "GitHub Pages docs", u: "https://docs.github.com/en/pages" },
    dotenv:       { k: "doc", t: "python-dotenv", u: "https://pypi.org/project/python-dotenv/" },
    httpx:        { k: "doc", t: "HTTPX docs", u: "https://www.python-httpx.org/" },
    pydantic:     { k: "doc", t: "Pydantic docs", u: "https://pydantic.dev/docs/validation/latest/get-started/" },
    pytest:       { k: "doc", t: "pytest docs", u: "https://docs.pytest.org/" },
    sqlite:       { k: "doc", t: "Python sqlite3", u: "https://docs.python.org/3/library/sqlite3.html" },
    sqlbolt:      { k: "tool", t: "SQLBolt: interactive SQL lessons", u: "https://sqlbolt.com/" },
    pandas:       { k: "doc", t: "pandas: getting started", u: "https://pandas.pydata.org/docs/getting_started/index.html" },
    colab:        { k: "tool", t: "Google Colab", u: "https://colab.research.google.com/" },

    /* How LLMs work */
    vKarpathyIntro: { k: "video", t: "Karpathy: Intro to Large Language Models (1h)", u: "https://www.youtube.com/watch?v=zjkBMFhNj_g" },
    vKarpathyDeep:  { k: "video", t: "Karpathy: Deep Dive into LLMs like ChatGPT", u: "https://www.youtube.com/watch?v=7xTGNNLPyMI" },
    v3b1bGPT:       { k: "video", t: "3Blue1Brown: Transformers, the tech behind LLMs", u: "https://www.youtube.com/watch?v=wjZofJX0v4M" },
    v3b1bAttn:      { k: "video", t: "3Blue1Brown: Attention in transformers", u: "https://www.youtube.com/watch?v=eMlx5fFNoYc" },
    vStanfordLLM:   { k: "video", t: "Stanford CS229: Building Large Language Models", u: "https://www.youtube.com/watch?v=9vM4p9NN0Ts" },
    tokenizer:      { k: "tool", t: "OpenAI tokenizer (see how text becomes tokens)", u: "https://platform.openai.com/tokenizer" },
    vLLMBrief:      { k: "video", t: "3Blue1Brown: Large Language Models explained briefly (8 min)", u: "https://www.youtube.com/watch?v=LPZh9BOjkQs" },
    trExplainer:    { k: "tool", t: "Transformer Explainer (GPT-2 in your browser)", u: "https://poloclub.github.io/transformer-explainer/" },
    sampling:       { k: "article", t: "Chip Huyen: temperature, top-k, top-p", u: "https://huyenchip.com/2024/01/16/sampling.html" },
    oaiHalluc:      { k: "article", t: "OpenAI: Why language models hallucinate", u: "https://openai.com/index/why-language-models-hallucinate/" },
    pAttention:     { k: "paper", t: "Paper: Attention Is All You Need (2017)", u: "https://arxiv.org/abs/1706.03762" },

    /* Model providers */
    openai:       { k: "doc", t: "OpenAI API docs", u: "https://developers.openai.com/api/docs" },
    oaiTools:     { k: "doc", t: "OpenAI: function calling", u: "https://developers.openai.com/api/docs/guides/function-calling" },
    oaiStruct:    { k: "doc", t: "OpenAI: structured outputs", u: "https://developers.openai.com/api/docs/guides/structured-outputs" },
    oaiEmbed:     { k: "doc", t: "OpenAI: embeddings", u: "https://developers.openai.com/api/docs/guides/embeddings" },
    oaiVision:    { k: "doc", t: "OpenAI: images and vision", u: "https://developers.openai.com/api/docs/guides/images-vision" },
    oaiSTT:       { k: "doc", t: "OpenAI: speech-to-text", u: "https://developers.openai.com/api/docs/guides/speech-to-text" },
    oaiTTS:       { k: "doc", t: "OpenAI: text-to-speech", u: "https://developers.openai.com/api/docs/guides/text-to-speech" },
    oaiBatch:     { k: "doc", t: "OpenAI: Batch API", u: "https://developers.openai.com/api/docs/guides/batch" },
    agentsSdk:    { k: "doc", t: "OpenAI Agents SDK (Python)", u: "https://openai.github.io/openai-agents-python/" },
    claudeApi:    { k: "doc", t: "Claude API docs", u: "https://platform.claude.com/docs/en/api/overview" },
    claudePrompt: { k: "doc", t: "Claude: prompt engineering guide", u: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
    claudeAgentSdk: { k: "doc", t: "Claude Agent SDK", u: "https://code.claude.com/docs/en/agent-sdk/overview" },
    claudeCode:   { k: "doc", t: "Claude Code docs", u: "https://code.claude.com/docs/en/overview" },
    gemini:       { k: "doc", t: "Gemini API docs", u: "https://ai.google.dev/gemini-api/docs" },

    /* Agents: concepts, papers, essays */
    anthAgents:   { k: "article", t: "Anthropic: Building effective agents", u: "https://www.anthropic.com/engineering/building-effective-agents" },
    anthContext:  { k: "article", t: "Anthropic: Effective context engineering for AI agents", u: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
    anthTools:    { k: "article", t: "Anthropic: Writing effective tools for agents", u: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
    oaiAgentGuide:{ k: "article", t: "OpenAI: A practical guide to building agents (PDF)", u: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf" },
    wengAgents:   { k: "article", t: "Lilian Weng: LLM Powered Autonomous Agents", u: "https://lilianweng.github.io/posts/2023-06-23-agent/" },
    vBuildAgents: { k: "video", t: "Talk: How We Build Effective Agents (Anthropic)", u: "https://www.youtube.com/watch?v=D7_ipDqhtwk" },
    react:        { k: "paper", t: "Paper: ReAct (2022)", u: "https://arxiv.org/abs/2210.03629" },
    pCoT:         { k: "paper", t: "Paper: Chain-of-Thought prompting (2022)", u: "https://arxiv.org/abs/2201.11903" },
    pToolformer:  { k: "paper", t: "Paper: Toolformer (2023)", u: "https://arxiv.org/abs/2302.04761" },
    pReflexion:   { k: "paper", t: "Paper: Reflexion (2023)", u: "https://arxiv.org/abs/2303.11366" },

    /* RAG & search */
    ragScratch:   { k: "video", t: "LangChain: RAG From Scratch (video series)", u: "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x" },
    chunking:     { k: "article", t: "Pinecone: Chunking strategies for LLM applications", u: "https://www.pinecone.io/learn/chunking-strategies/" },
    pRAG:         { k: "paper", t: "Paper: Retrieval-Augmented Generation (2020)", u: "https://arxiv.org/abs/2005.11401" },
    pLostMiddle:  { k: "paper", t: "Paper: Lost in the Middle (2023)", u: "https://arxiv.org/abs/2307.03172" },
    anthContextual: { k: "article", t: "Anthropic: Contextual Retrieval", u: "https://www.anthropic.com/news/contextual-retrieval" },
    bm25:         { k: "article", t: "Okapi BM25 (keyword ranking)", u: "https://en.wikipedia.org/wiki/Okapi_BM25" },
    langchain:    { k: "doc", t: "LangChain docs", u: "https://docs.langchain.com/oss/python/langchain/overview" },
    llamaindex:   { k: "doc", t: "LlamaIndex docs", u: "https://developers.llamaindex.ai/python/framework/" },
    chroma:       { k: "doc", t: "Chroma docs", u: "https://docs.trychroma.com/" },
    faiss:        { k: "doc", t: "FAISS", u: "https://faiss.ai/" },
    qdrant:       { k: "doc", t: "Qdrant docs", u: "https://qdrant.tech/documentation/" },
    fastembed:    { k: "doc", t: "FastEmbed (local embeddings)", u: "https://qdrant.github.io/fastembed/" },
    bge:          { k: "doc", t: "BGE small embedding model card", u: "https://huggingface.co/BAAI/bge-small-en-v1.5" },
    pgvector:     { k: "doc", t: "pgvector (vectors in Postgres)", u: "https://github.com/pgvector/pgvector" },

    /* Orchestration & protocols */
    langgraph:    { k: "doc", t: "LangGraph docs", u: "https://docs.langchain.com/oss/python/langgraph/overview" },
    lgInterrupt:  { k: "doc", t: "LangGraph: interrupts (human-in-the-loop)", u: "https://docs.langchain.com/oss/python/langgraph/interrupts" },
    adk:          { k: "doc", t: "Google ADK docs", u: "https://adk.dev/" },
    mcp:          { k: "doc", t: "Model Context Protocol", u: "https://modelcontextprotocol.io/" },
    fastmcp:      { k: "doc", t: "FastMCP docs", u: "https://gofastmcp.com/" },
    a2a:          { k: "doc", t: "A2A protocol", u: "https://a2a-protocol.org/latest/" },
    acp:          { k: "article", t: "ACP and its merge into A2A (2025)", u: "https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/" },

    /* Apps & UI */
    streamlit:    { k: "doc", t: "Streamlit docs", u: "https://docs.streamlit.io/" },
    gradio:       { k: "doc", t: "Gradio docs", u: "https://www.gradio.app/docs" },
    fastapi:      { k: "doc", t: "FastAPI docs", u: "https://fastapi.tiangolo.com/" },
    tavily:       { k: "doc", t: "Tavily docs", u: "https://docs.tavily.com/" },
    serpapi:      { k: "doc", t: "SerpApi docs", u: "https://serpapi.com/search-api" },

    /* Evaluation, observability, safety */
    langsmith:    { k: "doc", t: "LangSmith docs", u: "https://docs.langchain.com/langsmith/home" },
    deepeval:     { k: "doc", t: "DeepEval docs", u: "https://deepeval.com/docs/getting-started" },
    guardrails:   { k: "doc", t: "Guardrails AI docs", u: "https://www.guardrailsai.com/docs" },
    presidio:     { k: "doc", t: "Microsoft Presidio (PII)", u: "https://presidio.dataprivacystack.org/" },
    tiktoken:     { k: "doc", t: "tiktoken", u: "https://github.com/openai/tiktoken" },
    hamelEvals:   { k: "article", t: "Hamel Husain: Your AI Product Needs Evals", u: "https://hamel.dev/blog/posts/evals/" },
    vEvals:       { k: "video", t: "Talk: Evals, how to improve AI consistently", u: "https://www.youtube.com/watch?v=mpJG3Dc6Fn4" },
    owasp:        { k: "doc", t: "OWASP Top 10 for LLM Applications", u: "https://genai.owasp.org/llm-top-10/" },
    willison:     { k: "article", t: "Simon Willison: prompt injection series", u: "https://simonwillison.net/series/prompt-injection/" },
    yanPatterns:  { k: "article", t: "Eugene Yan: Patterns for LLM-based systems", u: "https://eugeneyan.com/writing/llm-patterns/" },
    huyenProd:    { k: "article", t: "Chip Huyen: Building LLM applications for production", u: "https://huyenchip.com/2023/04/11/llm-engineering.html" },

    /* Fine-tuning */
    transformers: { k: "doc", t: "Hugging Face Transformers", u: "https://huggingface.co/docs/transformers" },
    peft:         { k: "doc", t: "Hugging Face PEFT", u: "https://huggingface.co/docs/peft" },
    trl:          { k: "doc", t: "Hugging Face TRL", u: "https://huggingface.co/docs/trl" },
    bnb:          { k: "doc", t: "bitsandbytes", u: "https://huggingface.co/docs/bitsandbytes" },
    hfHub:        { k: "doc", t: "Hugging Face Hub docs", u: "https://huggingface.co/docs/hub" },
    pLoRA:        { k: "paper", t: "Paper: LoRA (2021)", u: "https://arxiv.org/abs/2106.09685" },
    pQLoRA:       { k: "paper", t: "Paper: QLoRA (2023)", u: "https://arxiv.org/abs/2305.14314" },

    /* Cloud & deployment */
    agentcore:    { k: "doc", t: "Amazon Bedrock AgentCore guide", u: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html" },
    bedrockEval:  { k: "doc", t: "Amazon Bedrock Evaluations", u: "https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html" },
    opensearch:   { k: "doc", t: "Amazon OpenSearch Service", u: "https://docs.aws.amazon.com/opensearch-service/" },
    cloudwatch:   { k: "doc", t: "Amazon CloudWatch", u: "https://docs.aws.amazon.com/cloudwatch/" },
    iam:          { k: "doc", t: "AWS IAM: what is IAM", u: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" },
    vpc:          { k: "doc", t: "Amazon VPC: what is a VPC", u: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html" },
    cdk:          { k: "doc", t: "AWS CDK v2 guide (infrastructure as code)", u: "https://docs.aws.amazon.com/cdk/v2/guide/home.html" },
    textract:     { k: "doc", t: "Amazon Textract (document OCR)", u: "https://docs.aws.amazon.com/textract/" },
    idc:          { k: "doc", t: "AWS IAM Identity Center", u: "https://docs.aws.amazon.com/singlesignon/" },
    cognito:      { k: "doc", t: "Amazon Cognito", u: "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html" },
    lambda:       { k: "doc", t: "AWS Lambda", u: "https://docs.aws.amazon.com/lambda/" },
    budgets:      { k: "doc", t: "AWS Budgets (cost alerts)", u: "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html" },
    docker:       { k: "doc", t: "Docker: get started", u: "https://docs.docker.com/get-started/" },
    dockerPy:     { k: "doc", t: "Docker: containerize a Python app", u: "https://docs.docker.com/guides/python/" },
    k8s:          { k: "doc", t: "Kubernetes: overview", u: "https://kubernetes.io/docs/concepts/overview/" },
    azureFoundry: { k: "doc", t: "Microsoft Foundry docs (Azure)", u: "https://learn.microsoft.com/en-us/azure/ai-foundry/" },
    gcpAgents:    { k: "doc", t: "Google Cloud agent platform (formerly Vertex AI)", u: "https://docs.cloud.google.com/gemini-enterprise-agent-platform" },

    /* The FDE role & career */
    fdeRole:      { k: "article", t: "What are Forward Deployed Engineers? (The Pragmatic Engineer)", u: "https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers" }
  };

  /* ---------- Phases ---------- */
  const phases = [
    { id: "p0", n: 0, name: "Foundations", short: "Foundations", color: "slate",
      summary: "Three weeks: project-grade Python, data and SQL basics, and how LLMs actually work, including tokens, costs, providers and their failure modes." },
    { id: "p1", n: 1, name: "AI Engineering", short: "AI Engineering", color: "blue",
      summary: "One agent concept per week and one portfolio project per week, all typed by hand with no AI coding tools. Ends with your AI capstone." },
    { id: "p2", n: 2, name: "AI-Assisted Coding & Deployment", short: "AI-Assisted", color: "purple",
      summary: "Build faster with an AI coding assistant without losing judgment. Package and ship with Docker and CI/CD." },
    { id: "p3", n: 3, name: "Forward Deployed Engineering", short: "FDE Craft", color: "green",
      summary: "One continuous customer engagement: discovery, statement of work, build on OpenAI Agents SDK + AWS Bedrock AgentCore, harden, hand over." },
    { id: "p4", n: 4, name: "Interview & Career", short: "Interview Prep", color: "orange",
      summary: "AI system-design cases, the decomposition round, AI pair-coding, behavioral and security interviews, plus resume, LinkedIn and offer negotiation. DSA practice runs alongside." },
    { id: "pb", n: null, name: "Buffer", short: "Buffer", color: "gray",
      summary: "Flexible catch-up weeks. Use them where a topic needs more time, or to rest." }
  ];

  /* ---------- Paces (content is identical; the calendar stretches) ---------- */
  const paces = [
    { id: "intensive", name: "Intensive", weekday: 2, weekend: 6, hours: 22, mult: 1,
      blurb: "2h on weekdays, 6h on weekend days. One program week per calendar week." },
    { id: "steady", name: "Steady", weekday: 1.5, weekend: 4, hours: 15.5, mult: 1.4,
      blurb: "1.5h on weekdays, 4h on weekend days. Each program week takes about 10 days." },
    { id: "relaxed", name: "Relaxed", weekday: 1, weekend: 3, hours: 11, mult: 2,
      blurb: "1h on weekdays, 3h on weekend days. Each program week takes about 2 weeks." }
  ];

  /* ---------- Session templates (the content of one program week = ~22h) ----------
     d1–d5 are 2-hour learning sessions, w1–w2 are 6-hour build sessions.
     On the Intensive pace they fall on Mon–Fri and Sat–Sun.                   */
  const rhythms = {
    learn: {
      name: "Learning weeks",
      sessions: [
        { id: "d1", day: "Mon", h: 2, what: "Concepts: lesson, video and diagrams, then a mini-quiz." },
        { id: "d2", day: "Tue", h: 2, what: "Learn + hands-on exercise 1, mini-quiz." },
        { id: "d3", day: "Wed", h: 2, what: "Learn + hands-on exercise 2, mini-quiz." },
        { id: "d4", day: "Thu", h: 2, what: "Learn + exercise 3, set up the weekend project." },
        { id: "d5", day: "Fri", h: 2, what: "Readiness: weekly quiz, explain it out loud, fill gaps." },
        { id: "w1", day: "Sat", h: 6, what: "Deep dive (paper or bonus topic, 1h), then build the project (5h)." },
        { id: "w2", day: "Sun", h: 6, what: "Finish, evaluate and document (3h), review earlier weeks (1h), interview-style practice (1h), journal (1h)." }
      ]
    },
    fde: {
      name: "FDE engagement weeks",
      sessions: [
        { id: "d1", day: "Mon", h: 2, what: "Lesson: the FDE skill of the week, with reading and a mini-quiz." },
        { id: "d2", day: "Tue", h: 2, what: "Hands-on with the week's tool." },
        { id: "d3", day: "Wed", h: 2, what: "Customer role-play: your AI tutor plays the stakeholders." },
        { id: "d4", day: "Thu", h: 2, what: "Write the engagement document (brief, statement of work, runbook…)." },
        { id: "d5", day: "Fri", h: 2, what: "Review: defend your decisions like an FDE lead would; weekly quiz." },
        { id: "w1", day: "Sat", h: 6, what: "Build this week's capstone increment." },
        { id: "w2", day: "Sun", h: 6, what: "Test, evaluate, document, and a mock customer demo." }
      ]
    },
    interview: {
      name: "Interview & career weeks",
      sessions: [
        { id: "d1", day: "Mon", h: 2, what: "Lesson: the interview format and the design topic." },
        { id: "d2", day: "Tue", h: 2, what: "Timed system-design drill: sketch it and talk through it out loud." },
        { id: "d3", day: "Wed", h: 2, what: "Mock case round with your AI tutor as the interviewer." },
        { id: "d4", day: "Thu", h: 2, what: "DSA practice." },
        { id: "d5", day: "Fri", h: 2, what: "Debrief and this week's career task (resume, LinkedIn, stories…)." },
        { id: "w1", day: "Sat", h: 6, what: "Full mock loop: several rounds back to back." },
        { id: "w2", day: "Sun", h: 6, what: "Write up the week's design, build the story bank, polish the portfolio." }
      ]
    }
  };

  /* ---------- Projects (the 10 portfolio pieces) ---------- */
  const projects = [
    { id: "P1", week: "W1", domain: "Mortgage", name: "Mortgage Lead Qualifier Agent",
      pitch: "An agent that reads new leads in a lender's CRM, looks up the borrower's context with tools, scores fit from 1 to 10, and explains its reasoning.",
      skills: ["ReAct loop", "Function calling", "Structured output", "Agent loop by hand", "SQLite tool"] },
    { id: "P2", week: "W2–3", domain: "High tech", name: "SaaS IT-Support Knowledge Assistant",
      pitch: "Answers IT-support questions strictly from past tickets and docs (including PDFs), cites sources, and says \"I don't know\" instead of guessing.",
      skills: ["Chunking", "OpenAI + open-source embeddings", "Chroma / FAISS / Qdrant", "Hybrid search + reranking", "Retrieval metrics"] },
    { id: "P3", week: "W4", domain: "Auto", name: "Multi-Agent EV Road-Trip Planner",
      pitch: "Orchestrator, search, itinerary and synthesizer agents plan an electric-vehicle road trip, with charging stops and range limits.",
      skills: ["LangGraph state and routing", "Parallel sub-agents", "Web search tools", "Checkpointers", "Context engineering"] },
    { id: "P4", week: "W5", domain: "Auto", name: "Voice Auto-Parts Ordering Assistant",
      pitch: "Talk to it, or show it a photo of a part. It finds the match, builds the order over several turns, and pauses for human approval before checkout.",
      skills: ["Speech-to-text", "Text-to-speech", "Vision input", "Human-in-the-loop interrupts", "Subgraphs"] },
    { id: "P5", week: "W6", domain: "Real estate", name: "Home-Purchase Negotiation Simulator",
      pitch: "Buyer and seller agents negotiate through typed messages over MCP tools and the A2A protocol. It starts as a naive build and ends as a robust state machine.",
      skills: ["Pydantic message schemas", "Finite-state machines", "MCP / FastMCP", "Google ADK", "A2A"] },
    { id: "P6", week: "W7", domain: "High tech", name: "SaaS Customer-Review Insights Dashboard",
      pitch: "Ingests reviews and product data, summarizes them with sentiment scores, and recommends the top-N product fixes on a dashboard.",
      skills: ["Hybrid RAG + REST APIs", "OAuth, rate limits, caching", "pandas scoring", "Streamlit / Gradio"] },
    { id: "P7", week: "W8", domain: "FinTech", name: "Production-Ready FinTech Support Agent",
      pitch: "A supervisor agent plus specialist agents for banking support, with PII redaction, prompt-injection defenses, guardrails, tracing, evaluation metrics and a cost dashboard.",
      skills: ["Tracing", "DeepEval", "Guardrails", "PII redaction", "OWASP LLM Top 10", "Cost tracking"] },
    { id: "P8", week: "W9", domain: "Health", name: "Fine-Tuned Healthcare Q&A Model",
      pitch: "A small open model fine-tuned with QLoRA on healthcare Q&A, evaluated side by side against the base model, and published to the Hugging Face Hub.",
      skills: ["Prompting vs RAG vs fine-tuning", "QLoRA / PEFT", "TRL", "4-bit quantization", "Model evaluation"] },
    { id: "P9", week: "W10–11", domain: "Your choice", name: "AI Engineering Capstone",
      pitch: "Your own end-to-end agentic system. Options: a personal-finance assistant, call-center quality analytics, an IT & HR service desk, a research-driven content studio, or your own idea.",
      skills: ["Everything from W1–W9", "Multi-provider model strategy", "LLMOps", "CI evals"] },
    { id: "P10", week: "W13–17", domain: "Insurance or health", name: "FDE Capstone: Claims or Prior-Authorization Copilot",
      pitch: "A full customer engagement for a regional auto insurer (claims triage) or a hospital network (prior authorization): discovery, statement of work, then a multi-agent system that reads documents and photos, drafts decisions with citations, routes edge cases to humans, and gets deployed and handed over.",
      skills: ["Customer discovery", "SoW + pricing", "OpenAI Agents SDK", "Bedrock AgentCore", "Document AI", "Multi-tenant MCP + RBAC", "Evals as a CI gate", "Runbook + handover"] }
  ];

  /* ---------- Program weeks (28) ---------- */
  const weeks = [
    /* ===== Phase 0: Foundations ===== */
    { id: "0A", phase: "p0", rhythm: "learn", title: "Python for Real Applications I",
      goal: "Go from interview-style Python to project Python: environments, packages, files, bad data, configuration, logging, git.",
      learn: [
        "Terminal fluency; virtual environments and pip",
        "Project layout: packages, modules, imports, __main__, python -m",
        "Files with pathlib; CSV and JSON; converting and validating text",
        "Exceptions: catch, record, continue",
        "Config and secrets: environment variables and .env files",
        "Logging instead of print; command-line tools with argparse",
        "git and GitHub: commits, .gitignore, pushing"
      ],
      tools: ["Python 3", "VS Code", "venv / pip", "git + GitHub CLI", "python-dotenv"],
      links: ["pyTutorial", "pyVenv", "vscodePy", "gitBook", "dotenv"],
      weekend: "Build the Lead Intake CLI: validate a CSV of mortgage leads, write clean JSON and an error report, and ship it to GitHub.",
      project: null },
    { id: "0B", phase: "p0", rhythm: "learn", title: "Python for Real Applications II: APIs, Data & SQL",
      goal: "Talk to web APIs, validate data, store it in a database, and test it: the habits every agent project relies on.",
      learn: [
        "HTTP explained: requests, status codes, headers, JSON; httpx with timeouts and retries",
        "Type hints and Pydantic models for validation",
        "async / await: running many API calls at once",
        "pytest: unit tests, fixtures, testing error paths",
        "SQL basics with SQLite: tables, SELECT, JOIN, parameters (and why SQL injection happens)",
        "pandas essentials: load, filter, group, summarize",
        "git teamwork: branches, pull requests, code review"
      ],
      tools: ["httpx", "Pydantic", "asyncio", "pytest", "SQLite", "pandas"],
      links: ["httpx", "pydantic", "pytest", "sqlite", "sqlbolt", "pandas", "ghPR"],
      weekend: "Upgrade the Lead Intake CLI: Pydantic models, a SQLite store, enrichment from a public API, and tests, merged through a pull request.",
      project: null },
    { id: "0C", phase: "p0", rhythm: "learn", title: "How LLMs Actually Work",
      goal: "Build a working mental model of LLMs, and learn to call, compare and budget three providers' APIs.",
      learn: [
        "Next-token prediction; tokens and tokenizers; context windows",
        "Transformers and attention, intuitively (no heavy math)",
        "Temperature, top-p, determinism; why models hallucinate",
        "Embeddings as meaning-vectors; cosine similarity",
        "Calling OpenAI, Claude and Gemini APIs; streaming; rate limits and retries",
        "Cost and latency math: tokens → dollars → seconds",
        "Prompting fundamentals; a first look at prompt injection"
      ],
      tools: ["OpenAI API", "Claude API", "Gemini API", "tiktoken", "async SDK clients"],
      links: ["vLLMBrief", "vKarpathyIntro", "vKarpathyDeep", "v3b1bGPT", "v3b1bAttn", "trExplainer", "tokenizer", "sampling", "oaiHalluc", "pAttention", "openai", "claudeApi", "gemini", "claudePrompt", "owasp"],
      weekend: "Build a Model Comparison Bench: run the same prompts across providers and report quality, latency, tokens and cost.",
      project: null },

    /* ===== Phase 1: AI Engineering ===== */
    { id: "W1", phase: "p1", rhythm: "learn", title: "Agentic AI Foundations",
      goal: "Understand what an agent really is, and build one by hand with no framework.",
      learn: [
        "From rules to LLMs to agents; workflows vs autonomous agents: when to use each",
        "The agent equation: (prompt + tools + memory) × model",
        "The ReAct loop: thought → action → observation → repeat",
        "Design patterns: reflection, routing, tool use, planning, multi-agent",
        "Prompting: zero-shot, few-shot, chain-of-thought",
        "Function calling and structured JSON output",
        "Short-term vs long-term memory"
      ],
      tools: ["OpenAI Responses API", "Pydantic", "SQLite", "pytest"],
      links: ["anthAgents", "vBuildAgents", "oaiTools", "oaiStruct", "anthTools", "react", "pCoT", "pReflexion", "wengAgents", "oaiAgentGuide"],
      weekend: "Build P1: the mortgage lead qualifier agent (it reads the database you built in 0B).",
      project: "P1" },
    { id: "W2", phase: "p1", rhythm: "learn", title: "RAG-Powered Knowledge Agents I",
      goal: "Make a model answer from your documents, not from its memory.",
      learn: [
        "Why RAG: hallucinations and knowledge cutoffs",
        "The pipeline: load → parse → chunk → embed → store → retrieve → generate",
        "Parsing real documents: PDFs, tables, messy text",
        "Chunking strategies and their trade-offs",
        "Embeddings: OpenAI vs open-source (BGE via FastEmbed)",
        "Vector stores: Chroma, FAISS, Qdrant",
        "Grounded answers: citations checked in code, and \"I don't know\"",
        "The same pipeline in LangChain (retriever → prompt → model → parser)"
      ],
      tools: ["pypdf", "OpenAI embeddings", "FastEmbed / BGE", "Chroma", "FAISS", "Qdrant", "LangChain"],
      links: ["pRAG", "ragScratch", "chunking", "oaiEmbed", "fastembed", "bge", "chroma", "faiss", "qdrant", "langchain"],
      weekend: "Build the P2 core: ingest tickets and PDFs, answer with citations.",
      project: "P2" },
    { id: "W3", phase: "p1", rhythm: "learn", title: "RAG-Powered Knowledge Agents II",
      goal: "Measure your RAG system, make it better, then make it agentic.",
      learn: [
        "Keyword search (BM25), hybrid search and reranking",
        "Contextual retrieval; the lost-in-the-middle effect",
        "LlamaIndex indexing approaches compared",
        "Retrieval metrics: Precision@K, Recall@K, F1@K",
        "Generation metrics: groundedness, completeness, relevance",
        "Evaluation statistics: how many test cases, and is a change real?",
        "Multi-turn RAG; agentic RAG; pgvector for Postgres shops"
      ],
      tools: ["LlamaIndex", "rank-bm25", "Chroma", "pgvector"],
      links: ["bm25", "anthContextual", "pLostMiddle", "llamaindex", "pgvector", "hamelEvals"],
      weekend: "Finish P2: hybrid search, evaluation report with real numbers, multi-turn chat, demo.",
      project: "P2" },
    { id: "W4", phase: "p1", rhythm: "learn", title: "Multi-Agent Systems (Planner–Executor–Critic)",
      goal: "Split one overloaded agent into a team with clear roles.",
      learn: [
        "Where single agents break down",
        "Roles: orchestrator, search, planner, synthesizer, critic",
        "LangGraph: state, nodes, edges, conditional routing",
        "Persistence: checkpointers and memory store",
        "Parallel sub-agents",
        "Context engineering: what each agent sees"
      ],
      tools: ["LangGraph", "LangChain", "Tavily", "SerpAPI"],
      links: ["langgraph", "anthContext", "tavily", "serpapi", "vBuildAgents"],
      weekend: "Build P3: the multi-agent EV road-trip planner.",
      project: "P3" },
    { id: "W5", phase: "p1", rhythm: "learn", title: "Conversational & Multimodal Agents",
      goal: "Add voice and vision, and a human who can approve what the agent does.",
      learn: [
        "Voice architectures: chained STT → LLM → TTS vs realtime speech-to-speech",
        "Vision input: images, screenshots, photos of documents",
        "LangGraph subgraphs for reusable parts",
        "Stateless vs stateful persistence",
        "Human-in-the-loop with interrupts: pause, review, approve, resume",
        "Parallel dispatch with Send() and a synthesizer"
      ],
      tools: ["Speech-to-text", "Text-to-speech", "Vision models", "LangGraph interrupts"],
      links: ["oaiSTT", "oaiTTS", "oaiVision", "lgInterrupt", "langgraph"],
      weekend: "Build P4: the voice and vision auto-parts assistant.",
      project: "P4" },
    { id: "W6", phase: "p1", rhythm: "learn", title: "Agent Communication Protocols (MCP, A2A, ACP)",
      goal: "Make agents talk through contracts, not free text.",
      learn: [
        "Why naive agent-to-agent chat fails",
        "Finite-state machines: explicit terminal states, validated transitions",
        "Model Context Protocol: tools as a standard interface; FastMCP servers",
        "Designing good tools for agents; per-agent tool access control",
        "Google ADK agent lifecycle",
        "A2A: agent cards, JSON-RPC over HTTP; ACP and why it merged into A2A"
      ],
      tools: ["MCP / FastMCP", "Google ADK", "A2A", "LangGraph"],
      links: ["mcp", "fastmcp", "anthTools", "adk", "a2a", "acp"],
      weekend: "Build P5: the home-purchase negotiation simulator.",
      project: "P5" },
    { id: "W7", phase: "p1", rhythm: "learn", title: "Domain-Specific Vertical Agents",
      goal: "Combine RAG with live APIs and numbers, and put it in front of a user.",
      learn: [
        "Vertical patterns: finance, health, SaaS",
        "REST APIs for agents: OAuth 2.0, rate limits, caching, retries",
        "Hybrid RAG + API workflows; structured JSON outputs",
        "Extractive vs abstractive summarization",
        "Sentiment scores and top-N recommendations: LLM output combined with math",
        "Dashboards with Streamlit (and when Gradio fits better)"
      ],
      tools: ["LangChain", "httpx", "pandas", "Streamlit", "Gradio"],
      links: ["streamlit", "gradio", "langchain", "yanPatterns"],
      weekend: "Build P6: the SaaS customer-review insights dashboard.",
      project: "P6" },
    { id: "W8", phase: "p1", rhythm: "learn", title: "Observability, Evaluation & Safety",
      goal: "Prove your agent works, keep it safe, and know what it costs.",
      learn: [
        "Traces, runs and spans: reading an agent trace",
        "Evaluation datasets from real traces; LLM-as-judge and its biases",
        "DeepEval metrics: faithfulness, relevancy, hallucination; custom criteria",
        "OWASP Top 10 for LLM apps; prompt injection attacks and defenses",
        "Output guardrails; PII detection and redaction",
        "Token and cost logging; model routing, semantic caching, batch jobs"
      ],
      tools: ["LangSmith", "DeepEval", "Guardrails AI", "Presidio", "tiktoken"],
      links: ["langsmith", "deepeval", "owasp", "willison", "guardrails", "presidio", "oaiBatch", "vEvals"],
      weekend: "Build P7: the production-ready FinTech support agent, including a red-team test set.",
      project: "P7" },
    { id: "W9", phase: "p1", rhythm: "learn", title: "Fine-Tuning & Domain Adaptation",
      goal: "Know when fine-tuning is the right call, and do it once properly.",
      learn: [
        "Decision ladder: prompting → RAG → fine-tuning, and when to move up",
        "Full fine-tuning vs PEFT: LoRA, QLoRA, adapters",
        "Building a dataset in chat-messages format",
        "4-bit quantization; training on a free GPU",
        "Evaluating base vs tuned models; publishing adapters"
      ],
      tools: ["Transformers", "PEFT", "TRL", "bitsandbytes", "HF Hub", "Colab"],
      links: ["pLoRA", "pQLoRA", "peft", "trl", "transformers", "bnb", "hfHub", "colab"],
      weekend: "Build P8: the fine-tuned healthcare Q&A model.",
      project: "P8" },
    { id: "W10", phase: "p1", rhythm: "learn", title: "AI Capstone I + LLMOps / AgentOps",
      goal: "Choose and scope your capstone like an owner, with an operations plan from day one.",
      learn: [
        "LLMOps / AgentOps: prompt and model versioning, fallbacks, regression tests",
        "Evals in CI with GitHub Actions",
        "Problem definition and measurable success metrics",
        "Architecture and trade-offs write-up",
        "Multi-provider model strategy (OpenAI / Claude / Gemini) by task",
        "Wiring retrieval, APIs, orchestration, evals and guardrails together"
      ],
      tools: ["LangGraph", "LangSmith", "GitHub Actions", "Streamlit"],
      links: ["huyenProd", "ghActions", "langsmith", "anthAgents"],
      weekend: "Build P9 part 1: working end-to-end skeleton plus eval harness in CI.",
      project: "P9" },
    { id: "B1", phase: "pb", rhythm: null, title: "Buffer week",
      goal: "Catch up, give the capstone extra time, or rest.",
      learn: [], tools: [], links: [], weekend: "Optional.", project: null },
    { id: "W11", phase: "p1", rhythm: "learn", title: "AI Capstone II",
      goal: "Harden your capstone and present it the way enterprise AI systems get reviewed.",
      learn: [
        "Failure testing and architectural justification",
        "Operational readiness: observability, cost monitoring, safety gates",
        "Enforcing constraints: reliability, latency, cost",
        "Presenting a system: the architecture review"
      ],
      tools: ["LangSmith", "DeepEval", "Streamlit"],
      links: ["langsmith", "deepeval", "hamelEvals"],
      weekend: "Ship P9 with a recorded architecture-review presentation.",
      project: "P9" },

    /* ===== Phase 2 ===== */
    { id: "W12", phase: "p2", rhythm: "learn", title: "AI-Assisted Coding & Deployment Foundations",
      goal: "Build faster with an AI coding assistant, and learn to package and ship services.",
      learn: [
        "What interviewers test in AI-assisted coding rounds",
        "An explore → plan → implement → verify → commit workflow with Claude Code",
        "Reviewing AI-written code critically",
        "FastAPI services; Docker images and containers",
        "CI/CD with GitHub Actions: test, build, deploy",
        "Kubernetes concepts: pods, deployments, services (enough to talk to platform teams)"
      ],
      tools: ["Claude Code", "FastAPI", "Docker", "GitHub Actions", "Kubernetes (concepts)"],
      links: ["claudeCode", "fastapi", "dockerPy", "ghActions", "k8s"],
      weekend: "With an AI assistant, wrap P7 in a FastAPI service, containerize it, and add a CI pipeline that runs tests and evals.",
      project: null },

    /* ===== Phase 3 ===== */
    { id: "W13", phase: "p3", rhythm: "fde", title: "Customer Discovery & Scoping",
      goal: "Start the FDE capstone: learn what the customer really needs before writing code.",
      learn: [
        "The FDE role vs SWE, solutions architect, ML engineer",
        "The engagement lifecycle: scope → build → deploy → operate",
        "Running a discovery workshop; stakeholder map and RACI",
        "One-page problem brief with measurable success criteria",
        "Stack-fit discovery: customer cloud, identity, data residency",
        "Decision logs and design docs"
      ],
      tools: ["Discovery frameworks", "Decision log"],
      links: ["fdeRole", "anthAgents"],
      weekend: "Capstone: problem brief, stakeholder map, first decisions logged.",
      project: "P10" },
    { id: "W14", phase: "p3", rhythm: "fde", title: "Statement of Work, Pricing & Solution Architecture",
      goal: "Turn discovery into a contract and an architecture you can defend.",
      learn: [
        "Estimating AI work: milestones and risk buffers",
        "Writing a statement of work with measurable acceptance",
        "Pricing models: time & materials with a cap, fixed-price milestones, outcome-based",
        "Reference architecture on AWS; stack-choice decision matrix",
        "UI choices: Streamlit, Gradio, React",
        "Handling procurement questions"
      ],
      tools: ["AWS reference architecture", "Decision matrix"],
      links: ["agentcore", "agentsSdk"],
      weekend: "Capstone: statement of work, pricing, architecture diagram.",
      project: "P10" },
    { id: "W15", phase: "p3", rhythm: "fde", title: "Building Production Agents on AWS",
      goal: "Build the capstone agents on the production stack.",
      learn: [
        "AWS fundamentals: IAM, VPC, regions, Secrets Manager",
        "Infrastructure as code with AWS CDK",
        "OpenAI Agents SDK: agents, handoffs, guardrails, sessions",
        "Deploying to Amazon Bedrock AgentCore",
        "Document AI: OCR and vision for claims files or medical records",
        "RAG at scale on OpenSearch; multi-tenant RAG; cost disciplines"
      ],
      tools: ["OpenAI Agents SDK", "Bedrock AgentCore", "AWS CDK", "Textract", "OpenSearch", "CloudWatch"],
      links: ["iam", "vpc", "cdk", "agentsSdk", "agentcore", "textract", "opensearch"],
      weekend: "Capstone: document-reading agents deployed on AgentCore.",
      project: "P10" },
    { id: "W16", phase: "p3", rhythm: "fde", title: "APIs, MCP Servers & Access Control",
      goal: "Wire the agent safely into messy enterprise systems.",
      learn: [
        "APIs as agent tools: FastAPI / Lambda, OpenAPI, idempotency keys, error envelopes",
        "Queues and background jobs for slow work",
        "Hardened MCP server: per-tenant scoping, role-based access at the tool boundary, audit logs, kill switch",
        "MCP clients inside the Agents SDK",
        "Auth patterns: API keys, OAuth 2.0, workload identity, passing user context"
      ],
      tools: ["FastAPI", "AWS Lambda", "FastMCP", "IAM Identity Center / Cognito"],
      links: ["fastapi", "lambda", "fastmcp", "mcp", "idc", "cognito"],
      weekend: "Capstone: multi-tenant MCP server with RBAC and a full audit log.",
      project: "P10" },
    { id: "W17", phase: "p3", rhythm: "fde", title: "Evals, Observability & Handover",
      goal: "Prove it, govern it, hand it over, and show you can adapt to another stack.",
      learn: [
        "Data governance: private networking, residency, PII, tenant isolation",
        "Compliance literacy: SOC 2, HIPAA, ISO 27001, GDPR",
        "An eval suite as a CI deploy gate: golden sets, LLM-as-judge, regression",
        "Observability on CloudWatch + LangSmith; incident drill and root-cause analysis",
        "Handover: runbook, on-call, escalation, SLAs",
        "Stack portability: port one agent to Claude Agent SDK or Google ADK; cloud equivalents"
      ],
      tools: ["Bedrock Evaluations", "LangSmith", "CloudWatch", "Claude Agent SDK", "Google ADK"],
      links: ["bedrockEval", "langsmith", "cloudwatch", "claudeAgentSdk", "adk", "azureFoundry", "gcpAgents"],
      weekend: "Ship the capstone: eval gate, incident report, runbook, handover pack, plus the stack-port write-up.",
      project: "P10" },
    { id: "B2", phase: "pb", rhythm: null, title: "Buffer week",
      goal: "Polish the FDE capstone and portfolio before interview prep.",
      learn: [], tools: [], links: [], weekend: "Optional.", project: null },

    /* ===== Phase 4 ===== */
    { id: "W18", phase: "p4", rhythm: "interview", title: "Agentic Research Systems + Resume",
      goal: "Design a research agent in an interview, trade-offs first. Rebuild your resume around your projects.",
      learn: [
        "ReAct vs plan-and-execute vs hybrid",
        "Tool reliability: failures, stale data, circuit breakers",
        "Source verification and citation grounding",
        "Career: an FDE-focused resume built from your 10 projects"
      ],
      tools: [], links: ["react", "pReflexion", "anthAgents"],
      dsa: "Sorting & complexity",
      weekend: "Mock loop + design write-up; resume v1.", project: null },
    { id: "W19", phase: "p4", rhythm: "interview", title: "Agentic Text-to-SQL + LinkedIn",
      goal: "Design reliable data-reasoning systems. Rework your LinkedIn profile.",
      learn: [
        "Schema retrieval → generation → execution → refinement",
        "Guardrails against dangerous queries",
        "Schema summarization at 1,000+ tables; execution-based evaluation",
        "Career: a LinkedIn profile and posts about your projects"
      ],
      tools: ["SQLite / Postgres"], links: ["sqlbolt", "langgraph"],
      dsa: "Recursion & backtracking",
      weekend: "Mock loop + design write-up; LinkedIn update.", project: null },
    { id: "W20", phase: "p4", rhythm: "interview", title: "Multi-Agent Coordination + System Design Basics",
      goal: "Design multi-agent systems that don't loop forever or cost a fortune.",
      learn: [
        "Centralized vs decentralized coordination; shared memory",
        "Disagreement, cascading failures, infinite loops",
        "System-design basics: caching, queues, idempotency, back-pressure",
        "Cross-agent observability; stress testing; cost control"
      ],
      tools: [], links: ["langgraph", "anthContext"],
      dsa: "Trees & BSTs",
      weekend: "Mock loop + design write-up.", project: null },
    { id: "W21", phase: "p4", rhythm: "interview", title: "Self-Improving Agents + Portfolio Polish",
      goal: "Design generate → test → refine loops that stop safely. Make your GitHub hiring-ready.",
      learn: [
        "Bug detection → fix → verification loops",
        "Tests as ground truth; ranking candidate fixes",
        "Sandboxing, rollback, retry-depth limits; accuracy vs cost",
        "Career: GitHub profile, pinned repos, demo videos"
      ],
      tools: [], links: ["pReflexion"],
      dsa: "Graphs",
      weekend: "Mock loop + design write-up; portfolio polish.", project: null },
    { id: "W22", phase: "p4", rhythm: "interview", title: "Decomposition & Case Interviews",
      goal: "Master the FDE case round and the AI pair-coding round.",
      learn: [
        "The case round: clarify → decompose → scope a 4-week plan",
        "10+ case prompts across industries",
        "AI-assisted pair-coding round",
        "AI system-design review under time pressure"
      ],
      tools: ["Claude Code"], links: ["claudeCode", "fdeRole"],
      dsa: "Dynamic programming",
      weekend: "Full case-round mock loop.", project: null },
    { id: "W23", phase: "p4", rhythm: "interview", title: "Behavioral, Security Interviews & Offers",
      goal: "Tell your stories well, get through the security questionnaire, and negotiate the offer.",
      learn: [
        "STAR+ for customer-facing roles; building a story bank",
        "Delivering bad news; explaining trade-offs to executives",
        "Procurement and security simulation; vendor-risk questions",
        "Offer negotiation; a first-90-days plan"
      ],
      tools: [], links: ["owasp"],
      dsa: "Mixed review",
      weekend: "Final full mock loop; launch your portfolio and your post about the journey.", project: null }
  ];

  /* ---------- Tech stack by category ---------- */
  const stack = [
    { cat: "Language & dev tools", items: ["pyTutorial", "vscodePy", "gitBook", "colab", "claudeCode"] },
    { cat: "Data", items: ["pandas", "sqlite", "pgvector", "httpx", "pydantic"] },
    { cat: "Model providers", items: ["openai", "claudeApi", "gemini"] },
    { cat: "Agent frameworks", items: ["langchain", "langgraph", "llamaindex", "adk", "agentsSdk", "claudeAgentSdk"] },
    { cat: "Retrieval", items: ["chroma", "faiss", "qdrant", "fastembed", "oaiEmbed"] },
    { cat: "Evaluation & safety", items: ["langsmith", "deepeval", "guardrails", "presidio", "owasp"] },
    { cat: "Voice, vision & protocols", items: ["oaiSTT", "oaiTTS", "oaiVision", "mcp", "fastmcp", "a2a"] },
    { cat: "Fine-tuning", items: ["transformers", "peft", "trl", "bnb", "hfHub"] },
    { cat: "Apps & UI", items: ["streamlit", "gradio", "fastapi"] },
    { cat: "Cloud & deployment", items: ["agentcore", "iam", "cdk", "opensearch", "cloudwatch", "textract", "docker", "ghActions", "k8s"] }
  ];

  /* Equivalent services across clouds: FDEs build in the customer's cloud */
  const cloudMap = [
    ["Agent runtime", "Amazon Bedrock AgentCore", "Microsoft Foundry Agent Service", "Google Cloud agent platform (formerly Vertex AI)"],
    ["Search / vector index", "Amazon OpenSearch Service", "Azure AI Search", "Vertex AI Vector Search"],
    ["Identity", "IAM Identity Center / Cognito", "Microsoft Entra ID", "Cloud Identity / IAM"],
    ["Monitoring & logs", "CloudWatch / Logs Insights", "Application Insights / Log Analytics", "Cloud Monitoring / Logging"],
    ["Containers", "ECS / App Runner / EKS", "Container Apps / AKS", "Cloud Run / GKE"],
    ["Document OCR", "Amazon Textract", "Azure Document Intelligence", "Document AI"]
  ];

  /* ---------- Setup checklist ---------- */
  const setup = [
    { id: "acc-openai", t: "OpenAI API account with a monthly spend limit", link: "openai" },
    { id: "acc-claude", t: "Claude API account with a spend limit (from Week 0C)", link: "claudeApi" },
    { id: "acc-gemini", t: "Gemini API key, free tier (from Week 0C)", link: "gemini" },
    { id: "acc-aws", t: "AWS account with MFA and a budget alert", link: "budgets" },
    { id: "acc-github", t: "GitHub account + GitHub CLI logged in", link: "gitBook" },
    { id: "acc-langsmith", t: "LangSmith account (free tier)", link: "langsmith" },
    { id: "acc-hf", t: "Hugging Face account", link: "hfHub" },
    { id: "acc-tavily", t: "Tavily API key (free tier)", link: "tavily" },
    { id: "acc-colab", t: "Google Colab access checked", link: "colab" },
    { id: "acc-python", t: "Python 3.11+ and VS Code installed", link: "vscodePy" }
  ];

  /* ---------- Portfolio standard (every project) ---------- */
  const portfolio = [
    { id: "readme", t: "README.md: problem, architecture diagram, how to run" },
    { id: "decisions", t: "Design decisions: why each approach, and what you rejected" },
    { id: "evals", t: "Evals with real numbers: accuracy, groundedness, latency, cost per request" },
    { id: "tests", t: "Automated tests that pass" },
    { id: "demo", t: "2-minute demo video or GIF" },
    { id: "clean", t: "No secrets in git; .env.example provided" }
  ];

  const principles = [
    { t: "No surprises", d: "Nothing appears in a weekend project that you haven't learned and practiced by hand earlier that week. Every lesson opens with a coverage map that proves it." },
    { t: "Hands on first", d: "Through Week 11 you type every line; AI assistants may explain and review, but not write your code. AI coding tools arrive in Week 12, once you can judge their output." },
    { t: "Learn, do, check, every day", d: "Each session has a short lesson or video, a hands-on exercise and a mini-quiz. The weekly quiz brings back questions from earlier weeks so they stick." },
    { t: "Stepped hints", d: "Stuck? Hints come in steps: concept → pseudocode → snippet → full solution. The full solution unlocks only after you've tried on your own." },
    { t: "Portfolio standard", d: "Each of the 10 projects ships with a README, design decisions, measured evals, tests and a demo, built to be read by hiring managers." },
    { t: "Primary sources", d: "Readings link to official docs, original papers, engineering blogs and talks. Each lesson re-checks its links before it's published." }
  ];

  return {
    L, phases, paces, rhythms, projects, weeks, stack, cloudMap, setup, portfolio, principles
  };
})();

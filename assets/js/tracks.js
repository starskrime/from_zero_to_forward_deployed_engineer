/* ==========================================================================
   Tracks: extends the core curriculum with
     Track B: Claude Certified Architect – Foundations preparation
     Track C: Enterprise FDE (the knowledge enterprise roles expect)
   plus paces, session templates, and the provider used in each project.
   Loaded right after curriculum.js on every page.
   ========================================================================== */
(function (F) {

  /* ---------- extra resources ---------- */
  Object.assign(F.L, {
    /* certification: official */
    certPage:     { k: "doc", t: "Certification page (Partner Academy)", u: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification" },
    certGuide:    { k: "doc", t: "Official exam guide (PDF)", u: "https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542750%2FClaude+Certified+Architect+%E2%80%93+Foundations+Exam+Guide.pdf" },
    certFaq:      { k: "doc", t: "Certification FAQ", u: "https://anthropic-partners.skilljar.com/page/faq-certifications" },
    certPrep:     { k: "doc", t: "Official prep course list", u: "https://anthropic-partners.skilljar.com/page/claude-certified-architect-foundations-prep-courses" },
    partners:     { k: "doc", t: "Claude Partner Network", u: "https://claude.com/partners" },
    pearson:      { k: "doc", t: "Pearson VUE: Anthropic exams", u: "https://www.pearsonvue.com/us/en/anthropic.html" },
    cApi:         { k: "tool", t: "Course: Building with the Claude API", u: "https://anthropic.skilljar.com/claude-with-the-anthropic-api" },
    cCode:        { k: "tool", t: "Course: Claude Code in Action", u: "https://anthropic.skilljar.com/claude-code-in-action" },
    cMcp:         { k: "tool", t: "Course: Introduction to Model Context Protocol", u: "https://anthropic.skilljar.com/introduction-to-model-context-protocol" },
    cMcpAdv:      { k: "tool", t: "Course: MCP Advanced Topics", u: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics" },
    cSkills:      { k: "tool", t: "Course: Introduction to agent skills", u: "https://anthropic.skilljar.com/introduction-to-agent-skills" },
    cSubagents:   { k: "tool", t: "Course: Introduction to subagents", u: "https://anthropic.skilljar.com/introduction-to-subagents" },
    /* certification: docs */
    sdkLoop:      { k: "doc", t: "Agent SDK: the agent loop", u: "https://code.claude.com/docs/en/agent-sdk/agent-loop" },
    sdkSub:       { k: "doc", t: "Agent SDK: subagents", u: "https://code.claude.com/docs/en/agent-sdk/subagents" },
    sdkHooks:     { k: "doc", t: "Agent SDK: hooks", u: "https://code.claude.com/docs/en/agent-sdk/hooks" },
    sdkSessions:  { k: "doc", t: "Agent SDK: sessions (resume, fork)", u: "https://code.claude.com/docs/en/agent-sdk/sessions" },
    ccMemory:     { k: "doc", t: "Claude Code: memory & CLAUDE.md", u: "https://code.claude.com/docs/en/memory" },
    ccSkills:     { k: "doc", t: "Claude Code: skills", u: "https://code.claude.com/docs/en/skills" },
    ccMcp:        { k: "doc", t: "Claude Code: MCP", u: "https://code.claude.com/docs/en/mcp" },
    ccSub:        { k: "doc", t: "Claude Code: sub-agents", u: "https://code.claude.com/docs/en/sub-agents" },
    ccWorkflows:  { k: "doc", t: "Claude Code: common workflows (plan mode)", u: "https://code.claude.com/docs/en/common-workflows" },
    ccHeadless:   { k: "doc", t: "Claude Code: headless mode (-p, JSON output)", u: "https://code.claude.com/docs/en/headless" },
    ccHooks:      { k: "doc", t: "Claude Code: hooks guide", u: "https://code.claude.com/docs/en/hooks-guide" },
    ccActions:    { k: "doc", t: "Claude Code: GitHub Actions", u: "https://code.claude.com/docs/en/github-actions" },
    apiTools:     { k: "doc", t: "Claude API: tool use overview", u: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" },
    apiDefTools:  { k: "doc", t: "Claude API: defining tools & tool_choice", u: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools" },
    apiStop:      { k: "doc", t: "Claude API: handling stop reasons", u: "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons" },
    apiStruct:    { k: "doc", t: "Claude API: structured outputs", u: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
    apiBatch:     { k: "doc", t: "Claude API: batch processing", u: "https://platform.claude.com/docs/en/build-with-claude/batch-processing" },
    apiPrompt:    { k: "doc", t: "Claude: prompting best practices", u: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
    apiContext:   { k: "doc", t: "Claude API: context windows", u: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
    apiHalluc:    { k: "doc", t: "Claude: reduce hallucinations", u: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations" },
    apiTests:     { k: "doc", t: "Claude: define success & develop tests", u: "https://platform.claude.com/docs/en/test-and-evaluate/develop-tests" },
    apiCaching:   { k: "doc", t: "Claude API: prompt caching (awareness)", u: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
    mcpToolsSpec: { k: "doc", t: "MCP spec: tools (isError)", u: "https://modelcontextprotocol.io/specification/2025-06-18/server/tools" },
    anthResearch: { k: "article", t: "Anthropic: How we built our multi-agent research system", u: "https://www.anthropic.com/engineering/multi-agent-research-system" },
    anthEvals:    { k: "article", t: "Anthropic: Demystifying evals for AI agents", u: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
    certCommunity:{ k: "article", t: "Unofficial: a candidate's certification study guide", u: "https://newsletter.bigtechcareers.com/p/step-by-step-guide-to-achieve-claude-certification" },

    /* enterprise FDE */
    palantirDelta:{ k: "article", t: "Palantir: Dev versus Delta", u: "https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87" },
    palantirDay:  { k: "article", t: "Palantir: A day in the life of an FDSE", u: "https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1" },
    a16zMoat:     { k: "article", t: "a16z: Trading margin for moat (services-led growth)", u: "https://a16z.com/services-led-growth/" },
    a16zDemos:    { k: "article", t: "a16z: From demos to deals", u: "https://a16z.com/insights-for-enterprise-ai-builders/" },
    svpgFde:      { k: "article", t: "SVPG: Forward Deployed Engineers", u: "https://www.svpg.com/forward-deployed-engineers/" },
    peHeats:      { k: "article", t: "Pragmatic Engineer: FDE heats up again (2026)", u: "https://blog.pragmaticengineer.com/the-pulse-forward-deployed-engineering-heats-up-again/" },
    latentFde:    { k: "article", t: "Latent Space: Forward deployed engineers (AIEWF 2026)", u: "https://www.latent.space/p/forward-deployed-engineers-aiewf" },
    vFde101:      { k: "video", t: "Talk: Forward Deployed Engineering 101 (Anthropic)", u: "https://ai.engineer/talks/KwhgfwOSToQ-forward-deployed-engineering-101" },
    tsHandbook:   { k: "doc", t: "The TypeScript Handbook", u: "https://www.typescriptlang.org/docs/handbook/intro.html" },
    tsClaude:     { k: "doc", t: "Claude TypeScript SDK", u: "https://github.com/anthropics/anthropic-sdk-typescript" },
    oaiEnterprise:{ k: "article", t: "OpenAI: AI in the Enterprise (PDF)", u: "https://cdn.openai.com/business-guides-and-resources/ai-in-the-enterprise.pdf" },
    oaiUseCases:  { k: "article", t: "OpenAI: Identifying and scaling AI use cases (PDF)", u: "https://cdn.openai.com/business-guides-and-resources/identifying-and-scaling-ai-use-cases.pdf" },
    gcStrategy:   { k: "article", t: "Google Cloud: How to build an effective AI strategy (value vs feasibility)", u: "https://cloud.google.com/transform/how-to-build-an-effective-ai-strategy" },
    nanda:        { k: "article", t: "Report coverage: the \"GenAI divide\" (why pilots fail)", u: "https://virtualizationreview.com/articles/2025/08/19/mit-report-finds-most-ai-business-investments-fail-reveals-genai-divide.aspx" },
    msGraph:      { k: "doc", t: "Microsoft Graph overview (M365, SharePoint)", u: "https://learn.microsoft.com/en-us/graph/overview" },
    msConnectors: { k: "doc", t: "Microsoft 365 Copilot connectors", u: "https://learn.microsoft.com/en-us/microsoftsearch/connectors-overview" },
    snowCortex:   { k: "doc", t: "Snowflake Cortex AI", u: "https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview" },
    sfAgents:     { k: "doc", t: "Salesforce Agentforce developer guide", u: "https://developer.salesforce.com/docs/einstein/genai/guide/get-started-agents.html" },
    snowDev:      { k: "doc", t: "ServiceNow Developer Program", u: "https://developer.servicenow.com/dev.do" },
    hamelFaq:     { k: "article", t: "Hamel Husain & Shreya Shankar: Evals FAQ", u: "https://hamel.dev/blog/posts/evals-faq/" },
    oauth:        { k: "doc", t: "OAuth 2.0 overview", u: "https://oauth.net/2/" },
    saml:         { k: "doc", t: "Okta: SAML concepts", u: "https://developer.okta.com/docs/concepts/saml/" },
    scimRfc:      { k: "doc", t: "SCIM protocol (RFC 7644)", u: "https://datatracker.ietf.org/doc/html/rfc7644" },
    scimEntra:    { k: "doc", t: "Microsoft Entra: build a SCIM endpoint", u: "https://learn.microsoft.com/en-us/entra/identity/app-provisioning/use-scim-to-provision-users-and-groups" },
    hax:          { k: "doc", t: "Microsoft HAX: guidelines for human-AI interaction", u: "https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/" },
    pair:         { k: "doc", t: "Google PAIR Guidebook", u: "https://pair.withgoogle.com/guidebook/" },
    mcpSecurity:  { k: "doc", t: "MCP security best practices", u: "https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices" },
    atlas:        { k: "doc", t: "MITRE ATLAS (AI threat matrix)", u: "https://atlas.mitre.org/" },
    otelGenai:    { k: "article", t: "OpenTelemetry: GenAI observability", u: "https://opentelemetry.io/blog/2026/genai-observability/" },
    sreSlo:       { k: "doc", t: "Google SRE book: SLIs, SLOs, SLAs", u: "https://sre.google/sre-book/service-level-objectives/" },
    sr262:        { k: "doc", t: "Federal Reserve SR 26-2 (model risk, replaces SR 11-7)", u: "https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm" },
    orrickMrm:    { k: "article", t: "Orrick: what changed in model risk guidance (2026)", u: "https://www.orrick.com/en/Insights/2026/04/Agencies-Overhaul-Model-Risk-Management-Guidance-for-Banks-Heres-What-Changed" },
    hipaa:        { k: "doc", t: "HHS: HIPAA Security Rule", u: "https://www.hhs.gov/hipaa/for-professionals/security/index.html" },
    finops:       { k: "doc", t: "FinOps Foundation: FinOps for AI", u: "https://www.finops.org/wg/finops-for-ai-overview/" },
    genaiLens:    { k: "doc", t: "AWS Well-Architected Generative AI Lens", u: "https://docs.aws.amazon.com/wellarchitected/latest/generative-ai-lens/generative-ai-lens.html" },
    soc2:         { k: "doc", t: "AICPA: SOC 2", u: "https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2" },
    iso27001:     { k: "doc", t: "ISO/IEC 27001", u: "https://www.iso.org/standard/27001" },
    iso42001:     { k: "doc", t: "ISO/IEC 42001 (AI management)", u: "https://www.iso.org/standard/42001" },
    caiq:         { k: "doc", t: "CSA Cloud Controls Matrix & CAIQ", u: "https://cloudsecurityalliance.org/research/cloud-controls-matrix" },
    anthCerts:    { k: "doc", t: "Example vendor trust page: Anthropic certifications", u: "https://privacy.claude.com/en/articles/10015870-what-certifications-has-anthropic-obtained" },
    gdpr:         { k: "doc", t: "GDPR full text", u: "https://gdpr-info.eu/" },
    bedrockPl:    { k: "doc", t: "Amazon Bedrock: VPC interface endpoints (PrivateLink)", u: "https://docs.aws.amazon.com/bedrock/latest/userguide/vpc-interface-endpoints.html" },
    azureDeploy:  { k: "doc", t: "Azure: deployment types & data residency", u: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/deployment-types" },
    nist80061:    { k: "doc", t: "NIST SP 800-61r3: incident response", u: "https://csrc.nist.gov/pubs/sp/800/61/r3/final" },
    adkar:        { k: "article", t: "Prosci ADKAR: change management", u: "https://www.prosci.com/methodology/adkar" },
    nistRmf:      { k: "doc", t: "NIST AI Risk Management Framework", u: "https://www.nist.gov/itl/ai-risk-management-framework" },
    euAiAct:      { k: "doc", t: "EU AI Act (official text)", u: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
    euOmnibus:    { k: "article", t: "EU Council: AI Act simplification adopted (2026)", u: "https://www.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/" },
    wcOmnibus:    { k: "article", t: "White & Case: EU AI Omnibus in force", u: "https://www.whitecase.com/insight-alert/eu-ai-omnibus-enters-force-amending-ai-act" },
    ivPalantir:   { k: "article", t: "Unofficial: Palantir FDE interview guide", u: "https://www.tryexponent.com/guides/palantir-forward-deployed-engineer-interview" },
    ivDecomp:     { k: "article", t: "Unofficial: the decomposition interview", u: "https://www.tryexponent.com/blog/decomposition-interview" },
    ivOpenai:     { k: "article", t: "Unofficial: OpenAI FDE interview guide", u: "https://www.tryexponent.com/guides/openai-forward-deployed-engineer-interview" },
    ivAnthropic:  { k: "article", t: "Unofficial: Anthropic FDE interview guide", u: "https://www.tryexponent.com/guides/anthropic-forward-deployed-engineer-interview" },
    ivSierra:     { k: "article", t: "Unofficial: Sierra agent engineer interview guide", u: "https://www.tryexponent.com/guides/sierra-agent-engineer-interview" },
    jobAnthropic: { k: "article", t: "Real posting: Anthropic FDE", u: "https://job-boards.greenhouse.io/anthropic/jobs/5302966008" },
    jobOpenaiHc:  { k: "article", t: "Real posting: OpenAI FDE, Healthcare", u: "https://openai.com/careers/forward-deployed-engineer-(fde)-healthcare-sf-san-francisco/" },
    jobAws:       { k: "article", t: "Real posting: AWS Sr FDE", u: "https://www.amazon.jobs/en/jobs/10517491/sr-forward-deployed-engineer-aws-forward-deployed-engineering" }
  });

  /* ---------- paces: content per program week is ~35h with all tracks on ---------- */
  F.paces = [
    { id: "fulltime", name: "Full-time", weekday: 4, weekend: 7.5, hours: 35,
      blurb: "4h on weekdays, 7.5h on weekend days. One program week per calendar week, with all three tracks." },
    { id: "intensive", name: "Intensive", weekday: 2, weekend: 6, hours: 22,
      blurb: "2h on weekdays, 6h on weekend days. With all tracks, each program week takes about 11 days." },
    { id: "steady", name: "Steady", weekday: 1.5, weekend: 4, hours: 15.5,
      blurb: "1.5h on weekdays, 4h on weekend days. Turn off optional tracks to finish sooner." },
    { id: "relaxed", name: "Relaxed", weekday: 1, weekend: 3, hours: 11,
      blurb: "1h on weekdays, 3h on weekend days. Best with only the core track." }
  ];

  F.tracks = [
    { id: "core", name: "Core build", short: "Core", optional: false, color: "blue",
      d: "Lessons, hand-coded exercises and the weekend portfolio project." },
    { id: "cert", name: "Claude Certified Architect", short: "Certification", optional: true, color: "purple",
      d: "Preparation for the Claude Certified Architect – Foundations exam, from Week 2. Before Week 2 and after the exam, these hours go to deep practice and interview drills." },
    { id: "ent", name: "Enterprise FDE", short: "Enterprise", optional: true, color: "green",
      d: "What enterprise FDE roles expect: security reviews, compliance, identity, integrations, reliability, cost, adoption and executive communication." }
  ];

  /* ---------- session templates: parts per track ---------- */
  function sessions(core) {
    const w = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return core.map((c, i) => ({
      id: c.id, day: w[i],
      parts: i < 5
        ? [{ track: "core", h: 2, what: c.what },
           { track: "cert", h: 1, what: "Certification track: today's exam skill (reading + drill)" },
           { track: "ent", h: 1, what: "Enterprise track: today's part of the weekly theme" }]
        : [{ track: "core", h: 6, what: c.what },
           i === 5 ? { track: "cert", h: 1.5, what: "Certification lab: hands-on exercise or mock-exam block" }
                   : { track: "ent", h: 1.5, what: "Enterprise case study or FDE interview practice" }]
    }));
  }
  Object.keys(F.rhythms).forEach(k => {
    const r = F.rhythms[k];
    r.sessions = sessions(r.sessions.map(s => ({ id: s.id, what: s.what })));
  });

  /* ---------- Track B: certification focus per week (from W2) ---------- */
  const certWeeks = {
    W2:  { focus: "Orientation + the Claude Messages API", tasks: ["1.1"], links: ["certGuide", "cApi", "apiStop", "apiTools"],
           note: "Read the exam guide end to end. Start the official Claude API course. Build a raw agent loop that stops on stop_reason, not on text." },
    W3:  { focus: "Prompt precision and few-shot examples", tasks: ["4.1", "4.2"], links: ["apiPrompt", "claudePrompt", "cApi"] },
    W4:  { focus: "Agentic loops and coordinator–subagent design", tasks: ["1.1", "1.2", "1.3"], links: ["sdkLoop", "sdkSub", "cSubagents", "anthResearch", "claudeAgentSdk"] },
    W5:  { focus: "Structured output with tools and schemas; validation-retry loops", tasks: ["4.3", "4.4"], links: ["apiStruct", "apiDefTools", "pydantic"] },
    W6:  { focus: "Tool design, structured MCP errors, tool distribution, tool_choice", tasks: ["2.1", "2.2", "2.3"], links: ["apiDefTools", "mcpToolsSpec", "anthTools", "cMcp"] },
    W7:  { focus: "MCP inside Claude Code; built-in tools", tasks: ["2.4", "2.5"], links: ["ccMcp", "cCode", "cMcpAdv"] },
    W8:  { focus: "Context, escalation and error propagation + Mock exam 1", tasks: ["5.1", "5.2", "5.3"], links: ["apiContext", "anthContext", "pLostMiddle"], mock: 1 },
    W9:  { focus: "Enforcement gates, handoffs and hooks", tasks: ["1.4", "1.5"], links: ["sdkHooks", "ccHooks"] },
    W10: { focus: "Task decomposition, sessions and forking; batch processing", tasks: ["1.6", "1.7", "4.5"], links: ["sdkSessions", "apiBatch", "anthAgents"] },
    W11: { focus: "Claude Code configuration: CLAUDE.md, rules, commands, skills", tasks: ["3.1", "3.2", "3.3"], links: ["ccMemory", "ccSkills", "cSkills"] },
    W12: { focus: "Plan mode, iterative refinement, CI/CD, multi-pass review + Mock exam 2", tasks: ["3.4", "3.5", "3.6", "4.6"], links: ["ccWorkflows", "ccHeadless", "ccActions", "ccSub"], mock: 2 },
    W13: { focus: "Large-codebase context, human review calibration, provenance + Scenarios 1–2", tasks: ["5.4", "5.5", "5.6"], links: ["apiHalluc", "apiTests", "anthEvals"] },
    W14: { focus: "Scenarios 3–4 + official prep exercises 1–2", tasks: [], links: ["certGuide", "anthResearch"] },
    W15: { focus: "Scenarios 5–6 + official prep exercises 3–4", tasks: [], links: ["certGuide", "ccHeadless"] },
    W16: { focus: "Distractor patterns and weak-domain drills", tasks: [], links: ["certCommunity", "certGuide"] },
    W17: { focus: "Mock exam 3 (full, timed) + final review", tasks: [], links: ["certGuide", "certFaq"], mock: 3 }
  };
  const deepWeeks = {
    "0A": "Deep practice: extra Python drills and the video of the week",
    "0B": "Deep practice: SQL drills and API exercises",
    "0C": "Deep practice: Karpathy's deep dive video, transformer visualizers and public leaderboards",
    W1:  "Deep practice: re-implement the ReAct loop a second time, from memory",
    W18: "Company formats: Anthropic-style technical use-case screen",
    W19: "Company formats: OpenAI-style one-week take-home (start)",
    W20: "Company formats: take-home (finish) and project deep dive",
    W21: "Company formats: Sierra-style build-and-present",
    W22: "Company formats: Palantir-style decomposition drills",
    W23: "Optional: look ahead to Claude Certified Architect – Professional"
  };

  /* ---------- Track C: enterprise theme per week ---------- */
  const entWeeks = {
    "0A": { theme: "The FDE role and business model", links: ["palantirDelta", "palantirDay", "a16zMoat", "fdeRole", "svpgFde", "peHeats"] },
    "0B": { theme: "TypeScript essentials I (appears in almost half of FDE postings)", links: ["tsHandbook"] },
    "0C": { theme: "The enterprise AI landscape: why most pilots fail, and how to pick use cases", links: ["oaiEnterprise", "oaiUseCases", "nanda", "a16zDemos", "gcStrategy"] },
    W1:  { theme: "TypeScript essentials II: calling Claude and OpenAI from TypeScript", links: ["tsClaude", "tsHandbook"] },
    W2:  { theme: "Enterprise data and connectors: Microsoft 365 / SharePoint, Snowflake", links: ["msGraph", "msConnectors", "snowCortex"] },
    W3:  { theme: "Evals as the acceptance contract with a customer", links: ["anthEvals", "hamelFaq", "apiTests"] },
    W4:  { theme: "Identity I: OAuth 2.0, OIDC and single sign-on (SAML)", links: ["oauth", "saml"] },
    W5:  { theme: "Human-in-the-loop and AI user experience", links: ["hax", "pair", "anthAgents"] },
    W6:  { theme: "Agent security: confused deputy, token passthrough, excessive agency", links: ["mcpSecurity", "owasp", "atlas"] },
    W7:  { theme: "Business cases and ROI: measuring the value you deliver", links: ["oaiUseCases", "a16zMoat", "nanda"] },
    W8:  { theme: "Observability and SLOs for AI systems", links: ["otelGenai", "sreSlo"] },
    W9:  { theme: "Regulated industries: banking model risk (SR 26-2) and healthcare (HIPAA)", links: ["sr262", "orrickMrm", "hipaa", "jobOpenaiHc"] },
    W10: { theme: "FinOps for AI: forecasting and controlling LLM cost", links: ["finops", "genaiLens"] },
    W11: { theme: "Executive communication and architecture reviews", links: ["svpgFde", "a16zDemos", "latentFde"] },
    W12: { theme: "Identity II: automatic user provisioning with SCIM", links: ["scimRfc", "scimEntra"] },
    W13: { theme: "Security reviews and questionnaires: SOC 2, ISO 27001 / 42001, CAIQ", links: ["soc2", "iso27001", "iso42001", "caiq", "anthCerts"] },
    W14: { theme: "Contracts and data terms: DPAs, BAAs, GDPR basics", links: ["gdpr", "hipaa"] },
    W15: { theme: "Private networking and data residency", links: ["bedrockPl", "azureDeploy", "vpc"] },
    W16: { theme: "Enterprise integration lab: Salesforce or ServiceNow developer instance", links: ["sfAgents", "snowDev"] },
    W17: { theme: "Incident response and user adoption (change management)", links: ["nist80061", "adkar"] },
    W18: { theme: "AI governance: NIST AI RMF and ISO 42001", links: ["nistRmf", "iso42001"] },
    W19: { theme: "EU AI Act (2026 timeline) and GDPR for AI systems", links: ["euAiAct", "euOmnibus", "wcOmnibus", "gdpr"] },
    W20: { theme: "How FDE interviews work at different companies", links: ["ivPalantir", "ivOpenai", "ivAnthropic", "ivSierra"] },
    W21: { theme: "Reading real job postings: map your portfolio to them", links: ["jobAnthropic", "jobOpenaiHc", "jobAws"] },
    W22: { theme: "Decomposition case bank: 10 enterprise prompts", links: ["ivDecomp", "palantirDelta"] },
    W23: { theme: "Your FDE field playbook: compile everything you've learned", links: ["vFde101", "latentFde", "peHeats"] }
  };

  F.weeks.find(w => w.id === "0A").lesson = "lessons/week-0A.html";
  F.weeks.find(w => w.id === "0B").lesson = "lessons/week-0B.html";
  F.weeks.find(w => w.id === "0C").lesson = "lessons/week-0C.html";
  F.weeks.forEach(w => {
    if (certWeeks[w.id]) w.cert = certWeeks[w.id];
    if (deepWeeks[w.id]) w.deep = deepWeeks[w.id];
    if (entWeeks[w.id]) w.ent = entWeeks[w.id];
  });
  const b2 = F.weeks.find(w => w.id === "B2");
  b2.title = "Certification exam week";
  b2.goal = "Take the Claude Certified Architect – Foundations exam, then polish the FDE capstone and portfolio.";

  /* ---------- provider used in each project (mix of OpenAI and Claude) ---------- */
  const providers = {
    P1: "OpenAI", P2: "OpenAI + open-source embeddings", P3: "Claude (via LangGraph)", P4: "OpenAI (voice + vision)",
    P5: "Claude + MCP", P6: "OpenAI", P7: "Claude Agent SDK", P8: "Open-source model (Hugging Face)",
    P9: "Multi-provider (your choice)", P10: "Claude Agent SDK on AWS Bedrock AgentCore (OpenAI Agents SDK compared)"
  };
  F.projects.forEach(p => { p.provider = providers[p.id]; });
  const p10 = F.projects.find(p => p.id === "P10");
  p10.skills = ["Customer discovery", "SoW + pricing", "Claude Agent SDK", "Bedrock AgentCore", "Document AI", "Multi-tenant MCP + RBAC", "Evals as a CI gate", "Runbook + handover"];
  const w15 = F.weeks.find(w => w.id === "W15");
  w15.learn = w15.learn.map(x => x.startsWith("OpenAI Agents SDK") ? "Claude Agent SDK and OpenAI Agents SDK compared: agents, handoffs, guardrails, sessions" : x);
  w15.tools = ["Claude Agent SDK", "OpenAI Agents SDK", "Bedrock AgentCore", "AWS CDK", "Textract", "OpenSearch"];
  w15.links = ["iam", "vpc", "cdk", "claudeAgentSdk", "agentsSdk", "agentcore", "textract", "opensearch"];
  F.phases.find(p => p.id === "p3").summary =
    "One continuous customer engagement: discovery, statement of work, build with the Claude Agent SDK on AWS Bedrock AgentCore (OpenAI Agents SDK compared), harden, hand over.";

  /* ---------- the certification itself ---------- */
  F.cert = {
    name: "Claude Certified Architect – Foundations",
    code: "CCAR-F",
    facts: [
      ["Questions", "60 multiple-choice and multiple-response"],
      ["Time", "120 minutes (about 135 minutes seat time)"],
      ["Structure", "4 scenarios drawn at random from 6"],
      ["Passing score", "720 on a 100–1,000 scale"],
      ["Delivery", "Pearson VUE, online or test center, closed book, proctored"],
      ["Price", "$125 (partner discounts may apply)"],
      ["Validity", "12 months; free renewal assessment if done on time"],
      ["Retakes", "Waits of 14, 30, then 90 days; up to 4 attempts per 12 months"],
      ["Eligibility", "Employees of Claude Partner Network organizations, registered with a company email"]
    ],
    domains: [
      { id: "D1", name: "Agentic Architecture & Orchestration", weight: 27 },
      { id: "D2", name: "Tool Design & MCP Integration", weight: 18 },
      { id: "D3", name: "Claude Code Configuration & Workflows", weight: 20 },
      { id: "D4", name: "Prompt Engineering & Structured Output", weight: 20 },
      { id: "D5", name: "Context Management & Reliability", weight: 15 }
    ],
    tasks: [
      ["1.1", "Design agentic loops that stop on stop_reason (tool_use vs end_turn), not on text or iteration caps"],
      ["1.2", "Orchestrate coordinator–subagent (hub-and-spoke) systems with isolated subagent context"],
      ["1.3", "Configure subagent invocation, explicit context passing, and parallel spawning"],
      ["1.4", "Enforce multi-step workflows with programmatic gates and structured human handoff"],
      ["1.5", "Use hooks to intercept tool calls, block policy violations and normalize data"],
      ["1.6", "Choose decomposition strategies: prompt chaining vs dynamic decomposition, per-file + integration passes"],
      ["1.7", "Manage session state: resume, fork, or start fresh with a summary"],
      ["2.1", "Write tool descriptions that drive correct selection; split or rename overlapping tools"],
      ["2.2", "Return structured MCP tool errors (isError, error category, retryable) and distinguish empty results"],
      ["2.3", "Give each agent a small, scoped toolset; configure tool_choice (auto / any / forced)"],
      ["2.4", "Integrate MCP servers: project (.mcp.json) vs user scope, environment variables, resources"],
      ["2.5", "Choose the right built-in tool: Read, Write, Edit, Bash, Grep, Glob"],
      ["3.1", "Structure CLAUDE.md across user / project / directory levels, with imports and rules"],
      ["3.2", "Create custom slash commands and skills (frontmatter, allowed tools, forked context)"],
      ["3.3", "Apply path-specific rules with glob patterns"],
      ["3.4", "Decide between plan mode and direct execution; use the Explore subagent"],
      ["3.5", "Refine iteratively: examples, test-driven iteration, the interview pattern"],
      ["3.6", "Run Claude Code in CI/CD: -p, JSON output, JSON schema, an independent reviewer"],
      ["4.1", "Write prompts with explicit criteria to cut false positives"],
      ["4.2", "Use 2–4 targeted few-shot examples for consistency"],
      ["4.3", "Enforce structured output with tool use and JSON schemas (nullable fields, 'other' / 'unclear' enums)"],
      ["4.4", "Build validation, retry and feedback loops for extraction quality"],
      ["4.5", "Design batch processing with the Message Batches API (cost, latency, custom_id, limits)"],
      ["4.6", "Design multi-instance and multi-pass review architectures"],
      ["5.1", "Preserve critical facts across long conversations; trim tool output; avoid lost-in-the-middle"],
      ["5.2", "Design escalation and ambiguity handling (sentiment and self-rated confidence are unreliable signals)"],
      ["5.3", "Propagate errors sensibly across multi-agent systems"],
      ["5.4", "Manage context in large codebases: scratchpads, subagent delegation, compaction"],
      ["5.5", "Design human review workflows with stratified sampling and calibrated confidence"],
      ["5.6", "Preserve provenance and handle uncertainty when synthesizing multiple sources"]
    ],
    scenarios: [
      ["Customer Support Resolution Agent", "D1, D2, D5"],
      ["Code Generation with Claude Code", "D3, D5"],
      ["Multi-Agent Research System", "D1, D2, D5"],
      ["Developer Productivity with Claude", "D2, D3, D1"],
      ["Claude Code for Continuous Integration", "D3, D4"],
      ["Structured Data Extraction", "D4, D5"]
    ],
    outOfScope: "Fine-tuning, model internals, API auth and billing, hosting MCP servers, embeddings and vector databases, computer use, vision, streaming, cloud-provider configuration, token counting, and prompt caching beyond knowing it exists.",
    courses: ["cApi", "cCode", "cMcp", "cSkills", "cSubagents", "cMcpAdv"],
    docs: ["certGuide", "certFaq", "certPrep", "pearson", "partners"]
  };

  F.stack.push(
    { cat: "Claude certification", items: ["cApi", "cCode", "cMcp", "cSkills", "cSubagents", "sdkLoop", "sdkHooks", "ccMemory", "ccHeadless", "apiDefTools", "apiBatch", "certGuide"] },
    { cat: "Enterprise FDE", items: ["palantirDelta", "a16zMoat", "anthEvals", "mcpSecurity", "saml", "scimRfc", "otelGenai", "sreSlo", "finops", "soc2", "caiq", "nistRmf", "euAiAct", "sr262", "adkar"] }
  );
  F.principles.splice(2, 0,
    { t: "Three tracks, one week", d: "Each program week combines the core build, Claude Architect certification prep (from Week 2), and enterprise FDE knowledge. Learners on lighter paces can switch the optional tracks off." });
  F.principles.forEach(p => {
    if (p.t === "Hands on first") p.d = "Through Week 11 you type every line of your project code; AI assistants may explain and review, but not write it. Configuring Claude Code for the certification is a separate skill, practiced in sandbox repos. AI-assisted coding starts in Week 12.";
  });
})(window.FDE);

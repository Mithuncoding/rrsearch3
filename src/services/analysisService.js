import { generateStructuredContent, SCHEMAS } from './geminiApi';

/**
 * Helper to extract most relevant sections from paper
 */
function extractRelevantSections(text, maxLength = 100000) {
  if (text.length <= maxLength) return text;
  
  // Try to extract key sections (abstract, introduction, methods, results, conclusion)
  const sections = [];
  const keywords = ['abstract', 'introduction', 'method', 'result', 'conclusion', 'discussion'];
  
  // Split by paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  // Keep paragraphs that likely contain important content
  for (const para of paragraphs) {
    const lowerPara = para.toLowerCase();
    if (keywords.some(keyword => lowerPara.includes(keyword)) || para.length > 200) {
      sections.push(para);
      if (sections.join('\n\n').length >= maxLength) break;
    }
  }
  
  const result = sections.join('\n\n');
  return result.substring(0, maxLength);
}

/**
 * Generate core analysis of a research paper
 */
export async function generateCoreAnalysis(text, persona = 'Engineer') {
  const personaInstructions = {
    Student: 'Use simple, accessible language. Explain technical concepts clearly. Avoid jargon where possible.',
    Engineer: 'Use professional technical language. Balance clarity with precision. Assume familiarity with scientific concepts.',
    Expert: 'Use advanced technical terminology. Provide deep, nuanced analysis. Assume domain expertise.'
  };

  // Extract relevant sections to reduce token count
  const relevantText = extractRelevantSections(text);

  const prompt = `You are analyzing a scientific research paper for a ${persona}.

${personaInstructions[persona]}

Paper text:
${relevantText}

Provide a comprehensive core analysis including:
1. Title and basic metadata
2. 3-5 key takeaways (most important contributions)
3. A comprehensive summary (200-300 words)
4. The problem statement this paper addresses
5. The methodology used
6. Key findings with DIRECT QUOTES from the paper as evidence

Each finding must include a verbatim quote from the paper as evidence.`;

  return generateStructuredContent(prompt, SCHEMAS.coreAnalysis, false); // Use Flash - faster!
}

/**
 * Generate advanced analysis (critique and ideation)
 */
export async function generateAdvancedAnalysis(text, coreAnalysis) {
  if (!coreAnalysis || !coreAnalysis.title) {
    throw new Error('Core analysis must be completed first');
  }
  
  const prompt = `You are conducting an advanced analysis of a scientific research paper.

Paper title: ${coreAnalysis.title}
Paper summary: ${coreAnalysis.summary}

Full paper text:
${text}

Provide:
1. STRENGTHS: 3-5 key strengths with direct quotes as evidence
2. WEAKNESSES: 3-5 limitations or areas for improvement with direct quotes as evidence
3. NOVEL HYPOTHESES: 3-4 testable hypotheses that extend from this work, each with:
   - The hypothesis statement
   - A detailed experimental design to test it
   - Expected outcomes

Be critical but fair. Ground everything in evidence from the paper.`;

  return generateStructuredContent(prompt, SCHEMAS.advancedAnalysis, false); // Use Flash - faster!
}

/**
 * Generate expertise assessment quiz
 */
export async function generateQuiz(abstract) {
  const prompt = `Based on this research paper abstract, generate a 5-question multiple choice quiz to assess the reader's expertise level.

Abstract:
${abstract}

Generate 5 questions that:
- Start easy (basic comprehension)
- Progress to medium (application)
- End difficult (analysis/synthesis)

Each question should have 4 options with exactly one correct answer.
Provide explanations for the correct answers.`;

  return generateStructuredContent(prompt, SCHEMAS.quiz, false); // Use Flash model
}

/**
 * Extract and format references
 */
export async function extractReferences(text) {
  // Look for common bibliography section markers
  const bibMarkers = ['references', 'bibliography', 'works cited', 'citations'];
  const lowerText = text.toLowerCase();
  let hasBibSection = bibMarkers.some(marker => lowerText.includes(marker));
  
  // Extract the bibliography section if found (last 30% of paper is typical)
  const bibStart = Math.floor(text.length * 0.7);
  const potentialBibSection = text.substring(bibStart);
  
  const prompt = `Extract all references/citations from this research paper's bibliography section.

${hasBibSection ? 'Bibliography section:' : 'Paper text:'}
${potentialBibSection.substring(0, 15000)}

IMPORTANT:
- Extract ONLY if there are actual citations/references present
- Return an EMPTY array if no references/bibliography section exists
- For each reference found, provide:
  1. APA format (author, year, title, journal/publisher)
  2. BibTeX format (properly formatted for LaTeX)

Look for patterns like:
- [1] Author et al. (Year). Title...
- Author, A. (Year). Title. Journal...
- Numbered or bulleted citations`;

  const result = await generateStructuredContent(prompt, SCHEMAS.references, false);
  
  // Return empty array if no references found
  return {
    references: result.references || []
  };
}

/**
 * Generate glossary of technical terms
 */
export async function generateGlossary(text, persona = 'Engineer') {
  const prompt = `Identify 10-15 key technical terms or concepts from this research paper and provide clear definitions suitable for a ${persona}.

Paper text:
${text.substring(0, 5000)}

For each term, provide a concise, context-aware definition (1-2 sentences).`;

  return generateStructuredContent(prompt, SCHEMAS.glossary, false); // Use Flash model
}

/**
 * Generate presentation slides
 */
export async function generatePresentation(coreAnalysis, advancedAnalysis) {
  const prompt = `Create a presentation outline for this research paper.

Title: ${coreAnalysis.title}
Summary: ${coreAnalysis.summary}
Problem: ${coreAnalysis.problemStatement}
Methodology: ${coreAnalysis.methodology}
Key Findings: ${coreAnalysis.keyFindings.map(f => f.finding).join('; ')}

Generate 6-8 slides with:
- Title slide
- Introduction/Problem Statement
- Methodology
- Key Results (can be multiple slides)
- Strengths & Limitations
- Conclusion/Future Work

Each slide should have a title and 3-5 bullet points of content.`;

  return generateStructuredContent(prompt, SCHEMAS.presentation, false); // Use Flash model
}

/**
 * Find related papers using search
 */
export async function findRelatedPapers(title, summary, methodology, keyFindings) {
  const findingsText = Array.isArray(keyFindings) 
    ? keyFindings.map(f => typeof f === 'string' ? f : f.finding).slice(0, 3).join('; ')
    : '';

  const prompt = `Generate comprehensive, targeted search queries to find papers related to this research. These queries will be used on Google Scholar.

PAPER DETAILS:
Title: ${title}
Summary: ${summary}
Methodology: ${methodology || 'Not specified'}
Key Findings: ${findingsText}

Generate 12-15 high-quality search queries organized into these categories:

1. SIMILAR WORK (3-4 queries): Papers on the exact same topic, problem, or domain
2. METHODOLOGY (2-3 queries): Papers using similar methods, techniques, or frameworks
3. EVOLUTION (2-3 queries): Foundational work, seminal papers, or historical development of these ideas
4. CONTRADICTORY (2-3 queries): Papers with opposing views, contradictory findings, or critiques

REQUIREMENTS:
- Each query should be specific, technical, and 5-15 words
- Use relevant academic terminology
- Include authors, years, or specific technical terms when relevant
- Queries should yield real research papers on Google Scholar
- Avoid generic terms; be specific and actionable

For each query, also provide a brief reason (15-25 words) explaining why this query is relevant.`;

  const schema = {
    type: 'object',
    properties: {
      categorizedQueries: {
        type: 'object',
        properties: {
          similar: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['query', 'reason']
            },
            minItems: 3,
            maxItems: 4
          },
          methodology: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['query', 'reason']
            },
            minItems: 2,
            maxItems: 3
          },
          evolution: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['query', 'reason']
            },
            minItems: 2,
            maxItems: 3
          },
          contradictory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['query', 'reason']
            },
            minItems: 2,
            maxItems: 3
          }
        },
        required: ['similar', 'methodology', 'evolution', 'contradictory']
      }
    },
    required: ['categorizedQueries']
  };

  const result = await generateStructuredContent(prompt, schema, false);
  
  // Add stats and flat queries array for backward compatibility
  const allQueries = [
    ...(result.categorizedQueries.similar || []),
    ...(result.categorizedQueries.methodology || []),
    ...(result.categorizedQueries.evolution || []),
    ...(result.categorizedQueries.contradictory || [])
  ];
  
  return {
    ...result,
    queries: allQueries.map(q => q.query),
    stats: {
      totalQueries: allQueries.length,
      categories: 4,
      similar: result.categorizedQueries.similar?.length || 0,
      methodology: result.categorizedQueries.methodology?.length || 0,
      evolution: result.categorizedQueries.evolution?.length || 0,
      contradictory: result.categorizedQueries.contradictory?.length || 0
    }
  };
}

/**
 * Synthesize multiple papers
 */
export async function generateMultiPaperSynthesis(papers) {
  const paperSummaries = papers.map((p, i) => 
    `Paper ${i + 1}: ${p.title}\nSummary: ${p.summary}\nKey Findings: ${p.keyFindings.map(f => f.finding).join('; ')}`
  ).join('\n\n---\n\n');

  const prompt = `Analyze and synthesize these ${papers.length} research papers:

${paperSummaries}

Provide:
1. OVERALL SYNTHESIS: A narrative weaving together the core ideas (300-400 words)
2. COMMON THEMES: Identify shared concepts, methods, or findings across papers
3. CONFLICTING FINDINGS: Highlight disagreements or contradictions between papers
4. CONCEPT EVOLUTION: How do ideas develop, refine, or challenge each other across this body of work?`;

  return generateStructuredContent(prompt, SCHEMAS.multiPaperSynthesis, false); // Use Flash - faster!
}

/**
 * Regenerate summary with custom parameters
 */
export async function regenerateSummary(text, persona, length, depth) {
  const lengthInstructions = {
    short: '100-150 words',
    medium: '200-300 words',
    long: '400-500 words'
  };

  const depthInstructions = {
    high_level: 'Focus on main ideas and conclusions only. Avoid technical details.',
    balanced: 'Balance main ideas with key technical details. Explain methods briefly.',
    technical: 'Include all technical details, mathematical formulations, and precise methodology.'
  };

  const prompt = `Generate a summary of this research paper for a ${persona}.

Length: ${lengthInstructions[length]}
Depth: ${depthInstructions[depth]}

Paper text:
${text.substring(0, 8000)}

Provide a well-structured summary that matches the requested length and depth.`;

  const schema = {
    type: 'object',
    properties: {
      summary: { type: 'string' }
    },
    required: ['summary']
  };

  return generateStructuredContent(prompt, schema, false);
}

/**
 * Explain a figure
 */
export async function explainFigure(paperContext, figureCaption, figureNumber) {
  const prompt = `Explain this figure from a research paper.

Paper context: ${paperContext}
Figure number: ${figureNumber}
Caption: ${figureCaption || 'No caption provided'}

Provide a detailed explanation (150-200 words) covering:
- What the figure shows
- How it relates to the paper's findings
- Key takeaways from this visualization
- Any important details in the figure`;

  const schema = {
    type: 'object',
    properties: {
      explanation: { type: 'string' }
    },
    required: ['explanation']
  };

  return generateStructuredContent(prompt, schema, false);
}

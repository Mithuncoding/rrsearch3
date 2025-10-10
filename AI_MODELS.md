# 🤖 PRISM AI Model Usage

## API Configuration

**API Key**: `AIzaSyDNK5X9mr8AB0wjy9D2gtvpCdQ0FUecj5Y`

---

## Models

### Gemini 2.5 Flash (Lighter Tasks)
**Model ID**: `gemini-2.5-flash`
- ⚡ **Speed**: Ultra-fast responses (1-3 seconds)
- 💰 **Cost**: Lower cost per request
- 🎯 **Use Cases**: Simple, structured tasks

### Gemini 2.5 Pro (Heavy Tasks)
**Model ID**: `gemini-2.5-pro`
- 🧠 **Intelligence**: Advanced reasoning
- 📊 **Quality**: Higher quality analysis
- 🎯 **Use Cases**: Complex analysis requiring deep understanding

---

## Task Distribution

### ⚡ Gemini 2.5 Flash (Lighter Tasks)

1. **Expertise Quiz Generation**
   - Generates 5 multiple-choice questions
   - Fast assessment of user knowledge level

2. **Reference Extraction**
   - Extracts citations from paper
   - Formats in APA and BibTeX

3. **Glossary Generation**
   - Identifies technical terms
   - Provides definitions

4. **Presentation Generation**
   - Creates slide-by-slide outline
   - Structures content for talks

5. **Related Papers Search**
   - Generates Google Scholar queries
   - Suggests related research

6. **Figure Explanations**
   - Explains specific figures
   - Quick contextual understanding

7. **Regenerate Summary**
   - Regenerates summary with different parameters
   - Fast iterations

8. **Chat Responses**
   - Interactive Q&A about the paper
   - Real-time streaming responses

9. **Document Validation**
   - Checks if uploaded file is a scientific paper
   - Quick validation

---

### 🧠 Gemini 2.5 Pro (Heavy Tasks)

1. **Core Analysis** ⭐
   - Extracts title, authors, year
   - Generates 3-5 key takeaways
   - Creates comprehensive summary
   - Identifies problem statement
   - Analyzes methodology
   - Extracts key findings with evidence quotes
   - **Most important task** - needs deep understanding

2. **Advanced Analysis (Critique)** ⭐
   - Identifies strengths with evidence
   - Identifies weaknesses with evidence
   - Critical evaluation requiring nuanced reasoning

3. **Novel Hypothesis Generation (Ideation)** ⭐
   - Creates 3-5 novel hypotheses
   - Designs experimental protocols
   - Requires creative, advanced reasoning

4. **Multi-Paper Synthesis** ⭐
   - Compares multiple papers
   - Identifies consensus and conflicts
   - Generates unified takeaways
   - Complex comparative analysis

---

## Model Usage Summary

| Task | Model | Reason |
|------|-------|--------|
| Core Analysis | **Pro** | Deep understanding of methodology & findings |
| Critique | **Pro** | Nuanced evaluation of strengths/weaknesses |
| Ideation | **Pro** | Creative hypothesis generation |
| Multi-Paper Synthesis | **Pro** | Complex comparative reasoning |
| Quiz | **Flash** | Structured Q&A generation |
| References | **Flash** | Pattern extraction |
| Glossary | **Flash** | Term identification |
| Presentation | **Flash** | Content structuring |
| Related Papers | **Flash** | Query generation |
| Figure Explanation | **Flash** | Contextual interpretation |
| Summary Regeneration | **Flash** | Text transformation |
| Chat | **Flash** | Quick responses |
| Validation | **Flash** | Document classification |

---

## Cost & Performance Optimization

### Why This Distribution?

1. **Core Analysis uses Pro** because it's the foundation of all other features
   - Requires deep understanding of scientific methodology
   - Needs to extract nuanced findings with evidence
   - One-time upfront cost for high-quality base

2. **Critique uses Pro** because critical evaluation requires:
   - Understanding of research standards
   - Ability to identify subtle flaws
   - Balanced assessment of trade-offs

3. **Ideation uses Pro** because hypothesis generation requires:
   - Creative thinking beyond the paper
   - Domain knowledge synthesis
   - Feasibility assessment

4. **Multi-Paper Synthesis uses Pro** because:
   - Comparative analysis across papers
   - Conflict resolution
   - Unified insight generation

5. **Everything else uses Flash** because:
   - Tasks are more mechanical (extraction, formatting)
   - Speed matters for user experience
   - Cost-effective for high-frequency operations

---

## API Endpoints

### Flash Model
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

### Pro Model
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent
```

---

## Token Limits

Both models support:
- **Max Output Tokens**: 8,192
- **Context Window**: Up to 1M tokens (input)

**Configuration**:
```javascript
generationConfig: {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
  responseSchema: schema
}
```

---

## Structured Output

All tasks use **JSON Schema** for structured output:
- ✅ Reliable, parseable responses
- ✅ No hallucinated formats
- ✅ Type-safe data structures
- ✅ Validation built-in

Example Schema (Core Analysis):
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "takeaways": { "type": "array", "items": { "type": "string" } },
    "summary": { "type": "string" },
    "keyFindings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "finding": { "type": "string" },
          "evidence": { "type": "string" }
        }
      }
    }
  }
}
```

---

## Error Handling

Both models include:
- ✅ Automatic retry on failure
- ✅ Error messages to user
- ✅ Fallback to cached data when available
- ✅ Timeout handling (30 seconds)

---

## Testing the Models

### Test Flash Model (Quick)
1. Upload a paper
2. Skip or complete the quiz
3. Go to "Related Papers" tab
4. Should load in ~2 seconds

### Test Pro Model (Deep)
1. Upload a paper
2. Wait for core analysis (5-8 seconds)
3. Check "Overview" tab for detailed findings
4. Verify evidence quotes are present

---

## Future Optimizations

### Potential Model Upgrades
- Use **Gemini 2.5 Flash Thinking** for ideation (when available)
- Use **Gemini 2.5 Pro Thinking** for multi-paper synthesis
- Implement **streaming** for core analysis (show progress)

### Caching Strategy
- Cache core analysis locally (localStorage)
- Reuse analysis for regeneration tasks
- Reduce redundant API calls

---

<div align="center">

### 🎯 Optimized for Speed & Quality

**Flash** for instant interactions • **Pro** for deep insights

</div>

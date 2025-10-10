# 🚀 Quick Start Guide - PRISM

## Your App is Running! 🎉

**Access Prism at:** http://localhost:3001/

---

## 🎯 First Steps

### 1. **Upload a Research Paper**
   - Drop a PDF, DOCX, or TXT file on the home page
   - Or click "Choose Files" to browse
   - Maximum file size: 50MB

### 2. **Take the Expertise Quiz (Optional)**
   - Answer 5 questions about the paper's abstract
   - Your score determines analysis complexity:
     - 80%+ → Expert level
     - 50-79% → Engineer level
     - <50% → Student level
   - Can skip to use default (Engineer)

### 3. **Explore the Analysis**
   Navigate through these tabs:
   - **Key Takeaways**: 3-5 most important contributions
   - **Overview**: Full summary, problem, methodology, findings
   - **Critique**: Strengths and weaknesses with evidence
   - **AI Ideation Lab**: Novel hypotheses and experimental designs
   - **Figures**: Visual analysis with AI explanations
   - **References**: APA and BibTeX formatted citations
   - **Related Papers**: Search queries for Google Scholar

### 4. **Chat with AI**
   - Click "Chat" button in header
   - Ask questions about any aspect of the paper
   - Attach figures to ask visual questions
   - Get streaming, context-aware responses

### 5. **Export Your Work**
   - Click "Export" → Choose format:
     - **PDF**: Professional analysis report
     - **Markdown**: Plain text for notes
     - **PowerPoint**: Presentation slides

---

## 🎨 Features to Try

### ✨ Regenerate Summaries
In the Overview tab:
- Change persona (Student/Engineer/Expert)
- Adjust length (Short/Medium/Long)
- Set depth (High-level/Balanced/Technical)
- Click "Regenerate Summary"

### 🔬 AI Ideation Lab
- See novel research hypotheses
- Each with detailed experimental design
- Extends from paper's limitations

### 🖼️ Figure Explanations
- Click any figure in Figures tab
- AI generates detailed explanation
- Understand complex visualizations

### 📚 Multi-Paper Analysis
- Upload multiple papers (2+)
- Get comparative synthesis:
  - Overall narrative
  - Common themes
  - Conflicting findings
  - Concept evolution

### 📜 Analysis History
- Click "History" in header
- Access your last 10 analyses
- One-click to reload

---

## 🛠️ Technical Details

### API Usage
- **Gemini Flash (2.0)**: Lighter tasks (quiz, glossary, references)
- **Gemini Pro (1.5)**: Heavy analysis (core analysis, critique, synthesis)
- Structured JSON output for reliability

### Privacy
- All file parsing happens in your browser
- No documents sent to servers (only extracted text to AI)
- Analysis history stored locally

### Performance
- Initial analysis: 30-60 seconds
- Non-blocking: See results as they arrive
- Streaming chat responses

---

## 🐛 Troubleshooting

### File Won't Upload
- Check file size (<50MB)
- Ensure it's PDF, DOCX, or TXT
- Must be a scientific paper (AI validates)

### Analysis Fails
- Check internet connection (API calls)
- Try with a different paper
- API might be rate-limited (wait 1 min)

### Slow Performance
- Large PDFs take longer to parse
- Complex papers need more AI processing
- First analysis is slowest (loads models)

### Figures Not Showing
- Only PDF files support figure extraction
- Some PDFs have non-extractable images
- Try a different PDF

---

## 💡 Pro Tips

1. **Use Quiz for Best Results**: Personalization dramatically improves relevance
2. **Chat with Context**: Ask specific questions like "How does Figure 3 support the hypothesis?"
3. **Compare Papers**: Upload 2-3 related papers for powerful synthesis
4. **Export Early**: Save analysis as you go (history only keeps 10)
5. **Regenerate Summaries**: Try different personas to see how complexity changes

---

## 🌐 Sample Papers to Try

For testing, search for:
- ArXiv preprints (open access)
- PubMed Central articles
- Your own research papers
- University course papers

---

## 📖 Full Documentation

See `README.md` for:
- Complete feature list
- Technology stack details
- Architecture explanation
- API configuration
- Contributing guidelines

---

## 🎓 What Makes This Special?

1. **Evidence-Based**: Every claim backed by quotes
2. **Generative**: Creates new research ideas
3. **Interactive**: Chat with your papers
4. **Multi-Modal**: Analyze text and figures together
5. **Comparative**: Synthesize multiple papers
6. **Personalized**: Adapts to your expertise
7. **Privacy-First**: Client-side processing
8. **Beautiful**: Premium UI/UX design

---

## 🚀 Next Steps

- Upload your first paper
- Take the quiz
- Explore all tabs
- Try the chat feature
- Export your analysis
- Upload multiple papers
- Check your history

---

## 📞 Need Help?

- Check the README.md
- Review the code comments
- Open an issue on GitHub
- Experiment and explore!

---

<div align="center">

### 🌈 Enjoy Using Prism!

**Transform How You Understand Research**

Built with ❤️ using React, Vite, Tailwind CSS, and Google Gemini AI

</div>

// AI API Configuration
const AI_API_KEY = 'AIzaSyBUqpBkaHfv7I2LFLScItrR6W6cqIW7zVI';

// Get API key (simple, no rotation needed with single key)
const getApiKey = () => AI_API_KEY;

const AI_FAST_MODEL = 'gemini-2.5-flash';
const AI_ADVANCED_MODEL = 'gemini-2.5-pro';
const AI_FALLBACK_MODEL = 'gemini-2.5-flash'; // Fallback model

const buildApiUrl = (model, apiKey) => 
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const FAST_API_URL = buildApiUrl(AI_FAST_MODEL, getApiKey());
const ADVANCED_API_URL = buildApiUrl(AI_ADVANCED_MODEL, getApiKey());

// Schema definitions for structured output
export const SCHEMAS = {
  coreAnalysis: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'The title of the paper' },
      authors: { type: 'array', items: { type: 'string' }, description: 'List of authors' },
      publicationYear: { type: 'string', description: 'Year of publication' },
      takeaways: {
        type: 'array',
        items: { type: 'string' },
        description: '3-5 key takeaways from the paper',
        minItems: 3,
        maxItems: 5
      },
      summary: { type: 'string', description: 'Comprehensive summary of the paper' },
      problemStatement: { type: 'string', description: 'The problem the paper addresses' },
      methodology: { type: 'string', description: 'The methods used in the research' },
      keyFindings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            finding: { type: 'string' },
            evidence: { type: 'string', description: 'Direct quote from the paper' }
          },
          required: ['finding', 'evidence']
        },
        description: 'Key findings with evidence'
      }
    },
    required: ['title', 'takeaways', 'summary', 'problemStatement', 'methodology', 'keyFindings']
  },
  
  advancedAnalysis: {
    type: 'object',
    properties: {
      strengths: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            point: { type: 'string' },
            evidence: { type: 'string' }
          },
          required: ['point', 'evidence']
        }
      },
      weaknesses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            point: { type: 'string' },
            evidence: { type: 'string' }
          },
          required: ['point', 'evidence']
        }
      },
      hypotheses: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            hypothesis: { type: 'string' },
            experimentalDesign: { type: 'string' },
            expectedOutcome: { type: 'string' }
          },
          required: ['hypothesis', 'experimentalDesign']
        }
      }
    },
    required: ['strengths', 'weaknesses', 'hypotheses']
  },
  
  quiz: {
    type: 'object',
    properties: {
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
            correctAnswer: { type: 'number', minimum: 0, maximum: 3 },
            explanation: { type: 'string' }
          },
          required: ['question', 'options', 'correctAnswer', 'explanation']
        },
        minItems: 5,
        maxItems: 5
      }
    },
    required: ['questions']
  },
  
  references: {
    type: 'object',
    properties: {
      references: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            apa: { type: 'string' },
            bibtex: { type: 'string' }
          },
          required: ['apa', 'bibtex']
        }
      }
    },
    required: ['references']
  },
  
  glossary: {
    type: 'object',
    properties: {
      terms: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            term: { type: 'string' },
            definition: { type: 'string' }
          },
          required: ['term', 'definition']
        }
      }
    },
    required: ['terms']
  },
  
  presentation: {
    type: 'object',
    properties: {
      slides: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'array', items: { type: 'string' } }
          },
          required: ['title', 'content']
        }
      }
    },
    required: ['slides']
  },
  
  multiPaperSynthesis: {
    type: 'object',
    properties: {
      overallSynthesis: { type: 'string' },
      commonThemes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            theme: { type: 'string' },
            papersDiscussing: { type: 'array', items: { type: 'string' } }
          },
          required: ['theme', 'papersDiscussing']
        }
      },
      conflictingFindings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            conflicts: { type: 'string' }
          },
          required: ['topic', 'conflicts']
        }
      },
      conceptEvolution: { type: 'string' }
    },
    required: ['overallSynthesis', 'commonThemes', 'conflictingFindings', 'conceptEvolution']
  }
};

// Helper function to truncate text to fit token limits
function truncateText(text, maxTokens = 30000) {
  // Rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  
  // Truncate and add notice
  return text.substring(0, maxChars) + '\n\n[Note: Document was truncated to fit token limits]';
}

// Generate content with structured output and retry logic
export async function generateStructuredContent(prompt, schema, useAdvancedModel = false, retries = 3) {
  // Truncate prompt if too long
  const truncatedPrompt = truncateText(prompt);
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Get fresh API key and URL for each attempt
      const model = useAdvancedModel ? AI_ADVANCED_MODEL : AI_FAST_MODEL;
      const apiKey = getApiKey();
      const apiUrl = buildApiUrl(model, apiKey);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: truncatedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096, // Reduced from 8192
            responseMimeType: 'application/json',
            responseSchema: schema
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error?.message || response.statusText;
        const errorCode = errorData.error?.code;
        
        // Check if it's a retryable error (quota/overload)
        if ((response.status === 503 || response.status === 429) && attempt < retries - 1) {
          // On quota error, try next API key immediately
          if (errorCode === 429) {
            console.warn(`⚠️ Quota exceeded, rotating to next API key... (attempt ${attempt + 1}/${retries})`);
            continue; // Try immediately with next key
          }
          
          // If Advanced model is overloaded, try Fast model as fallback
          if (useAdvancedModel && attempt === 0) {
            console.warn('⚠️ Pro model overloaded, trying Flash model as fallback...');
            return generateStructuredContent(prompt, schema, false, 1);
          }
          
          // For other errors, exponential backoff
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(`⚠️ API error, retrying in ${waitTime/1000}s... (attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        throw new Error(`AI API Error: ${errorMessage}`);
      }

      const data = await response.json();
      
      // Check if response has candidates
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates in API response');
      }
      
      const textContent = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!textContent) {
        throw new Error('No content in response');
      }

      return JSON.parse(textContent);
    } catch (error) {
      if (attempt === retries - 1) {
        console.error('Error calling AI API:', error);
        throw error;
      }
      // If not last attempt, continue to retry
    }
  }
}

// Stream content for chat with retry and rotation (optimized for speed)
export async function streamChatResponse(messages, onChunk, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Use gemini-2.5-flash explicitly for fast responses
      const apiKey = getApiKey();
      const chatModel = 'gemini-2.5-flash'; // Fast model for chat
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${chatModel}:streamGenerateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role,
            parts: [{
              text: msg.content
            }]
          })),
          generationConfig: {
            temperature: 0.7,  // Slightly lower for more focused responses
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024, // Faster responses with reasonable length
            candidateCount: 1
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: { message: errorText } };
        }
        
        const errorCode = errorData[0]?.error?.code || errorData.error?.code;
        const errorMessage = errorData[0]?.error?.message || errorData.error?.message || response.statusText;
        
        console.error('💬 Chat API Error:', errorMessage);
        
        // Retry on quota errors
        if (errorCode === 429 && attempt < retries - 1) {
          console.warn(`⚠️ Chat quota exceeded, retrying... (attempt ${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
          continue;
        }
        
        throw new Error(`Chat Error: ${errorMessage}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Gemini streaming returns JSON objects separated by newlines
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                onChunk(text);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      
      // Successfully streamed, return
      return;
      
    } catch (error) {
      console.error('Error streaming chat:', error);
      
      // If last attempt, throw error
      if (attempt === retries - 1) {
        throw error;
      }
      // Otherwise retry with next API key
    }
  }
}

// Validate if document is a scientific paper
export async function validateDocument(text) {
  const prompt = `Analyze the following text and determine if it is a scientific research paper. 
  
A scientific paper typically has:
- An abstract or introduction
- Methodology or methods section
- Results or findings
- References or citations
- Academic/formal language

Text (first 2000 characters):
${text.substring(0, 2000)}

Return your analysis in JSON format with:
- isValid: boolean (true if it's a scientific paper)
- reason: string (explanation of your decision)`;

  const schema = {
    type: 'object',
    properties: {
      isValid: { type: 'boolean' },
      reason: { type: 'string' }
    },
    required: ['isValid', 'reason']
  };

  return generateStructuredContent(prompt, schema, false);
}

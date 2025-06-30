// server/index.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios'); // NEW: Import axios for HTTP requests to Wolfram Alpha
const xml2js = require('xml2js'); // NEW: For parsing Wolfram Alpha XML response
const parser = new xml2js.Parser(); // NEW: Initialize the XML parser

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors()); // Enables CORS for all origins, allowing frontend to access
app.use(express.json()); // Parses incoming requests with JSON payloads

// Initialize Google Gemini API
// IMPORTANT: Ensure GEMINI_API_KEY is correctly set in your .env file
if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env file!');
    console.error('Please add GEMINI_API_KEY=YOUR_API_KEY_HERE to your .env file in the server directory.');
    process.exit(1); // Exit the process if the API key is missing
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model instance once
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// NEW: Store chat history for context (simple in-memory for this example)
// In a real application, this would be per-user and persistent (e.g., in a database)
const chatHistory = []; 

// IMPORTANT: Ensure WOLFRAM_ALPHA_APP_ID is correctly set in your .env file
if (!process.env.WOLFRAM_ALPHA_APP_ID) {
    console.error('Error: WOLFRAM_ALPHA_APP_ID is not set in .env file!');
    console.error('Please add WOLFRAM_ALPHA_APP_ID=YOUR_APP_ID_HERE to your .env file in the server directory.');
    process.exit(1); // Exit the process if the API key is missing
}
const WOLFRAM_ALPHA_APP_ID = process.env.WOLFRAM_ALPHA_APP_ID;


// --- API Routes ---

// 1. Root/Test Route
app.get('/', (req, res) => {
    res.send('E-Learning Backend API is running!');
});

// 2. AI Flashcard Generator API
app.post('/api/generate-flashcards', async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Please provide valid text to generate flashcards.' });
    }

    try {
        const prompt = `Based on the following text, generate a list of 5-10 concise flashcards.
        Each flashcard should have a 'question' and an 'answer'.
        Provide the output as a JSON array of objects, like this:
        [
          {"question": "Question 1?", "answer": "Answer 1."},
          {"question": "Question 2?", "answer": "Answer 2."}
        ]
        Ensure the JSON is well-formed and directly parsable without any extra conversational text.
        If you cannot generate flashcards from the text, return an empty array or a single error flashcard.

        Text to analyze:
        "${text}"`;

        console.log("Sending prompt to Gemini (Flashcards)...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textContent = response.text();

        console.log("Received response from Gemini (Flashcards raw):", textContent);

        let flashcards = [];
        try {
            const jsonMatch = textContent.match(/\[\s*{[^}]*}(?:,\s*{[^}]*})*\s*\]/s);

            if (jsonMatch && jsonMatch[0]) {
                const cleanedJsonString = jsonMatch[0];
                flashcards = JSON.parse(cleanedJsonString);
                if (!Array.isArray(flashcards) || flashcards.some(card => !card.question || !card.answer)) {
                    console.warn("Parsed JSON is not a valid flashcard array, attempting simpler parse:", flashcards);
                    flashcards = JSON.parse(textContent); // Fallback
                }
            } else {
                console.warn("No valid JSON array found by regex in Gemini response (Flashcards). Trying full parse as fallback.");
                flashcards = JSON.parse(textContent);
            }
        } catch (parseError) {
            console.error("Failed to parse JSON from Gemini response (Flashcards):", parseError);
            flashcards = [{ question: "Error generating flashcard", answer: "Could not parse AI response. Try different text." }];
        }

        res.json({ flashcards });

    } catch (error) {
        console.error('Error calling Gemini API or processing response for Flashcards:', error);
        if (error.response) {
            console.error('Gemini API error details (Flashcards):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to generate flashcards. Please check your API key and try again later.' });
    }
});

// 3. AI Book Summarizer API
app.post('/api/summarize', async (req, res) => {
    const { textToSummarize } = req.body;

    if (!textToSummarize || typeof textToSummarize !== 'string' || textToSummarize.trim() === '') {
        return res.status(400).json({ error: 'Please provide valid text to summarize.' });
    }

    try {
        const prompt = `Summarize the following text concisely. Focus on the main points and key information.
        Text to summarize:
        "${textToSummarize}"`;

        console.log("Sending prompt to Gemini (Summarize)...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        console.log("Received response from Gemini (Summarize raw):", summary);

        res.json({ summary });

    } catch (error) {
        console.error('Error calling Gemini API or processing response for Summarizer:', error);
        if (error.response) {
            console.error('Gemini API error details (Summarizer):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to generate summary. Please try again later.' });
    }
});

// 4. AI Research Paper Summarizer API
app.post('/api/summarize-research-paper', async (req, res) => {
    const { textToSummarize } = req.body;

    if (!textToSummarize || typeof textToSummarize !== 'string' || textToSummarize.trim() === '') {
        return res.status(400).json({ error: 'Please provide valid text to summarize the research paper.' });
    }

    try {
        const prompt = `Summarize the following research paper text concisely.
        Focus on the abstract, introduction, methodology, key findings, and conclusions.
        Highlight the main contributions and significant results.

        Research Paper Text:
        "${textToSummarize}"`;

        console.log("Sending prompt to Gemini (Research Paper Summarizer)...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        console.log("Received response from Gemini (Research Paper Summarizer raw):", summary);

        res.json({ summary });

    } catch (error) {
        console.error('Error calling Gemini API or processing response for Research Paper Summarizer:', error);
        if (error.response) {
            console.error('Gemini API error details (Research Paper Summarizer):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to generate research paper summary. Please try again later.' });
    }
});

// 5. AI Career Recommendation System API
app.post('/api/career-recommendation', async (req, res) => {
    // Now expecting a single 'userInput' field
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
        return res.status(400).json({ error: 'Please provide your skills, technologies, or keywords for career recommendation.' });
    }

    try {
        // Updated prompt to infer interests and provide comprehensive recommendation
        const prompt = `Given the following skills, technologies, and keywords, first infer potential career interests, then provide a comprehensive career recommendation.
        Include a recommended career path, essential skill sets, technologies to learn, learning resources, job market insights (general trends), and an action plan.
        Structure your response clearly with headings, bullet points, and actionable advice.

        Here's the desired structure (use similar headings for clarity, but be concise and informative):
        
        **I. Inferred Interests**
        Based on the provided input, what specific career areas or roles might the user be interested in?

        **II. Recommended Career Path**
        A concise recommendation based on the inferred interests and input.

        **III. Essential Skill Sets**
        List core skills required for this path, including soft skills.

        **IV. Technologies to Learn**
        Specific technologies, languages, frameworks relevant to this path.

        **V. Resources for Learning**
        Suggest types of online courses, documentation, communities, or blogs/articles.

        **VI. Job Market Insights (General Trends)**
        Brief overview of industry trends, demand, and potential specializations within this path.

        **VII. Action Plan**
        Step-by-step guidance on how to get started (e.g., build portfolio, networking, internships).

        ---
        
        User Input (Skills/Keywords): "${userInput}"`;

        console.log("Sending prompt to Gemini (Career Recommendation)...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const careerRecommendation = response.text();

        console.log("Received response from Gemini (Career Recommendation raw):", careerRecommendation);

        res.json({ recommendation: careerRecommendation });

    } catch (error) {
        console.error('Error calling Gemini API or processing response for Career Recommendation:', error);
        if (error.response) {
            console.error('Gemini API error details (Career Recommendation):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to generate career recommendation. Please try again later.' });
    }
});

// 6. AI MCQ Generator API (NEW ROUTE)
app.post('/api/generate-mcqs', async (req, res) => {
    const { text, numQuestions = 5 } = req.body; // Default to 5 questions if not specified

    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Please provide valid text to generate MCQs.' });
    }

    // You can add validation for numQuestions if needed, e.g., max limit
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 10) {
        return res.status(400).json({ error: 'Number of questions must be between 1 and 10.' });
    }

    try {
        const prompt = `Based on the following text, generate exactly ${numQuestions} Multiple Choice Questions (MCQs).
        Each MCQ should have:
        - a "question" field,
        - an "options" field (an array of 4 strings),
        - an "answer" field (the correct option string).

        Provide the output as a JSON array of objects, like this:
        [
          {
            "question": "What is the capital of France?",
            "options": ["Berlin", "Madrid", "Paris", "Rome"],
            "answer": "Paris"
          },
          {
            "question": "Which planet is known as the Red Planet?",
            "options": ["Earth", "Mars", "Jupiter", "Venus"],
            "answer": "Mars"
          }
        ]
        Ensure the JSON is well-formed and directly parsable without any extra conversational text.
        Make sure the number of MCQs generated is exactly ${numQuestions}.

        Text to analyze:
        "${text}"`;

        console.log("Sending prompt to Gemini (MCQ Generator)...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textContent = response.text(); // Gemini's response will be the JSON string

        console.log("Received response from Gemini (MCQ Generator raw):", textContent);

        let mcqs = [];
        try {
            // Attempt to extract JSON from the response text, in case Gemini adds conversational filler
            const jsonMatch = textContent.match(/\[\s*{[^}]*}(?:,\s*{[^}]*})*\s*\]/s);

            if (jsonMatch && jsonMatch[0]) {
                mcqs = JSON.parse(jsonMatch[0]);
                // Basic validation for parsed MCQs
                if (!Array.isArray(mcqs) || mcqs.some(q => !q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer)) {
                   console.warn("Parsed JSON is not a valid MCQ array, attempting full parse as fallback:", mcqs);
                   mcqs = JSON.parse(textContent); // Fallback to raw parse
                }
            } else {
                console.warn("No valid JSON array found by regex in Gemini response (MCQ). Trying full parse as fallback.");
                mcqs = JSON.parse(textContent);
            }
        } catch (parseError) {
            console.error("Failed to parse JSON from Gemini response (MCQ):", parseError);
            mcqs = [{ question: "Error generating MCQs", options: [], answer: "Could not parse AI response. Try different text." }];
        }

        // Ensure we return the requested number of questions if possible
        if (mcqs.length > numQuestions) {
            mcqs = mcqs.slice(0, numQuestions);
        } else if (mcqs.length < numQuestions) {
              console.warn(`Gemini generated ${mcqs.length} MCQs, but ${numQuestions} were requested.`);
        }

        res.json({ mcqs });

    } catch (error) {
        console.error('Error calling Gemini API or processing response for MCQ Generator:', error);
        if (error.response) {
            console.error('Gemini API error details (MCQ Generator):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to generate MCQs. Please check your API key and try again later.' });
    }
});

// 7. AI Homework Helper API (NEW/UPDATED ROUTE with Wolfram Alpha Full Results & Gemini)
app.post('/api/homework-helper', async (req, res) => {
    const { problem } = req.body;

    if (!problem || typeof problem !== 'string' || problem.trim() === '') {
        return res.status(400).json({ error: 'Please provide a math or science problem.' });
    }

    try {
        let wolframAlphaResultText = '';
        let wolframAlphaSteps = null;

        // Step 1: Query Wolfram Alpha Full Results API for detailed answer and steps
        const encodedProblem = encodeURIComponent(problem);
        // Use the v2/query endpoint with 'podstate' to try and get step-by-step solutions
        // 'podstate=Result__Step-by-step solution' attempts to expand that pod
        // 'format=plaintext' for simpler text extraction, or 'output=json' if you prefer JSON (but default is XML)
        const wolframAlphaUrl = `http://api.wolframalpha.com/v2/query?input=${encodedProblem}&appid=${WOLFRAM_ALPHA_APP_ID}&output=xml&podstate=Result__Step-by-step solution&format=plaintext`; // Request plaintext for simpler parsing

        console.log("Querying Wolfram Alpha Full Results API:", wolframAlphaUrl);
        try {
            const wolframResponse = await axios.get(wolframAlphaUrl, { timeout: 15000 }); // Increase timeout for complex queries
            const xmlResponse = wolframResponse.data;
            console.log("Wolfram Alpha Raw XML Response:", xmlResponse);

            // Parse the XML response
            const resultObj = await parser.parseStringPromise(xmlResponse);
            console.log("Wolfram Alpha Parsed Object:", JSON.stringify(resultObj, null, 2));

            const queryResult = resultObj.queryresult;

            if (queryResult && queryResult.pod) {
                // Extract main result
                const resultPod = queryResult.pod.find(p => p.$.title === 'Result' || p.$.title === 'Solutions' || p.$.title === 'Value');
                if (resultPod && resultPod.subpod && resultPod.subpod[0] && resultPod.subpod[0].plaintext) {
                    wolframAlphaResultText = resultPod.subpod[0].plaintext[0];
                }

                // Extract step-by-step solution
                // Wolfram Alpha sometimes names this pod "Solution" or "Step-by-step solution"
                const stepByStepPod = queryResult.pod.find(p => p.$.title === 'Step-by-step solution' || p.$.title === 'Solution');
                if (stepByStepPod && stepByStepPod.subpod) {
                    wolframAlphaSteps = stepByStepPod.subpod.map(sp => sp.plaintext[0]).join('\n');
                }
            }

            if (!wolframAlphaResultText && !wolframAlphaSteps) {
                wolframAlphaResultText = "Wolfram Alpha could not find a direct answer or steps for this problem.";
            }

        } catch (waError) {
            console.error("Error querying Wolfram Alpha Full Results API or parsing response:", waError.message);
            wolframAlphaResultText = "Failed to get detailed answer from Wolfram Alpha. Gemini will attempt to solve and explain.";
            // If XML parsing fails, the previous error handling would just give the raw error,
            // so we set a user-friendly message.
        }

        // Step 2: Use Gemini to generate a step-by-step explanation, incorporating Wolfram Alpha's findings
        let prompt;
        if (wolframAlphaSteps) {
            // If Wolfram Alpha provided steps, use them
            prompt = `You are an AI Homework Helper. Here is a problem and its step-by-step solution from a reliable computational engine. Please present this solution clearly and pedagogically for a student. Explain each step in an easy-to-understand manner. Format the steps using clear numbering or bullet points.

            Problem: "${problem}"

            Wolfram Alpha Steps:
            ${wolframAlphaSteps}

            ---
            Your explanation:`;
        } else if (wolframAlphaResultText && !wolframAlphaResultText.includes("Wolfram Alpha could not find")) {
            // If Wolfram Alpha only provided a result, ask Gemini to explain how to get there
            prompt = `You are an AI Homework Helper. Here is a problem and its direct answer from a reliable computational engine. Please provide a detailed, step-by-step explanation for how to arrive at this answer. Format the steps using clear numbering or bullet points.

            Problem: "${problem}"
            Wolfram Alpha Answer: "${wolframAlphaResultText}"

            ---
            Your step-by-step explanation:`;
        } else {
            // Fallback: Wolfram Alpha failed or didn't find steps/answer, so Gemini solves from scratch
            prompt = `You are an AI Homework Helper. Please provide a detailed, step-by-step explanation for the following problem. Attempt to solve it yourself and explain each step clearly. Format the steps using clear numbering or bullet points.

            Problem: "${problem}"

            ---
            Your step-by-step explanation:`;
        }


        console.log("Sending prompt to Gemini (Homework Helper)...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const explanation = response.text();

        console.log("Received explanation from Gemini (Homework Helper):", explanation);

        res.json({ explanation });

    } catch (error) {
        console.error('Error in AI Homework Helper API (overall process):', error);
        if (error.response) { // Check for Gemini API specific error details
            console.error('Gemini API error details (Homework Helper):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to provide homework help. Please try again later.' });
    }
});

// 8. Contact Form Submission API
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    console.log('\n--- New Contact Form Submission ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('---------------------------------\n');

    res.status(200).json({ message: 'Message received successfully! We will get back to you shortly.' });
});

// NEW: 9. AI Chat Endpoint for CourseDetail page
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required." });
    }

    try {
        // Start a chat session with the model, providing past history
        const chat = model.startChat({
            history: chatHistory.map(entry => ({
                role: entry.role,
                parts: entry.parts
            })), // Map simple history to Gemini's expected format
            generationConfig: {
                maxOutputTokens: 120, // <--- UPDATED: Increased for more complete, concise answers
                temperature: 0.5,
            },
        });

        // Send the user's question to the AI model
        const result = await chat.sendMessage(
            `Please provide a very concise and direct answer to the following question. Ensure the answer is complete and stands on its own, suitable for a quick reference during a class.
            Question: "${question}"`
        );
        const responseText = await result.response.text();

        // Add to chat history (for future context)
        chatHistory.push({ role: "user", parts: [{ text: question }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        res.json({ answer: responseText });

    } catch (error) {
        console.error("Error asking AI:", error);
        // Log more details about the error if it's an Axios error (from Gemini API call)
        if (error.response) {
            console.error('Gemini API error details (ask-ai):', error.response.status, error.response.statusText, error.response.data);
        }
        res.status(500).json({ error: "Failed to get response from AI. Please try again." });
    }
});


// --- Start the server ---
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
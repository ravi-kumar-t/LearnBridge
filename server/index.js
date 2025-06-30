// server/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios'); 
const xml2js = require('xml2js'); 
const parser = new xml2js.Parser(); 

const app = express();
const port = process.env.PORT || 5000; 

app.use(cors());  
app.use(express.json()); 

if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env file!');
    console.error('Please add GEMINI_API_KEY=YOUR_API_KEY_HERE to your .env file in the server directory.');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

if (!process.env.WOLFRAM_ALPHA_APP_ID) {
    console.error('Error: WOLFRAM_ALPHA_APP_ID is not set in .env file!');
    console.error('Please add WOLFRAM_ALPHA_APP_ID=YOUR_APP_ID_HERE to your .env file in the server directory.');
    process.exit(1); 
}
const WOLFRAM_ALPHA_APP_ID = process.env.WOLFRAM_ALPHA_APP_ID;

if (!process.env.YOUTUBE_API_KEY_FOR_SERVER_SIDE) {
    console.error('Error: YOUTUBE_API_KEY_FOR_SERVER_SIDE is not set in .env file!');
    console.error('Please add YOUTUBE_API_KEY_FOR_SERVER_SIDE=YOUR_API_KEY_HERE to your .env file in the server directory.');
    process.exit(1); 
}
const YOUTUBE_API_KEY_SERVER = process.env.YOUTUBE_API_KEY_FOR_SERVER_SIDE;

const chatHistory = [];


// --- apis ---

// 1. Root route
app.get('/', (req, res) => {
    res.send('E-Learning Backend API is running!');
});

// 2. Endpoint to fetch youtube
app.get('/api/youtube-video-details/:videoId', async (req, res) => {
    const { videoId } = req.params;

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                key: YOUTUBE_API_KEY_SERVER, 
                part: 'snippet,statistics',
                id: videoId,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching video details on backend:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch video details from YouTube API',
            details: error.response?.data || error.message
        });
    }
});

// 3. Endpoint to search youtube videos
app.get('/api/search-youtube-videos', async (req, res) => {
    const { q, maxResults = 12, order = 'relevance', videoDuration = 'long' } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search query (q) is required.' });
    }

    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: YOUTUBE_API_KEY_SERVER, 
                part: 'snippet',
                q: q,
                type: 'video',
                maxResults: maxResults,
                order: order,
                videoDuration: videoDuration,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error searching YouTube videos on backend:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to search YouTube videos from YouTube API',
            details: error.response?.data || error.message
        });
    }
});


// 4. ai flashcard generator api
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
                    flashcards = JSON.parse(textContent); 
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

// 5. ai book summarizer api
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

// 6. ai research paper summarizer api
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

// 7. ai career recommendation system api
app.post('/api/career-recommendation', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
        return res.status(400).json({ error: 'Please provide your skills, technologies, or keywords for career recommendation.' });
    }

    try {
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

// 8. ai mcq generator api 
app.post('/api/generate-mcqs', async (req, res) => {
    const { text, numQuestions = 5 } = req.body; 

    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ error: 'Please provide valid text to generate MCQs.' });
    }

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
        const textContent = response.text(); 

        console.log("Received response from Gemini (MCQ Generator raw):", textContent);

        let mcqs = [];
        try {
            const jsonMatch = textContent.match(/\[\s*{[^}]*}(?:,\s*{[^}]*})*\s*\]/s);

            if (jsonMatch && jsonMatch[0]) {
                mcqs = JSON.parse(jsonMatch[0]);
                if (!Array.isArray(mcqs) || mcqs.some(q => !q.question || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer)) {
                   console.warn("Parsed JSON is not a valid MCQ array, attempting full parse as fallback:", mcqs);
                   mcqs = JSON.parse(textContent); 
                }
            } else {
                console.warn("No valid JSON array found by regex in Gemini response (MCQ). Trying full parse as fallback.");
                mcqs = JSON.parse(textContent);
            }
        } catch (parseError) {
            console.error("Failed to parse JSON from Gemini response (MCQ):", parseError);
            mcqs = [{ question: "Error generating MCQs", options: [], answer: "Could not parse AI response. Try different text." }];
        }

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

// 9. ai homework hlper api
app.post('/api/homework-helper', async (req, res) => {
    const { problem } = req.body;

    if (!problem || typeof problem !== 'string' || problem.trim() === '') {
        return res.status(400).json({ error: 'Please provide a math or science problem.' });
    }

    try {
        let wolframAlphaResultText = '';
        let wolframAlphaSteps = null;

        const encodedProblem = encodeURIComponent(problem);
        const wolframAlphaUrl = `http://api.wolframalpha.com/v2/query?input=${encodedProblem}&appid=${WOLFRAM_ALPHA_APP_ID}&output=xml&podstate=Result__Step-by-step solution&format=plaintext`; // Request plaintext for simpler parsing

        console.log("Querying Wolfram Alpha Full Results API:", wolframAlphaUrl);
        try {
            const wolframResponse = await axios.get(wolframAlphaUrl, { timeout: 15000 }); 
            const xmlResponse = wolframResponse.data;
            console.log("Wolfram Alpha Raw XML Response:", xmlResponse);

            const resultObj = await parser.parseStringPromise(xmlResponse);
            console.log("Wolfram Alpha Parsed Object:", JSON.stringify(resultObj, null, 2));

            const queryResult = resultObj.queryresult;

            if (queryResult && queryResult.pod) {
                const resultPod = queryResult.pod.find(p => p.$.title === 'Result' || p.$.title === 'Solutions' || p.$.title === 'Value');
                if (resultPod && resultPod.subpod && resultPod.subpod[0] && resultPod.subpod[0].plaintext) {
                    wolframAlphaResultText = resultPod.subpod[0].plaintext[0];
                }

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
        }

        let prompt;
        if (wolframAlphaSteps) {
            prompt = `You are an AI Homework Helper. Here is a problem and its step-by-step solution from a reliable computational engine. Please present this solution clearly and pedagogically for a student. Explain each step in an easy-to-understand manner. Format the steps using clear numbering or bullet points.

            Problem: "${problem}"

            Wolfram Alpha Steps:
            ${wolframAlphaSteps}

            ---
            Your explanation:`;
        } else if (wolframAlphaResultText && !wolframAlphaResultText.includes("Wolfram Alpha could not find")) {
            prompt = `You are an AI Homework Helper. Here is a problem and its direct answer from a reliable computational engine. Please provide a detailed, step-by-step explanation for how to arrive at this answer. Format the steps using clear numbering or bullet points.

            Problem: "${problem}"
            Wolfram Alpha Answer: "${wolframAlphaResultText}"

            ---
            Your step-by-step explanation:`;
        } else {
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
        if (error.response) { 
            console.error('Gemini API error details (Homework Helper):', error.response.status, error.response.statusText, await error.response.text());
        }
        res.status(500).json({ error: 'Failed to provide homework help. Please try again later.' });
    }
});

// 10. contact form Submission api
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

// 11. ai Chat endpoint for coursedetail page
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required." });
    }

    try {
        const chat = model.startChat({
            history: chatHistory.map(entry => ({
                role: entry.role,
                parts: entry.parts
            })), 
            generationConfig: {
                maxOutputTokens: 120, 
                temperature: 0.5,
            },
        });

        const result = await chat.sendMessage(
            `Please provide a very concise and direct answer to the following question. Ensure the answer is complete and stands on its own, suitable for a quick reference during a class.
            Question: "${question}"`
        );
        const responseText = await result.response.text();

        chatHistory.push({ role: "user", parts: [{ text: question }] });
        chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        res.json({ answer: responseText });

    } catch (error) {
        console.error("Error asking AI:", error);
        if (error.response) {
            console.error('Gemini API error details (ask-ai):', error.response.status, error.response.statusText, error.response.data);
        }
        res.status(500).json({ error: "Failed to get response from AI. Please try again." });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
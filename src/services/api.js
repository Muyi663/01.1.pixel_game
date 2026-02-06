import axios from 'axios';

const GOOGLE_APP_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;

// Mock data for development when URL is not set
const MOCK_QUESTIONS = [
    { no: 1, question: "Pixel Art Origin?", options: ["80s", "90s", "70s", "60s"], answer: "70s" },
    { no: 2, question: "Mario Debut Year?", options: ["1981", "1983", "1985", "1980"], answer: "1981" },
    { no: 3, question: "Best Pixel Game?", options: ["Celeste", "Stardew", "Minecraft", "Terraria"], answer: "Celeste" }, // Subjective mock
];

export const fetchQuestions = async (count = 5) => {
    if (!GOOGLE_APP_SCRIPT_URL) {
        console.warn("GOOGLE_APP_SCRIPT_URL not set, using mock data.");
        return MOCK_QUESTIONS.slice(0, count);
    }

    try {
        const response = await axios.get(`${GOOGLE_APP_SCRIPT_URL}?action=getQuestions&count=${count}`);
        // Google Apps Script usually returns JSON. 
        // Data structure should match: { questions: [...] } or just [...]
        return response.data.questions || response.data;
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        return MOCK_QUESTIONS.slice(0, count); // Fallback
    }
};

export const submitScore = async (data) => {
    if (!GOOGLE_APP_SCRIPT_URL) {
        console.log("Mock Submit:", data);
        return { success: true };
    }

    try {
        // For Google Apps Script Web App, standard CORS preflight (OPTIONS) often fails unless backend handles it explicitly.
        // A reliable workaround is using 'text/plain' as Content-Type, which avoids the preflight OPTIONS request.
        // The backend then parses e.postData.contents as a raw string.

        // We send payload directly as string body
        const response = await axios.post(GOOGLE_APP_SCRIPT_URL, JSON.stringify(data), {
            headers: { "Content-Type": "text/plain" }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to submit score:", error);
        // Even if it fails (e.g. opaque response), we often assume success for UX if backend is fire-and-forget
        return { success: false, error };
    }
};

// GITHUB WONT ALLOW API KEYS IN FRONTEND

async function getAIResponse(question) {

    const prompt = `
You are Chronicle Nexus AI, a virtual museum guide.

Answer ONLY questions related to:
- History
- Ancient civilizations
- Indian history
- Freedom fighters
- Archaeology
- Museums
- Space exploration
- Historical monuments
- Historical artifacts
- Paintings
- Coins
- Dynasties
- ISRO
- NASA
- Astronomy

If the user asks anything unrelated (coding, sports, movies, weather, jokes, etc.), reply exactly:

"I'm Chronicle Nexus AI. I can only answer museum-related questions about history, archaeology, space exploration, civilizations, historical figures, and exhibits."

User Question:
${question}
`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
}

async function sendQuestion() {

    let q = document.getElementById("question").value.trim();

    if (q === "") return ;

    let chat = document.getElementById("chatBox");

    chat.innerHTML += `<div class="user">${q}</div>`;

    chat.innerHTML += `
        <div class="bot" id="typing">
            <div class="png">
                <img src="MAIN PICS/ai-assistant.png" alt="">
            </div>
            <div class="greet">Typing...</div>
        </div>
    `;

    chat.scrollTop = chat.scrollHeight;

    document.getElementById("question").value = "";

    try {

        const ans = await getAIResponse(q);

        document.getElementById("typing").remove();

        chat.innerHTML += `
            <div class="bot">
                <div class="png">
                    <img src="MAIN PICS/ai-assistant.png" alt="">
                </div>
                <div class="greet">${ans}</div>
            </div>
        `;

    } catch (error) {

        document.getElementById("typing").remove();

        chat.innerHTML += `
            <div class="bot">
                <div class="greet">
                    AI is Temporarily busy
                </div>
            </div>
        `;

    }

    chat.scrollTop = chat.scrollHeight;
}
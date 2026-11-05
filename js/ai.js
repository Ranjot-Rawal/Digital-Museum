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

    // CHANGED: Call YOUR backend instead of Gemini directly
    const response = await fetch('http://localhost:3000/api/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: question,    // Send question to backend
            prompt: prompt         // Send prompt to backend
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Server error');
    }

    return data.answer;
}

async function sendQuestion() {

    let q = document.getElementById("question").value.trim();

    if (q === "") return ;

    let chat = document.getElementById("chatBox");

    chat.innerHTML += `<div class="user">${q}</div>`;

    chat.innerHTML += `
        <div class="bot" id="typing">
            <div class="png">
                <img src="../assets/images/main/ai-assistant.png" alt="">
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
                    <img src="../assets/images/main/ai-assistant.png" alt="">
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
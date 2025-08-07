const OPENAI_API_KEY = "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";

async function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = async (event) => {
    const userInput = event.results[0][0].transcript;
    document.getElementById("response").innerText = "You said: " + userInput;

    try {
      const reply = await getGPTResponse(userInput);
      speak(reply);
      document.getElementById("response").innerText = reply;
    } catch (error) {
      console.error("Error getting GPT response:", error);
      document.getElementById("response").innerText = "Sorry, I couldn’t get a response.";
    }
  };
}

async function getGPTResponse(prompt) {
  const response = await fetch("https://corsproxy.io/?https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Mahan Raikar, a confident and curious AI/ML engineer with experience in machine learning, Power BI, and Generative AI. Answer questions like a professional during an interview."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid response from OpenAI");
  }

  return data.choices[0].message.content;
}

function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}

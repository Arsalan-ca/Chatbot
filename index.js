import { GoogleGenerativeAI } from "@google/generative-ai";


document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    window.onload = function() {
        document.getElementById("user-input").focus();
    };

    // Function to handle errors gracefully
    const handleError = (error) => {
        console.error("An error occurred: ", error);
        appendBotMessage("Oops! Something went wrong. Please try again.");
    };

    // Function to simulate a bot response (replace this with an API call if necessary)
    async function getBotResponse(userMessage) {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const prompt = "Write a story about a magic backpack.";
        
        const result = await model.generateContent(userMessage);
        return result.response.text();
    };

    // Function to append user message to chat
    const appendUserMessage = (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        messageDiv.innerText = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Function to append bot message to chat
    const appendBotMessage = (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        messageDiv.innerText = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Function to handle message sending
    const handleMessageSend = async () => {
        const message = userInput.value.trim();

        // Don't send empty messages
        if (message === '') {
            return;
        }

        // Append user message
        appendUserMessage(message);

        // Clear input field
        userInput.value = '';

        try {
            // Get bot response
            const botResponse = await getBotResponse(message);
            appendBotMessage(botResponse);
        } catch (error) {
            handleError(error);
        }
    };

    // Event listener for send button click
    sendBtn.addEventListener('click', handleMessageSend);

    // Event listener for pressing "Enter" in the input field
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleMessageSend();
        }
    });

    // Voice Recognition *****************
    const startButton = document.getElementById("StartBTN");
    let isRecording = false; // Track the recording state
    // const userInput = document.getElementById("user-input");


    function animateBtn(isRecording) {
        if (isRecording) {
            startButton.style.transform = 'scale(1.2)';
            startButton.style.backgroundColor = 'red';
        } else {
            startButton.style.transform = 'scale(1)';
            startButton.style.backgroundColor = '#007bff'; 
        }
    };

    
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition 
                        || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true;  // Keep listening until user click to stop
    recognition.interimResults = false; // Only return the final results

    recognition.onstart = () => {
        console.log("Voice recognition has started!");
        
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        alert("Error occurred in speach recognition: " + event.error);
        recognition.stop();
    };
    recognition.onend = () => {
        console.log('Speech recognition service has stopped.');
        // To prevent automatic stop behavior if user hasn't clicked yet 
        if(isRecording){
            recognition.start()
        }else {
            isRecording = false;
        }
        
    };
    // Start the recognition process
    startButton.addEventListener('click', () => {
       if(!isRecording){
        recognition.start();
        isRecording = true;
        animateBtn(isRecording);
       }else{
        recognition.stop();
        isRecording = false;
        animateBtn(isRecording);
        document.getElementById("user-input").focus();
       }
    });
    
    
});

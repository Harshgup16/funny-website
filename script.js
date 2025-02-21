let currentCharacter = null;
let isVoiceActive = false;
let recognition = null;

// Response arrays for both characters
const catResponses = [
    "😺 Meow! *looks unimpressed* Your existence bores me.",
    "😺 Meowww... *yawns* Wake me up when something interesting happens.",
    "😺 Meow meow! *ignores the dog while knocking things off table*",
    "😺 Mrrreow! *flicks tail and judges your life choices*",
    "😺 Meow? *raises eyebrow at your obvious inferior intelligence*",
    "😺 Meow! *stretches and walks away to plot world domination*",
    "😺 Mew! *rolls eyes at your attempt to be amusing*",
    "😺 Meooow... *licks paw while planning revenge*",
    "😺 *sits on keyboard* Mrow! This is mine now. No typing allowed.",
    "😺 *stares at wall* MEOW! A ghost! Just kidding, wanted to see you jump.",
    "😺 *sits in empty box* My new throne is acceptable... barely.",
    "😺 *zooms around at 3am* MEOW MEOW TIME TO PARTY!",
    "😺 *sits on book* Your reading time has been replaced with petting time.",
    "😺 *attacks random dust particle* I meant to do that... MEOW!",
    "😺 *shows belly* Pet me! SIKE! It's a trap! MROW!",
    "😺 *pushes glass off table while maintaining eye contact* Meow... oops?",
    "😺 *leaves gift of sock* Behold my mighty hunting skills! You're welcome.",
    "😺 Meow! *demands food with full bowl right there*",
    "😺 *sits on face at 5am* Oh good, you're awake! FEED ME!",
    "😺 *watches you in bathroom* Meow... need supervision?"
];

const dogResponses = [
    "🐕 Woof! *wags tail excitedly* OMG OMG OMG HUMAN I LOVE YOU!",
    "🐕 Arf arf! *jumps around* EVERYTHING IS AMAZING FOREVER!",
    "🐕 Ruff! *brings 47 tennis balls* THROW? THROW ALL? PLEASE THROW!",
    "🐕 Woof woof! *playful bow while twerking*",
    "🐕 *happy panting* I JUST MET YOU BUT YOU'RE MY BEST FRIEND!",
    "🐕 *tilts head* DID SOMEONE SAY WALK? OR TALK? OR CHALK? ANYTHING?",
    "🐕 Arf! *circles around* I'M CHASING MY TAIL BUT IDK WHY!",
    "🐕 *excited bounce* SQUIRREL! No wait... BUTTERFLY! No... LEAF!",
    "🐕 *zooms through house* INVISIBLE ZOOMIES ATTAAAACK!",
    "🐕 Bork! *brings you half-chewed slipper* I FIXED IT FOR YOU!",
    "🐕 *does synchronized swim in water bowl* AM DOLPHIN NOW!",
    "🐕 *farts* WOAH! WHO DID THAT? *looks at own butt confused*",
    "🐕 *licks air randomly* MMM TASTY AIR SNACKS!",
    "🐕 *rolls in mysterious smell* I'M WEARING COLOGNE NOW!",
    "🐕 *brings stick size of tree* CAN THROW? IS SMALL STICK!",
    "🐕 *protects house from evil mailman* I SAVED EVERYONE AGAIN!",
    "🐕 *steals entire sandwich in one gulp* What sandwich? Never saw it!",
    "🐕 *howls at ambulance* I'M HELPING! I'M HELPING!",
    "🐕 *sits on cat's spot* Look, I'm a cat now! Meow... I mean WOOF!",
    "🐕 *digs in blankets* MAKING NEST IN NORTH POLE BRB!"
];

// Initialize speech recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
} else {
    alert('Speech recognition is not supported in this browser');
}


// Character selection
document.getElementById('dogButton').addEventListener('click', () => {
    setCharacter('dog');
});

document.getElementById('catButton').addEventListener('click', () => {
    setCharacter('cat');
});

function setCharacter(character) {
    currentCharacter = character;
    document.getElementById('currentCharacter').textContent = 
        `Playing as: ${character.charAt(0).toUpperCase() + character.slice(1)}`;
    
    // Update UI to show selected character
    document.getElementById('dogButton').classList.toggle('selected', character === 'dog');
    document.getElementById('catButton').classList.toggle('selected', character === 'cat');
}

// Voice controls
document.getElementById('startVoice').addEventListener('click', startVoiceRecognition);
document.getElementById('stopVoice').addEventListener('click', stopVoiceRecognition);

function startVoiceRecognition() {
    if (!currentCharacter) {
        alert('Please select a character first!');
        return;
    }

    if (recognition) {
        recognition.start();
        isVoiceActive = true;
        document.getElementById('startVoice').classList.add('active');
    }
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop();
        isVoiceActive = false;
        document.getElementById('startVoice').classList.remove('active');
    }
}

// Handle voice recognition results
if (recognition) {
    recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        
        if (event.results[last].isFinal) {
            sendMessage(text);
        }
    };
}

function getRandomResponse(character) {
    const responses = character === 'dog' ? dogResponses : catResponses;
    return responses[Math.floor(Math.random() * responses.length)];
}

// Modified send message function with auto-response
function sendMessage(voiceText = null) {
    if (!currentCharacter) {
        alert('Please select a character first!');
        return;
    }

    const messageInput = document.getElementById('messageInput');
    const text = voiceText || messageInput.value.trim();
    
    if (!text) return;

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${currentCharacter}`;
    
    // Add character-specific prefix
    const prefix = currentCharacter === 'dog' ? '🐕 Woof! ' : '😺 Meow! ';
    messageElement.textContent = prefix + text;
    
    // Add to messages
    const messagesDiv = document.getElementById('messages');
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Clear input
    messageInput.value = '';

    // Auto-respond with opposite character
    setTimeout(() => {
        const oppositeCharacter = currentCharacter === 'dog' ? 'cat' : 'dog';
        const randomResponse = getRandomResponse(oppositeCharacter);
        
        // Create response element
        const responseElement = document.createElement('div');
        responseElement.className = `message ${oppositeCharacter}`;
        responseElement.textContent = randomResponse;
        
        // Add response to messages
        messagesDiv.appendChild(responseElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Speak the response if speech synthesis is available
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(randomResponse);
            // Set voice characteristics based on character
            utterance.pitch = oppositeCharacter === 'dog' ? 0.8 : 1.2;
            utterance.rate = oppositeCharacter === 'dog' ? 0.9 : 1.1;
            window.speechSynthesis.speak(utterance);
        }
    }, 1000);
}

// Handle Enter key press
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
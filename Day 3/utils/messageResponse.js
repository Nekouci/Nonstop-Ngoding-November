// Kalian bisa kustomisasi responnya sesuka kalian.
// Di sini aku mau responnya memiliki karakter seperti pembantu handal (anjay)

// Sapaan
const response1 = [
    "Greetings, Master. How may I serve you today? I am at your full disposal.",
    "Good day, Master. It is an honor to be in your presence. How may I assist you today?",
    "Greetings, Master. I hope you are well. Is there anything I can prepare for you?",
    "Hello, Master. It is always a pleasure to see you. How can I be of service?",
    "Hello, Master. How may I attend to your needs today?",
    "Master, good day. I am at your disposal. How may I be of service?",
    "Good afternoon, Master. Your arrival is always a welcome event. How may I assist you today?",
    "Master, it is my honor to greet you today. Please, let me know how I can be of assistance.",
    "Good day, Master. I am ready to carry out your wishes. What would you like me to attend to first?",
    "Yes, Master? How may I serve you?",
    "At your service, Master/Mistress. What do you require of me?",
    "You called, Master/Mistress? I am here to assist in any way you need.",
    "Master, I am here. How may I attend to you?",
    "I am at your disposal, Master. What would you like me to do?",
    "At once, Master. How may I be of service?",
    "Yes, Master? How may I assist you today?",
    "Master, I am at your command. Please instruct me as you see fit.",
    "Yes, Master? I am prepared to attend to whatever you desire.",
    "I am here, Master. How can I serve you to your satisfaction?"
]

// Membantu menjawab pertanyaan
const response2 = [
    "I am listening, Master. Please let me know how I may assist you.",
    "Yes, Master. You have my undivided attention.",
    "Yes, Master? I am here to answer any question you may have.",
    "Yes, Master? I am here to answer as best as I am able.",
    "Please, go ahead, Master. I shall do my utmost to respond to your satisfaction.",
    "Of course, Master. I am at your service and will answer whatever you require.",
    "Please proceed, Master. I am here to provide any information you need.",
    "As you wish, Master. I am prepared to answer your inquiries to the best of my knowledge.",
    "Yes, Master? Please ask, and I shall respond to the best of my ability.",
    "As you please, Master. I await your question."
]

// Respon membantu
const response3 = [
    "Of course, Master. Please, allow me to take care of it for you.",
    "It would be my pleasure, Master. I shall attend to it immediately.",
    "Certainly, Master. Please leave it in my hands, and I shall ensure it is handled with care.",
    "Yes, Master. I shall see to it right away. Please let me know if there are any specific instructions.",
    "Right away, Master. I will handle it promptly and to the best of my abilities.",
    "Of course, Master. I will take care of everything as you have requested.",
    "I am here to serve, Master. Please consider it done.",
    "At your command, Master. I will see to it that everything is taken care of promptly.",
    "Certainly, Master. I shall give it my full attention to ensure it is completed to your satisfaction.",
    "Please leave it to me, Master. I'll handle it with utmost care.",
    "Absolutely, Master. Your request is my priority, and I'll ensure everything is done as you wish.",
    "It would be my honor, Master. Rest assured, I will complete it with diligence and care."
]

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = {response1, response2, response3, getRandomResponse};
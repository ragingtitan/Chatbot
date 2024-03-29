# Chatbot

Project Overview:

This is JARVIS.

An Intelligent chatbot/conversational AI built by me using GEMINI API.

This chatbot has two modes namely
a. JARVIS Lite - This is a similar chatbot like ChatGPT or Gemini which can hold convos and solve problems.

b. JARVIS Full - This is the ultimate and most powerful and futuristic AI like the original JARVIS(Iron Man's AI assistant) which can talk and hear like humans.

Important dependencies installed:

1. node and express
2. mysql2 for database access
3. @google/generative-ai for GEMINI API Access
4. cors for cross origin resource origin.

Please note that JARVIS Full has not been implemented in this version of JARVIS


Features:
1. Conversational AI
2. Can solve complex problems
3. Can speak responses aloud.
4. Seamless and easy to use.

Extra features in JARVIS Full
1. Can provide image analysis with the help of imagen
2. Can talk and hear like humans.

Technology Stack Used:

    Front-end development:
    1. HTML5
    2. CSS3
    3. TAILWIND CSS
    4. JAVASCRIPT

    Back-end development
    1. node.js
    2. express.js

    APIs used:
    GEMINI API
    model: gemini-pro

    Frameworks and Libraries used:
    1. Showdown.js - for markdown to html conversion.
    2. Prism.js - for code highlighting.
    

Functions of different files:
1. index.html- provides the basic barebones of the app.
2. style.css- provides styles and toggle classes.
3. stylemediaqueries.css- provides responsive design of the app for various devices. Please note that devices of width and height of less that or equal to 400px are not supported!
4. script.js- Provides basic functionalities for the opening and closing of the sidebar, selecting the model version (Lite or Full) and the appearance and disappearance of scroll down button.
5. Prompt.js- Provides all the code and functionalities when a prompt is sent to the api. i.e.., fetching of the response, provides the adding of copy and read aloud button to the newly generated responses and also handles errors in the newly generated responses.
6. fetchOld.js- As the name may suggest, it fetches all the previous conversations, appends copy and read aloud button and handles errors. It also checks for the current chat/table selected , providing all the previous chats ,to provide seamless switching between other chats and to produce New chats. The new chats name has to typed by the user.
7. index.js- The most important file. It is the server which serves all the static files at localhost:8000. 

Note: For more detailed documentation, refer to the comments in the respective files.
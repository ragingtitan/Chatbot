let username = window.prompt("Enter username: ");
while (username === "" || username === null) {
    username = window.prompt("Username must be entered!: ");
}

function scrollToBottom() {
    let interactionContainer = document.getElementById('interaction-container');
    interactionContainer.scrollTop = interactionContainer.scrollHeight;
}

function summarizer(text) {
    // Split the string into an array of words
    const words = text.trim().split(/\s+/);
    
    // Extract the first four words
    const firstFourWords = words.slice(0, 4).join(' ');
    
    return firstFourWords;
}
function formatText(text) {
    // Define regular expressions for matching patterns
    const sectionRegex = /\*\*([^*]+)\*\*/g; // Matches sections enclosed in **
    const itemRegex = /\*([^*]+)\*/g; // Matches items enclosed in *

    // Replace section headers with bold formatting and add serial numbers to items
    let formattedText = text.replace(sectionRegex, (match, p1) => {
        return `<strong>${p1}:</strong>`;
    }).replace(itemRegex, (match, p1) => {
        return `<li>${p1}</li>`;
    });

    // Wrap sections in <ul> tags
    formattedText = formattedText.replace(/(<strong>.*?<\/strong>:)/g, '<ul>$1');

    // Wrap entire text in <div> tag
    formattedText = `<div>${formattedText}</div>`;

    return formattedText;
}


async function fetchOldData(username) {
    let sidebar = document.querySelector('.sidebar-content');
    let interactionContainer = document.getElementById('interaction-container');
    let logoWelcome=document.querySelector('.logo-welcome');
    
    const url = 'http://localhost:8000/getprev';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch response from server.');
        }

        const jsonResponse = await response.json();
        if(jsonResponse.length > 0) {
            interactionContainer.classList.remove('hidden');
            logoWelcome.classList.add('hidden');
        }
        console.log(jsonResponse);
        for (let i = 0; i < jsonResponse.length; i++) {
            const interaction = `<div class="response-body min-w-1/3 gap-1 flex justify-center flex-col">
                <div class="user-prompt p-2">
                    ${username}: ${jsonResponse[i].prompt}
                </div>
                <div class="response-message justify-start w-full flex p-2">
                    <div class="message">
                        J.A.R.V.I.S: ${formatText(jsonResponse[i].response)}
                    </div>
                </div>
            </div>`;
            interactionContainer.insertAdjacentHTML('beforeend', interaction);

            // Prompt summary to be appended to the sidebar
            /*const addSummary = `<div class="summary hover:cursor-pointer h-fit text-center p-2 my-1">
                <p class="hover:text-white transition-all duration-200">${summarizer(jsonResponse[i].prompt)}</p>
            </div>`;
            sidebar.insertAdjacentHTML('afterbegin', addSummary);*/
            document.getElementById('prompt').focus();
            scrollToBottom();
        }
    } catch (error) {
        console.error('Error:', error.message);
        // Handle error if necessary
    }
}

fetchOldData(username);

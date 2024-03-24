function textToSpeechAloud() {
  let textToSpeechBtn = document.querySelectorAll('.read-aloud');
  textToSpeechBtn.forEach(button => {
      button.addEventListener('click', () => {
          console.log('Clicked read aloud button');
          // Find the parent response message element
          const responseMessage = button.closest('.response-message');
          // Get the message content
          const messageContent = responseMessage.querySelector('.message').innerText;

          // Check if speech synthesis is already in progress
          if (!window.speechSynthesis.speaking) {
              textToSpeechBtn.innerHTML = `<p class="">Speaking...</p>`;
              // Create SpeechSynthesisUtterance object
              const utterance = new SpeechSynthesisUtterance();
              // Set text to be spoken
              utterance.text = messageContent;
              // Optionally, configure other parameters like language and rate
              utterance.lang = 'en-US'; // Set language to English (United States)
              utterance.rate = 1.0; // Set speech rate (1.0 is the default)

              // Speak the text using Speech Synthesis API
              window.speechSynthesis.speak(utterance);
          }
          textToSpeechBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.9099C11 4.47485 10.4828 4.24734 10.1621 4.54132L6.67572 7.7372C6.49129 7.90626 6.25019 8.00005 6 8.00005H4C3.44772 8.00005 3 8.44776 3 9.00005V15C3 15.5523 3.44772 16 4 16H6C6.25019 16 6.49129 16.0938 6.67572 16.2629L10.1621 19.4588C10.4828 19.7527 11 19.5252 11 19.0902V4.9099ZM8.81069 3.06701C10.4142 1.59714 13 2.73463 13 4.9099V19.0902C13 21.2655 10.4142 22.403 8.81069 20.9331L5.61102 18H4C2.34315 18 1 16.6569 1 15V9.00005C1 7.34319 2.34315 6.00005 4 6.00005H5.61102L8.81069 3.06701ZM20.3166 6.35665C20.8019 6.09313 21.409 6.27296 21.6725 6.75833C22.5191 8.3176 22.9996 10.1042 22.9996 12.0001C22.9996 13.8507 22.5418 15.5974 21.7323 17.1302C21.4744 17.6185 20.8695 17.8054 20.3811 17.5475C19.8927 17.2896 19.7059 16.6846 19.9638 16.1962C20.6249 14.9444 20.9996 13.5175 20.9996 12.0001C20.9996 10.4458 20.6064 8.98627 19.9149 7.71262C19.6514 7.22726 19.8312 6.62017 20.3166 6.35665ZM15.7994 7.90049C16.241 7.5688 16.8679 7.65789 17.1995 8.09947C18.0156 9.18593 18.4996 10.5379 18.4996 12.0001C18.4996 13.3127 18.1094 14.5372 17.4385 15.5604C17.1357 16.0222 16.5158 16.1511 16.0539 15.8483C15.5921 15.5455 15.4632 14.9255 15.766 14.4637C16.2298 13.7564 16.4996 12.9113 16.4996 12.0001C16.4996 10.9859 16.1653 10.0526 15.6004 9.30063C15.2687 8.85905 15.3578 8.23218 15.7994 7.90049Z" fill="currentColor"></path></svg>`;
      });
  });
}
/*function isCode(code) {
  // Check if the string starts and ends with triple backticks
  if (code.startsWith('```') && code.endsWith('```')) {
      // Check if there are at least six backticks in total
      if (code.length >= 6) {
          return true;
      }
  }
  return false;
}*/
function isCode(code) {
  // Check if the string starts and ends with triple backticks
  if (code.startsWith('```') && code.endsWith('```')) {
      // Check if there are at least six backticks in total
      return true;
  }
  if (code.length >= 6) {
      return true;
  }
  return false;
}

// Example usage:
function formatCodeBlocks(message) {
// Regular expression to match code blocks (assuming code blocks are enclosed in triple backticks)
const codeRegex = /```([\s\S]+?)```/g;

// Variable to track if a code block was found
let codeFound = false;
// Replace code blocks with formatted HTML (assuming Markdown-like syntax)
const formattedMessage = message.replace(
  codeRegex,
  (match, code) => {
      codeFound = true; // Set codeFound to true since a code block was found

      // Replace tab characters with four spaces
      code = code.replace(/\t/g, '    ');

      // Split code block into lines
      const lines = code.split('\n');

      // Remove leading and trailing whitespace from each line
      const trimmedLines = lines.map(line => line.trim());

      // Join lines back together with line breaks
      let formattedCode = trimmedLines.join('\n');

      // Replace multiple consecutive empty lines with a single empty line
      formattedCode = formattedCode.replace(/\n{2,}/g, '\n');

      return `<pre class="my-2 bg-black overflow-x-scroll rounded-xl p-3 code-block-wrapper"><p class="code-block  ">${formattedCode}</p></pre>`;
  }
);

return  formattedMessage ;
}    
function highlightSyntax(code) {
  // Define regular expressions for different token types
  const keywordRegex = /\b(class|function|if|else|for|while|return)\b/g;
  const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g;
  const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
  const numberRegex = /\b\d+(\.\d+)?\b/g;
  const operatorRegex = /[\+\-\*\/=<>]/g;
  const builtinRegex = /\b(console|print|printf)\b/g;
  const punctuationRegex = /[\(\){}\[\];,:]/g;

  // Apply syntax highlighting using spans with appropriate classes
  code = code.replace(keywordRegex, '<span class="keyword">$&</span>');
  code = code.replace(commentRegex, '<span class="comment">$&</span>');
  code = code.replace(stringRegex, '<span class="string">$&</span>');
  code = code.replace(numberRegex, '<span class="number">$&</span>');
  code = code.replace(operatorRegex, '<span class="operator">$&</span>');
  code = code.replace(builtinRegex, '<span class="builtin">$&</span>');
  code = code.replace(punctuationRegex, '<span class="punctuation">$&</span>');

  return code;
}

document.addEventListener('DOMContentLoaded',()=>{
  let scrollDownBtn=document.querySelector('.scroll-down-btn');
    function copyText() {
        let copymessageBtn = document.querySelectorAll('.copy-btn');
    
    
        copymessageBtn.forEach(button => {
            button.addEventListener('click', () => {
                console.log('Clicked copy button');
                // Find the parent response message element
                const responseMessage = button.closest('.response-message');
    
                // Get the message content
                const messageContent = responseMessage.querySelector('.message').innerText;
    
                // Create a temporary textarea element
                const textarea = document.createElement('textarea');
                textarea.value = messageContent;
    
                // Append the textarea to the document
                document.body.appendChild(textarea);
    
                // Select the textarea content
                textarea.select();
    
                // Copy the selected content to the clipboard
                document.execCommand('copy');
    
                // Remove the textarea from the document
                document.body.removeChild(textarea);
    
                // Provide visual feedback (optional)
                button.innerHTML = '<span class="copy-msg flex justify-center items-center">Copied!</span>'; // Change button text to indicate copy operation
                setTimeout(() => {
                    button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C10.8954 3.5 10 4.39543 10 5.5H14C14 4.39543 13.1046 3.5 12 3.5ZM8.53513 3.5C9.22675 2.3044 10.5194 1.5 12 1.5C13.4806 1.5 14.7733 2.3044 15.4649 3.5H17.25C18.9069 3.5 20.25 4.84315 20.25 6.5V18.5C20.25 20.1569 19.1569 21.5 17.25 21.5H6.75C5.09315 21.5 3.75 20.1569 3.75 18.5V6.5C3.75 4.84315 5.09315 3.5 6.75 3.5H8.53513ZM8 5.5H6.75C6.19772 5.5 5.75 5.94772 5.75 6.5V18.5C5.75 19.0523 6.19772 19.5 6.75 19.5H17.25C18.0523 19.5 18.25 19.0523 18.25 18.5V6.5C18.25 5.94772 17.8023 5.5 17.25 5.5H16C16 6.60457 15.1046 7.5 14 7.5H10C8.89543 7.5 8 6.60457 8 5.5Z" fill="currentColor"></path></svg>'; // Reset button text after a short delay
                }, 1000); // Adjust delay as needed
            });
        });
    }
  //All important variables declared here 
  let sidebar = document.querySelector('.sidebar-content');
  let loadingPlaceholder = document.getElementById('loading-placeholder');
  let logoWelcome=document.querySelector('.logo-welcome');
  let promptResponse=document.querySelector('.response');
  let path = document.querySelector('.path-send-btn');
  let sendPromptBtn=document.getElementById('send-prompt');
  sendPromptBtn.disabled = true;//Button starts disabled
  let interactionContainer=document.getElementById('interaction-container');
  let error=document.querySelector('.error');

  //Listener for input change and change button state.
  document.getElementById('prompt').addEventListener('input',()=>{
    let prompt=document.getElementById('prompt').value.trim();//Disregard trailing and leading whitespace
    if(prompt!=null || prompt!='' || prompt!="")
    {
      sendPromptBtn.disabled = false;
    }
    if(prompt==null || prompt=='' || prompt=="")
    {
      sendPromptBtn.disabled = true;
    }
  });
  //Add event listener to sendPromptBtn to send the prompt
  sendPromptBtn.addEventListener('click',()=>{
   
    //Button is disabled when prompt is sent.
    sendPromptBtn.disabled = true;
    //Button is changed
    path.classList.add('hidden');
    //Add the loading effect
    loadingPlaceholder.classList.add("loading-spinner");
    let prompt=document.getElementById('prompt').value;
  logoWelcome.classList.add('hidden');
  promptResponse.classList.remove('hidden');
  console.log(prompt);
  //Picks first four words of the prompt.
  function summarizer(text) {
    // Split the string into an array of words
    const words = text.trim().split(/\s+/);
    
    // Extract the first four words
    const firstFourWords = words.slice(0, 4).join(' ');
    
    return firstFourWords;
}

  //Formats the output response
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

function scrollToBottom() {
  let interactionContainer = document.getElementById('interaction-container');
  interactionContainer.scrollTop = interactionContainer.scrollHeight;
}
//Getting the response from the server at an appropriate endpoint.
  async function sendPrompt() 
  {
      try {
          const url = 'http://localhost:8000/response'; // Assuming your Express server is running on port 8000 and the endpoint is '/response'
              
          const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ prompt: prompt })
              });
                //if error is returned apply all error rules
              if (!response.ok || response.error) {
                  error.classList.remove('hidden');
                  sendPromptBtn.disabled = true;
                  interactionContainer.classList.add('hidden');
                  path.classList.remove('hidden');
                  loadingPlaceholder.classList.remove("loading-spinner");
                  throw new Error('Failed to fetch response from server.');
              }
              else{
                error.classList.add('hidden');
              }
              //Response object
              const jsonResponse = await response.json();
              console.log(jsonResponse.response);
              //Handle btn state after message received.
              sendPromptBtn.disabled=false;
              //display path after message received
              path.classList.remove('hidden');
              //Remove loading animation after message received
              loadingPlaceholder.classList.remove("loading-spinner");
              //Appending formatted response to the output
              const formattedText = formatText(jsonResponse.response);
              //message to be appended
              let interaction;
              let checkcode=isCode(jsonResponse.response);
              console.log(checkcode);
              if(checkcode)
              {
                interaction = `<div class="response-body min-w-1/3 flex justify-center flex-col">
                <div class="user-prompt p-2 flex flex-col items-start">
                    <div class="prompt"><p class="font-bold">You</p></div>
                ${'\n'+prompt}
                </div>
                <div class="response-message items-start w-full flex flex-col p-2">
                    <p class="font-bold">JARVIS</p>
                    <div class="message w-full">
                      ${formatCodeBlocks(formattedText)}
                    </div>
                    <div class="copy-btn-wrapper items-center flex gap-1">
                        <span class="">
                            <button title="Copy Response" class="copy-btn transition-all duration-200 hover:bg-white hover:text-black flex items-center gap-1.5 rounded-md p-1 text-xs text-token-text-tertiary hover:text-token-text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C10.8954 3.5 10 4.39543 10 5.5H14C14 4.39543 13.1046 3.5 12 3.5ZM8.53513 3.5C9.22675 2.3044 10.5194 1.5 12 1.5C13.4806 1.5 14.7733 2.3044 15.4649 3.5H17.25C18.9069 3.5 20.25 4.84315 20.25 6.5V18.5C20.25 20.1569 19.1569 21.5 17.25 21.5H6.75C5.09315 21.5 3.75 20.1569 3.75 18.5V6.5C3.75 4.84315 5.09315 3.5 6.75 3.5H8.53513ZM8 5.5H6.75C6.19772 5.5 5.75 5.94772 5.75 6.5V18.5C5.75 19.0523 6.19772 19.5 6.75 19.5H17.25C18.0523 19.5 18.25 19.0523 18.25 18.5V6.5C18.25 5.94772 17.8023 5.5 17.25 5.5H16C16 6.60457 15.1046 7.5 14 7.5H10C8.89543 7.5 8 6.60457 8 5.5Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </span>
                        <span class="">
                            <button title="Speak the response" class="read-aloud transition-all duration-200 flex hover:bg-white hover:text-black items-center gap-1.5 rounded-md p-1 text-xs text-token-text-tertiary hover:text-token-text-primary md:group-hover:visible md:group-[.final-completion]:visible"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.9099C11 4.47485 10.4828 4.24734 10.1621 4.54132L6.67572 7.7372C6.49129 7.90626 6.25019 8.00005 6 8.00005H4C3.44772 8.00005 3 8.44776 3 9.00005V15C3 15.5523 3.44772 16 4 16H6C6.25019 16 6.49129 16.0938 6.67572 16.2629L10.1621 19.4588C10.4828 19.7527 11 19.5252 11 19.0902V4.9099ZM8.81069 3.06701C10.4142 1.59714 13 2.73463 13 4.9099V19.0902C13 21.2655 10.4142 22.403 8.81069 20.9331L5.61102 18H4C2.34315 18 1 16.6569 1 15V9.00005C1 7.34319 2.34315 6.00005 4 6.00005H5.61102L8.81069 3.06701ZM20.3166 6.35665C20.8019 6.09313 21.409 6.27296 21.6725 6.75833C22.5191 8.3176 22.9996 10.1042 22.9996 12.0001C22.9996 13.8507 22.5418 15.5974 21.7323 17.1302C21.4744 17.6185 20.8695 17.8054 20.3811 17.5475C19.8927 17.2896 19.7059 16.6846 19.9638 16.1962C20.6249 14.9444 20.9996 13.5175 20.9996 12.0001C20.9996 10.4458 20.6064 8.98627 19.9149 7.71262C19.6514 7.22726 19.8312 6.62017 20.3166 6.35665ZM15.7994 7.90049C16.241 7.5688 16.8679 7.65789 17.1995 8.09947C18.0156 9.18593 18.4996 10.5379 18.4996 12.0001C18.4996 13.3127 18.1094 14.5372 17.4385 15.5604C17.1357 16.0222 16.5158 16.1511 16.0539 15.8483C15.5921 15.5455 15.4632 14.9255 15.766 14.4637C16.2298 13.7564 16.4996 12.9113 16.4996 12.0001C16.4996 10.9859 16.1653 10.0526 15.6004 9.30063C15.2687 8.85905 15.3578 8.23218 15.7994 7.90049Z" fill="currentColor"></path></svg></button>
                        </span>
                    </div>
                </div>
            </div>`;
              }
              else{
                interaction = `<div class="response-body min-w-1/3 flex justify-center flex-col">
                <div class="user-prompt p-2 flex flex-col items-start">
                    <div class="prompt"><p class="font-bold">You</p></div>
                      ${'\n'+prompt}
                </div>
                <div class="response-message items-start w-full flex flex-col p-2">
                <p class="font-bold">JARVIS</p>
                    <div class="message">
                      ${formattedText}
                    </div>
                    <div class="copy-btn-wrapper items-center flex gap-1">
                        <span class="">
                            <button title="Copy Response" class="copy-btn transition-all duration-200 hover:bg-white hover:text-black flex items-center gap-1.5 rounded-md p-1 text-xs text-token-text-tertiary hover:text-token-text-primary">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C10.8954 3.5 10 4.39543 10 5.5H14C14 4.39543 13.1046 3.5 12 3.5ZM8.53513 3.5C9.22675 2.3044 10.5194 1.5 12 1.5C13.4806 1.5 14.7733 2.3044 15.4649 3.5H17.25C18.9069 3.5 20.25 4.84315 20.25 6.5V18.5C20.25 20.1569 19.1569 21.5 17.25 21.5H6.75C5.09315 21.5 3.75 20.1569 3.75 18.5V6.5C3.75 4.84315 5.09315 3.5 6.75 3.5H8.53513ZM8 5.5H6.75C6.19772 5.5 5.75 5.94772 5.75 6.5V18.5C5.75 19.0523 6.19772 19.5 6.75 19.5H17.25C18.0523 19.5 18.25 19.0523 18.25 18.5V6.5C18.25 5.94772 17.8023 5.5 17.25 5.5H16C16 6.60457 15.1046 7.5 14 7.5H10C8.89543 7.5 8 6.60457 8 5.5Z" fill="currentColor"></path>
                                </svg>
                            </button>
                        </span>
                        <span class="">
                            <button title="Speak the response" class="read-aloud transition-all duration-200 flex hover:bg-white hover:text-black items-center gap-1.5 rounded-md p-1 text-xs text-token-text-tertiary hover:text-token-text-primary md:group-hover:visible md:group-[.final-completion]:visible"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M11 4.9099C11 4.47485 10.4828 4.24734 10.1621 4.54132L6.67572 7.7372C6.49129 7.90626 6.25019 8.00005 6 8.00005H4C3.44772 8.00005 3 8.44776 3 9.00005V15C3 15.5523 3.44772 16 4 16H6C6.25019 16 6.49129 16.0938 6.67572 16.2629L10.1621 19.4588C10.4828 19.7527 11 19.5252 11 19.0902V4.9099ZM8.81069 3.06701C10.4142 1.59714 13 2.73463 13 4.9099V19.0902C13 21.2655 10.4142 22.403 8.81069 20.9331L5.61102 18H4C2.34315 18 1 16.6569 1 15V9.00005C1 7.34319 2.34315 6.00005 4 6.00005H5.61102L8.81069 3.06701ZM20.3166 6.35665C20.8019 6.09313 21.409 6.27296 21.6725 6.75833C22.5191 8.3176 22.9996 10.1042 22.9996 12.0001C22.9996 13.8507 22.5418 15.5974 21.7323 17.1302C21.4744 17.6185 20.8695 17.8054 20.3811 17.5475C19.8927 17.2896 19.7059 16.6846 19.9638 16.1962C20.6249 14.9444 20.9996 13.5175 20.9996 12.0001C20.9996 10.4458 20.6064 8.98627 19.9149 7.71262C19.6514 7.22726 19.8312 6.62017 20.3166 6.35665ZM15.7994 7.90049C16.241 7.5688 16.8679 7.65789 17.1995 8.09947C18.0156 9.18593 18.4996 10.5379 18.4996 12.0001C18.4996 13.3127 18.1094 14.5372 17.4385 15.5604C17.1357 16.0222 16.5158 16.1511 16.0539 15.8483C15.5921 15.5455 15.4632 14.9255 15.766 14.4637C16.2298 13.7564 16.4996 12.9113 16.4996 12.0001C16.4996 10.9859 16.1653 10.0526 15.6004 9.30063C15.2687 8.85905 15.3578 8.23218 15.7994 7.90049Z" fill="currentColor"></path></svg></button>
                        </span>
                    </div>
                </div>
            </div>`;
              }
          interactionContainer.insertAdjacentHTML('beforeend',interaction);
          copyText();
          //Prompt summary to be appended to the sidebar
          /*const addSummary = `<div class="summary hover:cursor-pointer h-fit text-center p-2 my-1"><p class="hover:text-white transition-all duration-200">${summarizer(prompt)}</p>
          </div>`;
          sidebar.insertAdjacentHTML('afterbegin', addSummary);*/
          document.getElementById('prompt').value = '';
          document.getElementById('prompt').focus();
          scrollToBottom();
          textToSpeechAloud();
          
              //document.getElementById('response').textContent = jsonResponse.response;
          } catch (error) {
              error.classList.remove('hidden');
              //Reset the textarea after the error
              document.getElementById('prompt').value = '';
              //Removing spin animation after error is thrown
              loadingPlaceholder.classList.remove("loading-spinner");
              //Set button to disabled state after error thus forcing the reload
              
              let responseBody=document.querySelectorAll('.response-body');
              responseBody.forEach(element => {
                element.classList.add('hidden');
              });
              console.error('Error:', error);
              // Handle error if necessary
          }
          sendPromptBtn.disabled=true;
  }
  sendPrompt();
});
});
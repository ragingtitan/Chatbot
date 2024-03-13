//Fetch old data


document.addEventListener('DOMContentLoaded',()=>{
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
    let prompt=document.getElementById('prompt').value.trim();
    if(prompt!=null || prompt!='' || prompt!="")
    {
      sendPromptBtn.disabled = false;
    }
    if(prompt==null || prompt=='' || prompt=="")
    {
      sendPromptBtn.disabled = true;
    }
  });
  sendPromptBtn.addEventListener('click',()=>{
   
    //Button is disabled when prompt is sent.
    sendPromptBtn.disabled = true;
    path.classList.add('hidden');
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
      
              if (!response.ok || response.error) {
                  error.classList.remove('hidden');

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
            const interaction = `<div class="response-body min-w-1/3 gap-1 flex justify-center flex-col">
            <div class="user-prompt p-2">
              ${username}: ${prompt}
            </div>
            <div class="response-message justify-start w-full flex p-2">
              <div class="message">
               J.A.R.V.I.S: ${`\n`+formattedText}
              </div>
            </div>
          </div>`;
          interactionContainer.insertAdjacentHTML('beforeend',interaction);
          //Prompt summary to be appended to the sidebar
          const addSummary = `<div class="summary hover:cursor-pointer h-fit text-center p-2 my-1"><p class="hover:text-white transition-all duration-200">${summarizer(prompt)}</p>
          </div>`;
          sidebar.insertAdjacentHTML('afterbegin', addSummary);
          document.getElementById('prompt').value = '';

              //document.getElementById('response').textContent = jsonResponse.response;
          } catch (error) {
              error.classList.remove('hidden');
              //Removing spin animation after error is thrown
              loadingPlaceholder.classList.remove("loading-spinner");
              sendPromptBtn.disabled=false;
              let responseBody=document.querySelectorAll('.response-body');
              responseBody.forEach(element => {
                element.classList.add('hidden');
              });
              console.error('Error:', error);
              // Handle error if necessary
          }
  }
  sendPrompt();
});
});
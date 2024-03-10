document.addEventListener('DOMContentLoaded',()=>{
    let sidebar = document.querySelector('.sidebar-content');
    let logoWelcome=document.querySelector('.logo-welcome');
    let promptResponse=document.querySelector('.response');
    
    let sendPromptBtn=document.getElementById('send-prompt');
    sendPromptBtn.disabled = true;
    let interactionContainer=document.getElementById('interaction-container');
    let error=document.querySelector('.error');
    document.getElementById('prompt').addEventListener('input',()=>{
      let prompt=document.getElementById('prompt').value;
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
      let prompt=document.getElementById('prompt').value;
    logoWelcome.classList.add('hidden');
    promptResponse.classList.remove('hidden');
    console.log(prompt);

    function summarizer(text) {
      // Split the string into an array of words
      const words = text.trim().split(/\s+/);
      
      // Extract the first four words
      const firstFourWords = words.slice(0, 4).join(' ');
      
      return firstFourWords;
  }

    function formatText(unformattedText) {
      // Replace newlines with HTML line breaks
      const formattedText = unformattedText.replace(/\n/g, '<br>');
  
      return formattedText;
  }
    async function sendPrompt() 
    {
        try {
            const url = 'http://localhost:8000/response'; // Assuming your Express server is running on port 8000 and the endpoint is '/chatbot'
                
            const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt: prompt })
                });
        
                if (!response.ok) {
                    error.classList.remove('hidden');
                    throw new Error('Failed to fetch response from server.');
                    
                }
                else{
                  error.classList.add('hidden');
                 
                }
                const jsonResponse = await response.json();
                console.log(jsonResponse.response);
                sendPromptBtn.disabled=false;
                const formattedText = formatText(jsonResponse.response);
                //promptResponse.innerHTML = jsonResponse.response;
                /*promptResponse.innerHTML =`<div class="response-body w-5/6 gap-5 flex justify-center flex-col">
                <div class="user-prompt p-2">
                  user: ${prompt}
                </div>
                <div class="response-message p-2">
                  J.A.R.V.I.S: ${jsonResponse.response}
                </div>
              </div>` */
              const interaction = `<div class="response-body gap-1 flex justify-center flex-col">
              <div class="user-prompt p-2">
                User: ${prompt}
              </div>
              <div class="response-message w-full flex p-2">
                <div class="message">
                 J.A.R.V.I.S: ${formattedText}
                </div>
              </div>
            </div>`;
            interactionContainer.insertAdjacentHTML('beforeend',interaction);
            const addSummary = `<div class="summary hover:cursor-pointer h-fit text-center p-2 my-1"><p class="hover:text-white transition-all duration-200">${summarizer(prompt)}</p>
            </div>`;
            sidebar.insertAdjacentHTML('afterbegin', addSummary);
            
                //document.getElementById('response').textContent = jsonResponse.response;
            } catch (error) {
                error.classList.remove('hidden');
                interactionContainer.classList.add('hidden');
                console.error('Error:', error);
                // Handle error if necessary
            }
    }
    sendPrompt();
});
});
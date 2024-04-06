document.addEventListener('DOMContentLoaded',()=>{
    let newchat=document.querySelector('.newchat');
    let opensidebarBtn=document.querySelector('.toggle-sidebar');
    let cross=document.querySelector('.cross');
    let dropdownSelection=document.querySelector('.dropdown-selection');
    let modelSelection=document.querySelector('.model-selection');
    let sidebarContent=document.querySelector('.sidebar-content');
    let darkmodeBtn=document.getElementById('dark-mode-btn');
    opensidebarBtn.addEventListener('click',()=>{
        let sidebar=document.querySelector('.sidebar');
        sidebar.classList.add('open-sidebar');
        sidebar.classList.remove('close-sidebar');
        cross.classList.remove('hidden')
        opensidebarBtn.classList.add('hidden')
        sidebarContent.classList.remove('hidden')
        if(sidebar.classList.contains('open-sidebar'))
        {
            newchat.classList.add('hide');
        }
        
    })
    cross.addEventListener('click',()=>{
        let sidebar=document.querySelector('.sidebar');
        sidebar.classList.remove('open-sidebar');
        sidebar.classList.add('close-sidebar');
        cross.classList.add('hidden')
        opensidebarBtn.classList.remove('hidden')
        sidebarContent.classList.add('hidden')
        if(sidebar.classList.contains('close-sidebar'))
        {
            newchat.classList.remove('hide');
        }
    });
    modelSelection.addEventListener('click',()=>{
        dropdownSelection.classList.toggle('hidden');
    });

    //Typing animations
    const words = ["Hello!","I am JARVIS","How may I help you today?"];
    let index = 0;
    let wordIndex = 0;
    let intervalId;

    function typingText() {
        const target = document.getElementById("type");
        const currentWord = words[wordIndex];
        const currentWordLength = currentWord.length;

        if (index < currentWordLength) {
            target.textContent += currentWord.charAt(index);
            index++;
            setTimeout(typingText, 50);
        } else {
            setTimeout(() => {
                intervalId = setInterval(removeText, 20);
            }, 2000);
        }
    }

// To remove text after typing
function removeText() {
    const target = document.getElementById("type");
    const currentWord = words[wordIndex];
    const currentWordLength = currentWord.length;

    if (index > 0) {
        target.textContent = currentWord.substring(0, index - 1);
        index--;
    } else {
        clearInterval(intervalId);
        wordIndex = (wordIndex + 1) % words.length;
        index = 0;
        setTimeout(typingText, 1000);
    }
}

// Add a delay before typing the first sentence
setTimeout(typingText, 500);

let jarvisLite=document.getElementById("jarvis-lite");
let jarvisAdvanced=document.getElementById("jarvis-advanced");
// Assuming jarvisLite and jarvisAdvanced are radio button elements
jarvisLite.checked = true;
jarvisLite.addEventListener('change', function() {
    if (jarvisLite.checked) {
        jarvisAdvanced.checked = false;
    }
});

jarvisAdvanced.addEventListener('change', function() {
    if (jarvisAdvanced.checked) {
        jarvisLite.checked = false;
    }
});
let interactionContainer = document.getElementById('interaction-container');
let scrollDownBtn=document.querySelector('.scroll-down-btn');

function isScrollAtBottom(element) {
    // Calculate the difference between scroll height and client height
    const scrollDifference = element.scrollHeight - element.clientHeight;

    // Check if the scroll difference is close to the scroll top position
    // You can adjust the threshold as needed
    return Math.abs(element.scrollTop - scrollDifference) < 1;
}
interactionContainer.addEventListener('scroll',()=>{
    if(isScrollAtBottom(interactionContainer)){
        scrollDownBtn.classList.add('hidden');
    }
    else{
        scrollDownBtn.classList.remove('hidden');
    }
})

scrollDownBtn.addEventListener('click',()=>{
    interactionContainer.scrollTop=interactionContainer.scrollHeight;
});

});
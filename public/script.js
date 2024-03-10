document.addEventListener('DOMContentLoaded',()=>{
    let opensidebarBtn=document.querySelector('.toggle-sidebar');
    let cross=document.querySelector('.cross');
    let dropdownSelection=document.querySelector('.dropdown-selection');
    let modelSelection=document.querySelector('.model-selection');
    let sidebarContent=document.querySelector('.sidebar-content');
    opensidebarBtn.addEventListener('click',()=>{
        let sidebar=document.querySelector('.sidebar');
        //sidebar.style.width="300px";
        sidebar.classList.add('open-sidebar');
        sidebar.classList.remove('close-sidebar');
        cross.classList.remove('hidden')
        opensidebarBtn.classList.add('hidden')
        sidebarContent.classList.remove('hidden')
    })
    cross.addEventListener('click',()=>{
        let sidebar=document.querySelector('.sidebar');
        //sidebar.style.width="0px";
        sidebar.classList.remove('open-sidebar');
        sidebar.classList.add('close-sidebar');
        cross.classList.add('hidden')
        opensidebarBtn.classList.remove('hidden')
        sidebarContent.classList.add('hidden')
    });
    modelSelection.addEventListener('click',()=>{
        dropdownSelection.classList.toggle('hidden');
    });

    //Typing animations
    const words = ["Hi!","I am J.A.R.V.I.S","How can I help you today?"];
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
        }, 1500);
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

});
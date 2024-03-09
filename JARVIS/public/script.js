document.addEventListener('DOMContentLoaded',()=>{
    let opensidebarBtn=document.querySelector('.toggle-sidebar');
    let cross=document.querySelector('.cross');
    let dropdownSelection=document.querySelector('.dropdown-selection');
    let modelSelection=document.querySelector('.model-selection');
    opensidebarBtn.addEventListener('click',()=>{
        let sidebar=document.querySelector('.sidebar');
        //sidebar.style.width="300px";
        sidebar.classList.add('open-sidebar');
        sidebar.classList.remove('close-sidebar');
        cross.classList.remove('hidden')
        opensidebarBtn.classList.add('hidden')
    })
    cross.addEventListener('click',()=>{
        let sidebar=document.querySelector('.sidebar');
        //sidebar.style.width="0px";
        sidebar.classList.remove('open-sidebar');
        sidebar.classList.add('close-sidebar');
        cross.classList.add('hidden')
        opensidebarBtn.classList.remove('hidden')
    });
    modelSelection.addEventListener('click',()=>{
        dropdownSelection.classList.toggle('hidden');
    })
});
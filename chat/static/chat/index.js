document.addEventListener("DOMContentLoaded", ()=>{

    clear_divs();
    document.getElementById("search_chat_wrapper_div").style.display = "block";

    document.getElementById("create_chat_navbar_link").addEventListener("click", ()=>{
        clear_divs()
        document.getElementById("create_chat_wrapper_div").style.display = "block";
    })
})

function clear_divs(){
    document.querySelectorAll("#search_chat_wrapper_div, #create_chat_wrapper_div").forEach(div => {
        div.style.display = "none";
    })
}
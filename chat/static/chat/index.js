document.addEventListener("DOMContentLoaded", ()=>{

    // initial index load
    clear_divs();
    document.getElementById("search_chat_wrapper_div").style.display = "block";

    //adding functioning button which directs user to create a chat
    document.getElementById("create_chat_navbar_link").addEventListener("click", ()=>{
        clear_divs()
        document.getElementById("create_chat_wrapper_div").style.display = "block";
    })

    // submit button on create chat page to allow user to create a new chat
    document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #create-chat-button").addEventListener("click", ()=>{
        create_chat()
    })
})

// clearing all visible divs to start clean
function clear_divs(){
    document.querySelectorAll("#search_chat_wrapper_div, #create_chat_wrapper_div").forEach(div => {
        div.style.display = "none";
    })
}

// querying database and then seeing if chat can be created. Ensuring no names are crossed
async function create_chat(){
    const chat_name_input = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #chat_name");
    const chat_name = chat_name_input.value;
    const error_p = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div .error-div")
    error_p.innerHTML = "";
    if (chat_name === ""){
        error_p.innerHTML = "Enter Valid Chat Name"
    } else{
        chat_name_input.value = "";

        let data_json = await fetch("create_chat", {
            method: "post",
            body: JSON.stringify({
                chat_name: chat_name
            })
        })
        let data = await data_json.json();
        const available = data.available;
        if (available === "yes"){
            error_p.innerHTML = "Chat Created"
        } else if (available === "no"){
            error_p.innerHTML = "Name Already Taken"
        }
    }
}
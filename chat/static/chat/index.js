document.addEventListener("DOMContentLoaded", ()=>{

    // initial index load
    clear_divs();
    load_search_chat_div();
    

    //adding functioning button which directs user to create a chat
    document.getElementById("create_chat_navbar_link").addEventListener("click", ()=>{
        clear_divs()
        document.getElementById("create_chat_wrapper_div").style.display = "block";
    })

    // submit button on create chat page to allow user to create a new chat
    document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #create-chat-button").addEventListener("click", ()=>{
        create_chat()
    })

    //adding functionality to public and private buttons
    document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #public-chat-state-button").addEventListener("click", ()=>{
        change_create_chat_state("public");
    })

    document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #private-chat-state-button").addEventListener("click", ()=>{
        change_create_chat_state("private");
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
    const success_p = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div .success-div")

    //private chat room coding
    let chat_state = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #create-chat-button").getAttribute("chat_type")
    const chat_password_input = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #chat_password")
    const chat_password = chat_password_input.value
    chat_password_input.value = "";


    //getting chat category
    const chat_category = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #chat_category")
    const chat_category_value = chat_category.value
    chat_category.value = "";

    console.log(chat_password)
    error_p.innerHTML = "";
    if (chat_name === "" || chat_category_value === ""){
        error_p.innerHTML = "Fill in required field"
    } else{
        chat_name_input.value = "";

        let data_json = await fetch("create_chat", {
            method: "post",
            body: JSON.stringify({
                chat_name: chat_name,
                chat_state: chat_state,
                chat_password: chat_password,
                chat_category:chat_category_value
            })
        })
        let data = await data_json.json();
        const available = data.available;
        if (available === "yes"){
            success_p.innerHTML = "Chat Created"
        } else if (available === "no"){
            error_p.innerHTML = "Name Already Taken"
        }
    }
}

function change_create_chat_state(state){
    let private_button = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #private-chat-state-button");
    let public_button = document.querySelector(" body .main-wrapper-div #create_chat_wrapper_div #public-chat-state-button");
    let create_chat_button = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #create-chat-button");
    let password_input = document.querySelector("body .main-wrapper-div #create_chat_wrapper_div #chat_password");
    private_button.classList.remove("active-button");
    public_button.classList.remove("active-button");

    if (state === "public"){
        public_button.classList.add("active-button")
        create_chat_button.setAttribute("chat_type", "public")
        password_input.style.visibility = "hidden";
    } else {
        private_button.classList.add("active-button")
        create_chat_button.setAttribute("chat_type", "private")
        password_input.style.visibility = "visible";
    }
}

    function load_search_chat_div(){
        document.getElementById("search_chat_wrapper_div").style.display = "block";
}
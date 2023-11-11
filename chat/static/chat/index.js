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

    document.getElementById("refresh-button").addEventListener("click", ()=>{
        location.reload()
    })
    
    //my chats page
    document.getElementById("my_chats_navbar_link").addEventListener("click", ()=>{
        load_my_chats_page();
    })
})

// clearing all visible divs to start clean
function clear_divs(){
    document.querySelectorAll("#search_chat_wrapper_div, #create_chat_wrapper_div, #my_chats_wrapper_div").forEach(div => {
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

//fetching data from server and generating a list of all the chats currently online
async function load_search_chat_div(){
    document.getElementById("search_chat_wrapper_div").style.display = "block";
    const chatroom_data_json = await fetch("chat_room_info",{
        method: "get"
    })
    let chatroom_data = await chatroom_data_json.json()
    chatroom_data = chatroom_data.info
    console.log(chatroom_data);
    const current_live_chats_div = document.getElementById("current_live_chats_div")
    load_div_data(current_live_chats_div, chatroom_data,"search_div")
}

//general chat div loading function
function load_div_data(overall_wrapper_div, chatroom_data, page_type){
    console.log(overall_wrapper_div,chatroom_data)
    for (i=0;i<chatroom_data.length;i++){
        let wrapper_div = document.createElement("div")
        wrapper_div.classList.add("individual-chat-wrapper-div")

        let first_div = document.createElement("div")
        first_div.classList.add("individual-chat-wrapper-div-divisions")
        let second_div = document.createElement("div")
        second_div.classList.add("individual-chat-wrapper-div-divisions")

        let title_b = document.createElement("b");
        let creator_p = document.createElement("p");

        let join_button_wrap = document.createElement("a");
        join_button_wrap.setAttribute("href", `/chat/${chatroom_data[i].room_name}`)
        let join_button = document.createElement("button");
        join_button.innerHTML = "Join Room"
        join_button_wrap.append(join_button)

        title_b.innerHTML = `${chatroom_data[i].room_name}`
        creator_p.innerHTML = `Created by: ${chatroom_data[i].creator_id}`
        
        let type_p = document.createElement("p");
        let category_p = document.createElement("p");
        type_p.innerHTML = `Type: ${chatroom_data[i].state}`
        category_p.innerHTML = `Category: ${chatroom_data[i].category}`

        //adding my chats removing the chat page
        let remove_button = ""
        if (page_type === "my_chats"){
            remove_button = document.createElement("button");
            remove_button.innerHTML = "Close Chat"
            const room_name = chatroom_data[i].room_name
            remove_button.addEventListener("click", ()=>{
                remove_chat(room_name)
            })
        }
        
        first_div.append(title_b,creator_p,join_button_wrap)
        second_div.append(type_p,category_p,remove_button)
        
        wrapper_div.append(first_div,second_div)
        overall_wrapper_div.append(wrapper_div)
    }
}

async function load_my_chats_page(){
    clear_divs();
    document.querySelector("#my_chats_wrapper_div").style.display = "block";
    const my_chats_wrapper_div = document.querySelector("#current_my_chats_div");
    my_chats_wrapper_div.innerHTML = "";

    let my_chat_data_json = await fetch("my_chats_info")
    let my_chats_data = await my_chat_data_json.json()
    console.log(my_chats_data)
    load_div_data(my_chats_wrapper_div, my_chats_data.data, "my_chats")
}

async function remove_chat(room_name){
    let remove_chat_outcome_json = await fetch("remove_chat",{
        method: "post",
        body : JSON.stringify({
            room_name: room_name
        })
    })
    let remove_chat_outcome = await remove_chat_outcome_json.json();
    console.log(remove_chat_outcome)
}
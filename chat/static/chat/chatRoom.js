document.addEventListener("DOMContentLoaded", ()=>{
    const room_name = JSON.parse(document.getElementById("room_name").textContent);
    const username = JSON.parse(document.getElementById("username").textContent);

    const chat_message_input = document.querySelector("#chat_message_input");

    load_past_messages(room_name)

    const chatSocket = new WebSocket( 
        'ws://'
        + window.location.host
        + '/ws/chat/'
        + room_name
        + '/'
    )

    chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(data)
        document.querySelector("#chat_log").value += ("Sent by: " + data.username + '\n' + data.message + '\n\n')
    };

    chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly')
    };

    chat_message_input.onkeyup = function(e) {
        if (e.keyCode === 13) {
            document.querySelector('#chat_message_submit').click();
        }
    };

    chat_message_input.focus();

    document.querySelector("#chat_message_submit").addEventListener("click", ()=>{
        const message = chat_message_input.value;
        if (message.trim() == ""){
            return
        }
        chatSocket.send(JSON.stringify({
            'message': message,
            'username': username,
            'room_name': room_name
        }))
        chat_message_input.value = '';
    })

    let save_status_button = document.getElementById("save_chat_button");
    save_status_button.addEventListener("click", ()=>{
        save_chat(room_name,save_status_button.getAttribute("save_action"))
    })
})

async function save_chat(room_name,save_action){
    console.log(room_name)
    let save_status_button = document.getElementById("save_chat_button");
    if (save_action === "unsave"){
        save_status_button.innerHTML = "Save"
        save_status_button.setAttribute("save_action", "save")
    }else if (save_action === "save"){
        save_status_button.innerHTML = "Unsave"
        save_status_button.setAttribute("save_action", "unsave")
    };
    
    let outcome_json = await fetch("save_chat/",{
        method: "post", 
        body: JSON.stringify({
            room_name: room_name,
            save_action: save_action
        })
    })
    let outcome = await outcome_json.json()
    console.log(outcome)
    
}

async function load_past_messages(room_name){
    let message_data_json = await fetch("past_chat_messages/",{
        method:"post",
        body: JSON.stringify({
            room_name:room_name
        })
    });
    let message_data = await message_data_json.json();
    past_messages = message_data.data;
    console.log(past_messages);
    let chat_log = document.getElementById("chat_log");
    for(i=0;i<past_messages.length;i++){
        chat_log.value += (`Sent by: ${past_messages[i].sender_id}\n${past_messages[i].message}\n\n`)
    }
}
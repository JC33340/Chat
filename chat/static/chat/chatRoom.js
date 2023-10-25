document.addEventListener("DOMContentLoaded", ()=>{
    const room_name = JSON.parse(document.getElementById("room_name").textContent);
    
    const chat_message_input = document.querySelector("#chat_message_input");

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
        document.querySelector("#chat_log").value += (data.message + '\n')
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
        chatSocket.send(JSON.stringify({
            'message': message
        }))
        chat_message_input.value = '';
    })

})
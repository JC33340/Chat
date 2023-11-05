document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelector("#submit-button").addEventListener("click", (event)=>{
        event.preventDefault()
        form_submission()
    })
})

//form submission functions
async function form_submission(){
    const room_name = JSON.parse(document.getElementById("room_name").textContent);
    const password_div = document.getElementById("chat_password")
    const password = password_div.value
    const error_div = document.getElementById("error-div")
    error_div.innerHTML = ""
    password_div.value = "";

    console.log(password,room_name)
    if (password === ""){
        error_div.innerHTML = "Cannot Be Blank"
        return;
    }
    const data_json = await fetch("chat_room",{
        method: "post",
        body: JSON.stringify({
            room_name : room_name,
            password : password
        })
    })
    const data = await data_json.json()
    console.log(data.password)
    if (data.password === true){
        location.reload()
    }else if (data.password === false){
        error_div.innerHTML = "Incorrect Password"
    }
}
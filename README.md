# Chat

## Distinctiveness and Complexity
I have produced a chat application, distinct from the other projects previous as instead of using REST APIs to communicate with the django server, in each of the chatrooms a websocket connection is opened allowing for continuous and real time communication between the front and backend. Therefore no refreshing is required allowing for people to communicate with each other through a constantly open channel.There are a number of functions in the app giving it complexity. The user is allowed to create new private or public chatrooms, with the former requiring a password, each of the chat apps will be required to have a category, therefore specifying to other users the content of it. Other functions include saving chats which the user has an interest in, as well as viewing ones own chats. 

### static/chat file
Within this folder contains the css and Javascript content for the application. 

1. #### chat_login.js
This is the Javascript content for the login page of the app, containing a function which takes the user input username and password and, using REST APIs communicates with the backend to verify the credentials. Then if they are correct the django backend will reload the page and log the user into a session.

2. #### chatRooom.js
This is the Javascript for the functions which happen in each chat room. This includes the establishment of a websocket connection with the backend and creating channels and layers in order to allow for individual chatrooms to be formed based on the name of the room in the URL. This page also contains the functions for the sending and saving of messages, via REST APIs to the django backend. There is also a save and unsave button, allowing the user to save the chats allowing for easier access next time.

3. #### index.js
This file controls the navbar buttons for the create chat, my chat and saved chats page, changing the display status of each of the wrapper divs. For the index page, it displays all the chats that have been created by users. There is also a search function which queries django to look for chats with names similar to the user input. The refresh button reloads the entire page, so if any new chats are created they can be seen. On each of the chat divisions, there is a join chat button, if the chatroom is public then you will be redirected straight to the room, if the chatroom is private then you will be taken to a screen requiring password input. 

The create chat initially displays 2 input divs for the chat name and the category of the chats. So that people will know the purpose of the chat room. Chat names cannot be the same, and an error message will show if this occurs. There are also 2 buttons will toggle showing the state of the chat room, either being public or private. The default setting is public, but can be toggled to private. In private, an additional input div appears allowing the user to enter a password, which will then be required by other users to enter the chat room. Upon creation of the chatroom, if all the parameters are fulfilled then the user will be redirected to the index page.

The my chats page shows chats the the user has created, similar to the index page. An additional function of this page is the ability to close a chat, therefore deleting it from the database, and preventing other users from accessing it. 

Finally the saved chat page displays a div which displays all the chat rooms which the user has saved. Saving and unsaving can be done in the chatroom page itself. 

4. #### chatRoom.css/index.css/LoginRegister.css

This contains the css of the templates, nothing much special here.

### templates/chat file

This folder contains all of the html files required in the app, the login and registration pages, the index and the chatroom page itself. 

### consumers.py

This file contains the functions for the websocket connection, and what to do when the JS front end makes a connection/sends a message/ disconnects. Additionally its responsible for creating the channel layers, therefore allowing independent channels allowing for multiple chatrooms to be active at once. The create_message function in here also saves messages once they are sent and recieved by the backend, therefore re-opening of the chatroom, queries all the saved messages and sends it to the frontend to display.

### models.py

Contains 3 models. The User model stores the username and the password of each individual user, used for the login and the sessions. The LiveChats model saves all the chat information. The SavedChats model stores all the saved chats that each user makes. The Messages model saves all the messages that are sent in each chat for querying later, in order to look at the chat history.

### routing.py

The url.py file for the websocket, using the url to direct it to the function in the consumers.py page

### urls.py

Contains all the urls for the REST APIs as well as the page loading functions. For example, the loading of the login, registration, index and chatroom pages. The REST APIs, include the saving and creating of chats, the saving of messages, and the loading of various pages. 

### views.py

Contains all the corresponding functions for the urls.py, calling the SQLite model to retrieve the required information about the chats, the user or the messages. As well as the page loading functions such as the login and registration and index pages. 
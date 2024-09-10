function connect(event) {
   event.preventDefault(); // Prevents the default form submission behavior
 
   const user = document.querySelector("#username").value;
   const room = document.querySelector("#room").value;
   const phone = document.querySelector("#phone").value;
 
   console.log(user, room, phone); 
 // the concept of return keyword like just like we learn lexical scope concept so same like this when we used return and return was executed so they stop the execution of parent function
 function validname(name) {
   // this check a-z or A-Z + mean next character 
   if (!/^[a-zA-Z]+$/.test(name)) {
     alert("Please enter a correct name");
     return false; 
   }
   return true; 
 }

 function validroom(name) {
   if (typeof name !== "string") {
     alert("Please enter a correct room name");
     return false;
   }
   return true;
 }

 function validphone(number) {
   // they check the digit from 0-9  11 mean only 11 digit is acceptable
   if (!/^\d{11}$/.test(number)) {
     alert("Please enter a correct phone number");
     return false;
   }
   return true;
 }

 if (!validname(user) || !validroom(room) || !validphone(phone)) {
   // If any validation fails, prevent redirection
   document.querySelector("#username").value="";
   document.querySelector("#room").value="";
   document.querySelector("#phone").value=""
   return;
 }

 // If all validation passes, proceed with the redirection
 window.location.href = `chat.html?username=${user}&roomname=${room}&phone=${phone}`;
}
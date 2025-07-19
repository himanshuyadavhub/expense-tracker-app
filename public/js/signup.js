
function handleFormSubmit(event){
    event.preventDefault();
    const userName = event.target.userName.value.trim();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    console.log(userName,email,password);
    event.target.reset();
}
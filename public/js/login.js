
function handleFormSubmit(event){
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    alert(`Login with email ${email}, password ${password}!`);
    return;
}
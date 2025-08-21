
async function handleResetPasswordFormSubmit(event){
    event.preventDefault();
    const password= event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    try {
        if(password !== confirmPassword){
            alert('Password does not match!');
            return;
        }
        const currentUrl = window.location.pathname;
        const urlSplited = currentUrl.split("/");
        const requestId = urlSplited[urlSplited.length-1];
        

        const res = await axios.post(`http://3.108.126.137:5000/user/updatepassword/${requestId}`, {password});
        const {message} = res.data;
        console.log(message);
        alert("Password updated");
        window.location.href = "http://3.108.126.137:5000/user/login";
        return;
    } catch (error) {
        handleErrorMessage(error);
    }
}

function handleErrorMessage(error) {
    if (error.response) {
        alert(`${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
        console.log(`No response from server. Please check your network or server status.`);
    } else {
        console.log(`Error: ${error.message}`);
    }
}
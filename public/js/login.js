const url = "http://localhost:5000/user"

async function handleFormSubmit(event){
    try {
        event.preventDefault();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        
        const res = await axios.post(url+"/login",{email,password});
        const{message,data} = res.data;
        console.log(message);
        localStorage.setItem("token",data.token);
        window.location.href="./expenses.html"
        return;
    } catch (error) {
        handleErrorMessage(error);
    }
}

function handleErrorMessage(error) {
    if (error.response) {
        alert(`${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
        console.log(`No response from server. Please check your network or server status.`) ;
    } else {
        console.log(`Error: ${error.message}`);
    }
}
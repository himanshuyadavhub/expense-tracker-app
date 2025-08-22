// const host = "localhost";
const host = "3.108.126.137";


const url = `http://${host}/user`
async function handleFormSubmit(event){
    try {
        event.preventDefault();
        const userName = event.target.userName.value.trim();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        
        const res = await axios.post(url+"/create",{userName,email,password});
        const {message,data:createdUser} = res.data;
        console.log(message);
        event.target.reset();
    } catch (error) {
        handleErrorMessage(error)
    }
}

function handleErrorMessage(error) {
    if (error.response) {
        alert(`${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    } else if (error.request) {
        console.log(`No response from server. Please check your network or server status.`) ;
    } else {
        console.log(`Error: ${error.message}`);
    }
}

const url = "http://localhost:5000/user"

async function handleFormSubmit(event){
    try {
        event.preventDefault();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        
        const res = await axios.post(url+"/login",{email,password});
        const{message,data:user} = res.data;
        console.log(message);
        console.log("user", user);
        return;
    } catch (error) {
        console.log("Login failed!",error.message);
    }
}
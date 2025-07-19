
const url = "http://localhost:5000/user"
async function handleFormSubmit(event){
    try {
        event.preventDefault();
        const userName = event.target.userName.value.trim();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        
        const res = await axios.post(url+"/create",{userName,email,password});
        const createdUser = res.data.data;
        if(res.status === 400){
            alert(res.data.message);
            return;
        }
        console.log(createdUser)
        event.target.reset();
    } catch (error) {
        console.log("Form submission failed!",error.message);
    }
}
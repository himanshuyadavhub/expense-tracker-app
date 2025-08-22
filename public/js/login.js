// const host = "localhost";
const host = "3.108.126.137";

const url = `http://${host}:5000/user`

async function handleLoginFormSubmit(event) {
    try {
        event.preventDefault();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;

        const res = await axios.post(url + "/login", { email, password });
        const { message, data } = res.data;
        console.log(message);

        await setLocalStorageItem("token", data.token);
        await setLocalStorageItem("isPremiumUser", data.isPremiumUser);
        await setLocalStorageItem("userName", data.userName);


        window.location.href = `http://${host}:5000/expense`;

        return;
    } catch (error) {
        handleErrorMessage(error);
    }
}

function handleForgotPassword() {
    document.querySelector(".login-form-container").style.display = "none";
    document.querySelector(".forgot-password-form-container").style.display = "block";
}

async function handleForgotPasswordFormSubmit(event) {
    event.preventDefault();

    try {
        const email = event.target.forgotEmail.value.trim();
        const res = await axios.post(url + "/forgotpassword", { email });
        const { message } = res.data;
        console.log(message);
        alert("Password reset link has been sent on registered email!");
        document.querySelector(".login-form-container").style.display = "block";
        document.querySelector(".forgot-password-form-container").style.display = "none";

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

function setLocalStorageItem(key, value) {
    return new Promise((resolve, reject) => {
        try {
            localStorage.setItem(key, String(value));
            if (localStorage.getItem(key) === String(value)) {
                console.log(`Added${key} to LS`)
                resolve();
            } else {
                reject(new Error(`Failed to set ${key} in localStorage.`));
            }
        } catch (err) {
            reject(err);
        }
    });
}
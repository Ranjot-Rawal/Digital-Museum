const form = document.querySelector("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");
const submitBtn = document.querySelector(".submit-btn");


const counter = document.createElement("p");
counter.style.color = "#888";
counter.style.fontSize = "13px";
counter.style.marginTop = "8px";
counter.style.textAlign = "right";

messageInput.parentElement.appendChild(counter);

function updateCounter() {
    counter.textContent = `${messageInput.value.length}/500 Characters`;
}

updateCounter();

messageInput.addEventListener("input", updateCounter);


emailInput.addEventListener("input", () => {

    const email = emailInput.value.trim();

    if (email === "") {
        emailInput.style.borderColor = "#444";
    }

    else if (email.includes("@") && email.includes(".")) {
        emailInput.style.borderColor = "#2ecc71";
    }

    else {
        emailInput.style.borderColor = "#e74c3c";
    }

});


form.addEventListener("submit", function (e) {

    e.preventDefault();

    // if (
    //     nameInput.value.trim() === "" ||
    //     emailInput.value.trim() === "" ||
    //     messageInput.value.trim() === ""
    // ) {
    //     alert("Please fill all required fields.");
    //     return;
    // }

    submitBtn.disabled = true;
    submitBtn.textContent = "SENDING...";

    setTimeout(() => {

        submitBtn.textContent = "✓ SENT";
        submitBtn.style.background = "#28a745";

        setTimeout(() => {

            alert("Thank you! Your message has been received.");

            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = "SEND MESSAGE";
            submitBtn.style.background = "";

            emailInput.style.borderColor = "#444";
            updateCounter();

        }, 1500);

    }, 2000);

});
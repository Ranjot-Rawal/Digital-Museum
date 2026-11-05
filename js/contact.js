const form = document.querySelector("form");
if (form) {
    form.noValidate = true;

    const fields = ["name", "email", "subject", "message"].map((id) => {
        const input = document.getElementById(id);

        return {
            input,
            error: document.getElementById(`${id}-error`)
        };
    });
    const messageInput = document.getElementById("message");
    const counter = document.getElementById("message-counter");
    const status = form.querySelector(".form-status");

    function updateCounter() {
        counter.textContent = `${messageInput.value.length}/${messageInput.maxLength} characters`;
    }

    function validateField(input, error) {
        const value = input.value.trim();
        let message = "";

        if (input.required && !value) {
            message = "This field is required.";
        } else if (input.type === "email" && input.validity.typeMismatch) {
            message = "Enter a valid email address.";
        }

        input.setAttribute("aria-invalid", String(Boolean(message)));
        error.textContent = message;

        return !message;
    }

    messageInput.addEventListener("input", updateCounter);
    updateCounter();

    fields.forEach(({ input, error }) => {
        input.addEventListener("blur", () => validateField(input, error));
        input.addEventListener("input", () => {
            if (input.hasAttribute("aria-invalid")) {
                validateField(input, error);
            }
        });
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "";

        const invalidFields = fields.filter(({ input, error }) => !validateField(input, error));

        if (invalidFields.length > 0) {
            status.textContent = "Please correct the highlighted fields.";
            invalidFields[0].input.focus();
            return;
        }

        const submitButton = form.querySelector(".submit-btn");
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "SENDING...";

        try {
            const response = await fetch(form.action, {
                method: form.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(new FormData(form)))
            });
            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, message]) => {
                        const input = document.getElementById(field);
                        const error = document.getElementById(`${field}-error`);

                        if (input && error) {
                            input.setAttribute("aria-invalid", "true");
                            error.textContent = message;
                        }
                    });
                }
                throw new Error(result.message || "Your message could not be sent.");
            }

            form.reset();
            fields.forEach(({ input, error }) => {
                input.removeAttribute("aria-invalid");
                error.textContent = "";
            });
            updateCounter();
            status.textContent = result.message;
        } catch (error) {
            status.textContent = error.message || "Unable to reach the server. Please try again.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}
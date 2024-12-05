document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log("Username:", username);
    console.log("Password:", password);
    
    try {
        const response = await fetch("/user/authenticate", { // Update this route
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Authentication successful:", result);
            // Store the token in local storage or cookies
            localStorage.setItem("authToken", result.token);
            // Redirect to the dashboard or another page
            window.location.href = "/index.html";
        } else {
            alert(result.error || "Authentication failed!");
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        alert("An error occurred. Please try again.");
    }
});

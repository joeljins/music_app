document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/user/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // Include cookies with the request
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Authentication successful:", result);
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

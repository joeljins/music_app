show_playlists = document.getElementById('display_playlists');
list_of_playlists = document.getElementById('your_playlists');

// "Show Playlists" button event listener
show_playlists.addEventListener('click', async (event) => {
    const token = localStorage.getItem("authToken"); 
    try {
        const response = await fetch("playlist/display", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        const results = await response.json();

        // Clear table
        list_of_playlists.innerHTML = "";
        if (results.error) {
            list_of_playlists.innerHTML = `<p style="color: red;">Error: ${results.error}</p>`;
        } else if (results.length === 0) {
            list_of_playlists.innerHTML = `<p>No results found for "${query}".</p>`;
        } else {

            // Display playlists in list format
            const list = document.createElement("ul");
            results.forEach((item) => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = `/playlist/songs`;
                link.textContent = item.name;
                link.style.cursor = 'pointer';

                // Append to list
                listItem.appendChild(link);
                list.appendChild(listItem);
                });

                list_of_playlists.appendChild(list);
                const row = document.createElement('tr');

                const cell = document.createElement('td');

                // Create delete button
                const remove = document.createElement('button');
                remove.textContent = 'Delete';

                // Create the input box
                const delete_input = document.createElement('input');

                // Append
                cell.appendChild(remove);
                cell.appendChild(delete_input);
                row.appendChild(cell);
                list_of_playlists.appendChild(row);

                // Delete button event listener
                remove.addEventListener('click', async (event) => {
                    const playlist_name = delete_input.value;
                    
                    // Send the DELETE request to the server
                    try {
                        const response = await fetch("playlist/delete", {
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: JSON.stringify({ playlist_name }),
                        });
                        if (!response.ok) {
                            throw new Error(`Error: ${response.statusText}`);
                        }
                        const results = await response.json();
                        console.log('Delete response:', results);
                    } catch (error) {
                        console.error('An error occurred while deleting the playlist:', error);
                    }
                });
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred while performing the search.");
    }
}
)

// Get cell to append to
let add_playlist = document.getElementById("newplaylist");

// Get table to append to
let table = document.getElementById("add_playlist");

// Inserting playlist into database
add_playlist.addEventListener("click", (event) => {
    
    // Add name input
    table.innerHTML='';
    let row_1 = document.createElement('tr');
    let td_1 = document.createElement('td');
    const playlist_name = document.createElement('input');
    playlist_name.placeholder = 'Enter name'; 
    td_1.appendChild(playlist_name); 
    row_1.appendChild(td_1); 
    table.appendChild(row_1);

    // Add description input
    let row_2 = document.createElement('tr');
    let td_2 = document.createElement('td');
    const description = document.createElement('input');
    description.placeholder = 'Enter description';
    description.style.width = '300px';
    description.style.height = '40px';
    description.style.fontSize = '18px';
    description.style.padding = '10px';
    td_2.appendChild(description);
    row_2.appendChild(td_2);
    table.appendChild(row_2);

    // Add submit button
    let row_3 = document.createElement('tr');
    let td_3 = document.createElement('td');
    let submit = document.createElement('button');
    submit.textContent = 'Submit';
    td_3.appendChild(submit);
    row_3.appendChild(td_3);
    table.appendChild(row_3);

    // Submit button event listener
    submit.addEventListener( 'click', async (event) => {
        const query_1 = playlist_name.value;
        const query_2 = description.value;
        const token = localStorage.getItem("authToken");
        
        if (!query_1 || !query_2) {
            alert("Please enter name and details.");
            return;
        }
        
        // Send database parameters for insertion
        try {
            const response = await fetch("playlist/insert", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" ,
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ query_1, query_2 }),
            });
            const results = response.json();
            
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while performing the search.");
        }
		}
)
});
const song = document.getElementById("song");
const add_song = document.getElementById("add_song");

// Create the input field
const inputField = document.createElement('input');
inputField.type = 'text';
inputField.placeholder = 'Enter playlist name here';
inputField.id = 'inputField';

// Append the input field to the song button (not inside)
song.appendChild(inputField);

// Add event listener for the submit button
add_song.addEventListener('click', async function() {
    const inputValue = inputField.value;
    if (inputValue.trim() !== "") {
        console.log("Submitted text:", inputValue);
        let playlist_name = inputValue;
        inputField.value = "";
        const resultsDiv = document.getElementById("results");
        const listItems = resultsDiv.querySelectorAll("ul li");

        let songs = [];
        listItems.forEach((item, index) => {
            console.log(`Item ${index + 1}: ${item.textContent}`);
            songs.push(item.textContent.trim());
        });

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("playlist/add", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ songs, playlist_name }),
            });
            const results = await response.json(); 
            console.log(results);
        }
        catch (err) {
            console.error("Error:", err);
            alert("An error occurred while adding the playlist.");
        }
    } else {
        alert("Please enter a playlist name!");
    }
});


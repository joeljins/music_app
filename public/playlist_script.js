show_playlists = document.getElementById('display_playlists');
list_of_playlists = document.getElementById('your_playlists');

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
            console.log(results);

            list_of_playlists.innerHTML = "";
            if (results.error) {
                list_of_playlists.innerHTML = `<p style="color: red;">Error: ${results.error}</p>`;
            } else if (results.length === 0) {
                list_of_playlists.innerHTML = `<p>No results found for "${query}".</p>`;
            } else {
                const list = document.createElement("ul");
                results.forEach((item) => {
                    const listItem = document.createElement("li");
                    const link = document.createElement("a");
                    link.href = `/playlist/songs`;  // Set the URL of the link
                    link.textContent = item.name;  // Set the name of the playlist as the clickable text
                    link.style.cursor = 'pointer';  // Optional: Change the cursor to indicate it's clickable

                    // Append the link inside the list item
                    listItem.appendChild(link);

                    // Append the list item to the list
                    list.appendChild(listItem);
                    });
                list_of_playlists.appendChild(list);
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                const remove = document.createElement('button');
                remove.textContent = 'Delete'
                remove.addEventListener('click', (event) => {
                    
                })

            }
        } catch (err) {
            console.error("Error:", err);
            alert("An error occurred while performing the search.");
        }
    }
)


let add_playlist = document.getElementById("newplaylist");
let table = document.getElementById("add_playlist");

add_playlist.addEventListener("click", (event) => {
    
    table.innerHTML='';
    let row_1 = document.createElement('tr');
    let td_1 = document.createElement('td');
    const playlist_name = document.createElement('input');
    playlist_name.placeholder = 'Enter name'; 
    td_1.appendChild(playlist_name); 
    row_1.appendChild(td_1); 

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

    let row_3 = document.createElement('tr');
    let td_3 = document.createElement('td');
    let submit = document.createElement('button');
    submit.textContent = 'Submit';
    td_3.appendChild(submit);
    row_3.appendChild(td_3);
    
    submit.addEventListener( 'click', (event) => {

			const query_1 = playlist_name.value;
			const query_2 = description.value;
            const token = localStorage.getItem("authToken");

			if (!query_1 || !query_2) {
				alert("Please enter name and details.");
				return;
			}

			try {
				const response = fetch("playlist/insert", {
					method: "POST",
					headers: { 
                        "Content-Type": "application/json" ,
                        "Authorization": `Bearer ${token}`,
                    },
					body: JSON.stringify({ query_1, query_2 }),
				});

				const results = response.json();

				// Get the results container
				const resultsDiv = document.getElementById("results");
				resultsDiv.innerHTML = ""; // Clear previous results

				// Display results or an appropriate message
				if (results.error) {
					resultsDiv.innerHTML = `<p style="color: red;">Error: ${results.error}</p>`;
				} else if (results.length === 0) {
					resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
				} else {
					const list = document.createElement("ul");
					results.forEach((item) => {
						const listItem = document.createElement("li");
						listItem.textContent = item.result;
						list.appendChild(listItem);
					});
					resultsDiv.appendChild(list);
				}
			} catch (err) {
				console.error("Error:", err);
				alert("An error occurred while performing the search.");
			}
		}
    //}
)

    table.appendChild(row_1);
    table.appendChild(row_2);
    table.appendChild(row_3);
});
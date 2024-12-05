let search = document.getElementById("searchtype");
let query = document.getElementById("query");
search.addEventListener("click", (event) => {
    if ( search.value == "album" ){
        fetch(`/getAlbums?q=${query.value}`)
        .then(response => {
            return response.json();
        }).then(data => {
            console.log("Request successful");
            console.log(data);
            let table = document.getElementById("search");
            let results = document.createElement("table");
            data.forEach(element => {
                let row = document.createElement("tr"); // Create a table row
                let cell = document.createElement("td"); // Create a table cell
                cell.textContent = element; // Set the cell's text content
                row.appendChild(cell); // Append the cell to the row
                results.appendChild(row); // Append the row to the table
            });
            table.innerHTML = ''; // Clear any previous results
            table.appendChild(results);
        }).catch(error => {
            console.log(error);
        })
        }
    }
);

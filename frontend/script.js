// Time table edit functionality

// to delete button



const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(button => {
    button.addEventListener("click", function () {
        const row = this.closest("tr");
        row.remove();
    });
});


// to edit button 
const editButtons = document.querySelectorAll(".edit-btn");

editButtons.forEach(button => {
    button.addEventListener("click", function () {
        const row = this.closest("tr");
        const cells = row.querySelectorAll("td");

        for (let i = 1; i < cells.length - 1; i++) {
            let cell = cells[i];

            if (cell.isContentEditable) {
                // SAVE (button click)
                cell.contentEditable = "false";
                cell.classList.remove("bg-yellow-100");
            } else {
                // EDIT MODE
                cell.contentEditable = "true";
                cell.classList.add("bg-yellow-100");

                // ENTER KEY SAVE
                cell.addEventListener("keydown", function (e) {
                    if (e.key === "Enter") {
                        e.preventDefault(); // stop new line
                        cell.contentEditable = "false";
                        cell.classList.remove("bg-yellow-100");
                    }
                });
            }
        }
    });
});
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function showForm() {
    document.getElementById("new-task-form").style.display = "block";
};

function hideForm() {
    document.getElementById("new-task-form").style.display = "none";
};

function deleteTask(id) {
    fetch("api/tasks/"+id+"/", {
        method: "DELETE",
        headers: { "X-CSRFToken": getCookie('csrftoken') }
    }).then(Response => {
        if (Response.status == 200) {
            document.getElementById("task#"+id).remove()
        };
    });
};

function moveTask(id) {
    fetch("api/tasks/"+id+"/move/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie('csrftoken') }
    }).then(Response => {
        if (Response.status == 200) {
            var task = document.getElementById("task#"+id);
            if (task.parentElement.id == "doneTasks") {
                document.getElementById("notDoneTasks").appendChild(task);
                document.getElementById("moveBtn#"+id).textContent = "Stil not done!"
            } else {
                document.getElementById("doneTasks").appendChild(task);
                document.getElementById("moveBtn#"+id).textContent = "Done!"
            }
        };
    });
};

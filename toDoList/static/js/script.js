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
                document.getElementById("moveBtn#"+id).textContent = "Done!"
            } else {
                document.getElementById("doneTasks").appendChild(task);
                document.getElementById("moveBtn#"+id).textContent = "Stil not done!"
            }
        };
    });
};

function createTask() {
    title = document.getElementById("title").value;
    description = document.getElementById("description").value;

    fetch("api/tasks/", {
        method: "POST",
        headers: { "X-CSRFToken": getCookie('csrftoken'), "Content-Type": "application/json" },
        body: JSON.stringify({
            "task": {
                "title": title,
                "description": description,
                "done": false,
            }
        }),
    }).then(Response => {
        if (Response.status == 200) {
            var li = document.createElement("li");
            var taskDiv = document.createElement("div");
            taskDiv.innerHTML = title + " " + description + " ";
            var deleteTaskBtn = document.createElement("button");
            deleteTaskBtn.innerHTML = "Delete";
            
            var doneTaskBtn = document.createElement("button");
            doneTaskBtn.innerHTML = "Done!";

            Response.json().then(data => {
                li.id = "task#" + data.taskID;
                deleteTaskBtn.setAttribute("onclick", "deleteTask(" + data.taskID + ")");
                doneTaskBtn.setAttribute("onclick", "moveTask(" + data.taskID + ")");
                doneTaskBtn.id = "moveBtn#" + data.taskID;
            });

            taskDiv.appendChild(deleteTaskBtn);
            taskDiv.appendChild(doneTaskBtn);


            li.appendChild(taskDiv);
            document.getElementById("notDoneTasks").appendChild(li);
            hideForm();
        }
    });
};

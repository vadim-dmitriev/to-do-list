Vue.config.productionTip = false

Vue.component('to-do-list-item', {
	props: ['task'],
	data: function() {
		return {
			listClass: "list",
		}
	},
	template: `
	<li>
		<div>
			{{ task.id }} {{ task.title }} {{ task.description }} {{ task.done }}
			<button v-on:click="deleteTask(task.id)">Delete</button>
		</div>
	</li>
	`,
	methods: {
		deleteTask: function (id) {
			fetch("/api/tasks/"+id+"/", {
				method: "DELETE",
				headers: { "X-CSRFToken": getCookie('csrftoken'), "Content-Type": "application/json" },
			}).then(Response => {
				if (Response.status == 200) {
					this.$emit('delete-task');
				};
			});
		},
	},
});

Vue.component('to-do-list', {
	props: ['tasks'],
	data: function() {
		return {
			isHidden: true,
			newTaskTitle: "",
			newTaskDescription: "",
		}
	},
	template: `
	<div>
		<h2>In progress</h2>
		<ul>
			<to-do-list-item v-on:delete-task="deleteTask(task.id)"
							 v-on:new-task="newTask()"
							 v-for="task in tasks"
							 v-if="task.done == false"
							 v-bind:task="task">
			</to-do-list-item>
		</ul>
		<br>
		<h2>Done</h2>
		<ul>
			<to-do-list-item v-on:delete-task="deleteTask(task.id)"
							 v-for="task in tasks"
							 v-if="task.done == true"
							 v-bind:task="task">
			</to-do-list-item>
		</ul>
		<button v-on:click="isHidden = !isHidden">New task</button>
		<div class="new-task-form" v-bind:class="{hidden: isHidden}">
			<input v-model="newTaskTitle" placeholder="Title"></input>
			<input v-model="newTaskDescription" placeholder="Description"></input>
			<button v-on:click="isHidden = !isHidden; newTaskDescription=''; newTaskTitle=''">x</button>
			<button v-on:click="saveNewTask()">Save</button>
		</div>
	</div>
	`,
	methods: {
		deleteTask: function (id) {
			this.tasks.splice(this.tasks.findIndex(task => task.id === id), 1);
		},
		saveNewTask: function () {
			fetch("/api/tasks/", {
				method: "POST", 
				headers: { "X-CSRFToken": getCookie('csrftoken'), "Content-Type": "application/json" },
				body: JSON.stringify({
					"task": {
						"title": this.newTaskTitle,
						"description": this.newTaskDescription,
						"done": false,
					}
				})
			}).then(Response => {
				if (Response.status == 200) {
					this.isHidden = true;
					Response.json().then(resp => {
						this.tasks.push({
							"id": resp.taskID,
							"title": this.newTaskTitle,
							"description": this.newTaskDescription,
							"done": false,
						});
					});
				};
			});
		},
	},
});

new Vue({
	el: "#app",
	template: `
	<div>
		<h1>Hello World</h1>
		<to-do-list v-bind:tasks="tasks"/>
	</div>
	`,
	data: {
		tasks: [],
	},
	created: function () {
		fetch('/api/tasks/', {
			method: "GET",
			headers: { "X-CSRFToken": getCookie('csrftoken'), "Content-Type": "application/json" },
		}).then(Response => {
			Response.json().then(ResponseObj =>{
				this.tasks = ResponseObj["tasks"];
			});
		})
	},
});

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
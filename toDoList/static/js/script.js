Vue.config.productionTip = false

Vue.component('to-do-list-item', {
	props: ['task'],
	data: function() {
		return {
			moveBtnTitle: ((this.task.done) ? 'Stil not done!' : 'Done!'),
		}
	},
	template: `
	<div class="task-item">
		<h2>{{ task.title }}</h2>
		<h4>{{ task.description }}</h4>
		<button v-on:click="deleteTask(task.id)">Delete</button>
		<button v-on:click="moveTask(task.id)">{{ moveBtnTitle }}</button>
	</div>
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
		moveTask: function (id) {
			fetch("/api/tasks/"+id+"/move/", {
				method: "POST",
				headers: { "X-CSRFToken": getCookie('csrftoken'), "Content-Type": "application/json" },
			}).then(Response => {
				if (Response.status == 200) {
					this.task.done = !this.task.done;
				}
			});
		},
	},
});

Vue.component('to-do-list', {
	props: ['tasks'],
	data: function() {
		return {}
	},
	template: `
	<div class="tasks-desk">

		<div class="tasks-col">
			<h1>In progress</h1>
			<to-do-list-item v-on:delete-task="deleteTask(task.id)"
							 v-on:new-task="newTask()"
							 v-for="task in tasks"
							 v-if="task.done == false"
							 v-bind:task="task">
			</to-do-list-item>
		</div>
		
		<div class="tasks-col">
			<h1>Done</h1>
			<to-do-list-item v-on:delete-task="deleteTask(task.id)"
							 v-for="task in tasks"
							 v-if="task.done == true"
							 v-bind:task="task">
			</to-do-list-item>
		</div>
	</div>
	`,
	methods: {
		deleteTask: function (id) {
			this.tasks.splice(this.tasks.findIndex(task => task.id === id), 1);
		},
	}
});

new Vue({
	el: "#app",
	template: `
	<div class="app">
		<to-do-list v-bind:tasks="tasks"></to-do-list>
		<button class="btn" v-on:click="isHidden = !isHidden">+</button>
		<div class="new-task-form" v-bind:class="{hidden: isHidden}">
			<input v-model="newTaskTitle" placeholder="Title"></input>
			<br>
			<input v-model="newTaskDescription" placeholder="Description"></input>
			<br>
			<button v-on:click="isHidden = !isHidden; newTaskDescription=''; newTaskTitle=''">x</button>
			<button v-on:click="saveNewTask()">Save</button>
		</div>
	</div>
	`,
	data: {
		tasks: [],
		isHidden: true,
		newTaskTitle: "",
		newTaskDescription: "",
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
	methods: {
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
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
					this.$emit('deleteTask');
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

Vue.component('column', {
	props: ['column', 'tasks'],
	data: function() {
		return {}
	},
	template: `
		<div>
			<h1 class="text-center">
				{{ column.name }}
			</h1>
			<hr class="solid" />
			<div class="column">
				<to-do-list-item v-for="task in tasks" :task="task" v-on:deleteTask="deleteTask"/>
			</div>
		</div>
	`,
	methods: {
		deleteTask: function (id) {
			this.tasks.splice(this.tasks.findIndex(task => task.id == id), 1);
		},
	}
})

Vue.component('to-do-list', {
	props: ['tasks'],
	data: function() {
		return {
			columns: [
				{
					id: 0,
					name: "Backlog",
					status: "b"
				},
				{
					id: 1,
					name: "In progress",
					status: "p"
				},
				{
					id: 2,
					name: "Done",
					status: "d"
				},
			],
			columnTasks: (column) => this.tasks.filter(task => task.status == column.status)
		}
	},
	template: `
		<div class="row">
			<column v-for="column in columns" :tasks="columnTasks(column)" :column="column" class="col-4" />
		</div>
	`,
	methods: {
		onDrop: function(evt, list) {
			const taskID = evt.dataTransfer.getData('taskID')
			const item = this.items.tasks(task => task.id == taskID)
			item.list = list
	  	},
	}
});

new Vue({
	el: "#app",
	template: `
	<div class="app container">
		<div class="mb-4">
			<to-do-list v-bind:tasks="tasks"></to-do-list>
		</div>
		<div class="row">
			<button class="new-task-btn" v-on:click="isHidden = !isHidden">+</button>
			<div class="new-task-form" v-bind:class="{hidden: isHidden}">
				<input v-model="newTaskTitle" placeholder="Title"></input>
				<br>
				<input v-model="newTaskDescription" placeholder="Description"></input>
				<br>
				<button v-on:click="isHidden = !isHidden; newTaskDescription=''; newTaskTitle=''">x</button>
				<button v-on:click="saveNewTask()">Save</button>
			</div>
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
		});
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
					}
				})
			}).then(Response => {
				if (Response.status == 200) {
					this.isHidden = true;
					Response.json().then(resp => {
						this.tasks.push({
							"id": resp.id,
							"title": resp.title,
							"description": resp.description,
							"status": resp.status,
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

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
			{{ task.id }}
			<br>
			{{ task.title }}
			<br>
			{{ task.description }}
		</div>
	</li>
	`,
});

Vue.component('to-do-list', {
	props: ['tasks'],
	data: function() {
		return {
			listClass: "list",
			items: ['a', 'b', 'c'],
		}
	},
	template: `
	<div v-bind:class="listClass">
		<ul>
			<to-do-list-item v-for="task in tasks" v-bind:task="task"></to-do-list-item>
		</ul>
	</div>`,
});

new Vue({
	el: "#app",
	template: `
	<div>
		<h1>Hello World</h1>
		<to-do-list v-bind:tasks="tasks"></to-do-list>
	</div>
	`,
	data: {
		tasks: [],
	},
	created: function () {
		fetch('/api/tasks', {
			method: "GET",
			headers: { "X-CSRFToken": getCookie('csrftoken'), "Content-Type": "application/json" },
		}).then(Response => {
			// JSON.parse(Response.body);
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
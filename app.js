function allowDrop(event) {
    event.preventDefault();
}

function drag (event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop (event, columnId) {
    event.preventDefault();
    console.log("columnId =", columnId);
    const data = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(data);
    console.log('draggedElement =', draggedElement);

    if (draggedElement) {
        const taskStatus = columnId;
        updateTaskStatus(data, taskStatus)
        // keeps task in new column in the board
        event.target.querySelector('.task-container').appendChild(draggedElement);
    }
}

// function to update task status when moved to another column on the board
function updateTaskStatus(taskId, newStatus) {
    console.log('newStatus =', newStatus);
    tasks = tasks.map(task => {
        if(task.id === taskId) {
            return {
                ...task,
                status: newStatus
            }
        }
    })
    updateLocalStorage();
}

// get items from local storage key of 'tasks' if there is none create an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// let tasks = [];
console.log("tasks", tasks);

// Render task on board
document.addEventListener("DOMContentLoaded", renderTasks);

function renderTasks() {
    // localStorage.clear();
    const columns = ["todo", "in-progress", "done"];
    columns.forEach((columnId) => {
        const column = document.getElementById(columnId);
        // console.log("column =", column);
        // 1. clear task from board
        column.querySelector('.task-container').innerHTML = "";

        // 2. loop through the task and add to board
        tasks.forEach(task => {
            if(task.status === columnId) {
                const taskElement = createTaskElement(task.content, task.id);
                // show task in todo section 
                column.querySelector(".task-container").appendChild(taskElement)
            }
        });
    });
}

// ---------------------------------------------------------------------
// function for creating a task element
function createTaskElement(content, Id) {
    const taskId = Id;
    const task = document.createElement('div');
    task.id = taskId;
    task.className = 'task';
    task.draggable = true;
    task.innerHTML = `
        ${content}
        <span class="delete-btn" onclick="deleteTask('${taskId}')">
            ❌
        </span>
    `
    task.addEventListener("dragstart", drag);
    return task;
}

function deleteTask(taskId) {
    console.log("taskId =", taskId);
    tasks = tasks.filter((task) => task.id !== taskId);

    // // other way to filter
    // let newTask = [];
    // for (let i = 0; i < tasks.length; i++) {
    //     if (tasks[i] !== testId) newTask.push(tasks[i]);

    // after deleting task from array, updateLocalStorage
    updateLocalStorage();
    // new filtered array get rendered 
    renderTasks();
}

// ---------------------------------------------------------------------

/**
 * 
 */

function addTask(columnId) {
    const taskInput = document.getElementById('taskInput');
    const taskContent = taskInput.value.trim();
    if (taskContent !== "") {
        const newTask = {
            id: `task-${Date.now()}`, // creates id with the date of the task
            content: taskContent, // name of the task
            status: columnId
        }
        tasks.push(newTask)
        updateLocalStorage();
        renderTasks();
        taskInput.value = "";
    }
}

function updateLocalStorage() {
    // update localStorage with task
    localStorage.setItem("tasks", JSON.stringify(tasks))
}
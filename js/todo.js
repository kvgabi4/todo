'use strict';

// Set the date.
(function setDate() {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    document.querySelector('.day').textContent = weekDays[now.getDay()];
    document.querySelector('.date').textContent = now.toLocaleDateString('en-GB').split('/').join('-');
})();

// localStorage handler object.
const localDB = {
    setItem(key, value) {
        value = JSON.stringify(value);
        localStorage.setItem(key, value);
    },
    getItem(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return [];
        }
        return JSON.parse(value);
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
};

// Get initial todos from the localeStorage to arrays.
let todoArray = localDB.getItem('todo-list');
let completedArray = localDB.getItem('completed-list');

// Set new item.
const newToDo = (item) => {
    return `
    <div class="task">
        <input type="checkbox" class="checkbox" name="task1"><label class="task-text" for="task1">${item}</label><div class="fa fa-trash-o"></div>
    </div>`;
};

// Add todo to the DOM
const addToTheDOM = (list, todo) => {
    document.querySelector(list).insertAdjacentHTML('afterend', todo);
};

// You have x pending items.
const pendingItems = (arr) => {
    const todoItems = document.querySelector('.todo-list');
    todoItems.textContent = `You have ${arr.length} pending items`;
};

// Completed tasks: x%
const completedTasks = (arr1, arr2) => {
    const completedItems = document.querySelector('.completed-list');
    completedItems.textContent =
        Number.isNaN(arr2.length / (arr2.length + arr1.length)) ?
            `Completed tasks: 0%` :
            `Completed tasks: ${Math.round(arr2.length / (arr2.length + arr1.length) * 1000) / 10}%`;
};

// Set initial todo list to the DOM.
const getToDoList = () => {
    todoArray.forEach((item, index) => addToTheDOM('.todo-list', newToDo(todoArray[index])));
    completedArray.forEach((item, index) => addToTheDOM('.completed-list', newToDo(completedArray[index])));
    pendingItems(todoArray);
    completedTasks(todoArray, completedArray);
};
getToDoList();

// Add a todo to an array.
const addTodo = (arr, element) => {
    arr.unshift(element);
};

// Clear input field.
const clearInput = () => {
    document.querySelector('.input-todo').value = '';
};

// Remove todo from the DOM.
const removeFromTheDOM = (element) => {
    element.parentNode.remove();
};

const completedContainer = document.querySelector('.completed-list__container');
let completedCheckboxes = completedContainer.querySelectorAll('.checkbox');
completedCheckboxes.forEach(checkbox => checkbox.checked = true);

const todoContainer = document.querySelector('.todo-list__container');
let todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
todoCheckboxes.forEach(checkbox => checkbox.checked = false);

// Add todo from the completed list to the todocompleted list.
const completedToPending = () => {
    completedCheckboxes.forEach((checkbox, index) => checkbox.addEventListener('change', (ev) => {
        if (!ev.target.checked) {
            const label = checkbox.nextSibling.textContent;
            removeFromTheDOM(checkbox);
            addToTheDOM('.todo-list', newToDo(completedArray.find(item => item === label)));
            todoArray = todoArray.concat(completedArray.find(item => item === label));
            completedArray = completedArray.filter((item, index) => index !== completedArray.findIndex(item => item === label));
            todoArray.length > 0 ? localDB.setItem('todo-list', todoArray) : localDB.removeItem('todo-list');
            completedArray.length > 0 ? localDB.setItem('completed-list', completedArray) : localDB.removeItem('completed-list');
            pendingItems(todoArray);
            completedTasks(todoArray, completedArray);
            todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
            completedCheckboxes = completedContainer.querySelectorAll('.checkbox');
            return todoCheckboxes, completedCheckboxes;
        }
    }));
};


// Clear item.
const clearTodoItemInit = () => {
    const todoTrashes = todoContainer.querySelectorAll('.fa.fa-trash-o')
    todoTrashes.forEach((trash, index) => trash.addEventListener('click', () => {
        const label = trash.previousSibling.textContent;
        removeFromTheDOM(trash);
        //if (index === todoArray.findIndex(item => item === label)) {
            todoArray = todoArray.filter((item, index) => index !== todoArray.findIndex(item => item === label));
        //};
        todoArray.length > 0 ? localDB.setItem('todo-list', todoArray) : localDB.removeItem('todo-list');
        pendingItems(todoArray);
        completedTasks(todoArray, completedArray);
        emptyTodoList();
        return todoArray;
    }));
};

const clearTodoItem = () => {
    const todoTrashes = todoContainer.querySelectorAll('.fa.fa-trash-o')
    todoTrashes.forEach((trash, index) => trash.addEventListener('click', () => {
        const label = trash.previousSibling.textContent;
        removeFromTheDOM(trash);
        if (index === todoArray.findIndex(item => item === label)) {
            todoArray = todoArray.filter((item, index) => index !== todoArray.findIndex(item => item === label));
        };
        todoArray.length > 0 ? localDB.setItem('todo-list', todoArray) : localDB.removeItem('todo-list');
        pendingItems(todoArray);
        completedTasks(todoArray, completedArray);
        emptyTodoList();
        return todoArray;
    }));
};

const clearCompletedItem = (trashes, arr, list) => {
    const completedTrashes = completedContainer.querySelectorAll('.fa.fa-trash-o')
    completedTrashes.forEach((trash, index) => trash.addEventListener('click', () => {
        const label = trash.previousSibling.textContent;
        removeFromTheDOM(trash);
        const findItem = completedArray.find(item => item === label);
        //if (index === completedArray.findIndex(item => item === label)) {
            completedArray = completedArray.filter((item, index) => completedArray.indexOf(label) !== index);
        //};
        completedArray.length > 0 ? localDB.setItem('completed-list', completedArray) : localDB.removeItem('completed-list');
        pendingItems(todoArray);
        completedTasks(todoArray, completedArray);
        emptyTodoList();
        return completedArray;
    }));
};


const todoTrashes = todoContainer.querySelectorAll('.fa.fa-trash-o')
const completedTrashes = completedContainer.querySelectorAll('.fa.fa-trash-o')


const showHideBtn = document.querySelector('.show-hide');
const showHide = () => {
    let clickEvent = true;
    showHideBtn.addEventListener('click', () => {
        clickEvent ?
            (completedContainer.classList.add('hide'), showHideBtn.textContent = 'Show Complete') :
            (completedContainer.classList.remove('hide'), showHideBtn.textContent = 'Hide Complete');
        return clickEvent = !clickEvent;
    });
};

const clearAllBtn = document.querySelector('.clearAll');
const clearAll = () => {
    clearAllBtn.addEventListener('click', () => {
        todoCheckboxes.forEach(item => removeFromTheDOM(item));
        localDB.removeItem('todo-list');
        todoArray = [];
        emptyTodoList();
    });
}

const emptyTodoList = () => {
    const toastingContainer = document.querySelector('.toasting__container');
    if (todoArray.length > 0) {
        toastingContainer.classList.add('hide');
        completedContainer.classList.remove('hide');
        todoContainer.classList.remove('hide');
        clearAllBtn.classList.remove('hide');
        showHideBtn.classList.remove('hide');
    } else {
        setTimeout(() => {
            toastingContainer.classList.remove('hide');
            completedContainer.classList.add('hide');
            todoContainer.classList.add('hide');
            clearAllBtn.classList.add('hide');
            showHideBtn.classList.add('hide');
            clearTimeout();
        }, 1200);
    };
};

// Add todo from the todo list to the completed list.
const pendingToCompletedInit = () => {
    todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
    todoCheckboxes.forEach((checkbox, index) => checkbox.addEventListener('change', (ev) => {
        if (ev.target.checked) {
            const label = checkbox.nextSibling.textContent;
            removeFromTheDOM(checkbox);
            const findItem = todoArray.find(item => item === label);
            addToTheDOM('.completed-list', newToDo(findItem));
            completedArray = completedArray.concat(findItem);
            todoArray = todoArray.filter((item, index) => index !== todoArray.findIndex(item => item === label));
            todoArray.length > 0 ? localDB.setItem('todo-list', todoArray) : localDB.removeItem('todo-list');
            completedArray.length > 0 ? localDB.setItem('completed-list', completedArray) : localDB.removeItem('completed-list');
            pendingItems(todoArray);
            completedTasks(todoArray, completedArray);
            todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
            completedCheckboxes = completedContainer.querySelectorAll('.checkbox');
            completedCheckboxes.forEach(checkbox => checkbox.checked = true);
            clearCompletedItem();
            clearTodoItem();
            emptyTodoList();
            return todoCheckboxes, completedCheckboxes;
        }
    }));
};

const pendingToCompleted = () => {
    todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
    todoCheckboxes.forEach((checkbox, index) => checkbox.addEventListener('change', (ev) => {
        if (ev.target.checked) {
            const label = checkbox.nextSibling.textContent;
            removeFromTheDOM(checkbox);
            if (index === todoArray.findIndex(item => item === label)) {
                const findItem = todoArray.find(item => item === label);
                addToTheDOM('.completed-list', newToDo(findItem));
                completedArray = completedArray.concat(findItem);
                todoArray = todoArray.filter((item, index) => index !== todoArray.findIndex(item => item === label));
            };
            todoArray.length > 0 ? localDB.setItem('todo-list', todoArray) : localDB.removeItem('todo-list');
            completedArray.length > 0 ? localDB.setItem('completed-list', completedArray) : localDB.removeItem('completed-list');
            pendingItems(todoArray);
            completedTasks(todoArray, completedArray);
            todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
            completedCheckboxes = completedContainer.querySelectorAll('.checkbox');
            completedCheckboxes.forEach(checkbox => checkbox.checked = true);
            clearCompletedItem();
            clearTodoItem();
            emptyTodoList();
            return todoCheckboxes, completedCheckboxes;
        }
    }));
};

// Add new todo to the todo list.
const addTodoToTheList = () => {
    document.querySelector('.plus').addEventListener('click', () => {
        let input = document.querySelector('.input-todo').value;
        if (input !== '') {
            addTodo(todoArray, input);
            todoArray.forEach((item, index) => newToDo(todoArray[index]));
            localDB.setItem('todo-list', todoArray)
            addToTheDOM('.todo-list', newToDo(todoArray[0]));
            clearInput();
            pendingItems(todoArray);
            completedTasks(todoArray, completedArray);
            todoCheckboxes = todoContainer.querySelectorAll('.checkbox');
            pendingToCompleted();
            clearCompletedItem();
            clearTodoItem();
            emptyTodoList();
            return todoCheckboxes;
        }
    });
};
addTodoToTheList();
pendingToCompletedInit();
clearCompletedItem();
clearTodoItemInit();
clearAll();
showHide();

$(document).ready(function(){
    $.getJSON("/api/todos")
    .then(addTodos);

    $('#todoInput').keypress(function(event){
        if(event.which == 13) {
            createTodo();
        }
    });

    $('.list').on('click', 'li', function(){ // Event listener added to ul, which exists on page load
        updateTodo($(this));
    });

    $('.list').on('click', 'span', function(event){
        event.stopPropagation(); // If user clicks on span, do not trigger click on li
        removeTodo($(this).parent());
    });
});

function addTodos(todos) {
    // add todos to page
    todos.forEach(function(todo){
        addTodo(todo);
    });
}

function addTodo(todo) {
    var newTodo = $('<li class="task">' + todo.name + '<span>X</span></li>');
    newTodo.data('id', todo._id); // jQuery data attribute, does not show up in html
    newTodo.data('completed', todo.completed);
    if(todo.completed){ newTodo.addClass("done"); };
    $('.list').append(newTodo);
}

function createTodo() {
    // send request to create new todo
    var usrInput = $('#todoInput').val();
    $.post('/api/todos', {name: usrInput})
    .then(function(newTodo){
        $('#todoInput').val('');
        addTodo(newTodo);
    }).catch(function(err){
        console.log(err);
    });
}

function removeTodo(todo) {
    var clickedId = todo.data('id');
    var deleteUrl = '/api/todos/' + clickedId;

    $.ajax({
        method: 'DELETE',
        url: deleteUrl
    })
    .then(function(data){
        todo.remove();
    })
    .catch(function(err){
        console.log(err);
    });
}

function updateTodo(todo) {
    var updateUrl = '/api/todos/' + todo.data('id');
    var isDone = !todo.data('completed');
    updateData = {completed: isDone}

    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
    .then(function(updatedTodo){
        todo.toggleClass("done");
        todo.data('completed', isDone); // Update data attribute
    });
}
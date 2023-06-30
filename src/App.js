import React from "react";
import "./App.css";
import TodoTextEditSwitch from "./TodoTextEditSwitch";
import {
  dbUpdateGetData,
  dbUpdateAddTodo,
  dbUpdateMarkFinished,
  dbUpdateEditTodo,
  dbUpdateDeleteTodo,
} from "./TodosService.js";

const MarkTodoFinishedBtn = (props) => {
  const { todo, markTodoFinished } = props;
  return (
    <button
      className="markTodoFinishedBtn"
      type="button"
      onClick={() => markTodoFinished(todo.id)}
    >
      {todo.id + 1}
    </button>
  );
};

const DeleteTodoBtn = (props) => {
  const { todo, deleteTodo } = props;
  return (
    <button
      className="deleteTodoBtn"
      type="button"
      onClick={() => deleteTodo(todo.id)}
    >
      X
    </button>
  );
};

const SingleTodo = (props) => {
  const { id } = props.todo;
  return (
    <li key={id}>
      <div className="li-items-wrapper">
        <div className="todo-finished-btn">
          <MarkTodoFinishedBtn {...props} />
        </div>
        <div className="todo-edit-switch">
          <TodoTextEditSwitch {...props} />
        </div>
        <div className="delete-todo-btn">
          <DeleteTodoBtn {...props} />
        </div>
      </div>
    </li>
  );
};

class App extends React.Component {
  state = {
    inputText: "",
    todosLeft: 1,
    displayQualifer: "all",
    todoEditInput: "",
    todoList: [],
  };

  componentDidMount() {
    this.getTodos();
  }

  getTodos = () => {
    dbUpdateGetData()
      .then((response) => {
        this.setState({ todoList: this.newTodoList(response.todos) });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  newTodoList = (todos) => {
    return todos.map((element, index) => this.newListItem(element, index));
  };

  newListItem = (element, index) => {
    return {
      dbId: element.id,
      id: index,
      text: element.todo,
      isFinished: element.completed,
      showEditor: false,
    };
  };

  showTodoEditor = (id) => {
    let todoList = this.state.todoList;
    todoList[id].showEditor = true;

    this.setState({
      todoList: todoList,
    });
  };

  saveEditedTodo = (id, editedText) => {
    let todoList = this.state.todoList;
    todoList[id].showEditor = false;
    todoList[id].text = editedText;

    this.setState({
      todoList: todoList,
    });

    dbUpdateEditTodo(todoList[id].dbId, editedText);
  };

  changeText = (newText) => {
    this.setState({ inputText: newText });
  };

  manageTodoDisplaying = (todoList, displayQualifer) => {
    switch (displayQualifer) {
      case "all":
        break;
      case "active":
        todoList = todoList.filter((todo) => !todo.isFinished);
        break;
      case "completed":
        todoList = todoList.filter((todo) => todo.isFinished);
        break;
      default:
        console.log("unknown display qualifer");
    }
    return this.displayTodoList(todoList);
  };

  displayTodoList = (currentDisplayList) => {
    return currentDisplayList.map((todo) => (
      <SingleTodo
        todo={todo}
        key={todo.id}
        todoList={this.state.todoList}
        markTodoFinished={this.markTodoFinished}
        deleteTodo={this.deleteTodo}
        showTodoEditor={this.showTodoEditor}
        saveEditedTodo={this.saveEditedTodo}
      />
    ));
  };

  markTodoFinished = (id) => {
    const { calcTodosLeft } = this;
    let todoList = this.state.todoList;
    todoList[id].isFinished = !todoList[id].isFinished;

    this.setState({
      todoList: todoList,
      todosLeft: calcTodosLeft(todoList),
    });

    dbUpdateMarkFinished(todoList[id].dbId, todoList[id].isFinished); // inner Id doesn't match with db Id
  };

  deleteTodo = (id) => {
    const { calcTodosLeft, clearTodoList, assignNewId } = this;
    let todoList = this.state.todoList;
    dbUpdateDeleteTodo(todoList[id].dbId);
    todoList = clearTodoList(todoList, id);
    todoList = assignNewId(todoList);

    this.setState({
      todoList: todoList,
      todosLeft: calcTodosLeft(todoList),
    });
  };

  clearTodoList = (todoList, id) => {
    todoList.splice(id, 1);
    return todoList;
  };

  assignNewId = (todoList) => {
    todoList.forEach((todo, id) => (todo.id = id));
    return todoList;
  };

  addTodo = (e) => {
    e.preventDefault();
    const { inputText } = this.state;
    const { calcTodosLeft } = this;
    const setId = this.state.todoList.length;
    let todoList = this.state.todoList;
    todoList.push({
      id: setId,
      text: inputText,
      isFinished: false,
    });

    this.setState({
      inputText: "",
      todoList: todoList,
      todosLeft: calcTodosLeft(todoList),
    });

    dbUpdateAddTodo(inputText);
  };

  calcTodosLeft = (todoList) => {
    return todoList.filter((todo) => !todo.isFinished).length;
  };

  switchAllTodos = () => {
    const todoList = this.state.todoList;
    const { areAllTodoDone, calcTodosLeft } = this;

    areAllTodoDone(todoList)
      ? todoList.map((todo) => {
          todo.isFinished = false;
          return todo;
        })
      : todoList.map((todo) => {
          todo.isFinished = true;
          return todo;
        });

    this.setState({
      todoList: todoList,
      todosLeft: calcTodosLeft(todoList),
    });
  };

  areAllTodoDone = (todoList) => {
    return todoList.every((todo) => todo.isFinished);
  };

  setDisplayQualifer = (displayQualifer) => {
    this.setState({
      displayQualifer: displayQualifer,
    });
  };

  clearCompletedTodos = () => {
    const { todoList } = this.state;
    const clearedTodoList = todoList.filter((todo) => !todo.isFinished);

    this.setState({
      todoList: this.assignNewId(clearedTodoList),
    });
  };

  render() {
    const {
      addTodo,
      switchAllTodos,
      changeText,
      manageTodoDisplaying,
      calcTodosLeft,
      setDisplayQualifer,
      clearCompletedTodos,
    } = this;
    const { inputText, todoList, displayQualifer } = this.state;

    return (
      <div className="App appContainer app-container">
        <div className="header-wrapper">
          <h1>todos</h1>
        </div>
        <div className="content content-wrapper">
          <div className="input-wrapper">
            <button
              className="switchAllBtn"
              type="button"
              onClick={switchAllTodos}
            ></button>
            <form onSubmit={addTodo}>
              <input
                className="todosInput"
                name="inputText"
                type="text"
                placeholder="What needs to be done?"
                value={inputText}
                onChange={(e) => changeText(e.target.value)}
              ></input>
            </form>
          </div>
          <div className="todo-list-wrapper">
            <ul className="">
              {manageTodoDisplaying(todoList, displayQualifer)}
            </ul>
          </div>
          <div className="items-left-wrapper">
            <h6>{calcTodosLeft(todoList)} items left</h6>
          </div>
          <div className="control-buttons-wrapper">
            <button type="button" onClick={() => setDisplayQualifer("all")}>
              All
            </button>
            <button type="button" onClick={() => setDisplayQualifer("active")}>
              Active
            </button>
            <button
              type="button"
              onClick={() => setDisplayQualifer("completed")}
            >
              Completed
            </button>
            <button type="button" onClick={clearCompletedTodos}>
              Clear completed
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

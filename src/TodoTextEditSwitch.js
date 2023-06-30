import React from "react";
import "./index.css";

class TodoTextEditSwitch extends React.Component {
  state = {
    todoEditInput: this.props.todo.text,
  };

  changeText = (newText) => {
    this.setState({ todoEditInput: newText });
  };

  handleKeyDown = (e) => {
    const { todo, saveEditedTodo } = this.props;
    const { todoEditInput } = this.state;

    if (e.key === "Enter") {
      saveEditedTodo(todo.id, todoEditInput);
    }
  };

  render() {
    const { todo, showTodoEditor, saveEditedTodo } = this.props;
    const { todoEditInput } = this.state;
    const { changeText } = this;

    return todo.showEditor ? (
      <input
        className=""
        style={{ width: +todo.text.length * 17 + "px" }}
        autoFocus
        type="text"
        name="todoEditInput"
        onChange={(e) => changeText(e.target.value)}
        value={todoEditInput}
        onBlur={() => saveEditedTodo(todo.id, todoEditInput)}
        onKeyDown={(e) => {
          this.handleKeyDown(e);
        }}
      />
    ) : (
      <span
        style={{ width: +todo.text.length * 17 + "px" }}
        className={todo.isFinished ? "todoList-todoFinished" : ""}
        onDoubleClick={() => showTodoEditor(todo.id)}
      >
        {todo.text}
      </span>
    );
  }
}

export default TodoTextEditSwitch;

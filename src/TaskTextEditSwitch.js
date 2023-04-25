import React from "react";
import "./index.css";

class TaskTextEditSwitch extends React.Component {
  state = {
    taskEditInput: this.props.task.text,
  };

  changeText = (newText) => {
    this.setState({ taskEditInput: newText });
  };

  handleKeyDown = (e) => {
    const { task, saveEditedTask } = this.props;
    const { taskEditInput } = this.state;

    if (e.key === "Enter") {
      saveEditedTask(task.id, taskEditInput);
    }
  };

  render() {
    const { task, showTaskEditor, saveEditedTask } = this.props;
    const { taskEditInput } = this.state;
    const { changeText } = this;

    return task.showEditor ? (
      <input
        className=""
        style={{ width: +task.text.length * 17 + "px" }}
        autoFocus
        type="text"
        name="taskEditInput"
        onChange={(e) => changeText(e.target.value)}
        value={taskEditInput}
        onBlur={() => saveEditedTask(task.id, taskEditInput)}
        onKeyDown={(e) => {
          this.handleKeyDown(e);
        }}
      />
    ) : (
      <span
        style={{ width: +task.text.length * 17 + "px" }}
        className={task.isFinished ? "taskList-taskFinished" : ""}
        onDoubleClick={() => showTaskEditor(task.id)}
      >
        {task.text}
      </span>
    );
  }
}

export default TaskTextEditSwitch;

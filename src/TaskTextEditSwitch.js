import React from "react";
import "./index.css";

class TaskTextEditSwitch extends React.Component {
  state = {
    taskEditInput: this.props.task.text,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
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
    const { handleChange } = this;

    return task.showEditor ? (
      <input
        autoFocus
        type="text"
        name="taskEditInput"
        onChange={handleChange}
        value={taskEditInput}
        onBlur={() => saveEditedTask(task.id, taskEditInput)}
        onKeyDown={(e) => {
          this.handleKeyDown(e);
        }}
      />
    ) : (
      <span
        className={task.isFinished ? "taskList-taskFinished" : ""}
        onDoubleClick={() => showTaskEditor(task.id)}
      >
        {task.text}
      </span>
    );
  }
}

export default TaskTextEditSwitch;

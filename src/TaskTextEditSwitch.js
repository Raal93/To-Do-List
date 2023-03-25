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
    const { task, taskList, switchShowTaskText } = this.props;
    const { taskEditInput } = this.state;

    if (e.key === "Enter") {
      switchShowTaskText(taskList, task.id, taskEditInput);
    }
  };

  render() {
    const { task, switchShowEditor, taskList, switchShowTaskText } = this.props;
    const { taskEditInput } = this.state;
    const { handleChange } = this;

    return task.showEditor ? (
      <input
        autoFocus
        type="text"
        name="taskEditInput"
        onChange={handleChange}
        value={taskEditInput}
        onBlur={() => switchShowTaskText(taskList, task.id, taskEditInput)}
        onKeyDown={(e) => {
          this.handleKeyDown(e);
        }}
      />
    ) : (
      <span
        className={task.isFinished ? "taskList-taskFinished" : ""}
        onDoubleClick={() => switchShowEditor(taskList, task.id)}
      >
        {task.text}
      </span>
    );
  }
}

export default TaskTextEditSwitch;

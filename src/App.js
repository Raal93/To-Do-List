import React from "react";
import "./App.css";
import TaskTextEditSwitch from "./TaskTextEditSwitch";

const MarkTaskFinishedBtn = (props) => {
  const { task, markTaskFinished } = props;
  return (
    <button
      className="markTaskFinishedBtn"
      type="button"
      onClick={() => markTaskFinished(task.id)}
    >
      {task.id + 1}
    </button>
  );
};

const DeleteTaskBtn = (props) => {
  const { task, deleteTask } = props;
  return (
    <button
      className="deleteTaskBtn"
      type="button"
      onClick={() => deleteTask(task.id)}
    >
      X
    </button>
  );
};

const SingleTask = (props) => {
  const { id } = props.task;
  return (
    <li key={id}>
      <div className="li-items-wrapper">
        <div className="task-finished-btn">
          <MarkTaskFinishedBtn {...props} />
        </div>
        <div className="task-edit-switch">
          <TaskTextEditSwitch {...props} />
        </div>
        <div className="delete-task-btn">
          <DeleteTaskBtn {...props} />
        </div>
      </div>
    </li>
  );
};

class App extends React.Component {
  state = {
    inputText: "",
    tasksLeft: 3,
    displayQualifer: "all",
    taskEditInput: "",
    taskList: [
      { id: 0, text: "example task 1", isFinished: false, showEditor: false },
      { id: 1, text: "task 2", isFinished: true, showEditor: false },
      { id: 2, text: "example 3", isFinished: false, showEditor: false },
    ],
  };

  showTaskEditor = (id) => {
    let taskList = this.state.taskList;
    taskList[id].showEditor = true;

    this.setState({
      taskList: taskList,
    });
  };

  saveEditedTask = (id, editedText) => {
    let taskList = this.state.taskList;
    taskList[id].showEditor = false;
    taskList[id].text = editedText;

    this.setState({
      taskList: taskList,
    });
  };

  changeText = (newText) => {
    this.setState({ inputText: newText });
  };

  manageTaskDisplaying = (taskList, displayQualifer) => {
    switch (displayQualifer) {
      case "all":
        break;
      case "active":
        taskList = taskList.filter((task) => !task.isFinished);
        break;
      case "completed":
        taskList = taskList.filter((task) => task.isFinished);
        break;
      default:
        console.log("unknown display qualifer");
    }
    return this.displayTaskList(taskList);
  };

  displayTaskList = (currentDisplayList) => {
    return currentDisplayList.map((task) => (
      <SingleTask
        task={task}
        key={task.id}
        taskList={this.state.taskList}
        markTaskFinished={this.markTaskFinished}
        deleteTask={this.deleteTask}
        showTaskEditor={this.showTaskEditor}
        saveEditedTask={this.saveEditedTask}
      />
    ));
  };

  markTaskFinished = (id) => {
    const { calcTasksLeft } = this;
    let taskList = this.state.taskList;
    taskList[id].isFinished = !taskList[id].isFinished;

    this.setState({
      taskList: taskList,
      tasksLeft: calcTasksLeft(taskList),
    });
  };

  deleteTask = (taskId) => {
    const { calcTasksLeft, clearTaskList, assignNewId } = this;
    let taskList = this.state.taskList;
    taskList = clearTaskList(taskList, taskId);
    taskList = assignNewId(taskList);

    this.setState({
      taskList: taskList,
      tasksLeft: calcTasksLeft(taskList),
    });
  };

  clearTaskList = (taskList, taskId) => {
    taskList.splice(taskId, 1);
    return taskList;
  };

  assignNewId = (taskList) => {
    taskList.forEach((task, id) => (task.id = id));
    return taskList;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { inputText } = this.state;
    const { calcTasksLeft } = this;
    const setId = this.state.taskList.length;
    let taskList = this.state.taskList;
    taskList.push({
      id: setId,
      text: inputText,
      isFinished: false,
    });

    this.setState({
      inputText: "",
      taskList: taskList,
      tasksLeft: calcTasksLeft(taskList),
    });
  };

  calcTasksLeft = (taskList) => {
    return taskList.filter((task) => !task.isFinished).length;
  };

  switchAllTasks = () => {
    const taskList = this.state.taskList;
    const { areAllTaskDone, calcTasksLeft } = this;

    areAllTaskDone(taskList)
      ? taskList.map((task) => {
          task.isFinished = false;
          return task;
        })
      : taskList.map((task) => {
          task.isFinished = true;
          return task;
        });

    this.setState({
      taskList: taskList,
      tasksLeft: calcTasksLeft(taskList),
    });
  };

  areAllTaskDone = (taskList) => {
    return taskList.every((task) => task.isFinished);
  };

  setDisplayQualifer = (displayQualifer) => {
    this.setState({
      displayQualifer: displayQualifer,
    });
  };

  clearCompletedTasks = () => {
    const { taskList } = this.state;
    const clearedTaskList = taskList.filter((task) => !task.isFinished);

    this.setState({
      taskList: this.assignNewId(clearedTaskList),
    });
  };

  render() {
    const {
      handleSubmit,
      switchAllTasks,
      changeText,
      manageTaskDisplaying,
      calcTasksLeft,
      setDisplayQualifer,
      clearCompletedTasks,
    } = this;
    const { inputText, taskList, displayQualifer } = this.state;

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
              onClick={switchAllTasks}
            ></button>
            <form onSubmit={handleSubmit}>
              <input
                className="tasksInput"
                name="inputText"
                type="text"
                placeholder="What needs to be done?"
                value={inputText}
                onChange={(e) => changeText(e.target.value)}
              ></input>
            </form>
          </div>
          <div className="task-list-wrapper">
            <ul className="">
              {manageTaskDisplaying(taskList, displayQualifer)}
            </ul>
          </div>
          <div className="items-left-wrapper">
            <h6>{calcTasksLeft(taskList)} items left</h6>
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
            <button type="button" onClick={clearCompletedTasks}>
              Clear completed
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

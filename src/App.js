import React from "react";
import "./App.css";
import TaskTextEditSwitch from "./TaskTextEditSwitch";

const MarkTaskFinishedBtn = (props) => {
  const { task, markTaskFinished } = props;
  return (
    <button type="button" onClick={() => markTaskFinished(task.id)}>
      {task.id + 1}
    </button>
  );
};

const DeleteTaskBtn = (props) => {
  const { task, deleteTask } = props;
  return (
    <button type="button" onClick={() => deleteTask(task.id)}>
      X
    </button>
  );
};

const SingleTask = (props) => {
  const { id } = props.task;
  return (
    <li key={id}>
      <MarkTaskFinishedBtn {...props} />
      <TaskTextEditSwitch {...props} />
      <DeleteTaskBtn {...props} />
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

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  manageTaskDisplaying = (taskList, displayQualifer) => {
    switch (displayQualifer) {
      case "all":
        break;
      case "active":
        taskList = taskList.filter((task) => task.isFinished === false);
        break;
      case "completed":
        taskList = taskList.filter((task) => task.isFinished === true);
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

  deleteTask = (id) => {
    const { calcTasksLeft } = this;
    let taskList = this.state.taskList;
    taskList.splice(id, 1); // delete a task
    taskList = this.assignNewId(taskList); // sign new id nums

    this.setState({
      taskList: taskList,
      tasksLeft: calcTasksLeft(taskList),
    });
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
    return taskList.filter((task) => {
      return task.isFinished === false;
    }).length;
  };

  switchAllTasks = () => {
    const taskList = this.state.taskList;
    const { areAllTaskDone, calcTasksLeft } = this;

    let newTaskList = areAllTaskDone(taskList)
      ? taskList.map((task) => {
          task.isFinished = false;
          return task;
        })
      : taskList.map((task) => {
          task.isFinished = true;
          return task;
        });
    // all task undone : all tasks done

    this.setState({
      taskList: newTaskList,
      tasksLeft: calcTasksLeft(newTaskList),
    });
  };

  areAllTaskDone = (taskList) => {
    return taskList.every((task) => task.isFinished === true);
  };

  setDisplayQualifer = (displayQualifer) => {
    this.setState({
      displayQualifer: displayQualifer,
    });
  };

  clearCompletedTasks = () => {
    const { taskList } = this.state;
    const clearedTaskList = taskList.filter(
      (task) => task.isFinished === false
    );

    this.setState({
      taskList: this.assignNewId(clearedTaskList),
    });
  };

  render() {
    const {
      handleSubmit,
      switchAllTasks,
      handleChange,
      manageTaskDisplaying,
      calcTasksLeft,
      setDisplayQualifer,
      clearCompletedTasks,
    } = this;
    const { inputText, taskList, displayQualifer } = this.state;

    return (
      <div className="App">
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1>todos</h1>
          <div className="header-input">
            <button
              className="switchAllBtn"
              type="button"
              onClick={switchAllTasks}
            ></button>
            <input
              className="tasksInput"
              name="inputText"
              type="text"
              placeholder="What needs to be done?"
              value={inputText}
              onChange={handleChange}
            ></input>
          </div>
          <ul>{manageTaskDisplaying(taskList, displayQualifer)}</ul>
          <h6>{calcTasksLeft(taskList)} items left</h6>
          <button type="button" onClick={() => setDisplayQualifer("all")}>
            All
          </button>
          <button type="button" onClick={() => setDisplayQualifer("active")}>
            Active
          </button>
          <button type="button" onClick={() => setDisplayQualifer("completed")}>
            Completed
          </button>
          <button type="button" onClick={clearCompletedTasks}>
            Clear completed
          </button>
        </form>
      </div>
    );
  }
}

export default App;

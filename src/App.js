import React from "react";
import "./App.css";
import TaskTextEditSwitch from "./TaskTextEditSwitch";

const MarkTaskFinishedBtn = (props) => {
  const { task, markTaskFinished } = props;
  return (
    <button type="button" onClick={() => markTaskFinished(task.id)}>
      O
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
    const taskList = this.state.taskList;

    const newTaskList = taskList.map((task) => {
      task.showEditor = task.id === id ? !task.showEditor : false;
      return task;
    });

    this.setState({
      taskList: newTaskList,
    });
  };

  showTask = (id, editedTask) => {
    const taskList = this.state.taskList;

    const newTaskList = taskList.map((task) => {
      if (task.id === id) {
        task.showEditor = !task.showEditor;
        task.text = editedTask;
      }
      return task;
    });

    this.setState({
      taskList: newTaskList,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  displayTaskList = (taskList, displayQualifer) => {
    // make an extra function (?)
    let currentDisplayList = [];

    switch (displayQualifer) {
      case "all":
        currentDisplayList = [...taskList];
        break;
      case "active":
        taskList.map((task) => {
          if (task.isFinished === false) currentDisplayList.push(task);
        });
        break;
      case "completed":
        taskList.map((task) => {
          if (task.isFinished === true) currentDisplayList.push(task);
        });
        break;
    }
    return this.displayCurrentTaskList(currentDisplayList);
  };

  displayCurrentTaskList = (currentDisplayList) => {
    return currentDisplayList.map((task) => {
      return (
        <SingleTask
          task={task}
          key={task.id}
          taskList={this.state.taskList}
          markTaskFinished={this.markTaskFinished}
          deleteTask={this.deleteTask}
          showTaskEditor={this.showTaskEditor}
          showTask={this.showTask}
        />
      );
    });
  };

  markTaskFinished = (taskId) => {
    const taskList = this.state.taskList;

    const newTaskList = taskList.map((task, id) => {
      task.isFinished = id === taskId ? !task.isFinished : task.isFinished;
      return task;
    });
    const tasksLeft = this.calcTasksLeft(newTaskList); // count tasks left

    this.setState({
      taskList: newTaskList,
      tasksLeft: tasksLeft,
    });
  };

  deleteTask = (taskId) => {
    const taskList = this.state.taskList;

    taskList.splice(taskId, 1); // delete a task
    const tasksLeft = this.calcTasksLeft(taskList); // count tasks left
    this.setState({
      taskList: taskList,
      tasksLeft: tasksLeft,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { inputText } = this.state;

    const setId = this.state.taskList.length;
    const taskListN = this.state.taskList.concat([
      { id: setId, text: inputText, isFinished: false }, // add a task
    ]);
    const tasksLeft = this.calcTasksLeft(taskListN); // count tasks left
    this.setState({
      inputText: "",
      taskList: taskListN,
      tasksLeft: tasksLeft,
    });
  };

  calcTasksLeft = (taskList) => {
    let taskCounter = 0;
    taskList.map((task) => {
      taskCounter = task.isFinished === false ? taskCounter + 1 : taskCounter;
    });
    return taskCounter;
  };

  switchAllTasks = () => {
    const taskList = this.state.taskList;
    const { ifAllTaskDoneF } = this;
    let newTaskList;

    if (ifAllTaskDoneF(taskList)) {
      newTaskList = taskList.map((task) => {
        task.isFinished = false;
        return task;
      }); // set all tasks undone
    } else {
      newTaskList = taskList.map((task) => {
        task.isFinished = true;
        return task;
      }); // set all tasks done
    }
    const tasksLeft = this.calcTasksLeft(newTaskList); // count tasks left

    this.setState({
      taskList: newTaskList,
      tasksLeft: tasksLeft,
    });
  };

  ifAllTaskDoneF = (taskList) => {
    // return true if all tasks are done | return false when at least task is undone
    let flag = true;
    taskList.map((task) => {
      if (task.isFinished === false) flag = false;
    });
    return flag;
  };

  setDisplayQualifer = (displayQualifer) => {
    this.setState({
      displayQualifer: displayQualifer,
    });
  };

  clearCompletedTasks = () => {
    const taskList = this.state.taskList;
    let clearedTaskList = [];

    taskList.map((task) => {
      if (task.isFinished === false) clearedTaskList.push(task);
    });

    this.setState({
      taskList: clearedTaskList,
    });
  };

  render() {
    const {
      handleSubmit,
      switchAllTasks,
      handleChange,
      displayTaskList,
      calcTasksLeft,
      setDisplayQualifer,
      clearCompletedTasks,
    } = this;
    const { inputText, taskList, displayQualifer } = this.state;

    return (
      <div className="App">
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1>todos</h1>
          <button type="button" onClick={switchAllTasks}>
            V
          </button>
          <input
            name="inputText"
            type="text"
            placeholder="What needs to be done?"
            value={inputText}
            onChange={handleChange}
          ></input>
          <ul>{displayTaskList(taskList, displayQualifer)}</ul>
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

import React from "react";
import "./App.css";
import TaskTextEditSwitch from "./TaskTextEditSwitch";

const MarkTaskFinishedBtn = (props) => {
  const { task, taskListProperties, markTaskFinished } = props;
  return (
    <button
      type="button"
      onClick={() => markTaskFinished(task.id, taskListProperties)}
    >
      O
    </button>
  );
};

const DeleteTaskBtn = (props) => {
  const { task, taskListProperties, deleteTask } = props;
  return (
    <button
      type="button"
      onClick={() => deleteTask(task.id, taskListProperties)}
    >
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
    taskListProperties: [
      { id: 0, text: "example task 1", isFinished: false, showEditor: false },
      { id: 1, text: "task 2", isFinished: true, showEditor: false },
      { id: 2, text: "example 3", isFinished: false, showEditor: false },
    ],
  };

  switchShowEditor = (taskListProperties, id) => {
    const newTaskListProperties = taskListProperties.map((task) => {
      task.showEditor = task.id === id ? !task.showEditor : false;
      return task;
    });

    this.setState({
      taskListProperties: newTaskListProperties,
    });
  };

  switchShowTaskText = (taskListProperties, id, editedTask) => {
    const newTaskListProperties = taskListProperties.map((task) => {
      if (task.id === id) {
        task.showEditor = !task.showEditor;
        task.text = editedTask;
      }
      return task;
    });

    this.setState({
      taskListProperties: newTaskListProperties,
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  displayTaskListAlternative = (taskListProperties, displayQualifer) => {
    let currentDisplayList = [];

    switch (displayQualifer) {
      case "all":
        currentDisplayList = [...taskListProperties];
        break;
      case "active":
        taskListProperties.map((task) => {
          if (task.isFinished === false) currentDisplayList.push(task);
        });
        break;
      case "completed":
        taskListProperties.map((task) => {
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
          taskListProperties={this.state.taskListProperties}
          markTaskFinished={this.markTaskFinished}
          deleteTask={this.deleteTask}
          switchShowEditor={this.switchShowEditor}
          switchShowTaskText={this.switchShowTaskText}
        />
      );
    });
  };

  markTaskFinished = (taskIndex, taskListProperties) => {
    const newTaskListProperties = taskListProperties.map((task, index) => {
      task.isFinished =
        index === taskIndex ? !task.isFinished : task.isFinished;
      return task;
    });
    const tasksLeft = this.calcTasksLeft(newTaskListProperties); // count tasks left
    this.setState({
      taskListProperties: newTaskListProperties,
      tasksLeft: tasksLeft,
    });
  };

  deleteTask = (taskIndex, taskListProperties) => {
    taskListProperties.splice(taskIndex, 1); // delete a task
    const tasksLeft = this.calcTasksLeft(taskListProperties); // count tasks left
    this.setState({
      taskListProperties: taskListProperties,
      tasksLeft: tasksLeft,
    });
  };

  handleSubmit = (e, inputText) => {
    e.preventDefault();
    const setId = this.state.taskListProperties.length;
    const taskListPropertiesN = this.state.taskListProperties.concat([
      { id: setId, text: inputText, isFinished: false }, // add a task
    ]);
    const tasksLeft = this.calcTasksLeft(taskListPropertiesN); // count tasks left
    this.setState({
      inputText: "",
      taskListProperties: taskListPropertiesN,
      tasksLeft: tasksLeft,
    });
  };

  // // strange variable name: taskListProperties
  calcTasksLeft = (taskListProperties) => {
    let taskCounter = 0;
    taskListProperties.map((task) => {
      taskCounter = task.isFinished === false ? taskCounter + 1 : taskCounter;
    });
    return taskCounter;
  };

  switchAllTasks = (taskListProperties) => {
    const { ifAllTaskDoneF } = this;
    let newTaskListProperties;

    if (ifAllTaskDoneF(taskListProperties)) {
      newTaskListProperties = taskListProperties.map((task) => {
        task.isFinished = false;
        return task;
      }); // set all tasks undone
    } else {
      newTaskListProperties = taskListProperties.map((task) => {
        task.isFinished = true;
        return task;
      }); // set all tasks done
    }
    const tasksLeft = this.calcTasksLeft(newTaskListProperties); // count tasks left

    this.setState({
      taskListProperties: newTaskListProperties,
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

  clearCompleted = (taskListProperties) => {
    let clearedTaskList = [];
    taskListProperties.map((task) => {
      if (task.isFinished === false) clearedTaskList.push(task);
    });

    this.setState({
      taskListProperties: clearedTaskList,
    });
  };

  render() {
    const {
      handleSubmit,
      switchAllTasks,
      handleChange,
      displayTaskListAlternative,
      calcTasksLeft,
      setDisplayQualifer,
      clearCompleted,
    } = this;
    const { inputText, taskListProperties, displayQualifer } = this.state;

    return (
      <div className="App">
        <form onSubmit={(e) => handleSubmit(e, inputText)}>
          <h1>todos</h1>
          <button
            type="button"
            onClick={() => switchAllTasks(taskListProperties)}
          >
            V
          </button>
          <input
            name="inputText"
            type="text"
            placeholder="What needs to be done?"
            value={inputText}
            onChange={handleChange}
          ></input>
          <ul>
            {displayTaskListAlternative(taskListProperties, displayQualifer)}
          </ul>
          <h6>{calcTasksLeft(taskListProperties)} items left</h6>
          <button type="button" onClick={() => setDisplayQualifer("all")}>
            All
          </button>
          <button type="button" onClick={() => setDisplayQualifer("active")}>
            Active
          </button>
          <button type="button" onClick={() => setDisplayQualifer("completed")}>
            Completed
          </button>
          <button
            type="button"
            onClick={() => clearCompleted(taskListProperties)}
          >
            Clear completed
          </button>
        </form>
      </div>
    );
  }
}

export default App;

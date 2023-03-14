import React from "react";
import "./App.css";

const MarkTaskFinishedBtn = (props) => {
  const { keyValue, taskListProperties, markTaskFinished } = props;
  return (
    <button
      type="button"
      onClick={() => markTaskFinished(keyValue, taskListProperties)}
    >
      O
    </button>
  );
};

const DeleteTaskBtn = (props) => {
  const { keyValue, taskListProperties, deleteTask } = props;
  return (
    <button
      type="button"
      onClick={() => deleteTask(keyValue, taskListProperties)}
    >
      X
    </button>
  );
};

const SingleTask = (props) => {
  const { keyValue } = props;
  return (
    <li key={keyValue}>
      <MarkTaskFinishedBtn {...props} />
      <TaskTextEditSwitch {...props} />
      <DeleteTaskBtn {...props} />
    </li>
  );
};

class TaskTextEditSwitch extends React.Component {
  state = {
    taskEditInput: this.props.text,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleKeyDown = (e) => {
    const { id, taskListProperties, switchShowTaskText } = this.props;
    const { taskEditInput } = this.state;

    if (e.key === "Enter") {
      switchShowTaskText(taskListProperties, id, taskEditInput);
    }
  };

  render() {
    const {
      id,
      isFinished,
      text,
      switchShowEditor,
      taskListProperties,
      showEditor,
      switchShowTaskText,
    } = this.props;
    const { taskEditInput } = this.state;
    const { handleChange } = this;

    return showEditor ? (
      <input
        autoFocus
        type="text"
        name="taskEditInput"
        onChange={handleChange}
        value={taskEditInput}
        onBlur={() => switchShowTaskText(taskListProperties, id, taskEditInput)}
        onKeyDown={(e) => {
          this.handleKeyDown(e);
        }}
      />
    ) : (
      <span
        className={isFinished ? "taskList-taskFinished" : ""}
        onDoubleClick={() => switchShowEditor(taskListProperties, id)}
      >
        {text}
      </span>
    );
  }
}

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

  displayTaskList = (taskListProperties, displayQualifer) => {
    if (displayQualifer === "all") {
      return taskListProperties.map((task, taskIndex) => {
        return (
          <SingleTask
            id={task.id}
            text={task.text}
            isFinished={task.isFinished}
            showEditor={task.showEditor}
            keyValue={taskIndex}
            key={taskIndex}
            taskListProperties={taskListProperties}
            markTaskFinished={this.markTaskFinished}
            deleteTask={this.deleteTask}
            switchShowEditor={this.switchShowEditor}
            switchShowTaskText={this.switchShowTaskText}
          />
        );
      });
    }
    if (displayQualifer === "active") {
      return taskListProperties.map((task, taskIndex) => {
        if (task.isFinished === false) {
          return (
            <SingleTask
              id={task.id}
              text={task.text}
              isFinished={task.isFinished}
              showEditor={task.showEditor}
              keyValue={taskIndex}
              key={taskIndex}
              taskListProperties={taskListProperties}
              markTaskFinished={this.markTaskFinished}
              deleteTask={this.deleteTask}
              switchShowEditor={this.switchShowEditor}
              switchShowTaskText={this.switchShowTaskText}
            />
          );
        }
      });
    }
    if (displayQualifer === "completed") {
      return taskListProperties.map((task, taskIndex) => {
        if (task.isFinished === true) {
          return (
            <SingleTask
              id={task.id}
              text={task.text}
              isFinished={task.isFinished}
              showEditor={task.showEditor}
              keyValue={taskIndex}
              key={taskIndex}
              taskListProperties={taskListProperties}
              markTaskFinished={this.markTaskFinished}
              deleteTask={this.deleteTask}
              switchShowEditor={this.switchShowEditor}
              switchShowTaskText={this.switchShowTaskText}
            />
          );
        }
      });
    }
  };

  markTaskFinished = (taskIndex, taskListProperties) => {
    const newTaskListProperties = taskListProperties.map((task, index) => {
      return index === taskIndex
        ? { text: task.text, isFinished: !task.isFinished }
        : { text: task.text, isFinished: task.isFinished };
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
    //1. check the state of tasks:
    // a) all are done
    // then change all to undone

    // b) some of them are not done & c) all are not done
    // then change all to done
    //2. save a new state

    let isAllTaskDone = 1;
    let newTaskListProperties;

    taskListProperties.map((task) => {
      if (task.isFinished === true) {
        isAllTaskDone += 1;
      } else {
        isAllTaskDone = -9999;
      }
    });

    if (isAllTaskDone > 0) {
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

  openEditField = (taskListProperties) => {
    console.log("rozpoczac edycje taska");
    return <input type="text"></input>;
  };

  render() {
    const {
      handleSubmit,
      switchAllTasks,
      handleChange,
      displayTaskList,
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
          <ul>{displayTaskList(taskListProperties, displayQualifer)}</ul>
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

// import React from "react";

// export const dbUpdateGetData = async () => {
//   const response = await fetch("https://dummyjson.com/todos?limit=8");

//   if (response.ok) return response.json();
//   throw Error(response.status);
// };

export const dbUpdateAddTodo = (inputText) => {
  fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: inputText,
      completed: false,
      userId: 5,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw Error(res.status);
    })
    .then((res) => {
      console.log("Todo added:");
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const dbUpdateMarkFinished = (id, completed) => {
  fetch("https://dummyjson.com/todos/" + id, {
    method: "PUT" /* or PATCH */,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: false,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();

      throw Error(res.status);
    })
    .then((res) => {
      console.log("Status changed. Completed: " + completed + ".");
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const dbUpdateEditTodo = (id, editedText) => {
  fetch("https://dummyjson.com/todos/" + id, {
    method: "PUT" /* or PATCH */,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: editedText,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw Error(res.status);
    })
    .then((res) => {
      console.log("Todo text edited: ");
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const dbUpdateDeleteTodo = (id) => {
  fetch("https://dummyjson.com/todos/" + id, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) return res.json();
      throw Error(res.status);
    })
    .then((res) => {
      console.log("Todo deleted: ");
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

// Cel: Chcę przenieść do pliku TodosService.js funkcję dbUpdateGetData zajmującą się pobieraniem listy zadań z bazy danych.

// Napotkany problem:

const createTodoRoot = (hasChildTodos = false) => {
  function onTodoMouseOver() {
    this.childNodes.forEach((node) => {
      if (node.id === "sub-todo") {
        node.classList.remove("invisible")
      }
    })
  }

  function onTodoMouseLeave() {
    this.childNodes.forEach((node) => {
      if (node.id === "sub-todo") {
        node.classList.add("invisible")
      }
    })
  }

  const todoEl = document.createElement("div")
  todoEl.classList.add("todo")

  if (hasChildTodos) {
    todoEl.addEventListener("mouseover", onTodoMouseOver)
    todoEl.addEventListener("mouseleave", onTodoMouseLeave)
  } else {
    todoEl.classList.add("sub-todo-wrapper")
  }

  return todoEl
}

export default createTodoRoot

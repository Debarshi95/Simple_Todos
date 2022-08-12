import todos from "../constant.js"
import render from "../todo.js"
import { todoWrapper } from "../selectors.js"

const createTodoBase = (todo, props = {}) => {
  const { draggable = false, classList = [] } = props

  const onTodoDragStart = (event) => {
    const dataId = event.currentTarget.getAttribute("data-id")
    event.dataTransfer.dropEffect = "move"
    event.dataTransfer.setData("data_id", dataId)
  }

  const onTodoDragOver = (event) => {
    event.preventDefault()
  }

  const onTodoDrop = (event) => {
    const currentId = event.currentTarget.getAttribute("data-id")
    const previousId = event.dataTransfer.getData("data_id")

    const currentTodoIdx = todos.findIndex(
      (todo) => todo.id === Number(currentId),
    )
    const previousTodoIdx = todos.findIndex(
      (todo) => todo.id === Number(previousId),
    )

    if (currentTodoIdx >= 0 && previousTodoIdx >= 0) {
      const temp = todos[currentTodoIdx]
      todos[currentTodoIdx] = todos[previousTodoIdx]
      todos[previousTodoIdx] = temp

      todoWrapper.innerHTML = ""
      render()
    }
  }

  const todoRootEl = document.createElement("li")
  todoRootEl.setAttribute("draggable", draggable)
  todoRootEl.classList.add.apply(todoRootEl.classList, [...classList])

  if (todo?.id) {
    todoRootEl.setAttribute("data-id", todo?.id)
  }

  if (draggable) {
    todoRootEl.addEventListener("dragstart", onTodoDragStart)
    todoRootEl.addEventListener("dragover", onTodoDragOver)
    todoRootEl.addEventListener("drop", onTodoDrop)
  }

  return todoRootEl
}

export default createTodoBase

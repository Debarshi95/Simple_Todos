const createTodoCheckbox = (isCompleted = false) => {
  const todoCheckEl = document.createElement("input")
  todoCheckEl.type = "checkbox"
  todoCheckEl.checked = isCompleted

  return todoCheckEl
}

export default createTodoCheckbox

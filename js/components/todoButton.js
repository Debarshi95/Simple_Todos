const createTodoButton = (props = {}) => {
  const { textContent = "" } = props
  const todoBtnEl = document.createElement("button")
  todoBtnEl.textContent = textContent

  return todoBtnEl
}

export default createTodoButton

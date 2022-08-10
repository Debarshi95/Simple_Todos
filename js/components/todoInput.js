const createTodoInput = (props = {}) => {
  const { type = "text", value = "" } = props

  const inputEl = document.createElement("input")
  inputEl.type = type
  inputEl.value = value

  return inputEl
}

export default createTodoInput

const inputEl = document.querySelector("input")
const todoContainer = document.querySelector(".todo-container")
const addTodoBtn = document.querySelector("button")

const docFragment = new DocumentFragment()

const validInput = () => {
  if (inputEl.value === "") {
    alert("Todo is required")
    return false
  }
  return true
}

const createTodo = (todo) => {
  const divRoot = document.createElement("div")
  divRoot.classList.add("todo")

  const deleteTodoBtn = document.createElement("button")
  deleteTodoBtn.textContent = "X"

  const selectTodoCheckbox = document.createElement("input")
  selectTodoCheckbox.type = "checkbox"
  selectTodoCheckbox.checked = todo.isCompleted

  const todoTextEl = document.createElement("p")
  todoTextEl.textContent = todo.text

  divRoot.appendChild(deleteTodoBtn)
  divRoot.appendChild(selectTodoCheckbox)
  divRoot.appendChild(todoTextEl)
  return divRoot
}

addTodoBtn.addEventListener("click", function () {
  if (validInput()) {
    const todo = { id: new Date(), text: inputEl.value, isCompleted: false }
    const todoItem = createTodo(todo)
    docFragment.appendChild(todoItem)
    todoContainer.appendChild(docFragment)
    inputEl.value = ""
  }
})

todoContainer.addEventListener("click", function (event) {
  const { tagName } = event.target

  if (tagName === "INPUT") {
    return toggleTodoCompleted(event.target)
  }
  if (tagName === "BUTTON") {
    return deleteTodo(event.target)
  }
})

const toggleTodoCompleted = (targetNode) => {
  const { lastChild } = targetNode?.parentNode || null
  lastChild?.classList?.toggle("text-through")
}

const deleteTodo = (targetNode) => {
  const { parentNode } = targetNode || null
  if (parentNode) {
    todoContainer.removeChild(parentNode)
  }
}

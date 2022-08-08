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

addTodoBtn.addEventListener("click", function () {
  if (validInput()) {
    const todo = { id: new Date(), text: inputEl.value, isCompleted: false }
    const todoItem = createTodo(todo)
    docFragment.appendChild(todoItem)
    todoContainer.appendChild(docFragment)
    inputEl.value = ""
  }
})

const createTodo = (todo) => {
  const divRoot = document.createElement("div")
  divRoot.classList.add("todo")

  const deleteTodoBtn = document.createElement("button")
  deleteTodoBtn.textContent = "X"

  const selectTodoCheckbox = document.createElement("input")
  selectTodoCheckbox.setAttribute("type", "checkbox")

  const todoTextEl = document.createElement("p")
  todoTextEl.textContent = todo.text

  divRoot.appendChild(deleteTodoBtn)
  divRoot.appendChild(selectTodoCheckbox)
  divRoot.appendChild(todoTextEl)
  return divRoot
}

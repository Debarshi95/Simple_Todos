const inputEl = document.querySelector("input")
const todoContainer = document.querySelector(".todo-container")
const addTodoBtn = document.querySelector("button")
const noTodoText = document.querySelector("#no-todo-text")

const docFragment = new DocumentFragment()

// Validate input box
const validInput = (value = "") => {
  if (value === "") {
    alert("Todo is required")
    return false
  }
  return true
}

// Creates a todo item
const createTodo = (todo) => {
  const divRoot = document.createElement("div")
  divRoot.classList.add("todo")
  divRoot.setAttribute("draggable", true)

  const deleteTodoBtn = document.createElement("button")
  deleteTodoBtn.textContent = "X"
  deleteTodoBtn.setAttribute("id", "delete-todo")

  const editTodoBtn = document.createElement("button")
  editTodoBtn.textContent = "EDIT"
  editTodoBtn.setAttribute("id", "edit-todo")

  const selectTodoCheckbox = document.createElement("input")
  selectTodoCheckbox.type = "checkbox"
  selectTodoCheckbox.checked = todo.isCompleted

  const todoTextEl = document.createElement("p")
  todoTextEl.textContent = todo.text

  divRoot.appendChild(deleteTodoBtn)
  divRoot.appendChild(selectTodoCheckbox)
  divRoot.appendChild(todoTextEl)
  divRoot.appendChild(editTodoBtn)
  return divRoot
}

addTodoBtn.addEventListener("click", function () {
  if (validInput(inputEl.value)) {
    const todo = { id: new Date(), text: inputEl.value, isCompleted: false }
    const todoItem = createTodo(todo)

    docFragment.appendChild(todoItem)
    todoContainer.appendChild(docFragment)

    todoContainer.classList.add("padding-xs")
    inputEl.value = ""

    noTodoText.classList.add("d-none")
  }
})

todoContainer.addEventListener("click", function (event) {
  const { tagName, id } = event.target

  if (tagName === "INPUT") {
    return toggleTodoCompleted(event.target)
  }
  if (tagName === "BUTTON" && id === "delete-todo") {
    return deleteTodo(event.target)
  }
  if (tagName === "BUTTON" && id === "edit-todo") {
    return createUpdateTodoElements(event.target)
  }
  if (tagName === "BUTTON" && id === "update-todo") {
    return updateTodo(event.target)
  }
})

const toggleTodoCompleted = (targetNode) => {
  const { nextSibling = null } = targetNode

  if (nextSibling && nextSibling.tagName === "P") {
    nextSibling.classList.toggle("text-through")
  }
}

// Deletes individual todo
const deleteTodo = (targetNode) => {
  const { parentNode = null } = targetNode

  if (parentNode) {
    todoContainer.removeChild(parentNode)
  }

  if (!todoContainer.childNodes.length) {
    todoContainer.classList.remove("padding-xs")
    noTodoText.classList.remove("d-none")
  }
}

// Creates individual todo input box to edit the todo
const createUpdateTodoElements = (targetNode) => {
  const { parentNode = null, previousSibling = "" } = targetNode

  if (parentNode && previousSibling?.tagName === "P") {
    const updateTodoInputEl = document.createElement("input")
    updateTodoInputEl.type = "text"
    updateTodoInputEl.value = previousSibling.textContent

    const updateTodoBtnEl = document.createElement("button")
    updateTodoBtnEl.textContent = "UPDATE"
    updateTodoBtnEl.style.marginLeft = "10px"
    updateTodoBtnEl.setAttribute("id", "update-todo")

    parentNode.innerHTML = ""
    const fragment = new DocumentFragment()

    fragment.appendChild(updateTodoInputEl)
    fragment.appendChild(updateTodoBtnEl)

    parentNode.appendChild(fragment)
  }
}

// Updates single todo
const updateTodo = (targetNode) => {
  const { parentNode = null, previousSibling = null } = targetNode

  if (validInput(previousSibling.value) && parentNode) {
    const todo = {
      id: new Date(),
      text: previousSibling.value,
      isCompleted: false,
    }

    const todoItem = createTodo(todo)

    docFragment.appendChild(todoItem)

    todoContainer.replaceChild(docFragment, parentNode)
  }
}

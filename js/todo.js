const inputEl = document.querySelector("input")
const cardContainer = document.querySelector(".todo-container")
const todoWrapper = document.querySelector("#todo-wrapper")
const addTodoBtn = document.querySelector("button")
const noTodoText = document.querySelector("#no-todo-text")

const docFragment = new DocumentFragment()

let previousTodo

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
  const onDragStart = function (event) {
    event.dataTransfer.dropEffect = "move"
    previousTodo = this
  }

  const onDragOver = function (e) {
    e.preventDefault()
  }

  const onDrop = function (e) {
    const currentTodo = e.currentTarget
    todoWrapper.replaceChild(currentTodo, previousTodo)
    todoWrapper.appendChild(previousTodo)
  }

  const divRoot = document.createElement("div")
  divRoot.setAttribute("data-id", todo.id)
  divRoot.classList.add("todo")
  divRoot.setAttribute("draggable", true)

  divRoot.addEventListener("dragstart", onDragStart)
  divRoot.addEventListener("dragover", onDragOver)
  divRoot.addEventListener("drop", onDrop)

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
    todoWrapper.removeChild(parentNode)
  }

  if (!todoWrapper.childNodes.length) {
    cardContainer.classList.add("d-none")
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

    todoWrapper.replaceChild(docFragment, parentNode)
  }
}

const handleAddTodo = () => {
  if (validInput(inputEl.value)) {
    const todo = {
      id: new Date().getSeconds(),
      text: inputEl.value,
      isCompleted: false,
    }

    const todoItem = createTodo(todo)

    todoWrapper.parentNode.classList.remove("d-none")
    docFragment.appendChild(todoItem)
    todoWrapper.appendChild(docFragment)

    cardContainer.classList.add("padding-xs")
    inputEl.value = ""

    noTodoText.classList.add("d-none")
  }
}

const clearAllTodos = () => {
  todoWrapper.innerHTML = ""
  cardContainer.classList.remove("padding-xs")
  noTodoText.classList.remove("d-none")
  cardContainer.classList.add("d-none")
}

const handleOnTodoClick = (event) => {
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
  if (tagName === "BUTTON" && id === "clear") {
    return clearAllTodos()
  }
}

addTodoBtn.addEventListener("click", handleAddTodo)
cardContainer.addEventListener("click", handleOnTodoClick)

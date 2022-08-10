const inputEl = document.querySelector("input")
const cardContainer = document.querySelector(".todo-container")
const todoWrapper = document.querySelector("#todo-wrapper")
const addTodoBtn = document.querySelector("button")
const noTodoText = document.querySelector("#no-todo-text")

let todos = []

// Validate input box
const validInput = (value = "") => {
  if (value === "") {
    alert("Todo is required")
    return false
  }
  return true
}

// Creates todo nodes and attaches listeners to parent node
const createTodo = (todo) => {
  const onDragStart = (event) => {
    const dataId = event.currentTarget.getAttribute("data-id")
    event.dataTransfer.dropEffect = "move"
    event.dataTransfer.setData("data_id", dataId)
  }

  const onDragOver = (event) => {
    event.preventDefault()
  }

  const onDrop = (event) => {
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

      render()
    }
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

  const todoFragment = new DocumentFragment()

  todoFragment.appendChild(deleteTodoBtn)
  todoFragment.appendChild(selectTodoCheckbox)
  todoFragment.appendChild(todoTextEl)
  todoFragment.appendChild(editTodoBtn)

  divRoot.appendChild(todoFragment)
  return divRoot
}

// Toggles a todos' checked and un-checked state
const toggleTodoCompleted = (targetNode) => {
  const { nextSibling = null, parentNode = null } = targetNode || {}
  const todoId = parentNode?.getAttribute("data-id")

  if (todoId) {
    const currentTodoIdx = todos.findIndex((todo) => todo.id === Number(todoId))
    todos[currentTodoIdx].isCompleted = !todos[currentTodoIdx].isCompleted

    if (nextSibling && nextSibling.tagName === "P") {
      nextSibling.classList.toggle("text-through")
    }
  }
  console.log(todos)
}

// Deletes a todo from the DOM
const deleteTodo = (targetNode) => {
  const { parentNode = null } = targetNode || {}

  if (parentNode) {
    todos = todos.filter(
      (todo) => todo.id !== Number(parentNode.getAttribute("data-id")),
    )
    render()
  }

  if (!todoWrapper.childNodes.length) {
    cardContainer.classList.add("d-none")
    noTodoText.classList.remove("d-none")
  }
}

// Creates input todo nodes to edit the current todo
const createUpdateTodoElements = (targetNode) => {
  const { parentNode = null, previousSibling = "" } = targetNode || {}

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

// Updates the current todo and attaches into the DOM
const updateTodo = (targetNode) => {
  const { parentNode = null, previousSibling = null } = targetNode || {}

  if (validInput(previousSibling.value) && parentNode) {
    const currentTodo = todos.find(
      (todo) => todo.id === Number(parentNode.getAttribute("data-id")),
    )

    if (currentTodo) {
      currentTodo.text = previousSibling.value
    }
    render()
  }
}

// Adds todos nodes into the DOM
const handleAddTodo = () => {
  if (validInput(inputEl.value)) {
    const todo = {
      id: new Date().getSeconds(),
      text: inputEl.value,
      isCompleted: false,
    }

    todos.push(todo)
    render()

    cardContainer.classList.remove("d-none")
    cardContainer.classList.add("padding-xs")
    inputEl.value = ""

    noTodoText.classList.add("d-none")
  }
}

// Clears todos
const clearAllTodos = () => {
  todos = []
  todoWrapper.innerHTML = ""

  cardContainer.classList.remove("padding-xs")
  noTodoText.classList.remove("d-none")
  cardContainer.classList.add("d-none")
}

// Delegated click listener to handle clicks on various todo nodes
const handleOnTodoClick = (event) => {
  const { tagName, id } = event.target

  if (tagName === "INPUT") {
    return toggleTodoCompleted(event.target)
  }
  if (tagName === "BUTTON" && id === "delete-todo") {
    return deleteTodo(event.target)
  }

  if (tagName === "BUTTON") {
    if (id === "edit-todo") {
      return createUpdateTodoElements(event.target)
    }

    if (id === "update-todo") {
      return updateTodo(event.target)
    }

    if (id === "clear") {
      return clearAllTodos()
    }
  }
}

// renders the todo items into the DOM
const render = () => {
  const docFragment = new DocumentFragment()
  todoWrapper.innerHTML = ""

  todos.forEach((todo) => {
    docFragment.appendChild(createTodo(todo))
  })

  todoWrapper.appendChild(docFragment)
}

// event listeners attached
addTodoBtn.addEventListener("click", handleAddTodo)
cardContainer.addEventListener("click", handleOnTodoClick)

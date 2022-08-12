import todos from "./constant.js"

import {
  createTodoBase,
  createTodoRoot,
  createTodoButton,
  createTodoCheckbox,
  createTodoInput,
} from "./components/index.js"

import {
  inputEl,
  cardContainer,
  addTodoBtn,
  noTodoText,
  todoWrapper,
} from "./selectors.js"
import {
  findTodo,
  getFilteredTodos,
  validateInput,
} from "./utils/helperfuncs.js"

// Creates todo nodes and attaches listeners to parent node
const createTodoNodes = (todo, draggable, includeChildTodos) => {
  const todoBaseEl = createTodoBase(todo, {
    draggable,
    classList: ["todo-border"],
  })

  const divRoot = createTodoRoot(includeChildTodos)

  const todoCheckEl = createTodoCheckbox(todo?.isCompleted)

  const todoTextEl = document.createElement("p")
  todoTextEl.textContent = todo.text

  const deleteTodoBtn = createTodoButton({ textContent: "X" })
  deleteTodoBtn.setAttribute("id", "delete-todo")

  const editTodoBtn = createTodoButton({ textContent: "EDIT" })
  editTodoBtn.setAttribute("id", "edit-todo")

  const addSubTodoBtn = createTodoButton({ textContent: "New Todo" })
  addSubTodoBtn.setAttribute("id", "sub-todo")
  addSubTodoBtn.classList.add("invisible")

  const todoFragment = new DocumentFragment()

  todoFragment.append(
    deleteTodoBtn,
    todoCheckEl,
    todoTextEl,
    addSubTodoBtn,
    editTodoBtn,
  )

  divRoot.appendChild(todoFragment)
  todoBaseEl.appendChild(divRoot)

  return todoBaseEl
}

// Toggles a todos' checked and un-checked state
const toggleTodoCompleted = (targetNode) => {
  const { nextSibling = null } = targetNode || {}
  const todoId = targetNode?.closest("li.todo-border")?.getAttribute("data-id")

  if (todoId) {
    const currentTodo = findTodo(todos, Number(todoId))
    currentTodo.isCompleted = !currentTodo.isCompleted

    if (nextSibling && nextSibling.tagName === "P") {
      nextSibling.classList.toggle("text-through")
    }
  }
}

// Deletes a todo from the DOM
const deleteTodo = (targetNode) => {
  const todoId = targetNode?.closest("li.todo-border")?.getAttribute("data-id")
  if (todoId) {
    const filteredTodos = getFilteredTodos(todos, Number(todoId))
    todos.length = 0
    todos.push(...filteredTodos)
    todoWrapper.innerHTML = ""
    render()
  }

  if (!todoWrapper.childNodes.length) {
    cardContainer.classList.add("d-none")
    noTodoText.classList.remove("d-none")
  }
}

// Creates input todo nodes to edit the current todo
const renderUpdateTodoNodes = (targetNode) => {
  const { parentNode = null, previousSibling = "" } = targetNode || {}

  const textNode = previousSibling?.previousSibling

  if (parentNode && textNode?.tagName === "P") {
    const updateTodoInputEl = createTodoInput({
      type: "text",
      value: textNode.textContent,
    })

    const updateTodoBtnEl = createTodoButton({ textContent: "UPDATE" })
    updateTodoBtnEl.style.marginLeft = "10px"
    updateTodoBtnEl.setAttribute("id", "update-todo")

    parentNode.innerHTML = ""

    const fragment = new DocumentFragment()
    fragment.append(updateTodoInputEl, updateTodoBtnEl)

    parentNode.appendChild(fragment)
  }
}

// Creates Child Todo items
const handleCreateChildTodo = (event) => {
  const currentNode = event.currentTarget
  const { previousSibling = null, parentNode } = currentNode

  const rootTodoNode = event.currentTarget?.closest("li.todo-border")

  if (validateInput(previousSibling.value) && rootTodoNode) {
    const currentTodo = todos.find(
      (todo) => todo.id === Number(rootTodoNode.getAttribute("data-id")),
    )

    if (currentTodo) {
      const newTodo = {
        id: new Date().getSeconds(),
        text: previousSibling.value,
        isCompleted: false,
      }
      currentTodo.children.push(newTodo)

      render()
    }
  }
}

// Create child todo input items
const renderCreateChildTodoNodes = (targetNode) => {
  const { parentNode = null } = targetNode || {}

  if (parentNode) {
    const childRoot = document.createElement("div")
    childRoot.classList.add("todo", "sub-todo-input")

    const childTodoInputEl = createTodoInput()
    childTodoInputEl.placeholder = "sub task"

    const childTodoBtnEl = createTodoButton({ textContent: "CREATE" })
    childTodoBtnEl.style.marginLeft = "10px"
    childTodoBtnEl.setAttribute("id", "create-sub-todo")
    childTodoBtnEl.addEventListener("click", handleCreateChildTodo)

    const fragment = new DocumentFragment()
    fragment.append(childTodoInputEl, childTodoBtnEl)

    childRoot.appendChild(fragment)

    const todoRootNode = parentNode.parentNode
    todoRootNode.appendChild(childRoot)
  }
}

// Updates the current todo and attaches into the DOM
const handleUpdateTodo = (targetNode) => {
  const { previousSibling = null } = targetNode || {}

  const rootTodoNode = targetNode?.closest("li.todo-border")

  const todoId = Number(rootTodoNode.getAttribute("data-id"))
  if (validateInput(previousSibling.value) && todoId) {
    const currentTodo = findTodo(todos, Number(todoId))

    if (currentTodo) {
      currentTodo.text = previousSibling.value
    }
    todoWrapper.innerHTML = ""
    render()
  }
}

// Adds todos nodes into the DOM
const handleAddTodo = () => {
  if (validateInput(inputEl.value)) {
    const todo = {
      id: new Date().getSeconds(),
      text: inputEl.value,
      isCompleted: false,
      children: [],
    }

    todos.push(todo)

    cardContainer.classList.remove("d-none")
    cardContainer.classList.add("padding-xs")
    noTodoText.classList.add("d-none")
    inputEl.value = ""

    todoWrapper.innerHTML = ""
    render()
  }
}

// Clear all todos
const clearAllTodos = () => {
  todos.length = 0
  todoWrapper.innerHTML = ""

  cardContainer.classList.remove("padding-xs")
  noTodoText.classList.remove("d-none")
  cardContainer.classList.add("d-none")
}

// Delegated click listener to handle clicks on various todo nodes
const handleOnTodoClick = (event) => {
  const { tagName, id, type } = event.target

  if (tagName === "INPUT" && type === "checkbox") {
    event.stopPropagation()
    return toggleTodoCompleted(event.target)
  }

  if (tagName === "BUTTON") {
    if (id === "delete-todo") {
      event.stopPropagation()
      return deleteTodo(event.target)
    }
    if (id === "edit-todo") {
      event.stopPropagation()
      return renderUpdateTodoNodes(event.target)
    }

    if (id === "update-todo") {
      event.stopPropagation()
      return handleUpdateTodo(event.target)
    }

    if (id === "sub-todo") {
      event.stopPropagation()
      return renderCreateChildTodoNodes(event.target)
    }

    if (id === "clear") {
      return clearAllTodos()
    }
  }
}

// Renders todos into the DOM
const render = (
  parentNode = todoWrapper,
  items = todos,
  draggable = true,
  includeChildTodos = true,
) => {
  const docFragment = new DocumentFragment()

  items.forEach((todo) => {
    const todoNode = createTodoNodes(todo, draggable, includeChildTodos)

    if (todo?.children?.length) {
      parentNode.innerHTML = ""
      render(todoNode, todo.children, false, false)
    }
    docFragment.appendChild(todoNode)
  })
  parentNode.appendChild(docFragment)
}

// event listeners attached
addTodoBtn.addEventListener("click", handleAddTodo)
cardContainer.addEventListener("click", handleOnTodoClick)

export default render

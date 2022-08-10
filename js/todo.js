import todos from "./constant.js"

import createTodoBase from "./components/todoBase.js"
import createTodoRoot from "./components/todoRoot.js"
import createTodoCheckbox from "./components/todoCheckbox.js"
import createTodoButton from "./components/todoButton.js"
import createTodoInput from "./components/todoInput.js"

import {
  inputEl,
  cardContainer,
  addTodoBtn,
  noTodoText,
  todoWrapper,
} from "./selectors.js"
import { validateInput } from "./utils/helperfuncs.js"

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
  editTodoBtn.textContent = "EDIT"
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
  const todoId = targetNode?.closest("div.todo-border")?.getAttribute("data-id")

  if (todoId) {
    const currentTodoIdx = todos.findIndex((todo) => todo.id === Number(todoId))
    todos[currentTodoIdx].isCompleted = !todos[currentTodoIdx].isCompleted

    if (nextSibling && nextSibling.tagName === "P") {
      nextSibling.classList.toggle("text-through")
    }
  }
}

// Deletes a todo from the DOM
const deleteTodo = (targetNode) => {
  const { parentNode = null } = targetNode || {}

  if (parentNode) {
    const filteredTodos = todos.filter(
      (todo) => todo.id !== Number(parentNode.getAttribute("data-id")),
    )
    todos.length = 0
    todos.push(...filteredTodos)
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

const handleCreateChildTodo = (event) => {
  const { previousSibling = null } = event.currentTarget

  const rootTodoNode = event.currentTarget?.closest("div.todo-border")

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

      const subTodoParentNode = event.currentTarget?.closest(
        "div.sub-todo-wrapper",
      )
      render(subTodoParentNode, currentTodo.children, false, false)
    }
  }
}
const renderCreateChildTodoNodes = (targetNode) => {
  const { parentNode = null } = targetNode || {}

  if (parentNode) {
    const childBase = createTodoBase({}, { classList: ["sub-todo-wrapper"] })

    const childRoot = document.createElement("div")
    childRoot.classList.add("todo", "sub-todo")

    const childTodoInputEl = createTodoInput()
    childTodoInputEl.placeholder = "sub task"

    const childTodoBtnEl = createTodoButton({ textContent: "CREATE" })
    childTodoBtnEl.style.marginLeft = "10px"
    childTodoBtnEl.setAttribute("id", "create-sub-todo")
    childTodoBtnEl.addEventListener("click", handleCreateChildTodo)

    const fragment = new DocumentFragment()
    fragment.append(childTodoInputEl, childTodoBtnEl)

    childRoot.appendChild(fragment)
    childBase.appendChild(childRoot)

    const todoRootNode = parentNode.parentNode
    todoRootNode.appendChild(childBase)
  }
}

// Updates the current todo and attaches into the DOM
const handleUpdateTodo = (targetNode) => {
  const { parentNode = null, previousSibling = null } = targetNode || {}

  const rootTodoNode = targetNode?.closest("div.todo-border")

  if (validateInput(previousSibling.value) && rootTodoNode) {
    const currentTodo = todos.find(
      (todo) => todo.id === Number(rootTodoNode.getAttribute("data-id")),
    )

    if (currentTodo) {
      currentTodo.text = previousSibling.value
    }
    render(todoWrapper)
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
    render(todoWrapper)

    cardContainer.classList.remove("d-none")
    cardContainer.classList.add("padding-xs")
    inputEl.value = ""

    noTodoText.classList.add("d-none")
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
  const { tagName, id } = event.target

  if (tagName === "INPUT") {
    return toggleTodoCompleted(event.target)
  }
  if (tagName === "BUTTON" && id === "delete-todo") {
    return deleteTodo(event.target)
  }

  if (tagName === "BUTTON") {
    if (id === "edit-todo") {
      return renderUpdateTodoNodes(event.target)
    }

    if (id === "update-todo") {
      return handleUpdateTodo(event.target)
    }

    if (id === "sub-todo") {
      return renderCreateChildTodoNodes(event.target)
    }

    if (id === "clear") {
      return clearAllTodos()
    }
  }
}

// Renders todos into the DOM
const render = (
  parentNode,
  items = todos,
  draggable = true,
  hasChildTodos = true,
) => {
  const docFragment = new DocumentFragment()
  parentNode.innerHTML = ""

  items.forEach((todo) =>
    docFragment.appendChild(createTodoNodes(todo, draggable, hasChildTodos)),
  )
  parentNode.appendChild(docFragment)
}

// event listeners attached
addTodoBtn.addEventListener("click", handleAddTodo)
cardContainer.addEventListener("click", handleOnTodoClick)

export default render

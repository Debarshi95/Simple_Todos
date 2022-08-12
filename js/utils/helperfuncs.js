const validateInput = (value = "") => {
  if (value === "") {
    alert("Todo is required")
    return false
  }
  return true
}

const getFilteredTodos = (todos = [], todoId) => {
  const result = []
  todos.forEach((todoItem) => {
    if (todoItem?.children?.length > 0) {
      const subArr = getFilteredTodos(todoItem.children, todoId)
      todoItem.children = subArr
    }
    if (todoItem.id !== todoId) {
      result.push(todoItem)
    }
  })
  return result
}

const findTodo = (todos = [], todoId) => {
  let searchedTodo

  todos.forEach((todoItem) => {
    if (!searchedTodo && todoItem?.children?.length > 0) {
      searchedTodo = findTodo(todoItem.children, todoId)
    }
    if (todoItem.id === todoId) {
      searchedTodo = todoItem
    }
  })

  return searchedTodo
}

export { validateInput, getFilteredTodos, findTodo }

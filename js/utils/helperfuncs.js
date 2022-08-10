const validateInput = (value = "") => {
  if (value === "") {
    alert("Todo is required")
    return false
  }
  return true
}

export { validateInput }

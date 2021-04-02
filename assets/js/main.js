/*
// Small navigation menu ---------

let wrap = document.querySelector("main")
let menu = document.querySelector("#small-menu")
let menuOpen = document.querySelector("#small-nav button.open")
let menuClose = document.querySelector("#small-menu button.close")

const closeMenu = event => {
  // Hide the small nav when the menu isn't open
  menu.style.opacity = "0"
  menu.style.zIndex = "-1"
  menuOpen.style.visibility = "visible"

  // Unblur the page
  wrap.style.filter = "blur(0)"
}

const openMenu = event => {
  // Make the menu appear
  menu.style.opacity = "1"
  menu.style.zIndex = "999999999999999999"
  menu.style.display = "flex"
  menuOpen.style.visibility = "collapse"

  // Blur the page
  wrap.style.filter = "blur(2px)"
  menu.style.background = "var(--bg-color)"
  menu.style.opacity = "0.85"
}

menuOpen.onclick = openMenu
menuClose.onclick = closeMenu

// Close the menu when the links are clicked
let links = document.querySelectorAll("#small-menu .nav-item a")
for (let v of links) {
  v.onclick = closeMenu
}
*/

// Dark and light mode ----------

// Set the user's cache to the default one
const defaultCache = () => {
  return {
    blog: {
      mode: "dark",
    },
  }
}

// Save the user's current settings
const save = () => {
  localStorage.setItem("ethanbaker.dev", JSON.stringify(cache))
}

// Switch between dark and light mode
const toggleMode = () => {
  cache.blog.mode === "light" ? setDark() : setLight()
}

let html = document.querySelector("html")

// Set the screen to dark mode
const setDark = () => {
  cache.blog.mode = "dark"
  save()

  html.style.setProperty("--bg-color", "#292929")
  html.style.setProperty("--text-color", "#eeeeee")
  html.style.setProperty("--hover-color", "#ff4400")
  html.style.setProperty("--line-color", "#474747")
  html.style.setProperty("--link-color", "#949494")
}

// Set the screen to light mode
const setLight = () => {
  cache.blog.mode = "light"
  save()

  html.style.setProperty("--text-color", "#292929")
  html.style.setProperty("--bg-color", "#eeeeee")
  html.style.setProperty("--hover-color", "#67e1ea")
  html.style.setProperty("--line-color", "#949494")
  html.style.setProperty("--link-color", "#474747")
}

// Get the user's cache and set the color appropriately
let localCache = localStorage.getItem("ethanbaker.dev")
let cache = localCache ? JSON.parse(localCache) : defaultCache()
cache.blog.mode === "light" ? setLight() : setDark()

// Todo Wiget ----------------
let todoInfo = document.querySelector(".todo-info")
let todoList = document.querySelector(".todo-info #work-list")
let todoUndo = document.querySelector(".todo #undo")
let todoAdd = document.querySelector(".todo #add")
let todoWorkButton = document.querySelector(".todo-nav #work")
let todoWorkList = document.querySelector(".todo-info #work-list")
let todoPersonalButton = document.querySelector(".todo-nav #personal")
let todoPersonalList = document.querySelector(".todo-info #personal-list")

let personalRemoved = []
let workRemoved = []
let todoRemoved = workRemoved

// Todo nav buttons
todoPersonalList.className = "hidden"

// Hide the personal list and show the work one
todoWorkButton.onclick = () => {
  todoRemoved = workRemoved
  todoList = todoWorkList

  todoWorkList.className = ""
  todoPersonalList.className = "hidden"
}

// Hide the work list and show the personal list
todoPersonalButton.onclick = () => {
  todoRemoved = personalRemoved
  todoList = todoPersonalList

  todoWorkList.className = "hidden"
  todoPersonalList.className = ""
}

// Delete parts of the list
const removeTodoItem = element => {
  todoRemoved.push(element)
  element.remove()

  //TODO send deleted info to server API
}

// Undo button
todoUndo.onclick = () => {
  if (todoRemoved.length === 0) return

  todoList.appendChild(todoRemoved[todoRemoved.length-1])
  todoRemoved.pop()

  //TODO send new element to server API for storage
}

// Add button
todoAdd.onclick = () => {
  // Add the input to the list and scroll so it's visible
  todoList.innerHTML += "<li><input type=text id=todo-add onfocusout=delTodoInput()></li>"
  todoInfo.scrollTop = todoInfo.scrollHeight

  // Find the input, focus it, and setup its onkeypress
  let input = todoInfo.querySelector("input")
  input.focus()
  input.onkeypress = e => {
    if (!e) e = window.event

    if (e.key === "Enter") {
      let val = input.value
      // Blur the input (which will delete it)
      input.blur()

      // Add the new item to the list
      todoList.innerHTML += `<li class=item onclick=removeTodoItem(this)>${val}</li>`

      //TODO send new info to server API for storage
    }
  }
}

// Delete the input
const delTodoInput = () => {
  let elements = todoInfo.querySelectorAll("li")

  for (let li of elements) {
    if (li && li.querySelector("input")) {
      li.remove()
    }
  }
}

// Goals wiget ------------
let goalsList = document.querySelector(".goals-info")
let goalsUndo = document.querySelector(".goals-utils #undo")
let goalsAdd = document.querySelector(".goals-utils #add")

let goalsRemoved = []

// Delete parts of the list
const removeGoalsItem = element => {
  goalsRemoved.push(element)
  element.remove()

  //TODO send deleted info to server API
}

// Undo button
goalsUndo.onclick = () => {
  if (goalsRemoved.length === 0) return

  goalsList.appendChild(goalsRemoved[goalsRemoved.length-1])
  goalsRemoved.pop()

  //TODO send new element to server API for storage
}

// Add button
goalsAdd.onclick = () => {
  // Add the input to the list and scroll so it's visible
  goalsList.innerHTML += "<li><input type=text id=goals-add onfocusout=delGoalsInput()></li>"
  goalsList.scrollTop = goalsList.scrollHeight

  // Find the input, focus it, and setup its onkeypress
  let input = goalsList.querySelector("input")
  input.focus()
  input.onkeypress = e => {
    if (!e) e = window.event

    if (e.key === "Enter") {
      let val = input.value
      // Blur the input (which will delete it)
      input.blur()

      // Add the new item to the list
      goalsList.innerHTML += `<li class=item onclick=removeGoalsItem(this)>${val}</li>`

      //TODO send new info to server API for storage
    }
  }
}

// Delete the input
const delGoalsInput = () => {
  let elements = goalsList.querySelectorAll("li")

  for (let li of elements) {
    if (li && li.querySelector("input")) {
      li.remove()
    }
  }
}

// Habits Wiget ----------------
let habitsInfo = document.querySelector(".habits-info")
let habitsAdd = document.querySelector(".habits #add")
let habitsDel = document.querySelector(".habits #del")

let habitsDeleteMode = false


const habitsDeleteModeHandler = () => {
  if (!habitsDeleteMode) {
    habitsDeleteMode = true
    for (let element of document.querySelectorAll(".habits tbody .head")) {
      element.className = "head delete"
      element.onclick = () => {
        for (let tr of document.querySelectorAll(".habits tbody tr")) {
          if (tr.querySelector(".head") && tr.querySelector(".head").innerText === element.innerText) {
            tr.remove()
            return
          }
        }
      }
    }
  } else {
    habitsDeleteMode = false
    for (let element of document.querySelectorAll(".habits tbody .head")) {
      element.className = "head"
    }
  }
}

habitsDel.onclick = habitsDeleteModeHandler

habitsAdd.onclick = () => {
  if (habitsDeleteMode) habitsDeleteModeHandler()

  // Add the input to the list and scroll so it's visible
  habitsInfo.innerHTML += `<input type=text onfocusout=habitsInfo.querySelector("input").remove()>`
  habitsInfo.scrollTop = habitsInfo.scrollHeight

  // Find the input, focus it, and setup its onkeypress
  let input = habitsInfo.querySelector("input")
  input.focus()
  input.onkeypress = e => {
    if (!e) e = window.event

    if (e.key === "Enter") {
      let val = input.value
      // Blur the input (which will delete it)
      input.blur()

      // Add the new item to the list
      let html = ""
      html += `<tr><td class=head>${val}</td>`
      for (let i = 0; i < 15; i++) {
        html += "<td class=item onclick=handleHabitCell(this)></td>"
      }
      html += "</tr>"
      document.querySelector(".habits-info tbody").innerHTML += html

      //TODO send new info to server API for storage
    }
  }
}

const handleHabitCell = element => {
  if (!element.innerText) {
    element.innerText = "X"
  } else if (element.innerText === "X") {
    element.innerText = "/"
  } else {
    element.innerText = ""
  }

  //TODO send new info to server API for storage
}

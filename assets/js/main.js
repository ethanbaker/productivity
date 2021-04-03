// Get the credentials for various apis
let xml = new XMLHttpRequest()
let url = "/assets/credentials.json"

// Set the credentials equal to something when the xml response comes back
let credentials
xml.responseType = "json"
xml.onload = () => {
  credentials = xml.response
}

// Open and send the xml request
xml.open("GET", url)
xml.send()

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

// Day Wiget ------------------

// Set the title of the wiget to the date
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
let prefixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

let date = new Date()
document.querySelector(".day .title").innerText = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}${prefixes[date.getDate()%10]}, ${date.getFullYear()}`

// Update the time in the wiget
const setTime = () => {
  let now = new Date()
  let h = now.getHours()
  let m = now.getMinutes()
  let p = " AM"

  if (h >= 12) {
    if (h > 12) h -= 12
   
    p = " PM"
  } else if (h === 0) {
    h = 12
  }
  if (m < 10) {
    m = "0" + m
  }

  document.querySelector(".day #time").innerText = `${h}:${m} ${p}`
}

setInterval(setTime(), 1000)
setTime()

// Update the weather in the wiget
const setWeather = async () => {
  // Get the ip of the user
  const ipRaw = await fetch("https://api.ipify.org/?format=json")
  const ip = await ipRaw.json()

  // Get the location of the user
  const posRaw = await fetch(`https://ipapi.co/${ip.ip}/json`)
  const pos = await posRaw.json()

  // Get the weather data
  const weatherRaw = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${pos.postal}&APPID=${credentials.weather.key}`)
  const weather = await weatherRaw.json()

  // Update the weather div
  document.querySelector(".day #weather").innerHTML = `${Math.floor((weather.main.temp - 273.15) * (9/5) + 32)} °F. ${weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1)} <br><img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png" />`
}

setInterval(setWeather(), 900000)
setWeather()

// Schedule stuff
let scheduleAdd = document.querySelector(".schedule #add")
let scheduleDel = document.querySelector(".schedule #del")
let scheduleEsc = document.querySelector(".schedule #escape")
let scheduleList = document.querySelector(".schedule ul")
let scheduleInfo = document.querySelector(".schedule-info")
let scheduleInput = document.querySelector(".schedule-info .input")

const openEventMenu = () => {
  scheduleList.style.filter = "blur(2px)"
  scheduleInput.className = "input"
}

const closeEventMenu = () => {
  scheduleList.style.filter = ""
  scheduleInput.className = "input hidden"

  scheduleInput.querySelector("#time").value = ""
  scheduleInput.querySelector("#name").value = ""
}

scheduleAdd.onclick = openEventMenu
scheduleEsc.onclick = closeEventMenu

const scheduleNewEvent = () => {
  let time = scheduleInput.querySelector("#time").value
  let name = scheduleInput.querySelector("#name").value

  closeEventMenu()

  let timeSplits = time.split(":")

  let suffix = " AM"
  let minute = timeSplits[1]
  let hour = timeSplits[0]

  if (timeSplits[0] >= 12) {
    suffix = " PM"
    if (timeSplits[0] > 12) {
      hour -= 12
    }
  } else if (timeSplits[0] === "00") {
    hour = 12
  } else {
    hour = hour[1]
  }

  let timeString = `${hour}:${minute}${suffix}`

  // Declare a new element
  let li = document.createElement("LI")
  li.innerHTML = `<strong>${timeString}:</strong> ${name}`
  li.className = "item"

  // Insert the element in specified hours
  for (let time of scheduleInfo.querySelectorAll("li")) {
    if (time.innerText.split(":")[0] == hour && time.innerText.split(" ")[1][0] == suffix[1] && minute-time.innerText.split(":")[1].substring(0, 2) >= 0) {
      time.insertAdjacentElement("afterend", li)
    }
  }

  // Insert the element if it is not in the specified hours
  if (suffix === " AM" && hour < 7) {
    li.className += " pre-times"
    for (let time of scheduleInfo.querySelectorAll(".pre-times")) {
      console.log(hour-time.innerText.split(":")[0] > 0, minute-time.innerText.split(":")[1].substring(0, 2) >= 0)
      if (hour-time.innerText.split(":")[0] > 0 && minute-time.innerText.split(":")[1].substring(0, 2) >= 0) {
        time.insertAdjacentElement("afterend", li)
        return
      }
    }
    if (scheduleInfo.querySelector(".pre-times")) {
      scheduleInfo.querySelector(".pre-times").insertAdjacentElement("beforebegin", li)
    } else {
      scheduleInfo.querySelector(".time").insertAdjacentElement("beforebegin", li)
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

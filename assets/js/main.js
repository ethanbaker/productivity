// Get the credentials for various apis
let xml1 = new XMLHttpRequest()
let url = "/assets/credentials.json"

let credentials
xml1.responseType = "json"
xml1.onload = () => {
  credentials = xml1.response
}

xml1.open("GET", url)
xml1.send()

// Get the user's data from the productivity api. If the user has no data, create it for the user
let xml2 = new XMLHttpRequest()
url = "https://api.ethanbaker.dev/" + TOKEN

let user 
xml2.responseType = "json"
xml2.onload = () => {
  user = xml2.response

  // Create a new user if the current user doesn't exist
  if (!user) {
    let xml3 = new XMLHttpRequest()
    xml3.responseType = "json"
    xml3.onload = () => {
      user = xml3.response
      updateUi()
    }
    xml3.open("POST", url)
    xml3.send(TOKEN)
  } else {
    updateUi()
  }
}

xml2.open("GET", url)
xml2.send()

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

/* HTML Elements */
let html = document.querySelector("html")

// Todo Wiget
let todoInfo = document.querySelector(".todo-info")
let todoList = document.querySelector(".todo-info #work-list")
let todoUndo = document.querySelector(".todo #undo")
let todoAdd = document.querySelector(".todo #add")
let todoButtons = [document.querySelector(".todo-nav #work"), document.querySelector(".todo-nav #personal")]
let todoLists = [document.querySelector(".todo-info #work-list"), document.querySelector(".todo-info #personal-list")]

// Goals Wiget
let goalsList = document.querySelector(".goals-info")
let goalsUndo = document.querySelector(".goals-utils #undo")
let goalsAdd = document.querySelector(".goals-utils #add")

// Schedule Wiget
let scheduleAdd = document.querySelector(".schedule #add")
let scheduleDel = document.querySelector(".schedule #del")
let scheduleEsc = document.querySelector(".schedule #escape")
let scheduleList = document.querySelector(".schedule ul")
let scheduleInfo = document.querySelector(".schedule-info")
let scheduleInput = document.querySelector(".schedule-info .input")

// Motivation Wiget
let motivationIcons = document.querySelectorAll(".motivation-slide-icons .icon")
let motivationSlides = document.querySelectorAll(".motivation-info .slide")
let motivationPrev = document.querySelector(".motivation-utils #prev")
let motivationNext = document.querySelector(".motivation-utils #next")
let motivationSave = document.querySelector(".motivation #save")

// Habits Wiget
let habitsInfo = document.querySelector(".habits-info")
let habitsAdd = document.querySelector(".habits #add")
let habitsDel = document.querySelector(".habits #del")


/* Dark and Light Mode */

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

/* Todo Wiget */
let todoRemoved = [[], []]
let todoIndex = 0

// Hide the personal list
todoLists[1].className = "hidden"

// Show the work list and hide the personal one
todoButtons[0].onclick = () => {
  todoIndex = 0

  todoLists[0].className = ""
  todoLists[1].className = "hidden"
}

// Show the personal list and hide the work one
todoButtons[1].onclick = () => {
  todoIndex = 1

  todoLists[0].className = "hidden"
  todoLists[1].className = ""
}

// Delete an item from a list
const removeTodoItem = element => {
  todoRemoved[todoIndex].push(element)

  let option = ["work", "personal"][todoIndex]
  user.todo[option] = user.todo[option].filter(e => {return e !== element.innerText})
  updateUser()

  element.remove()
}

// Todo undo button
todoUndo.onclick = () => {
  if (todoRemoved.length === 0) return

  todoLists[todoIndex].appendChild(todoRemoved[todoIndex][todoRemoved[todoIndex].length-1])
  let val = todoRemoved[todoIndex].pop()

  // Update the user
  let option = ["work", "personal"][todoIndex]
  user.todo[option].push(val)
  updateUser()
}

// Todo add button
todoAdd.onclick = () => {
  // Add the input to the list and scroll so it's visible
  todoLists[todoIndex].innerHTML += "<li><input type=text id=todo-add onfocusout=delTodoInput()></li>"
  todoInfo.scrollTop = todoInfo.scrollHeight

  // Find the input, focus it, and setup its onkeypress
  let input = todoInfo.querySelector("input")
  input.focus()
  input.onkeypress = e => {
    if (!e) e = window.event

    if (e.key === "Enter") {
      // Blur the input (which will delete it)
      input.blur()

      // Add the new item to the list
      todoLists[todoIndex].innerHTML += `<li class=item onclick=removeTodoItem(this)>${input.value}</li>`

      // Update the user
      let option = ["work", "personal"][todoIndex]
      user.todo[option].push(input.value)
      updateUser()
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

/* Goals Wiget */
let goalsRemoved = []

// Delete parts of the list
const removeGoalsItem = element => {
  goalsRemoved.push(element)

  user.goals = user.goals.filter(e => {return e !== element.innerText})
  updateUser()

  element.remove()
}

// Undo button
goalsUndo.onclick = () => {
  if (goalsRemoved.length === 0) return

  goalsList.appendChild(goalsRemoved[goalsRemoved.length-1])
  let val = goalsRemoved.pop()

  user.goals.push(val)
  updateUser()
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
      // Blur the input (which will delete it)
      input.blur()

      // Add the new item to the list
      goalsList.innerHTML += `<li class=item onclick=removeGoalsItem(this)>${input.value}</li>`

      user.goals.push(input.value)
      updateUser()
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
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let prefixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

let date = new Date()
let apiDate = `${date.getMonth()+1} ${date.getDate()} ${date.getFullYear()}`
let leapYear = ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0)) || (date.getFullYear() % 400 == 0) ? 1 : 0
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
  document.querySelector(".day #weather").innerHTML = `${Math.floor((weather.main.temp - 273.15) * (9/5) + 32)} °F. ${weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1)} <br><img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" />`
}

setInterval(setWeather(), 900000)
setWeather()

/* Schedule Wiget */
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
  } else if (timeSplits[0] < 10) {
    hour = hour[1]
  }

  let timeString = `${hour}:${minute}${suffix}`

  // Declare a new element
  let li = document.createElement("LI")
  li.innerHTML = `<strong>${timeString}:</strong> ${name}`
  li.className = "item"

  // Insert the element in specified hours
  let items = []

  let item = {"time": timeString, "value": name}
  items.push(item)

  for (let time of scheduleInfo.querySelectorAll("li")) {
    if (time.innerText.split(":")[0] == hour && time.innerText.split(" ")[1][0] == suffix[1] && minute-time.innerText.split(":")[1].substring(0, 2) >= 0) {
      time.insertAdjacentElement("afterend", li)
    }
    if (time.className === "item") {
      let a = time.innerText.split(":")

      items.push({"time": (a[0] + ":" + a[1].split(" ")[0] + " " + a[1].split(" ")[1]), "value": a[2]})
    }
  }
  console.log(items)

  // Insert the element if it is not in the specified hours
  let found = false
  if (suffix === " AM" && hour < 7) {
    li.className += " pre-times"
    for (let time of scheduleInfo.querySelectorAll(".pre-times")) {
      if (hour-time.innerText.split(":")[0] > 0 && minute-time.innerText.split(":")[1].substring(0, 2) >= 0) {
        time.insertAdjacentElement("afterend", li)
        found = true
      }
    }

    if (!found) {
      if (scheduleInfo.querySelector(".pre-times")) {
        scheduleInfo.querySelector(".pre-times").insertAdjacentElement("beforebegin", li)
      } else {
        scheduleInfo.querySelector(".time").insertAdjacentElement("beforebegin", li)
      }
    }
  }

  for (let i = 0; i < user.schedule.length; i++) {
    if (user.schedule[i].date === apiDate) {
      user.schedule[i].items = items
      updateUser()
      return
    }
  }
  let day = {
    "date": apiDate,
    "items": items
  }
  user.schedule.push(day)
  updateUser()
}

let scheduleDeleteMode = false
scheduleDel.onclick = () => {
  if (!scheduleDeleteMode) {
    scheduleDeleteMode = true
    for (let element of document.querySelectorAll(".schedule-times .item")) {
      element.className = "item delete"
      element.onclick = () => {
        for (let i = 0; i < user.schedule.length; i++) {
          if (user.schedule[i].date === apiDate) {
            user.schedule[i].items = user.schedule[i].items.filter(e => {return e.time !== element.innerText.split(" ")[0]+" "+element.innerText.split(":")[1].split(" ")[1] && e.name !== element.innerText.split(":")[2]})
          }
        }
        updateUser()

        element.remove()
      }
    }
  } else {
    scheduleDeleteMode = false
    for (let element of document.querySelectorAll(".schedule-times .item")) {
      element.className = "item"
      element.onclick = () => {}
    }
  }
}

// Motivation Wiget
let motivationIndex = 0

const motivationNextSlide = () => {
  // Make the current slide hidden
  motivationSlides[motivationIndex].className = "slide hidden"
  motivationIcons[motivationIndex].className = "icon"

  // Add one to the motivation index (or start the loop over)
  motivationIndex++
  if (motivationIndex === motivationSlides.length) motivationIndex = 0

  // Make the next slide visible
  motivationSlides[motivationIndex].className = "slide"
  motivationIcons[motivationIndex].className = "icon selected"
}
motivationNext.onclick = motivationNextSlide

const motivationPrevSlide = () => {
  // Make the current slide hidden
  motivationSlides[motivationIndex].className = "slide hidden"
  motivationIcons[motivationIndex].className = "icon"

  // Add one to the motivation index (or start the loop over)
  motivationIndex--
  if (motivationIndex === -1) motivationIndex = motivationSlides.length-1

  // Make the next slide visible
  motivationSlides[motivationIndex].className = "slide"
  motivationIcons[motivationIndex].className = "icon selected"
}
motivationPrev.onclick = motivationPrevSlide

const motivationSaveValues = () => {
  let index = -1
  for (let i = 0; i < user.motivation.days.length; i++) {
    if (user.motivation.days[i] && user.motivation.days[i].date === apiDate) {
      index = i
    }
  }
  if (index === -1) {
    index = user.motivation.days.length

    user.motivation.days.push({
      "date": apiDate,
      "grateful": "",
      "goal": "",
      "targets": [],
      "great": ""
    })
  }

  let fields = ["grateful", "goal", "targets", "great"]
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] !== "targets") {
      user.motivation.days[index][fields[i]] = motivationSlides[i].querySelector("textarea").value
    } else {
      let values = []
      for (let element of motivationSlides[i].querySelectorAll("textarea")) {
        values.push(element.value)
      }
      user.motivation.days[index][fields[i]] = values
    }
  }
  updateUser()
}
motivationSave.onclick = motivationSaveValues

// Habits Wiget ----------------
let habitsDeleteMode = false

const habitsDeleteModeHandler = () => {
  if (!habitsDeleteMode) {
    habitsDeleteMode = true
    for (let element of document.querySelectorAll(".habits tbody .head")) {
      element.className = "head delete"
      element.onclick = () => {
        for (let tr of document.querySelectorAll(".habits tbody tr")) {
          if (tr.querySelector(".head") && tr.querySelector(".head").innerText === element.innerText) {
            for (let i = 0; i < user.habits.length; i++) {
              if (user.habits[i].name === element.innerText) {
                user.habits = user.habits.filter(e => {return e.name !== element.innerText})
                updateUser()
              }
            }

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
      element.onclick = () => {}
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
      // Blur the input (which will delete it)
      input.blur()

      // Add the new item to the list
      let html = ""
      html += `<tr><td class=head>${input.value}</td>`
      for (let i = 0; i < 15; i++) {
        html += "<td class=item onclick=handleHabitCell(this)></td>"
      }
      html += "</tr>"
      document.querySelector(".habits-info tbody").innerHTML += html

      let habit = {
        "name": input.value,
        "start": apiDate,
        "value": ""
      }
      user.habits.push(habit)
      updateUser()
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

  let habit
  let name = element.parentElement.querySelector(".head").innerText
  for (let i = 0; i < user.habits.length; i++) {
    if (user.habits[i].name === name) {
      habit = i 
    }
  }

  let heads = document.querySelectorAll(".habits-info th")
  let index = 0
  let match
  for (let i = 0; i < heads.length; i++) {
    let a = heads[i].innerText.split("/")
    let b = user.habits[habit].start.split(" ")
    if (a[0] + " " + a[1] === b[0] + " " + b[1]) {
      index = i
      match = a
    }
  }

  let value = ""
  let items = element.parentElement.querySelectorAll(".item")
  for (let i = 0; i < items.length; i++) {

    if (items[i].innerText === "") {
      if (i+1 < index) continue

      value += "_"
    } else {
      value += items[i].innerText
      if (i+1 < index && user.habits[habit].start.split(" ")[1] > (i+1)) {
        user.habits[habit].start = match[0] + " " + (i+1) + " " + date.getFullYear()
      }
    }
  }
  user.habits[habit].value = value
  updateUser()
}

// Update the UI with information from the api
const updateUi = () => {
  // Todo Wiget
  let options = ["work", "personal"]
  let todoHtml = ""
  for (let i = 0; i < options.length; i++) {
    for (let item of user.todo[options[i]]) {
      todoHtml += `<li class=item onclick=removeTodoItem(this)>${item}</li>`
    }
    todoLists[i].innerHTML = todoHtml
    todoHtml = ""
  }

  // Goals Wiget
  let goalHtml = ""
  for (let item of user.goals) {
    goalHtml += `<li class=item onclick=removeGoalsItem(this)>${item}</li>`
  }
  goalsList.innerHTML = goalHtml


  // Schedule Wiget
  let day  
  for (let d of user.schedule) {
    if (d.date === apiDate) {
      day = d
    }
  }

  if (day) {
    for (let item of day.items) {
      let li = document.createElement("LI")
      li.innerHTML = `<strong>${item.time}:</strong> ${item.value}`
      li.className = "item"

      let found = false
      for (let time of scheduleInfo.querySelectorAll("li")) {
        if (time.innerText.split(":")[0] == item.time.split(":")[0] && time.innerText.split(" ")[1][0] == item.time.split(" ")[1][0] && item.time.split(":")[1].split(" ")[0]-time.innerText.split(":")[1].substring(0, 2) >= 0) {
          time.insertAdjacentElement("afterend", li)
          found = true
        }
      }

      if (found) continue

      li.className += " pre-times"
      for (let time of scheduleInfo.querySelectorAll(".pre-times")) {
        if (item.time.split(":")[0]-time.innerText.split(":")[0] > 0 && item.time.split(":")[1].split(" ")[0]-time.innerText.split(":")[1].substring(0, 2) >= 0) {
          time.insertAdjacentElement("afterend", li)
          found = true
        }
      }

      if (found) continue

      if (scheduleInfo.querySelector(".pre-times")) {
        scheduleInfo.querySelector(".pre-times").insertAdjacentElement("beforebegin", li)
      } else {
        scheduleInfo.querySelector(".time").insertAdjacentElement("beforebegin", li)
      }
    }
  }

  // Motivation Wiget
  let index = -1
  for (let i = 0; i < user.motivation.days.length; i++) {
    if (user.motivation.days[i] && user.motivation.days[i].date === apiDate) {
      index = i
    }
  }

  if (index !== -1) {
    let fields = ["grateful", "goal", "targets", "great"]
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] !== "targets") {
        motivationSlides[i].querySelector("textarea").value = user.motivation.days[index][fields[i]]
      } else {
        let elements = motivationSlides[i].querySelectorAll("textarea")
        for (let j = 0; j < elements.length; j++) {
          elements[j].value = user.motivation.days[index][fields[i]][j]
        }
      }
    }
  }

  // Habits Wiget
  let month = apiDate.split(" ")[0]

  let monthDays = [31, 28+leapYear, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let startDay = 1, endDay = 14
  if (apiDate.split(" ")[1] > 14) {
    startDay = 15
    endDay = monthDays[month-1]
  }
  for (let i = startDay; i <= endDay; i++) {
    habitsInfo.querySelector("#dates").innerHTML += `<th>${month}/${i}</th>`
  }

  let html = ""
  for (let habit of user.habits) {
    html += `<tr><td class=head>${habit.name}</td>`

    let data = habit.value

    let startYear = habit.start.split(" ")[2]
    while (startYear < apiDate.split(" ")[2]) {
      data = data.substring(365+leapYear)
      startYear++
    }

    let startMonth = habit.start.split(" ")[0]
    while (startMonth < apiDate.split(" ")[0]) {
      data = data.substring(monthDays[startMonth-1])
      startMonth++
    }


    let start = habit.start.split(" ")[1]
    for (let i = 0; i < endDay-startDay+1; i++) {
      let val = ""
      if (i >= start-1) {
        if (habit.value[i-start+1] && habit.value[i-start+1] !== "_") {
          val = data[i-start+1]
        }
      }

      html += `<td class=item onclick=handleHabitCell(this)>${val}</td>`
    }

    html += `</tr>`

  }
  habitsInfo.querySelector("tbody").innerHTML += html

}

// Update the api with the user's information
const updateUser = () => {
  let xml = new XMLHttpRequest()

  xml.responseType = "json"
  //xml.onload = () => {console.log(xml.response)}

  xml.open("PUT", "https://api.ethanbaker.dev/" + TOKEN)
  xml.send(JSON.stringify(user))
}


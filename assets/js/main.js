let user
let credentials
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

// Local storage
let cache = JSON.parse(localStorage.getItem("ethanbaker.dev"))
if (!cache) cache = {mode: "dark"}

/* Used for time keeping */
class Time {
  // Constants involving time
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  dayCounts = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  prefixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"]

  // Instance variables
  #_stamp = []
  #_date
  #_leapYear

  constructor() {
    this.#_date = new Date()

    // Initialize the time stamp
    this.#_stamp = [this.date.getMonth()+1, this.date.getDate(), this.date.getFullYear()]

    // Adjust for leap years
    this.dayCounts[1] += ((this.date.getFullYear() % 4 == 0) && (this.date.getFullYear() % 100 != 0)) || (this.date.getFullYear() % 400 == 0) ? 1 : 0
  }

  // Return the current time
  timeStamp() {
    let now = new Date()

    let hours = now.getHours()
    let minutes = now.getMinutes()

    return Time.convert24to12(`${hours}:${minutes}`)
  }

  // Return a string with the current date
  dateStamp() {
    let weekday = this.dayNames[this.date.getDay()]
    let month = this.months[this.date.getMonth()]
    let day = this.date.getDate()
    let prefix = this.prefixes[this.date.getDate()%10]
    let year = this.date.getFullYear()

    return `${weekday}, ${month} ${day}${prefix}, ${year}`
  }

  // Get the two weeks the current date is present in
  weekSpan() {
    let dates = []
    let start = 1
    let end = 14

    // Get a two week span depending on what half of the month the date is in
    if (this.stamp[1] > 14) {
      start = 15
      end = this.dayCounts[this.stamp[0]-1]
    }
    for (let i = start; i <= end; i++) {
      dates.push(`${this.stamp[0]}/${i}`)
    }

    return dates
  }

  // Convert a 24 hour time to a 12 hour one
  static convert24to12(time) {
    let hours = Number(time.split(":")[0])
    let minutes = time.split(":")[1]
    let prefix = "AM"

    if (hours >= 12) {
      hours -= hours > 12 ? 12 : 0

      prefix = "PM"
    } else if (hours === 0) {
      hours = 12
    }

    minutes += "" + minutes < 10 ? 0 : ""

    return `${hours}:${minutes} ${prefix}`
  }

  // Compare two times (false if t2 > t1, true if t1 > t2, -1 if t2 == t1)
  static compare(t1, t2) {
    let t1Hours = Number(t1.split(":")[0])
    let t1Mins = Number(t1.split(":")[1])

    let t2Hours = Number(t2.split(":")[0])
    let t2Mins = Number(t2.split(":")[1])

    return t1Hours < t2Hours ? false : t1Hours > t2Hours ? true : t1Mins < t2Mins ? false : t1Mins > t2Mins ? true : false
  }

  // Compare two date stamp arrays 
  static compareDates(d1, d2) {
    if (d1[2] > d2[2]) return true
    if (d1[2] < d2[2]) return false
    if (d1[0] > d2[0]) return true
    if (d1[0] < d2[0]) return false
    if (d1[1] > d2[1]) return true
    if (d1[1] < d2[1]) return false

    return -1
  }

  // See if the year is a leap year
  static isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
  }

  // Accessor Methods
  get stamp() {
    return this.#_stamp
  }

  get date() {
    return this.#_date
  }

  get leapYear() {
    return this.#_leapYear
  }
}

let html = document.querySelector("html")

/* Dark and Light Mode */
class Mode {
  // Instance variables
  button
  mode
  self

  constructor(id) {
    // Get the local cache data from the user and set the UI theme
    // accordingly
    !cache.mode ? cache.mode = "dark" : false
    cache.mode === "dark" ? this.setDark() : this.setLight()
    this.mode = cache.mode

    // Get the button from the document and set its onclick function
    this.button = document.querySelector("#" + id)
    this.button.onclick = () => this.toggleMode()
  }

  // Save the user's current cache to their local storage
  save() {
    localStorage.setItem("ethanbaker.dev", JSON.stringify(cache))
  }

  // Set the UI to dark mode
  setDark() {
    this.mode = "dark"
    cache.mode = "dark"

    html.style.setProperty("--bg-color", "#292929")
    html.style.setProperty("--text-color", "#eeeeee")
    html.style.setProperty("--hover-color", "#ff4400")
    html.style.setProperty("--line-color", "#474747")
    html.style.setProperty("--link-color", "#949494")
  }

  // Set the UI to light mode
  setLight() {
    this.mode = "light"
    cache.mode = "light"

    html.style.setProperty("--text-color", "#292929")
    html.style.setProperty("--bg-color", "#eeeeee")
    html.style.setProperty("--hover-color", "#67e1ea")
    html.style.setProperty("--line-color", "#949494")
    html.style.setProperty("--link-color", "#474747")
  }

  // Switch the UI between light and dark mode
  toggleMode() {
    this.mode === "light" ? this.setDark() : this.setLight()

    this.save()
  }
}

let mode = new Mode("mode-button")

/* User Session */
class Session {
  // Instance variables
  #_token

  constructor(token) {
    this.#_token = token
  }

  updateUi() {

  }

  updateApi() {

  }
}

/* Widget Superclass */
class Widget {
  // Instance variables
  #_x = 0
  #_y = 0
  #_width = 0
  #_height = 0
  element

  constructor(x, y, width, height, id) {
    this.#_x = x
    this.#_y = y
    this.#_width = width
    this.#_height = height
    this.element = document.querySelector(id)
  }

  save() {
    throw new Error("Must implement save()")
  }

  update() {
    throw new Error("Must implement update()")
  }

  // Accessor Methods
  get x() {
    return this.#_x
  }

  get y() {
    return this.#_y
  }

  get width() {
    return this.#_width
  }

  get height() {
    return this.#_height
  }

  // Mutator Methods
  set x(x) {
    this.#_x = x
  }

  set y(y) {
    this.#_y = y
  }

  set width(width) {
    this.#_width = width
  }

  set height(height) {
    this.#_height = height
  }
}

/* Todo Widget */
class Todo extends Widget {
  // Instance variables
  lists = []
  removed = []
  #_index = 0

  listElements = []
  listButtons = []
  utilButtons = []


  constructor(x, y, width, height, id) {
    super(x, y, width, height, id) 

    let self = this

    // Set the instance variables to the document elements
    this.listElements = [this.element.querySelector("#work-list"), this.element.querySelector("#personal-list")]
    this.listButtons = [this.element.querySelector("#work"), this.element.querySelector("#personal")]
    this.utilButtons = [this.element.querySelector("#undo"), this.element.querySelector("#add")]

    // Onclick methods for list buttons
    for (let button of this.listButtons) {
      button.onclick = () => this.toggleList(button) 
      this.removed.push([])
      this.lists.push([])
    }

    // Onclick methods for util buttons
    this.utilButtons[0].onclick = () => self.undo()
    this.utilButtons[1].onclick = () => self.add()


    // Hide the furthest list
    this.listElements[1].className = "hidden"

    // Draw the current items on the list
    this.update()
  }

  // Add an item to the current list
  add() {
    if (this.element.querySelector("input")) return

    let self = this

    // Create an input element
    let input = document.createElement("INPUT")
    input.id = "todo-add"
    input.type = "text"
    input.onkeypress = e => {
      if (e.key !== "Enter") return

      self.lists[self.index].push(input.value)

      input.blur()

      self.update()
    }

    // Create a list info element
    let li = document.createElement("LI")
    li.appendChild(input)

    // Add the list info element to the list

    this.listElements[this.index].appendChild(li)
    this.listElements[this.index].scrollTop = this.listElements[this.index].scrollHeight

    input.focus()
    input.addEventListener("focusout", e => {
      if (e) li.remove()
    })
  }

  // Remove an item from the current list
  remove(element) {
    this.removed[this.index].push(element.innerText)

    this.lists[this.index] = this.lists[this.index].filter(e => {return e !== element.innerText})

    element.remove()

    this.update()
  }

  // Undo
  undo(element) {
    if (this.removed[this.index].length === 0) return

    this.lists[this.index].push(this.removed[this.index].pop())

    this.update()
  }

  // Toggle between lists
  toggleList(element) {
    if (["work", "personal"][this.index] === element.innerText.toLowerCase()) return

    this.index = (this.index+1)%2

    this.listElements[this.index].className = ""
    this.listElements[(this.index+1)%2].className = "hidden"
  }

  // Update the items in the specified list
  update() {
    this.save()

    let self = this

    for (let i = 0; i < self.lists.length; i++) {
      self.listElements[i].innerHTML = ""

      for (let item of self.lists[i]) {
        let li = document.createElement("LI")
        li.className = "item"
        li.innerText = item
        li.onclick = () => self.remove(li)

        self.listElements[i].appendChild(li)
      }
    }
  }

  save() {
    if (!user) return

    user.todo.work = this.lists[0]
    user.todo.personal = this.lists[1]

    updateUser()
  }

  // Accessor Methods
  get index() {
    return this.#_index
  }

  // Mutator Methods
  set index(index) {
    this.#_index = index
  }
}

let todoWidget = new Todo(0, 0, 25, 50, "#todo")

class Goals extends Widget {
  // Instance variables
  list = []
  removed = []

  listElement
  utilButtons = []

  constructor(x, y, width, height, id) {
    super(x, y, width, height, id) 

    let self = this

    // Set the instance variables to the document elements
    this.listElement = this.element.querySelector(".goals-info")
    this.utilButtons = [this.element.querySelector("#undo"), this.element.querySelector("#add")]

    // Onclick methods for util buttons
    this.utilButtons[0].onclick = () => self.undo()
    this.utilButtons[1].onclick = () => self.add()
  }

  // Add an item to the current list
  add() {
    if (this.element.querySelector("input")) return

    let self = this

    // Create an input element
    let input = document.createElement("INPUT")
    input.id = "goals-add"
    input.type = "text"
    input.onkeypress = e => {
      if (e.key !== "Enter") return

      self.list.push(input.value)

      input.blur()

      self.update()
    }

    // Create a list info element
    let li = document.createElement("LI")
    li.appendChild(input)

    // Add the list info element to the list

    this.listElement.appendChild(li)
    this.listElement.scrollTop = this.listElement.scrollHeight

    input.focus()
    input.addEventListener("focusout", e => {
      if (e) li.remove()
    })
  }

  // Remove an item from the current list
  remove(element) {
    this.removed.push(element.innerText)

    this.list = this.list.filter(e => {return e !== element.innerText})

    element.remove()

    this.update()
  }

  // Undo
  undo(element) {
    if (this.removed.length === 0) return

    this.list.push(this.removed.pop())

    this.update()
  }

  // Update the items in the specified list
  update() {
    this.save()

    let self = this

    this.listElement.innerHTML = ""

    for (let item of self.list) {
      let li = document.createElement("LI")
      li.className = "item"
      li.innerText = item
      li.onclick = () => self.remove(li)

      self.listElement.appendChild(li)
    }
  }

  save() {
    if (!user) return

    user.goals = this.list

    updateUser()
  }
}

let goalsWidget = new Goals(2, 55, 25, 40, "#goals")

class Ambient extends Widget {
  // Instance variables
  dateElement
  timeElement
  weatherElement

  constructor(x, y, width, height, id) {
    super(x, y, width, height, id) 

    // Get the elements from the DOM
    this.dateElement = document.querySelector(".day #date")
    this.timeElement = this.element.querySelector("#time")
    this.weatherElement = this.element.querySelector("#weather")

    // Create a new time object for the date
    this.time = new Time()

    // Update the date element with the date
    this.setDate()

    // Continuously update the time element
    setInterval(this.setTime(), 1000)
    this.setTime()

    // Continuously update the weather element
    setInterval(this.setWeather(), 900000)
  }

  // Set the date of the date element
  setDate() {
    this.dateElement.innerText = this.time.dateStamp()
  }

  // Set the time of the time element
  setTime() {
    this.timeElement.innerText = this.time.timeStamp()
  }

  async setWeather() {
    if (!credentials) return

    // Get the position of the user
    let posRaw = await fetch(`https://api.ipdata.co?api-key=${credentials.ip.key}`)
    let pos = await posRaw.json()

    // Get the weather data
    let weatherRaw = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${pos.postal}&APPID=${credentials.weather.key}`)
    let weather = await weatherRaw.json()

    // Update the weather div
    this.weatherElement.innerHTML = `${Math.floor((weather.main.temp - 273.15) * (9/5) + 32)} °F. ${weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.substring(1)} <br><img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" />`
  }
}

let ambientWidget = new Ambient(65, 0, 35, 10, "#ambient")

class Schedule extends Widget {
  // Instance variables
  times = []
  deleteMode = false
  inputVisible = false

  list
  input
  timeInput
  valueInput
  submitInput
  escapeInput
  utilButtons = []

  constructor(x, y, width, height, id) {
    super(x, y, width, height, id)

    // Append defaults to times
    for (let hour = 7; hour < 25; hour++) {
      this.times.push({
        rawTime: hour%25+":00",
        time: Time.convert24to12(hour%25+":0"),
        default: true,
      })
    }

    // Get elements from the DOM
    this.list = this.element.querySelector(".schedule-times")
    this.input = this.element.querySelector(".input")
    this.timeInput = this.input.querySelector("#time")
    this.valueInput = this.input.querySelector("#name")
    this.submitInput = this.input.querySelector("#submit")
    this.escapeInput = this.input.querySelector("#escape")

    // Util buttons' onclick functions
    this.utilButtons = [this.element.querySelector("#del"), this.element.querySelector("#add")]
    this.utilButtons[0].onclick = () => this.delete()
    this.utilButtons[1].onclick = () => {
      // Blur the schedule and show the input
      this.list.style.filter = "blur(2px)"
      this.input.className = "input"
    }

    // Input buttons' onclick functions
    this.escapeInput.onclick = () => {
      // Unblur the schedule, show the input, and reset values
      this.list.style.filter = ""
      this.input.className = "input hidden"
      this.timeInput.value = ""
      this.valueInput.value = ""
    }

    this.submitInput.onclick = () => {
      // Get the values from the user and convert them to useful formats
      let rawTime = this.timeInput.value
      let time = Time.convert24to12(rawTime)
      let value = this.valueInput.value

      // TODO error message if time or value is empty
      if (time === "" || value === "") return

      // Insert the element to the list
      let newItem = {
        "rawTime": rawTime,
        "time": time,
        "value": value,
      }
      this.times.push(newItem)
      this.times = this.times.sort((a, b) => {return Time.compare(b.rawTime, a.rawTime) ? -1 : 1})

      // Unblur the schedule, show the input, and reset values
      this.list.style.filter = ""
      this.input.className = "input hidden"
      this.timeInput.value = ""
      this.valueInput.value = ""
      this.inputVisible = false

      // Update the schedule list
      this.update()
      this.save()
    }

    this.update()
  }

  // Remove an element from the schedule
  remove(element) {
    if (this.inputVisible) return

    for (let item of this.times) {
      if (element.innerText === `${item.time}: ${item.value}`) {
        this.times = this.times.filter(t => {return !(t.time === item.time && t.value === item.value)})

        element.remove()
        break
      }
    }

    this.save()
  }

  // Put the schedule wiget into delete mode
  delete() {
    if (this.inputVisible) return

    let self = this

    this.deleteMode = !this.deleteMode

    for (let item of this.list.querySelectorAll(".item")) {
      item.className = this.deleteMode ? "item delete" : "item"
      item.onclick = this.deleteMode ? () => {self.remove(item)} : () => {}
    }
  }

  // Update the schedule list
  update() {
    this.list.innerHTML = ""

    for (let time of this.times) {
      // Create an element to add to the list
      let li = document.createElement("LI")
      li.innerHTML = !time.value ? time.time : `<b>${time.time}:</b> ${time.value}`
      li.className = !time.value ? "time" : "item"

      this.list.appendChild(li)
    }
  }

  save() {
    if (!user) return 

    let time = new Time()
    let times = this.times.filter(e => {return e.value})

    for (let i = 0; i < user.schedule.length; i++) {
      if (Time.compareDates(user.schedule[i].date, time.stamp) === -1) {
        user.schedule[i].times = times
        updateUser()
        return
      }
    }

    user.schedule.push({date: time.stamp, times: times})
    updateUser()
  }
}
let scheduleWidget = new Schedule(10, 30, 25, 80, ".schedule")

class Motivation extends Widget {
  // Instance variables
  index = 0
  fields = ["grateful", "goal", "targets", "great"]

  slides = []
  iconElements = []
  next
  prev
  saveButton

  constructor(x, y, width, height, id) {
    super(x, y, width, height, id)

    // Get the elements from the DOM
    this.slides = this.element.querySelectorAll(".slide")
    this.iconElements = this.element.querySelectorAll(".icon")
    this.next = this.element.querySelector("#next")
    this.prev = this.element.querySelector("#prev")
    this.saveButton = this.element.querySelector("#save")

    // Set the onclick functions of the elements
    this.next.onclick = () => this.nextSlide()
    this.prev.onclick = () => this.prevSlide()
    this.saveButton.onclick = () => this.save()
  }

  nextSlide() {
    // Hide the current slide and icon
    this.slides[this.index].className = "slide hidden"
    this.iconElements[this.index].className = "icon"

    // Increment the index
    this.index++
    if (this.index === this.slides.length) this.index = 0

    // Make the next slide visible
    this.slides[this.index].className = "slide"
    this.iconElements[this.index].className = "icon selected"
  }

  prevSlide() {
    // Hide the current slide and icon
    this.slides[this.index].className = "slide hidden"
    this.iconElements[this.index].className = "icon"

    // Decrement the index
    this.index--
    if (this.index === -1) this.index = this.slides.length-1

    // Make the previous slide visible
    this.slides[this.index].className = "slide"
    this.iconElements[this.index].className = "icon selected"
  }

  update(day) {
    for (let i = 0; i < this.slides.length; i++) {
      if (i !== 2) {
        this.slides[i].querySelector("textarea").innerText = day[this.fields[i]]
      } else {
        let inputs = this.slides[i].querySelectorAll("textarea")
        for (let j = 0; j < day[this.fields[i]].length; j++) {
          inputs[j].innerText = day[this.fields[i]][j]
        }
      }
    }
  }

  save() {
    // Find if the motivation exists for the current day
    let time = new Time()
    let index = -1

    for (let i = 0; i < user.motivation.length; i++) {
      if (Time.compareDates(time.stamp, user.motivation[i]) === -1) {
        index = i
        break
      }
    }

    // If there is no index, push a new day to the user's data
    if (index === -1) {
      index = user.motivation.length

      user.motivation.push({
        "date": time.stamp,
        "grateful": "",
        "goal": "",
        "targets": [],
        "great": "",
      })
    }

    // Set the user's info equal to the values of the textareas
    for (let i = 0; i < this.fields.length; i++) {
      if (i !== 2) {
        // Push the value to the user's data
        user.motivation[index][this.fields[i]] = this.slides[i].querySelector("textarea").value
      } else {
        // Push the three target values to it's corresponding array
        let values = []
        for (let e of this.slides[i].querySelectorAll("textarea")) {
          values.push(e.value)
        }
        user.motivation[index][this.fields[i]] = values
      }
    }
    updateUser()
  }
}
let motivationWidget = new Motivation(68, 20, 30, 32, "#motivation")

class Habit extends Widget {
  // Instance variables
  deleteMode = false
  habits = []
  dates = []
  firstDate = []

  utils = []
  tbody
  thead
  
  constructor(x, y, width, height, id) {
    super(x, y, width, height, id)

    // Get the elements from the DOM
    this.utils = [this.element.querySelector("#del"), this.element.querySelector("#add")]
    this.tbody = this.element.querySelector("tbody")
    this.thead = this.element.querySelector("#dates")

    // Set the date headers for the table
    let t = new Time()
    for (let date of t.weekSpan()) {
      this.dates.push(date)

      let th = document.createElement("TH")
      th.innerText = date
      this.thead.appendChild(th)
    }

    this.firstDate = [t.stamp[0], t.weekSpan()[0].split("/")[1], t.stamp[2]]

    // Set the onclicks of the elements
    this.utils[0].onclick = () => this.delete()
    this.utils[1].onclick = () => this.add()

  }

  add() {
    if (this.deleteMode) return

    // Add an input to the habits widget
    let input = document.createElement("INPUT")
    input.type = "text"
    this.tbody.appendChild(input)

    input.onkeypress = e => {
      if (!e) return

      if (e.key === "Enter") {
        // Blur and delete the input
        input.blur()

        // Add the new list item and update the widget
        let t = new Time()

        let val = ""
        for (let i = 0; i < this.dates.length; i++) val += "_"

        this.habits.push({
          "date": this.firstDate,
          "name": input.value,
          "value": val,
        })
        this.update()
      }
    }

    input.focus()
    input.addEventListener("focusout", e => {
      if (e) input.remove()
    })
  }

  delete() {
    this.deleteMode = !this.deleteMode

    if (this.deleteMode) {
      for (let habit of this.tbody.querySelectorAll(".head")) {
        habit.className = "head delete"

        habit.onclick = () => {
          for (let tr of this.tbody.querySelectorAll("tr")) {
            if (tr.querySelector(".head") && tr.querySelector(".head").innerText === habit.innerText) {
              this.habits = this.habits.filter(e => {return e.name !== habit.innerText})

              tr.remove()
              return
            }
          }
        }
      }
    } else {
      this.deleteMode = false
      for (let habit of this.tbody.querySelectorAll(".head")) {
        habit.className = "head"
        habit.onclick = () => {}
      }
    }
  }

  handleHabitCell(self, element) {
    if (!element.innerText) {
      element.innerText = "X"
    } else if (element.innerText === "X") {
      element.innerText = "/"
    } else {
      element.innerText = ""
    }

    self.save()
  }

  update() {
    this.tbody.innerHTML = `<tr id="dates">${this.thead.innerHTML}</tr>`
    let t = new Time()

    for (let habit of this.habits) {
      let tr = document.createElement("TR")
      tr.className = "habit"

      let th = document.createElement("TD")
      th.className = "head"
      th.innerText = habit.name
      tr.appendChild(th)

      // Get the start position of the habit's value
      let date = habit.date
      let start = 0

      if (habit.value.length > this.dates.length) {
        while (date[2] < t.stamp[2]) {
          start += 365+Time.isLeapYear(date[2])
          date[2]++
        }
        while (date[0] < t.stamp[0]) {
          start += t.dayCounts[date[0]-1]
          date[0]++
        }
        if (date[1] > 14) start += 14
      }

      for (let i = 0; i < this.dates.length; i++) {
        if (start > 0) habit.value = habit.value.substring(start)

        // Add a cell to the habit
        let td = document.createElement("TD")
        td.className = "item"
        td.onclick = () => this.handleHabitCell(this, td)
        td.innerText = habit.value[i] === "_" ? "" : habit.value[i]
        tr.appendChild(td)
      }
      this.tbody.appendChild(tr)
    }

    this.save()
  }

  save() {
    user.habits = []

    let t = new Time()
    let startDate = [this.dates[0].split("/")[1], t.stamp[0], t.stamp[2]]

    let trs = this.tbody.querySelectorAll(".habit")
    for (let i = 0; i < trs.length; i++) {
      if (Time.compareDates(this.habits[i].date, startDate)) this.habits[i].date = startDate

      this.habits[i].value = ""
      for (let td of trs[i].querySelectorAll(".item")) {
        this.habits[i].value += td.innerText === "" ? "_" : td.innerText

      }

      user.habits.push(this.habits[i])
    }

    updateUser()
  }
}
let habitsWidget = new Habit(0, 0, 0, 0, "#habits")

// Update the api with the user's information
const updateUser = () => {
  let xml = new XMLHttpRequest()

  xml.responseType = "json"
  //xml.onload = () => {console.log(xml.response)}

  xml.open("PUT", "https://api.ethanbaker.dev/" + TOKEN)
  xml.send(JSON.stringify(user))
}

/* XML Requests */
let xml1 = new XMLHttpRequest()
let url = "/assets/credentials.json"

xml1.responseType = "json"
xml1.onload = () => {
  credentials = xml1.response
}

xml1.open("GET", url)
xml1.send()

// Get the user's data from the productivity api. If the user has no data, create it for the user
let xml2 = new XMLHttpRequest()
url = "https://api.ethanbaker.dev/" + TOKEN

xml2.responseType = "json"
xml2.onload = () => {
  user = xml2.response

  // Create a new user if the current user doesn't exist
  if (!user) {
    let xml3 = new XMLHttpRequest()
    xml3.responseType = "json"
    xml3.onload = () => {
      user = xml3.response
      //updateUi()
    }
    xml3.open("POST", url)
    xml3.send(TOKEN)
  } else {
    //updateUi()
  }

  // Create a new time for time-dependent widgets
  let time = new Time()

  // Update the Todo Widget
  todoWidget.lists = [user.todo.work, user.todo.personal]
  todoWidget.update()

  // Update the Goals Widget
  goalsWidget.list = user.goals
  goalsWidget.update()

  // Set the weather of the ambient widget
  ambientWidget.setWeather()

  // Add the user's habit data to the widget
  habitsWidget.habits = user.habits 
  habitsWidget.update()

  // Add the user's schedule items to the widget
  for (let day of user.schedule) {
    if (Time.compareDates(day.date, time.stamp) === -1) {
      scheduleWidget.times = scheduleWidget.times.concat(day.times)
      scheduleWidget.times = scheduleWidget.times.sort((a, b) => {return Time.compare(b.rawTime, a.rawTime) ? -1 : 1})
      break
    }
  }
  scheduleWidget.update()

  // Add the user's motivational values to the widget
  for (let day of user.motivation) {
    if (Time.compareDates(day.date, time.stamp) === -1) {
      motivationWidget.update(day)
    }
  }


}

xml2.open("GET", url)
xml2.send()

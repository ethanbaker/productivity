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

const div = document.getElementById("userInfo")
const slot = document.getElementById("userNameDisplay")
const tempUserData = localStorage.getItem("user")

if (tempUserData) {
    const userData = JSON.parse(tempUserData)

    slot.textContent = userData.nam
    div.style.display = "flex"
} else {
    div.style.display = "none"
}
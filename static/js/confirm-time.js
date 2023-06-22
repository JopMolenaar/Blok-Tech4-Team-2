const select = document.querySelector("#time-input")

// Define the available times
const today = new Date()
const startTime = new Date(today.getTime())

// set start time to 5:00 PM
startTime.setHours(9, 0, 0, 0)
const endTime = new Date(today.getTime())
// set end time to 8:00 PM
endTime.setHours(17, 0, 0, 0)
// Set interval to 30 minutes
const interval = 30

// Loop through the available times
for (let time = startTime; time <= endTime; time.setMinutes(time.getMinutes() + interval)) {
    const option = document.createElement("option")
    option.value = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    option.textContent = option.value
    select.appendChild(option)
}

const select = document.querySelector("#time-input"),
    today = new Date(),
    startTime = new Date(today.getTime()),
    endTime = (startTime.setHours(9, 0, 0, 0), new Date(today.getTime())),
    interval = (endTime.setHours(17, 0, 0, 0), 30)
for (let e = startTime; e <= endTime; e.setMinutes(e.getMinutes() + interval)) {
    const b = document.createElement("option")
    ;(b.value = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })), (b.textContent = b.value), select.appendChild(b)
}

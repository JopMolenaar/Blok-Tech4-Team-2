const search = () => {
    const t = document.querySelector("#searchAnimals").value.toLowerCase()
    document.querySelectorAll("#animalsList ul").forEach((e) => {
        ;-1 !== e.getElementsByTagName("li")[1].textContent.toLowerCase().indexOf(t) ? (e.style.display = "block") : (e.style.display = "none")
    })
}
document.getElementById("searchAnimals").addEventListener("input", search)

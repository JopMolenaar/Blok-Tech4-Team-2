function search() {
    var input = document.querySelector("#searchAnimals").value.toLowerCase()
    var animals = document.querySelectorAll("#animalsList ul")

    for (var i = 0; i < animals.length; i++) {
        var name = animals[i].getElementsByTagName("li")[1].textContent.toLowerCase()
        if (name.indexOf(input) !== -1) {
            animals[i].style.display = "block"
        } else {
            animals[i].style.display = "none"
        }
    }
}

document.getElementById("searchAnimals").addEventListener("input", search)

//lazy loading 
const lazyImages = document.querySelectorAll(".lazy-load")

const lazyLoad = (entries, observer) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const img = entry.target
			img.src = img.dataset.src
			img.classList.remove("lazy-load")
			observer.unobserve(img)
		}
	})
}

const observer = new IntersectionObserver(lazyLoad)
lazyImages.forEach(image => {
	observer.observe(image)
})
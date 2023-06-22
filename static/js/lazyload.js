const lazyImages = document.querySelectorAll(".lazy-load"),
    lazyLoad = (e, a) => {
        e.forEach((e) => {
            e.isIntersecting && (((e = e.target).src = e.dataset.src), e.classList.remove("lazy-load"), a.unobserve(e))
        })
    },
    observer = new IntersectionObserver(lazyLoad)
lazyImages.forEach((e) => {
    observer.observe(e)
})

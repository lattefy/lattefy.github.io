// 5-Star Rating

function getStarRating() {
    let userRating = null 

    document.querySelectorAll('.star').forEach((star, index) => {
        star.addEventListener('click', () => {
            userRating = 5 - index
            console.log('User rating updated:', userRating)
        })
    })
    return () => userRating
}
const getUserRating = getStarRating()

document.getElementById('btn').addEventListener('click', () => {
    const rating = getUserRating()
    if (rating !== null) {
        console.log('User rating on button click:', rating)
    } else {
        console.log('No rating selected')
    }
})

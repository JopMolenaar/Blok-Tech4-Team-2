// const getFormDate = document.querySelector('#formDate')

// // Get the date for tomorrow
// const tomorrow = new Date()
// tomorrow.setDate(tomorrow.getDate() + 1)

// // Set the min date to tomorrow
// const minDate = tomorrow.toISOString().split('T')[0]

// // Set the date to only weekdays





// const restrictWeekdays = () => {
//     const dateInput = document.querySelector("formDate")
//     const selectedDate = new Date(dateInput.value)
    
//     if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
//       // If selected date is Saturday or Sunday, add or subtract days to select the nearest weekday
//       if (selectedDate.getDay() === 0) {
//         selectedDate.setDate(selectedDate.getDate() + 1) // Add one day to select Monday
//       } else {
//         selectedDate.setDate(selectedDate.getDate() - 1) // Subtract one day to select Friday
//       }
      
//       // Format the date as "YYYY-MM-DD" to set as the new value
//       const formattedDate = selectedDate.toISOString().substring(0, 10)
//       dateInput.value = formattedDate
//     }
//   }






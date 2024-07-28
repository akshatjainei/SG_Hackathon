const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No Journals in your diary</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { Date, _id: taskID, journal } = task
        return `<div class="single-task ${'task-completed'}">
<h5><span><i class="far fa-check-circle"></i></span>${journal}</h5>
<div class="task-links">



<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showTasks()

// delete task /api/tasks/:id

tasksDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/tasks/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const journal = taskInputDOM.value

  try {
    await axios.post('/api/v1/tasks', {Date , journal})
    showTasks()
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, journal added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})

document.addEventListener('DOMContentLoaded', () => {
  // Event listener for the login button
  document.querySelector('.btn.donate-btn').addEventListener('click', () => {
    window.location.href = '/auth/google'; // Redirects to your authentication route
  });

  // Event listener for the analyze button
  document.querySelector('.analyze-btn').addEventListener('click', async () => {
    console.log('Analyze button clicked'); // Debugging log

    try {
      // Make a GET request to the '/therapist' endpoint
      const response = await axios.get('/therapists');
      console.log('Response received:', response); // Debugging log
      
      // Get the therapists data from the response
      const therapists = response.data;

      // Get the container to display therapists
      const therapistsContainer = document.getElementById('therapists-container');

      // Clear any existing content
      therapistsContainer.innerHTML = '';

      // Loop through the therapists and create elements to display them
      therapists.forEach(therapist => {
        const therapistDiv = document.createElement('div');
        therapistDiv.classList.add('therapist');

        const nameElement = document.createElement('h4');
        nameElement.textContent = `Name: ${therapist.name}`;

        const addressElement = document.createElement('p');
        addressElement.textContent = `Address: ${therapist.address}`;

        therapistDiv.appendChild(nameElement);
        therapistDiv.appendChild(addressElement);

        therapistsContainer.appendChild(therapistDiv);
      });
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  });
});
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('search-heading');
const single_mealEl = document.getElementById('single-meal');



function searchMeal(e) {
    e.preventDefault();

    // clear single meal 
    single_mealEl.innerHTML = '';

    //get search term
    const term = search.value;

    //check if its empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                resultHeading.innerHTML = `<h2>Search results for <span style="color:pink">${term}</span>:</h2>`;

                if (data.meals.length === -1) {
                    resultHeading.innerHTML = '<p>There is no search results! Try again later</p> '
                } else {
                        mealsEl.innerHTML = data.meals.map(meal =>
                             `
                            <div class = 'meal'>
                                <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
                                <div class='meal-info' data-mealId = '${meal.idMeal}'>
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>
                            `
                      ).join('');
                }
            });
        //clear search text
        search.value = '';
    } else {
        alert('please enter a search term')
    }
}

function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}
//fetch random meal 
function getRandomMeal() {
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            console.log(meal);
            addMealToDOM(meal);
        });
}
//add meal to dom 
function addMealToDOM(meal) {
    const ingredient = [];

    for (let i = 1; i <= 20; i++){
        if (meal[`strIngredient${i}`]) {
            ingredient.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class='single-meal'>
        <h1>${meal.strMeal}<h1>
        <img src = '${meal.strMealThumb}' alt='${meal.strMeal}' />
        <div class='single-meal-info'>
            ${meal.strCatagory ? `<p>${meal.strCatagory}</p>`: ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>`: ''}
        </div>
        <div class= 'main'>
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredient.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `
}

// event listener 
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);
mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        // console.log(item);
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false
        }
    });
    if (mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealId');
        // console.log(mealId);
        getMealById(mealId);
  }  
})
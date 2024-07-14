// Consts

const sideNavBtn = $('.nav-header .open-close-icon');
const loadingIcon = $('.inner-loading-screen');

const searchDiv = $('#searchContent');
const dataDiv = $('#dataContent');



function toggleSideNav(){
    if(sideNavBtn.hasClass('fa-align-justify')){
        // open menu
        
        
        $('.side-nav-menu').animate({
            left: 0
        }, 400);


        $('.side-nav-menu .links li').each(function (index, li) {
            $(li).animate({
                top: 0
            }, (index + 2) * 200);
        })

        sideNavBtn.removeClass('fa-align-justify');
        sideNavBtn.addClass('fa-x');


    }else{
        //close menu
        $('.side-nav-menu').animate({
            left: -256.562
        }, 400);

        // hide the menu items again
        $('.side-nav-menu .links li').css('top', '300px');

        sideNavBtn.removeClass('fa-x');
        sideNavBtn.addClass('fa-align-justify');
    }
}

function toggleLoading(){
    loadingIcon.toggleClass('d-none');
}

function clearContent(container){
    container.html('');
}

function setContent(container, content){
    container.html(content);
}

async function searchMeals(url, key, value){
    toggleLoading();
    
    // get data from api

    url = `${url}?${key}=${value}`;
    
    let response = await fetch(url);
    
    let data = await response.json();
    
    toggleLoading();

    return data;
}

async function searchByName(name){
    let data = await searchMeals('https://themealdb.com/api/json/v1/1/search.php', 's', name);


    let content = '';

    data.meals.splice(0, 20).forEach(meal => {
        content += `
            <div class="col-md-3">
                <div onclick="showMealById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `; 
    });

    setContent(dataDiv, content);
}

async function searchByFLetter(firstLetter){
    if(firstLetter != ''){
        let data = await searchMeals('https://themealdb.com/api/json/v1/1/search.php', 'f', firstLetter);
        
        let content = '';
        
        data.meals.splice(0, 20).forEach(meal => {
            content += `
            <div class="col-md-3">
            <div onclick="showMealById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
            <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${meal.strMeal}</h3>
            </div>
            </div>
            </div>
            `; 
        });
        
        setContent(dataDiv, content);
    }else{
        clearContent(dataDiv);
    }
}

function showSearchInputs(){

    clearContent(dataDiv);

    setContent(searchDiv, `
        <div class="row py-4">
            <div class="col-md-6">
                <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>    
    `)

    toggleSideNav();
}

async function showMealById(mealId){
    toggleLoading();
    
    // get data from api
    
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    
    let response = await fetch(url);
    
    let data = await response.json();

    let meal = data.meals[0];
        
    clearContent(dataDiv);

    let recipes = '';
    for (let index = 1; index < 21; index++) {
        if(meal['strIngredient' + index] != ''){
            recipes += `
                <li class="alert alert-info m-2 p-1">${meal['strMeasure' + index]} ${meal['strIngredient' + index]}</li>
            `;
        }
    }


    let tags = '';

    if(meal.strTags != null){
        meal.strTags.split(', ').forEach((tag) => {
            tags += `
               <li class="alert alert-danger m-2 p-1">${tag}</li>
            `;
        })
    }

    let content = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
                <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${recipes}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tags}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>
    `; 

    setContent(dataDiv, content);

    toggleLoading();

}

async function getMealsByCategory(category){
    
    let data = await searchMeals('https://themealdb.com/api/json/v1/1/filter.php', 'c', category);

    clearContent(searchDiv);

    let content = '';

    data.meals.splice(0, 20).forEach(meal => {
        content += `
            <div class="col-md-3">
                <div onclick="showMealById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `; 
    });

    setContent(dataDiv, content);

}


async function showHomeMeals(){

    let data = await searchMeals('https://themealdb.com/api/json/v1/1/search.php', 's', '');

    clearContent(searchDiv);

    let content = '';

    data.meals.splice(0, 20).forEach(meal => {
        content += `
            <div class="col-md-3">
                <div onclick="showMealById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `; 
    });

    setContent(dataDiv, content);

}


async function getCategories(){
    toggleLoading();

    // get data from api

    clearContent(searchDiv);

    let url = 'https://themealdb.com/api/json/v1/1/categories.php';

    let response = await fetch(url);

    let data = await response.json();

    let content = '';

    data.categories.forEach(category => {
        content += `
            <div class="col-md-3">
                <div onclick="getMealsByCategory('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${category.strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${category.strCategory}</h3>
                        <p>${category.strCategoryDescription}</p>
                    </div>
                </div>
            </div>
        `; 
    });

    toggleSideNav();

    setContent(dataDiv, content);

    toggleLoading();
}

async function getMealsByArea(area){
    let data = await searchMeals('https://themealdb.com/api/json/v1/1/filter.php', 'a', area);

    clearContent(searchDiv);

    let content = '';

    data.meals.splice(0, 20).forEach(meal => {
        content += `
            <div class="col-md-3">
                <div onclick="showMealById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `; 
    });

    setContent(dataDiv, content);
}

async function getArea(){
    let url = 'https://themealdb.com/api/json/v1/1/list.php?a=list';
    
    clearContent(searchDiv);
    
    toggleLoading();
    
    let response = await fetch(url);
    
    let data = await response.json();
    
    toggleLoading();

    toggleSideNav();

    let content = '';

    data.meals.forEach((area) => {
        content += `
            <div class="col-md-3">
                <div onclick="getMealsByArea('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area.strArea}</h3>
                </div>
            </div>
        `;
    });

    setContent(dataDiv, content);


}

async function getMealsByIngredient(ingredient){
    let data = await searchMeals('https://themealdb.com/api/json/v1/1/filter.php', 'i', ingredient);

    clearContent(searchDiv);

    let content = '';

    data.meals.splice(0, 20).forEach(meal => {
        content += `
            <div class="col-md-3">
                <div onclick="showMealById('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${meal.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `; 
    });

    setContent(dataDiv, content);
}


async function getIngredients(){
    let url = 'https://themealdb.com/api/json/v1/1/list.php?i=list';

    clearContent(searchDiv);
    
    toggleLoading();
    
    let response = await fetch(url);
    
    let data = await response.json();
    
    toggleLoading();

    toggleSideNav();

    let content = '';

    data.meals.splice(0, 20).forEach((ingredient) => {
        content += `
            <div class="col-md-3">
                <div onclick="getMealsByIngredient('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredient.strIngredient}</h3>
                        <p>${ingredient.strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        `;
    });

    setContent(dataDiv, content);

}


function showContactUs() {
    let content = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
                            <div class="container w-75 text-center">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Special characters and numbers not allowed
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Email not valid *exemple@yyy.zzz
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid Phone Number
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid age
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                                            Enter valid repassword 
                                        </div>
                                    </div>
                                </div>
                                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
                            </div>
                        </div> `

    setContent(dataDiv, content);


    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })

    toggleSideNav();
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;


function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}


$(document).ready(function () {
    showHomeMeals();
});
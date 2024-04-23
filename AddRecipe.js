// Get DOM elements
const form = document.querySelector('form');
const recipeList = document.querySelector('#recipe-list');
const noRecipes = document.getElementById('no-recipes');
const searchBox = document.getElementById('search-box');

// Define recipes array
let recipes = [];

// Function to save recipe data as a text file
function saveRecipeAsText(recipe) {
  // Create a string with the recipe data in a text format
  const textData = `Recipe: ${recipe.name}\nIngredients:\n${recipe.ingredients.join('\n')}\nMethod:\n${recipe.method}`;

  // Create a Blob object containing the text data
  const blob = new Blob([textData], { type: 'text/plain' });

  // Generate a unique file name based on the recipe name
  const fileName = `${recipe.name.replace(/\s+/g, '-').toLowerCase()}.txt`;

  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);

  // Create an <a> element to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // Append the <a> element to the document body and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up: remove the <a> element and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to save recipe data
function saveRecipe() {
  // Get input values
  const recipeName = document.getElementById("recipe-name").value;
  const recipeIngredients = document.getElementById("recipe-ingredients").value;
  const recipeMethod = document.getElementById("recipe-method").value;

  // Create an object to store recipe data
  const recipeData = {
    name: recipeName,
    ingredients: recipeIngredients.split(',').map(i => i.trim()),
    method: recipeMethod
  };

  // Check if local storage is available
  if (typeof(Storage) !== "undefined") {
    // Get existing recipes or initialize an empty array
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    // Add the new recipe to the array
    storedRecipes.push(recipeData);

    // Save the updated recipes array to local storage
    localStorage.setItem("recipes", JSON.stringify(storedRecipes));

    // Provide feedback to the user
    alert("Recipe saved successfully!");

    // Clear form inputs
    document.getElementById("recipe-name").value = "";
    document.getElementById("recipe-ingredients").value = "";
    document.getElementById("recipe-method").value = "";

    // Update the recipes array and display
    recipes = storedRecipes;
    displayRecipes();
  } else {
    // If local storage is not available, display an error message
    alert("Sorry, your browser does not support local storage. Unable to save recipe.");
  }
}

// Handle form submit
function handleSubmit(event) {
  // Prevent default form submission behavior
  event.preventDefault();

  // Save the recipe
  saveRecipe();
}

// Display recipes in recipe list
function displayRecipes() {
  recipeList.innerHTML = '';
  recipes.forEach((recipe, index) => {
    const recipeDiv = document.createElement('div');
    // Create div to display the individual recipe, for each recipe
    recipeDiv.innerHTML = `
      <p> <strong style="font-size:24px;"> Name: </strong><span style="font-size:18px; font-weight:700 ;">${recipe.name}</span></p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
      </ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      <button class="save-button" data-index="${index}">Save Recipe</button>
      <button class="delete-button" data-index="${index}">Delete</button>`;
    recipeDiv.classList.add('recipe');
    recipeList.appendChild(recipeDiv);
  });
  // Display warning when there are no recipes in the list
  if (recipes.length > 0) {
    noRecipes.style.display = 'none';
  } else {
    noRecipes.style.display = 'flex';
  }
}

// Handle recipe deletion
function handleDelete(event) {
  if (event.target.classList.contains('delete-button')) {
    const index = event.target.dataset.index;
    recipes.splice(index, 1);
    displayRecipes();
    searchBox.value = '';
    // Update local storage after deleting
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }
}

// Handle recipe saving
function handleSave(event) {
  if (event.target.classList.contains('save-button')) {
    const index = event.target.dataset.index;
    const recipeToSave = recipes[index];
    // Save the recipe as a text file
    saveRecipeAsText(recipeToSave);
  }
}

// Search recipes by search query
function search(query) {
  const filteredRecipes = recipes.filter(recipe => {
    return recipe.name.toLowerCase().includes(query.toLowerCase());
  });
  recipeList.innerHTML = '';
  filteredRecipes.forEach(recipe => {
    const recipeEl = document.createElement('div');
    recipeEl.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong></p>
      <ul style="list-style-type: none; padding: 0;>
      ${recipe.ingredients.map(ingr => `<li style="margin-bottom: 5px;">${ingr}</li>`).join('')}
      </ul>
      <p><strong>Method:</strong></p>
      <p>${recipe.method}</p>
      <button class="save-button" data-index="${recipes.indexOf(recipe)}">Save Recipe</button>
      <button class="delete-button" data-index="${recipes.indexOf(recipe)}">Delete</button>`;
    recipeEl.classList.add('recipe');
    recipeList.appendChild(recipeEl);
  });
}

// Add event listeners
form.addEventListener('submit', handleSubmit);
recipeList.addEventListener('click', handleDelete);
recipeList.addEventListener('click', handleSave);
searchBox.addEventListener('input', event => search(event.target.value));

// Load recipes from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
  recipes = storedRecipes;
  displayRecipes();
});

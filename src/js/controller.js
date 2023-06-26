import * as model from './model';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice('1');

    if (!id) return;

    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe)

    // 3) Update result view
    resultsView.render(model.getSearchResultsPage())

    // 4) Update bookmarks view
    bookmarksView.render(model.state.bookmarks)
  } catch (error) {
    console.error(`${error} 🔥🔥`);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage(1));
    paginationView.render(model.state.search);
  } catch (error) {}
};

const controlPagination = function (pageNumber) {
  resultsView.render(model.getSearchResultsPage(pageNumber));
  paginationView.render(model.state.search);
};

const controlServings = function(newServings) {
  model.updateServings(newServings)
  recipeView.render(model.state.recipe)
};

const controlBookmark = function() {
  // 1) Add / remove bookmark in state
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark()
  // 2)Update recipe view
  recipeView.render(model.state.recipe)
  //3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlGetBookmark = function() {
  model.getBookmarks()
};

const controlAddRecipe = async function(newRecipe) {

  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
  
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks)    

    // Success message 
    addRecipeView.renderMessage()

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)

  } catch (error) {
    console.error(error)
    addRecipeView.renderError(error)
  }
};

(() => {
  bookmarksView.addHandlerBookmark(controlGetBookmark)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerBookmark(controlBookmark)
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();

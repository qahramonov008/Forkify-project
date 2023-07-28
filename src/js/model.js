import { API_URL, KEY, RESULTS_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    pageNumber: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: []
};

const createRecipeObject = function(data) {
    const {recipe} = data

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        image: recipe.image_url,
        cookingTime: recipe.cooking_time,
        sourceUrl: recipe.source_url,
        ...(recipe.key && {key: recipe.key})
      };
}

export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}/${id}`);

    state.recipe = createRecipeObject(data.data)

    if(state.bookmarks.some(bookmarkedRecipe => bookmarkedRecipe.id === id)) state.recipe.bookmarked = true
    else state.recipe.bookmarked = false
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key})
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (
  pageNumber = state.search.pageNumber
) {
  state.search.pageNumber = pageNumber;
  let start = (pageNumber - 1) * state.search.resultsPerPage;
  let end = pageNumber * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function(newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity / state.recipe.servings * newServings
    });
    state.recipe.servings = newServings
}

const persistBookmarks = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function() {
    // Add bookmark
    state.bookmarks.push(state.recipe)

    // Mark current recipe as bookmark
    state.recipe.bookmarked = true

    // Save to localstorage 
    persistBookmarks()
}

export const deleteBookmark = function() {

    //Remove recipe from bookmarks list
    const index = state.bookmarks.findIndex(el => el.id === state.recipe.id) 
    state.bookmarks.splice(index, 1)

    //Mark current recipe as NOT bookmarked
    state.recipe.bookmarked = false

    // Save to local storage 
    persistBookmarks()
}

export const getBookmarks = function() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    if(!bookmarks) return;

    state.bookmarks = bookmarks
}

export const uploadRecipe = async function(newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
        .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingArr = ing[1].split(',')

            if(ingArr.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format')

            const [quantity, unit, description] = ingArr

            return {
                quantity: quantity ? +quantity : null,
                unit,
                description,
            }
        })

        const addedRecipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        const data = await AJAX(`${API_URL}?key=${KEY}`, addedRecipe)
        console.log(data)

        state.recipe = createRecipeObject(data.data)
       addBookmark(state.recipe)
        
    } catch (error) {
        throw error
    }
    
    
}
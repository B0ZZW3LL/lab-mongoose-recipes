const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// ONE WAY WITH ASYNC/AWAIT APPROACH... 
//    From walkthrough with Jack - maybe avoid the .then's below.. but declare the return instead. 
//      i.e 
//       const newData = await Recipe.insertMany(data);
//       newData.forEach(element => console.log(element.title));

mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`)
    recipeHandler()
      .then((message) => console.log('Recipes created and updated successfully'))
  })
  .catch(err => {
    console.error('Error connecting to the database', error);
  })

async function recipeHandler() {
  try {
    await Recipe.deleteMany()
      .then(() => console.log('All existing recipes deleted'))
    await Recipe.insertMany(data)
      .then(recipesCreated => {recipesCreated.forEach(element => console.log(`${element.title} has been created`))})
    await Recipe.findOneAndUpdate({title:'Rigatoni alla Genovese'}, { duration: 100 })
      .then(() => console.log('Rigatoni has been amended'))
    await Recipe.deleteOne({ title: 'Carrot Cake' })
      .then(deletedRecipe => console.log(`${deletedRecipe.deletedCount} recipe removed`))
    await mongoose.connection.close();
      console.log('connection closed')

  } catch (err) {
    console.log("Whoops, something went wrong", error);
  }
}


// NESTED THEN APPROACH - WORKS BUT NOT THE CLEANEST

// mongoose
//   .connect(MONGODB_URI)
//   .then(x => {
//     console.log(`Connected to the database: "${x.connection.name}"`);
//     return Recipe.deleteMany()    //<-- Before adding any recipes to the database, let's remove all existing ones //
//   })
//   .catch(err => {
//     console.error('Error connecting to the database', error);
//   })
//   .then(() => {                                                              
//     Recipe.insertMany(data)
//       .then(recipes => {recipes.forEach(element => console.log(`${element.title} has been created`))})
//       .catch(err => console.log('oops something went wrong creating recipe')) 

//         .then(() => Recipe.findOneAndUpdate({title:'Rigatoni alla Genovese'}, { duration: 100 }))
//           .then(message => console.log('Rigatoni updated successfully'))
//           .catch(err => console.log('whoops, something went wrong updating the Rigatoni')) 

//           .then(() => Recipe.deleteOne({ title: 'Carrot Cake' }))
//             .then(message => console.log('Carrot Cake removed successfully'))
//             .catch(err => console.log('Error deleting Carrot Cake'))

//               .then(() => {mongoose.connection.close()})
//                 .then(() => console.log('connection closed'))
//   })

// ITERATION 2 - CREATE ONE RECIPE

// .then(() => {                                                                 
//   Recipe.create(data[0])
//     .then(recipe => console.log(`${recipe.title} has been created`))
//     .catch(err => console.log('oops something went wrong creating recipe'))
// })
// .catch(error => {
//   console.error('Error connecting to the database', error);
// });

//ITERATION 3 - Create many recipes //

export function getRecipes(type, recipee) {
  var count = 0;
  const recipesArray = [];
  if (recipee) {
    var count = 1;
    recipee.map((data) => {
      if (data.type[0] == type && count <= 5) {
        recipesArray.push(data);
        count = count + 1;
      }
    });
  } else {
    return;
  }
  return recipesArray;
}

class CocktailsApp {
  constructor(data) {
    this.buttonsContainer = document.querySelector('.cocktails__buttons');
    this.buttonsList = this.addButtons(data);
    this.ingredientsList = document.querySelector('.cocktails__ingredients');
    this.findRecipe(data);
  }

  createButtons(data) {
    let buttonsList = '';
    data.forEach((element, index) => { 
      buttonsList += '<div class="cocktails__button" data-index="' + index + '" data-name="' + element.name + '">' + element.name + '</div>';
    });
    return buttonsList;
  }

  addButtons(data) {
    let buttons = this.createButtons(data);
    this.buttonsContainer.innerHTML = buttons;
    return document.querySelectorAll('.cocktails__button');
  }

  removeActiveClass(buttons) {
    buttons.forEach((button) => {
      button.classList.remove('active');
    })
  }

  findRecipe(data) {
    let thisApp = this;
    let buttons = this.buttonsList;
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        let btnIndex = e.target.dataset.index;
        thisApp.removeActiveClass(buttons);
        thisApp.ingredientsList.textContent = ''; 
        thisApp.checkRecipe(thisApp, btnIndex, data)
      }, true);
    })
  }

  checkRecipe(thisApp, btnIndex, data) {
    for(let itemIndex in data) {
      if (itemIndex === btnIndex) {
        thisApp.buttonsList[btnIndex].classList.add('active');
        thisApp.prepareRecipe(thisApp, data[itemIndex]);
      }
    }
  }

  prepareRecipe(thisApp, cocktail) {
    thisApp.getIngredients(thisApp, cocktail);
  }

  getIngredients(thisApp, cocktail) {
    let ingredients = cocktail.ingredients;
    thisApp.showIngredients(thisApp, ingredients);
  }

  getPartsTotal(ingredients) {
    let partsTotal = 0;
    for(let ingredient of ingredients) {
      partsTotal += ingredient.part;
    }
    return partsTotal;
  }

  createIngredient(thisApp, ingredientName, ingredientPart, partPercentage, ingredientColor) {
    let ingredientHTML = '<div class="cocktails__ingredient" style="height:' + partPercentage + '%' + '; background-color:' + ingredientColor + '"><span>' + ingredientPart + ' part of ' + ingredientName + '</span></div>';
    thisApp.ingredientsList.insertAdjacentHTML("afterbegin", ingredientHTML);
  }

  showIngredients(thisApp, ingredients) {
    let timeout = 0;
    let partsTotal = thisApp.getPartsTotal(ingredients);
    for(let ingredient of ingredients) {
      let ingredientName = ingredient.name;
      let ingredientPart = ingredient.part;
      let partPercentage = (100 / partsTotal * ingredientPart);
      let ingredientColor = ingredient.color;
      setTimeout(() => {
        thisApp.createIngredient(thisApp, ingredientName, ingredientPart, partPercentage, ingredientColor);
      }, timeout);
      timeout += 500;
    }
  }
}

async function generatecocktailsList() {
  let dataJson = await fetch('./src/data/data.json');
  dataJson = await dataJson.json();
  return dataJson;
}
generatecocktailsList().then(dataJson => new CocktailsApp(dataJson));
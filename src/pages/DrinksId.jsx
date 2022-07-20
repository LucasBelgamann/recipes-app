import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StartRecipe from '../components/StartRecipe';
import Context from '../context/context';

// import { Container } from './styles';

function DrinkId() {
  const { setFetchIdDrink, fetchIdDrink } = useContext(Context);
  const { id } = useParams();

  const [ingredientsArray, setIngredients] = useState([]);
  const [amountArray, setAmmount] = useState([]);
  const [foodArray, setFood] = useState([]);

  const handleFetchIdDrink = async () => {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    const getFetch = await fetch(url);
    const dataJson = await getFetch.json();
    const responseIdArray = dataJson.drinks[0];
    console.log(responseIdArray);
    const reduce = Object.entries(responseIdArray).reduce((acc, item) => {
      if (item[0].includes('strIngredient')) {
        acc.push(item[1]);
      }
      return acc;
    }, []);
    const ammoutReduce = Object.entries(responseIdArray).reduce((acc, item) => {
      if (item[0].includes('strMeasure')) {
        acc.push(item[1]);
      }
      return acc;
    }, []);

    setAmmount(ammoutReduce);
    setIngredients(reduce);
    setFetchIdDrink(responseIdArray);
  };

  const recommendationFetch = async () => {
    const url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    const response = await fetch(url);
    const data = await response.json();
    setFood(data.meals.filter((_, i) => i < '6'));
  };

  console.log(foodArray);
  useEffect(() => {
    handleFetchIdDrink();
    recommendationFetch();
  }, []);
  return (
    <div>
      <div>
        <img
          src={ fetchIdDrink.strDrinkThumb }
          alt="foto-drink"
          data-testid="recipe-photo"
          className="details-img-drink"
        />
        <h1 data-testid="recipe-title">{fetchIdDrink.strDrink}</h1>
        <h2 data-testid="recipe-category">{fetchIdDrink.strAlcoholic}</h2>
        <ol>
          {ingredientsArray.map(
            (item, i) => item && (
              <li data-testid={ `${i}-ingredient-name-and-measure` } key={ i }>
                {`${amountArray[i]} ${item}`}
              </li>
            ),
          )}
          <p data-testid="instructions">{fetchIdDrink.strInstructions}</p>
        </ol>
        <div className="recommendationItens">
          {foodArray.map((item, i) => (
            <div data-testid={ `${i}-recomendation-card` } key={ i }>
              <Link to={ `/foods/${item.idMeal}` } key={ i }>
                <div data-testid={ `${i}-recipe-card` }>
                  <img
                    src={ item.strMealThumb }
                    alt="foto-receita"
                    data-testid={ `${i}-card-img` }
                    className="recommendationImage"
                  />
                  <h2 data-testid={ `${i}-recomendation-title` }>{item.strMeal}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button type="button" data-testid="share-btn">Share</button>
      <button type="button" data-testid="favorite-btn">Favorite</button>
      <StartRecipe />
    </div>
  );
}

export default DrinkId;

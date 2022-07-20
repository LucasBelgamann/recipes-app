import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StartRecipe from '../components/StartRecipe';
import Context from '../context/context';

// import { Container } from './styles';

function FoodsId() {
  const { setFetchId, fetchId } = useContext(Context);
  const { id } = useParams();

  const [ingredientsArrayFood, setIngredientsArrayFood] = useState([]);
  const [amountArray, setAmmount] = useState([]);
  const [drinkArray, setDrink] = useState([]);

  const handleFetchIdFood = async () => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const getFetch = await fetch(url);
    const dataJson = await getFetch.json();
    const responseIdArrayFood = dataJson.meals[0];
    const reduce = Object.entries(responseIdArrayFood).reduce((acc, item) => {
      if (item[0].includes('strIngredient')) {
        acc.push(item[1]);
      }
      return acc;
    }, []);
    const ammoutReduce = Object.entries(responseIdArrayFood).reduce((acc, item) => {
      if (item[0].includes('strMeasure')) {
        acc.push(item[1]);
      }
      return acc;
    }, []);

    setAmmount(ammoutReduce);
    setIngredientsArrayFood(reduce);
    setFetchId(responseIdArrayFood);
  };

  const recommendationFetch = async () => {
    const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    const response = await fetch(url);
    const data = await response.json();
    setDrink(data.drinks.filter((_, i) => i < '6'));
  };

  console.log(fetchId);
  useEffect(() => {
    handleFetchIdFood();
    recommendationFetch();
  }, []);
  return (
    <div>
      <div>
        <img
          src={ fetchId.strMealThumb }
          alt="foto-drink"
          data-testid="recipe-photo"
          className="details-img-drink"
        />
        <h1 data-testid="recipe-title">{fetchId.strMeal}</h1>
        <h2 data-testid="recipe-category">{fetchId.strCategory}</h2>
        <ol>
          {ingredientsArrayFood.map(
            (item, i) => item && (
              <li data-testid={ `${i}-ingredient-name-and-measure` } key={ i }>
                {`${amountArray[i]} ${item}`}
              </li>
            ),
          )}
          <p data-testid="instructions">{fetchId.strInstructions}</p>
        </ol>
        { fetchId.strYoutube && <iframe
          title="youtube"
          src={ fetchId.strYoutube.replace('watch?v=', 'embed/') }
          data-testid="video"
        /> }
        <div className="recommendationItens">
          {drinkArray.map((item, i) => (
            <div data-testid={ `${i}-recomendation-card` } key={ i }>
              <Link to={ `/drinks/${item.idDrink}` } key={ i }>
                <div data-testid={ `${i}-recipe-card` }>
                  <img
                    src={ item.strDrinkThumb }
                    alt="foto-receita"
                    data-testid={ `${i}-card-img` }
                    className="recommendationImage"
                  />
                  <h2 data-testid={ `${i}-recomendation-title` }>{item.strDrink}</h2>
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

export default FoodsId;

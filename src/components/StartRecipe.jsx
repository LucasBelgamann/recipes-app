import React from 'react';

// import { Container } from './styles';

function StartRecipe() {
  return (
    <div>
      <button
        className="btn-start-recipe"
        type="button"
        data-testid="start-recipe-btn"
      >
        Start Recipe
      </button>
    </div>
  );
}

export default StartRecipe;

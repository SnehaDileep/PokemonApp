import React, { useState } from 'react';
import PokemonThumb from './components/PokemonThumb'
import axios from 'axios';
import {
  MDBInputGroup,
  MDBIcon
} from 'mdb-react-ui-kit';
import "./App.css";

const App = () => {
  const [pokemon, setPokemon] = useState("pikachu");
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonType, setPokemonType] = useState("");
  const[allPokemons, setAllPokemons] = useState([])
  const [loadMore, setLoadMore] = useState('https://pokeapi.co/api/v2/pokemon?limit=20')

  const getPokemon = async () => {
    const toArray = [];
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
      const res = await axios.get(url);
      toArray.push(res.data);
      setPokemonType(res.data.types[0].type.name);
      setPokemonData(toArray);
      console.log(res);
    } catch (e) {
      console.log(e)
    }
  };
  

  const getAllPokemons = async () => {
    const res = await fetch(loadMore)
    const data = await res.json()

    setLoadMore(data.next)

    function createPokemonObject(results)  {
      results.forEach( async pokemon => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const data =  await res.json()
        setAllPokemons( currentList => [...currentList, data])
        await allPokemons.sort((a, b) => a.id - b.id)
      })
    }
    createPokemonObject(data.results)
  }
    

  const handleChange = (e) => {
    setPokemon(e.target.value.toLowerCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getPokemon();
  };

  return (
    <div className='App'>
      <form onSubmit={handleSubmit}>
      
      <MDBInputGroup className='mb-3' noBorder textBefore={<MDBIcon fas icon='search' />}>
        <input className='form-control' type='text' onChange={handleChange} placeholder='Enter Pokemon Name' />
      </MDBInputGroup>
      </form>
    
      
        {/* <label>
          <input 
            type="text"
            onChange={handleChange}
            placeholder="Enter Pokemon Name"
          
          />
        </label> */}
      {pokemonData.map((data) => {
        return(
          <div className="container">
          <img src={data.sprites.other.dream_world["front_default"]} /> 
         <div className="divTable">
           <div className="divTableBody">
             <div className="divTableRow">
               <div className="divTableCell">Type</div>
               <div className="divTableCell">{pokemonType}</div>
             </div>
             <div className="divTableRow">
               <div className="divTableCell">Height</div>
               <div className="divTableCell">
                 {" "}
                 {Math.round(data.height * 3.9)}"
               </div>
             </div>
             <div className="divTableRow">
               <div className="divTableCell">Weight</div>
               <div className="divTableCell">
                 {" "}
                 {Math.round(data.weight / 4.3)} lbs
               </div>
             </div>
             <div className="divTableRow">
               <div className="divTableCell">Number of Battles</div>
               <div className="divTableCell">{data.game_indices.length}</div>
             </div>
           </div>
         </div>

         
       </div>
     );
      })}

      <div className="app-contaner">
      <h1>Pokemon List</h1>
      <div className="pokemon-container">
        <div className="all-container">
          {allPokemons.map( (pokemonStats, index) => 
            <PokemonThumb
              key={index}
              id={pokemonStats.id}
              image={pokemonStats.sprites.other.dream_world.front_default}
              name={pokemonStats.name}
              type={pokemonStats.types[0].type.name}
            />)}
        </div>
          <button className="load-more" onClick={() => getAllPokemons()}>Load</button>
      </div>
      </div>
    </div>
    


  );
};

export default App;

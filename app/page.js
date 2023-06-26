'use client'
import { useState, useEffect } from "react"
import Select from "react-select"
import { BsChevronUp } from 'react-icons/bs'
import { MdOutlineClear } from 'react-icons/md'
import Link from "next/link"

/* Select dropdown options of movie genres */
const options = [
  { value: 'animation', label: 'Animation' },
  { value: 'classic', label: 'Classic' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'horror', label: 'Horror' },
  { value: 'family', label: 'Family' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'western', label: 'Western'}
]

/* Fetch request from API with variable endpoint */
async function getMovies(genre){
  const res = await fetch(`https://api.sampleapis.com/movies/${genre}`)
  return res.json()
}

export default function Home() {
  /* State variables for fetching selected genre, handling data, search, and scroll button */
  const [selectedOption, setSelectedOption] = useState()
  const [movies, setMovies] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchedMovies, setSearchedMovies] = useState([])
  const [scrollButton, setScrollButton] = useState(false)
 
  /* Creates fetch request only when selected option changes, clears search and results*/
  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedOption) {
        const moviesData = await getMovies(selectedOption.value)
        setMovies(moviesData)
        setSearchInput('')
        setSearchedMovies([])
      }
    }
    fetchMovies()
  }, [selectedOption])


/* Handles broken images, on error adds property imageError:true to movie object */
  const handleImageError = (index) => {
    const updatedMovies = [...movies]
    updatedMovies[index].imageError = true
    setMovies(updatedMovies)
  }

/* Adds event listener to call handleButton on scroll */
  useEffect(() => {
    window.addEventListener('scroll', handleButton)
    return () => {
      window.removeEventListener('scroll', handleButton)
    }
  }, [])

/* Scroll to top button only displays once you scrolled down > 300px */
const handleButton = () => {
  if(window.scrollY > 300) {
    setScrollButton(true)
  }else{
    setScrollButton(false)
  }
}

/* Scroll to top function */  
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/* Returns movies that include searched term */
const searchMovies = (e) =>{
  setSearchInput(e.target.value)
  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchInput.toLowerCase()))
  setSearchedMovies(filteredMovies)
}

/* Clears input and resets movies to all in genre */
const clear = () =>{
  setSearchInput('')
  setSearchedMovies([])
  getMovies()
}

    return (
      <body>        
        <h1 className='gradient-heading'>MOVIES MOVIES MOVIES</h1>
        <h2 className="subheading">Choose a genre:</h2>

        <Select
          className="dropdown-menu"
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
          maxMenuHeight={300}
        />

        {selectedOption && 
        <div>
          <h3 className="subheading">Search by title in {selectedOption.value}:</h3>
          <div className="search">
            <input
              className="search-bar" 
              type='text'
              onChange={searchMovies}
              value={searchInput}>
            </input>
            <button 
              className="clear"
              onClick={clear}>  
              <MdOutlineClear
                className="clear-icon"/> 
            </button>
          </div>
        </div>}

        
        {searchMovies &&
        <div className='movies-container'>
         
          {/* only renders for working images */}
            {searchedMovies.map((movie, index) => (!movie.imageError &&
              <section 
                className='movie-card'
                key={movie.id}>
                <Link href={`https://www.imdb.com/title/${movie.imdbId}`}>
                <h3 className='movie-title'>{movie.title}</h3>
                <img
                    className="movie-img"
                    src={movie.posterURL} 
                    alt={`${movie.title} poster`}
                    onError={() => handleImageError(index)} />
                </Link>
              </section>
            ))}
           
        </div>}

        {!searchInput &&
        <div className='movies-container'>
          {/* only renders for working images */}
            {movies.map((movie, index) => (!movie.imageError &&          
              <section 
                className='movie-card'
                key={movie.id}>
                <Link href={`https://www.imdb.com/title/${movie.imdbId}`} target="_blank">
                <h4 className='movie-title'>{movie.title}</h4>
                <img
                    className="movie-img"
                    src={movie.posterURL} 
                    alt={`${movie.title} poster`}
                    onError={() => handleImageError(index)} />
                </Link>
              </section>            
            ))}
        </div>}
          
          { scrollButton && <BsChevronUp
            className='back-to-top'
            onClick={scrollToTop}
            />}
    </body>
  )
}

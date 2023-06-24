'use client'
import { useState, useEffect } from "react"
import Select from "react-select"
import { BsChevronUp } from 'react-icons/bs'

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
  /* State variables for fetching selected genre, handling data, and scroll button */
  const [selectedOption, setSelectedOption] = useState()
  const [movies, setMovies] = useState([])
  const [scrollButton, setScrollButton] = useState(false)
 
  /* Creates fetch request only when selected option changes*/
  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedOption) {
        const moviesData = await getMovies(selectedOption.value)
        /* can add slice here to limit results, setMovies(moviesData.slice(0, 30)) */
        setMovies(moviesData)
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

    return (
      <body>        
        <h1>Movies</h1>
        <p>Choose a genre:</p>

        <Select
          className="dropdown-menu"
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
          maxMenuHeight={300}
        />
    
        <div className='movies-container'>
          {/* only renders for working images */}
            {movies.map((movie, index) => (!movie.imageError &&
              <section 
                className='movie-card'
                key={movie.id}>
                <h3 className='movie-title'>{movie.title}</h3>
                <img 
                    className="movie-img"
                    src={movie.posterURL} 
                    alt={`${movie.title} poster`}
                    onError={() => handleImageError(index)} />
              </section>
            ))}
          
          { scrollButton && <BsChevronUp
            className='back-to-top'
            onClick={scrollToTop}
            />}
        </div>
    </body>
  )
}

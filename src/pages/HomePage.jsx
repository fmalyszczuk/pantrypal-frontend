import './HomePage.css'

const WAYS_TO_ADD = [
  {
    title: 'Paste a link',
    description: 'Drop in a recipe URL and we pull the ingredients out for you.',
  },
  {
    title: 'Search by name',
    description: 'Type a dish like "chicken tikka masala" and pick a recipe.',
  },
  {
    title: 'Upload a file',
    description: 'Snap a cookbook page or upload a screenshot or PDF.',
  },
]

function HomePage() {
  return (
    <div className="home">
      <header className="home__hero">
        <h1 className="home__title">PantryPal</h1>
        <p className="home__tagline">
          Turn any recipe into a shopping list. Add a few recipes and we merge
          the ingredients so you buy everything in one trip.
        </p>
      </header>

      <section aria-labelledby="ways-heading">
        <h2 id="ways-heading" className="home__section-title">
          Add a recipe
        </h2>
        <ul className="home__ways">
          {WAYS_TO_ADD.map((way) => (
            <li key={way.title} className="home__way">
              <h3 className="home__way-title">{way.title}</h3>
              <p className="home__way-description">{way.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default HomePage

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'

function App() {
	/*
	<div className="nav">
		<Link to="/">Home</Link> | <Link to="/about">About</Link>
	</div>
	*/
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
			</Routes>
		</Router>
	)
}

export default App

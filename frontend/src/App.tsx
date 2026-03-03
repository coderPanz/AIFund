import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Funds from './pages/Funds'
import FundDetail from './pages/FundDetail'
import AIAdvisor from './pages/AIAdvisor'
import Portfolio from './pages/Portfolio'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="funds" element={<Funds />} />
        <Route path="funds/:code" element={<FundDetail />} />
        <Route path="ai" element={<AIAdvisor />} />
        <Route path="portfolio" element={<Portfolio />} />
      </Route>
    </Routes>
  )
}

export default App
import logo from './logo.svg';
import './App.css';
import PeerConnection from './components/PeerConnection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="*" element={<PeerConnection />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;

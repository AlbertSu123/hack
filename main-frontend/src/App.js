import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';

function App() {
  const [status, setStatus] = useState(0);
  return (
    <div className="App">

      <Button variant="contained" onClick={() => {
    alert('clicked');
  }}> Submit Notional</Button>

    </div>
  );
}

export default App;

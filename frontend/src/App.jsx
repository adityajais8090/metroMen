import { useState } from 'react';
import './App.css';
import axios from 'axios';


function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const input = `${from}\\n${to}`;
    const language = 'cpp';
    const payload = { 
      language,
      input };

    try {
      const response = await axios.post( import.meta.env.VITE_BACKEND_URL , payload, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
     console.log("Response : ", response.data);
      
      const output_result = response.data.output;
      console.log("Result :" , output_result);
      setResult(output_result);
    } catch (error) {
      console.error('Error:', error);
      setResult(''); // Clear result in case of error to reset the display
    }
  };

  const parseResult = (result) => {
    const lines = result.split('\n').map(line => line.trim()).filter(line => line);
    const infoLines = lines.slice(0, 4); // Adjust based on your actual response structure
    const pathLines = lines.slice(4); // Adjust based on your actual response structure

    const stations = pathLines.map(line => {
      const station = line.substring(0, line.indexOf('->')).trim();
      const lineColor = line.substring(line.indexOf('[') + 1, line.indexOf(']')).trim();

      return { name: station, line: lineColor };
    });

    return { info: infoLines, stations };
  };

  const parsedResult = result ? parseResult(result) : { info: [], stations: [] };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h1>Metro Men</h1>
        <label>
          From:
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          To:
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {parsedResult.stations.length > 0 && (
        <div className="details">
          <div className="info">
            <p><strong>Source:</strong> {parsedResult.info[0]}</p>
            <p><strong>Destination:</strong> {parsedResult.info[1]}</p>
            <p><strong>Shortest time:</strong> {parsedResult.info[2].split(': ')[1]}</p>
            <p><strong>Minimum interchanges:</strong> {parsedResult.info[3].split(': ')[1]}</p>
          </div>
          <h2>Stations</h2>
          <table>
            <thead>
              <tr>
                <th>Station</th>
                <th>Line</th>
              </tr>
            </thead>
            <tbody>
              {parsedResult.stations.map((station, index) => (
                <tr key={index}>
                  <td>{station.name}</td>
                  <td className={`line ${station.line.toLowerCase()}`}>{station.line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;

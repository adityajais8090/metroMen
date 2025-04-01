import { useState } from "react";
import axios from "axios";
import Loader from "./SpinnerLoader"; // Corrected import
import "./App.css";

function App() {
  const stations = [
    "Adarsh Nagar", "AIIMS", "Arjan Garh", "Arthala", "Azadpur", 
    "Badarpur Border", "Badkal Mor", "Bata Chowk", "Botanical Garden", 
    "Central Secretariat", "Chandni Chowk", "Chawri Bazar", "Chhattarpur", 
    "Chirag Delhi", "Civil Lines", "Dabri Mor", "Delhi Gate", "Dilli Haat INA", 
    "Dilshad Garden", "Escorts Mujesar", "Ghitorni", "Govind Puri", 
    "Greater Kailash", "Green Park", "Guru Dronacharya", "Guru Tegh Bahadur Nagar", 
    "Haiderpur Badli Mor", "Hauz Khas", "Hindon River", "IFFCO Chowk", "IIT Delhi", 
    "Inderlok", "ITO", "Jahangirpuri", "Jamia Millia Islamia", "Janak Puri West", 
    "Janpath", "Jangpura", "Jasola", "Jasola Vihar Shaheen Bagh", "Jawaharlal Nehru Stadium", 
    "Jhil Mil", "Jorbagh", "Kailash Colony", "Kalindi Kunj", "Kalkaji Mandir", 
    "Kanhaiya Nagar", "Kashmere Gate", "Keshav Puram", "Khan Market", "Kohat Enclave", 
    "Lajpat Nagar", "Lal Quila", "Lok Kalyan Marg", "Mahatma Gandhi Road", "Malviya Nagar", 
    "Mandi House", "Mansarovar Park", "Major Mohit Sharma", "Mewala Maharajpur", 
    "MG Road", "Millennium City Centre Gurugram", "Model Town", "Mohan Estate", 
    "Mohan Nagar", "Munirka", "Nehru Enclave", "Nehru Place", "Netaji Subash Place", 
    "New Delhi", "NHPC Chowk", "Okhla", "Okhla Bird Sanctuary", "Okhla NSIC", 
    "Okhla Vihar", "Palam", "Panchsheel Park", "Patel Chowk", "Pitam Pura", 
    "Pratap Nagar", "Pul Bangash", "Qutab Minar", "Raja Nahar Singh", "Raj Bagh", 
    "Rajiv Chowk", "Rithala", "RK Puram", "Rohini East", "Rohini Sector", "Rohini West", 
    "Samaypur Badli", "Sant Surdas - Sihi", "Sadar Bazaar Cantonment", "Saket", 
    "Sarita Vihar", "Seelampur", "Shadipur", "Shaheed Nagar", "Shaheed Sthal", "Shahdara", 
    "Shalimar Bagh", "Shankar Vihar", "Shastri Nagar", "Shastri Park", "Shaheed Sthal", 
    "Shaheed Nagar", "Shyam Park", "Sikandarpur", "Sukhdev Vihar", "Sultanpur", 
    "Tis Hazari", "Terminal 1 IGI Airport", "Tughlakabad", "Udyog Bhawan", 
    "Vasant Vihar", "Vidhan Sabha", "Vishwavidyalaya", "Welcome"
  ];

  const [from, setFrom] = useState(stations[0]);
  const [to, setTo] = useState(stations[1]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    const input = `${from}\\n${to}`;
    const language = "cpp";
    const payload = { language, input };

    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL, payload, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      console.log("Response:", response.data);
      
      const outputResult = response.data.output;
      const parsedData = parseResult(outputResult);
      setResult(parsedData);
    } catch (error) {
      console.error("Error:", error);
      setResult(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const parseResult = (result) => {
    const lines = result.split("\n").map(line => line.trim()).filter(line => line);
    if (lines.length < 4) return null; // Handle unexpected response format

    return {
      source: lines[0],
      destination: lines[1],
      shortestTime: lines[2].split(": ")[1],
      interchanges: lines[3].split(": ")[1],
      route: lines.slice(4).map(line => {
        const station = line.substring(0, line.indexOf("->")).trim();
        const lineColor = line.substring(line.indexOf("[") + 1, line.indexOf("]")).trim();
        return { name: station, line: lineColor };
      })
    };
  };

  return (
    <div>
      <div className="header">Metro Route Optimization</div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>From:</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {stations.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>To:</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {stations.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
          </div>

          <button type="submit">Get Route</button>
        </form>

        {/* Show Loader while fetching data */}
        {loading && <Loader />}

        {!loading && result && (
          <div className="details">
            <h2>Route Details</h2>
            <p><strong>From:</strong> {result.source}</p>
            <p><strong>To:</strong> {result.destination}</p>
            <p><strong>Shortest Time:</strong> {result.shortestTime}</p>
            <p><strong>Interchanges:</strong> {result.interchanges}</p>

            <h3>Stations</h3>
            <ul>
              {result.route.map((station, index) => (
                <li key={index} className={`station ${station.line.toLowerCase()}-line`}>
                  {station.name} <span>({station.line} Line)</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

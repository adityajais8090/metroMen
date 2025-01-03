
# 🧑‍💻 Metro Route Optimization System

## 🌟 Overview  
The **Metro Route Optimization System** is a web application designed to find the shortest path and minimize interchanges in a metro system based on user input. It allows users to input the source and destination stations, and it calculates the shortest route with the minimum number of interchanges.

---

## ✨ Features  

### General Features  
- **Input Form**: Allows users to specify source and destination stations.  
- **Backend Processing**: The system processes input, generates input files, and executes C++ code for route optimization.  
- **Route Information**: Displays the shortest time, minimum interchanges, and a detailed station list with line color.

### Additional Features  
- **Live Feedback**: Users receive immediate feedback with results shown dynamically.  
- **Interactive Output**: Detailed path output including each station along the route and the color of the metro line.

---

## 🛠️ Technology Stack  

### Frontend  
- **React.js**  
- **HTML, CSS, JavaScript**  

### Backend  
- **Node.js**  
- **Express.js**  
- **C++** (for route optimization algorithm)  
- **Docker** (for isolated code execution)  

### Hosting  
- **AWS** / **Google Cloud**  

---

## 📊 Database Design  

### Files Structure  

#### Input Files  
- The backend generates dynamic input files based on user input, which are then used by the C++ code for optimization.

#### Output Files  
- Output files are generated after the execution of the C++ code, which contains the results of the route optimization.

---

## 🧩 Architecture  

### Microservices  
1. **Backend Service**:  
   - Handles POST requests to run the route optimization using C++.
   - Manages file generation and execution of the C++ code.  

2. **Frontend Service**:  
   - User interface to input source and destination stations and display results.  

### Security  
- **Execution Isolation**: Code execution happens in isolated environments using Docker to ensure safety.  
- **Input Validation**: Prevents invalid input from breaking the system.

---

## 🚀 Installation  

### Prerequisites  
- **Node.js**  
- **C++ Compiler (g++)**  
- **Docker** (for isolated code execution)  

### Steps  

1. **Clone the Repository**:  
   ```bash  
   git clone https://github.com/your-username/metro-route-optimization.git  
   cd metro-route-optimization  
   

2. **Install Backend Dependencies**:  
   ```bash
   npm install  
   

3. **Start the Backend Server**:  
   ```bash  
   npm start  
     

4. **Run the Frontend**:  
   ```bash  
   npm run dev  
  

---

## 🏆 Future Enhancements  
- Add support for more metro lines and cities.  
- Improve the user interface for better user experience.  
- Allow users to save favorite routes for quick access.  

---

## 🤝 Contributions  
Contributions are welcome!  
1. Fork the repository.  
2. Create a new branch.  
3. Submit a pull request with your changes.  

---


## 📬 Contact  
For queries or feedback, reach out at **[a_jaiswal@ece.iitr.ac.in](mailto:a_jaiswal@ece.iitr.ac.in)**.  

---

## 📝 Example C++ Code  

Here’s an example of the C++ code used for route optimization:

```cpp

unordered_map<string, unordered_map<string, pair<int, string>>> adjList;

void addEdge(string s1, string s2, int tm, string color) {
    adjList[s1].insert(make_pair(s2, make_pair(tm, color)));
    adjList[s2].insert(make_pair(s1, make_pair(tm, color)));
}


void shortestPathWithMinInterchange(string src, string dest) {
    // Priority queue to store (interchanges, time, station, previous color)
    typedef tuple<int, int, string, string> Node;
    priority_queue<Node, vector<Node>, greater<Node>> pq;
    pq.push(make_tuple(0, 0, src, ""));

    // Map to store the shortest time to reach each station and the minimum interchanges
    unordered_map<string, pair<int, int>> dist;
    unordered_map<string, pair<string, string>> parent; // To track the path and color
    for (auto node : adjList) {
        dist[node.first] = {INT_MAX, INT_MAX};
        parent[node.first] = {"", ""};
    }
    dist[src] = {0, 0};

    while (!pq.empty()) {
        Node current = pq.top();
        pq.pop();

        int curInterchanges = get<0>(current);
        int curTime = get<1>(current);
        string curStation = get<2>(current);
        string prevColor = get<3>(current);

        if (curStation == dest) {
            cout << "Shortest time: " << curTime << endl;
            cout << "Minimum interchanges: " << curInterchanges << endl;
            cout << "Path: " << endl;
            printPath(parent, dest);
            return;
        }

        for (auto nbr : adjList[curStation]) {
            string nextStation = nbr.first;
            int travelTime = nbr.second.first;
            string color = nbr.second.second;

            int newInterchanges = curInterchanges + (prevColor != "" && prevColor != color);
            int newTime = curTime + travelTime;

            if (newInterchanges < dist[nextStation].second || (newInterchanges == dist[nextStation].second && newTime < dist[nextStation].first)) {
                dist[nextStation] = {newTime, newInterchanges};
                parent[nextStation] = {curStation, color}; // Track the path and color
                pq.push(make_tuple(newInterchanges, newTime, nextStation, color));
            }
        }
    }
    cout << "Destination not reachable from source" << endl;
}



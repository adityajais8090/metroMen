#include <bits/stdc++.h>
using namespace std;

unordered_map<string, unordered_map<string, pair<int, string>>> adjList;

void addEdge(string s1, string s2, int tm, string color) {
    adjList[s1].insert(make_pair(s2, make_pair(tm, color)));
    adjList[s2].insert(make_pair(s1, make_pair(tm, color)));
}

void printAdjacencyList() {
    for (auto node : adjList) {
        cout << node.first << " --> ( ";
        for (auto nbr : node.second) {
            cout << "{ " << nbr.first << " , {" << nbr.second.first << " , " << nbr.second.second << "} } ";
        }
        cout << ")" << endl;
    }
}

void printPath(unordered_map<string, pair<string, string>> &parent, string dest) {
    vector<tuple<string, string, string>> path; // To store {current station, previous station, color}
    string cur = dest;
    while (parent[cur].first != "") {
        path.push_back(make_tuple(cur, parent[cur].first, parent[cur].second));
        cur = parent[cur].first;
    }
    reverse(path.begin(), path.end());

    for (auto p : path) {
        cout << get<1>(p) << " -> " << get<0>(p) << " [" << get<2>(p) << "]" << endl;
    }
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

int main() {
    int n;
    cin >> n;
    cin.ignore();
    while (n--) {
        string s1, s2, color;
        int tm;
        getline(cin, s1); // Read From station
        getline(cin, s2); // Read To station
        cin >> tm; // Read time taken (assuming it's an integer)
        cin.ignore(); // Ignore the newline character after reading an int
        getline(cin, color);
        addEdge(s1, s2, tm, color);
    }

    // Uncomment to print adjacency list
    // printAdjacencyList();

    string src, dest;
    getline(cin, src);
    getline(cin, dest);
     cout << "Source : " << src  << endl;
     cout << "Destintion : " << dest << endl;
    shortestPathWithMinInterchange(src, dest);

    return 0;
}

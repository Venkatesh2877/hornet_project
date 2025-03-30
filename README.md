# Bitcoin Transaction Flow Visualizer

A React-based application that visualizes Bitcoin transaction flows between wallet addresses using an interactive node graph.

## Features

- 🔍 Search any Bitcoin wallet address to view its transactions
- 📊 Visual representation of transaction flows using interactive nodes and edges
- 💱 Display of transaction amounts in BTC
- 🌓 Dark/Light theme support
- 🔄 Interactive graph with draggable nodes
- 📱 Responsive design
- 📋 Transaction details sidebar with Inflow/Outflow information

## Technologies Used

- React
- TypeScript
- React Flow (@xyflow/react)
- BlockCypher API (for Bitcoin transaction data)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Venkatesh2877/hornet_project.git
```

2. Get into the folder

```bash
     cd hornet_project
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Usage

1. Enter a Bitcoin wallet address in the search field
2. Click the "Search" button to visualize transactions
3. Drag nodes to rearrange the graph
4. Toggle between dark and light themes using the theme switch button
5. View detailed transaction information in the sidebar

## API

The application uses the BlockCypher API to fetch Bitcoin transaction data:

- Endpoint: `https://api.blockcypher.com/v1/btc/main/addrs/${address}/full`
- Rate limits may apply

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

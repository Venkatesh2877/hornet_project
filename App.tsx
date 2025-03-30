import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Edge,
  Connection,
  Node,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { handleBundle, handleSearch } from "./_nodeAndEdges";

function Flow() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([] as Node[]);
  const [edges, setEdges] = useState<Edge[]>([] as Edge[]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [searchedWallets, setSearchedWallets] = useState<Set<string>>(
    new Set()
  );
  const [inputs, setInputs] = useState<Record<string, number[]>>(
    {} as Record<string, number[]>
  );
  const [outputs, setOutputs] = useState<Record<string, number[]>>(
    {} as Record<string, number[]>
  );
  const [nodePositions, setNodePositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add styles based on dark mode
  const themeStyles = {
    background: isDarkMode ? "#1a1a1a" : "#ffffff",
    text: isDarkMode ? "#ffffff" : "#000000",
    nodeBackground: isDarkMode ? "#2d3748" : "#ffffff",
    nodeBorder: isDarkMode ? "#4a5568" : "#e2e8f0",
    edgeStroke: isDarkMode ? "#718096" : "#4a5568",
  };

  // Update the node creation to include theme styles
  const createNode = (key: string, position: { x: number; y: number }) => ({
    id: key,
    data: {
      label: (
        <div style={{ color: themeStyles.text }}>
          {key.slice(0, 5)}...{key.slice(-5)}
          {searchedWallets.has(key) && " 🔍"}
        </div>
      ),
    },
    resizable: true,
    position,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      background: themeStyles.nodeBackground,
      border: `1px solid ${themeStyles.nodeBorder}`,
      borderRadius: "8px",
      padding: "10px",
    },
  });

  const setNodesAndEdges = (
    bundleedInflow: Record<string, number[]>,
    bundleedOutflow: Record<string, number[]>
  ) => {
    const newSearchedWallets = new Set(searchedWallets);
    newSearchedWallets.add(walletAddress);
    setSearchedWallets(newSearchedWallets);

    // Calculate positions for new nodes
    const getNodePosition = (
      nodeId: string,
      defaultX: number,
      index: number
    ) => {
      if (nodePositions.has(nodeId)) {
        return nodePositions.get(nodeId)!;
      }
      return { x: defaultX, y: index * 70 };
    };

    // Create or update nodes
    const inputNodes = Object.keys(bundleedInflow)
      .filter((key) => key !== walletAddress)
      .map((key, index) => createNode(key, getNodePosition(key, -500, index)));

    const currentNode = createNode(
      walletAddress,
      getNodePosition(walletAddress, 0, inputNodes.length / 2)
    );

    const outputNodes = Object.keys(bundleedOutflow)
      .filter((key) => key !== walletAddress)
      .map((key, index) => createNode(key, getNodePosition(key, 500, index)));

    // Update node positions map
    const allNodes = [...inputNodes, currentNode, ...outputNodes];
    const newPositions = new Map(nodePositions);
    allNodes.forEach((node) => {
      newPositions.set(node.id, node.position);
    });
    setNodePositions(newPositions);

    // Merge with existing nodes, avoiding duplicates
    setNodes((prevNodes) => {
      const existingNodeIds = new Set(prevNodes.map((n) => n.id));
      const newNodes = allNodes.filter((n) => !existingNodeIds.has(n.id));
      return [...prevNodes, ...newNodes];
    });

    // Create new edges
    const newEdges = [
      ...Object.keys(bundleedInflow).map((key) => ({
        id: `${key}-${walletAddress}`,
        source: key,
        target: walletAddress,
        label: (bundleedInflow[key][0] / 100000000).toFixed(8) + " BTC",
      })),
      ...Object.keys(bundleedOutflow).map((key) => ({
        id: `${walletAddress}-${key}`,
        source: walletAddress,
        target: key,
        label: (bundleedOutflow[key][0] / 100000000).toFixed(8) + " BTC",
      })),
    ];

    setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    setWalletAddress("");
  };

  const fetchData = async (walletAddress: string) => {
    const { Inflow, Outflow } = await handleSearch(walletAddress);
    console.log(Inflow, Outflow);

    const { bundleedInflow, bundleedOutflow } = handleBundle(Inflow, Outflow);

    console.log(bundleedInflow, bundleedOutflow);
    setInputs(bundleedInflow);
    setOutputs(bundleedOutflow);

    setNodesAndEdges(bundleedInflow, bundleedOutflow);
  };

  useEffect(() => {
    console.log("useEffect");
  }, []);

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        background: themeStyles.background,
        color: themeStyles.text,
      }}
    >
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1000 }}>
        <div>
          <div>
            <input
              type="text"
              style={{
                border: `1px solid ${themeStyles.nodeBorder}`,
                borderRadius: "5px",
                padding: "5px 10px",
                marginRight: "10px",
                background: themeStyles.nodeBackground,
                color: themeStyles.text,
              }}
              placeholder="Enter wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <button
              onClick={() => fetchData(walletAddress)}
              style={{
                backgroundColor: isDarkMode ? "#4a5568" : "#3b82f6",
                color: "white",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          <div>
            <div style={{ fontSize: "12px", margin: "5px" }}>Inflows</div>
            <div
              style={{
                background: themeStyles.nodeBackground,
                border: `1px solid ${themeStyles.nodeBorder}`,
                borderRadius: "5px",
                padding: "10px",
                color: themeStyles.text,
                height: "100px",
                overflow: "scroll",
              }}
            >
              {Object.keys(inputs).map((key) => (
                <div
                  key={key}
                  style={{
                    padding: "2px",
                    borderBottom: `1px solid ${themeStyles.nodeBorder}`,
                    fontSize: "12px",
                  }}
                >
                  {key.slice(0, 5)}...{key.slice(-5)}:{" "}
                  {(inputs[key][0] / 100000000).toFixed(8) + " BTC"}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "12px", margin: "5px" }}>Outflows</div>
            <div
              style={{
                background: themeStyles.nodeBackground,
                border: `1px solid ${themeStyles.nodeBorder}`,
                borderRadius: "5px",
                padding: "10px",
                color: themeStyles.text,
                height: "100px",
                overflow: "scroll",
              }}
            >
              {Object.keys(outputs).map((key) => (
                <div
                  key={key}
                  style={{
                    padding: "2px",
                    borderBottom: `1px solid ${themeStyles.nodeBorder}`,
                    fontSize: "12px",
                  }}
                >
                  {key.slice(0, 5)}...{key.slice(-5)}:{" "}
                  {(outputs[key][0] / 100000000).toFixed(8) + " BTC"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          backgroundColor: isDarkMode ? "#1f2937" : "#e5e7eb",
          cursor: "pointer",
          zIndex: 50,
        }}
        onClick={() => {
          console.log("clicked", isDarkMode);
          setIsDarkMode(!isDarkMode);
        }}
      >
        {!isDarkMode ? (
          <svg
            style={{ width: "1.5rem", height: "1.5rem" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            style={{ width: "1.5rem", height: "1.5rem" }}
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background color={themeStyles.nodeBorder} />
      </ReactFlow>
    </div>
  );
}

export default Flow;

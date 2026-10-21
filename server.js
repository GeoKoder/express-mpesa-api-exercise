const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let agents = [
  {
    id: 1,
    name: "Mary Wanjiku",
    location: "Westlands, Nairobi",
    phoneNumber: "0712345001",
    isOpen: true,
  },
  {
    id: 2,
    name: "John Kamau",
    location: "Kasarani, Nairobi",
    phoneNumber: "0712345002",
    isOpen: false,
  },
  {
    id: 3,
    name: "Grace Akinyi",
    location: "Thika, Kiambu",
    phoneNumber: "0712345003",
    isOpen: true,
  },
  {
    id: 4,
    name: "Peter Mwangi",
    location: "Westlands, Nairobi",
    phoneNumber: "0712345004",
    isOpen: true,
  },
  {
    id: 5,
    name: "Faith Njeri",
    location: "Mombasa CBD",
    phoneNumber: "0712345005",
    isOpen: false,
  },
];

app.get("/api/agents", (req, res) => {
  let results = agents;

  const { location, open } = req.query;

  if (location) {
    results = results.filter((agent) =>
      agent.location.toLowerCase().includes(location.toLowerCase()),
    );
  }

  if (open === "true") {
    results = results.filter((agent) => agent.isOpen === true);
  }

  res.status(200).json({
    count: results.length,
    agents: results,
  });
});

// GET /api/agents/:id
app.get("/api/agents/:id", (req, res) => {
  const id = Number(req.params.id);

  const agent = agents.find((agent) => agent.id === id);

  if (!agent) {
    return res.status(404).json({
      message: "M-Pesa agent not found",
    });
  }

  res.status(200).json(agent);
});

// POST /api/agents
app.post("/api/agents", (req, res) => {
  const { name, location, phoneNumber, isOpen } = req.body;

  // Check that required fields exist and are non-empty strings.
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof location !== "string" ||
    !location.trim() ||
    typeof phoneNumber !== "string" ||
    !phoneNumber.trim()
  ) {
    return res.status(400).json({
      message: "Name, location, and phoneNumber are required.",
    });
  }

  // If supplied, isOpen must be a boolean.
  if (isOpen !== undefined && typeof isOpen !== "boolean") {
    return res.status(400).json({
      message: "isOpen must be a boolean.",
    });
  }

  const newAgent = {
    id: Math.max(0, ...agents.map((agent) => agent.id)) + 1,
    name: name.trim(),
    location: location.trim(),
    phoneNumber: phoneNumber.trim(),
    isOpen: isOpen ?? false,
  };

  agents.push(newAgent);

  res.status(201).json({
    message: "M-Pesa agent added successfully",
    agent: newAgent,
  });
});

// Handle requests to routes that do not exist.
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Start the server.
app.listen(PORT, () => {
  console.log(`M-Pesa Agent API running at http://localhost:${PORT}`);
});
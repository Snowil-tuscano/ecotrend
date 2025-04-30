const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "test";

let db;

// Connect to MongoDB once at server startup
async function connectToDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

// Route: Faculty Login
app.post("/login-1", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection("teacher").findOne({ username, password });
    if (user) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Faculty login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route: Admin Login
app.post("/login-admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection("admin").findOne({ username, password });
    if (user) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route: Student Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection("student").findOne({ username, password });
    if (user) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Student login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route: Student Dashboard
app.get("/student-dashboard", async (req, res) => {
  const name = req.query.name;

  try {
    const metrics = await db.collection("student").findOne({ username: name });

    if (metrics) {
      res.json(metrics);
    } else {
      res.status(404).json({ message: "Metrics not found" });
    }
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/faculty-dashboard", async (req, res) => {
    const name = req.query.name;
  
    try {
      const metrics = await db.collection("teacher").findOne({ username: name });
  
      if (metrics) {
        res.json(metrics);
      } else {
        res.status(404).json({ message: "Metrics not found" });
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/register", async (req, res) => {
    try {
        const users = db.collection("student"); // use existing connection
  
        const { username, password } = req.body;
        await users.insertOne({ username, password });
  
        res.status(201).json({ message: "User registered" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    } 
  });
  
  app.post("/faculty_register", async (req, res) => {
    try {
        const users = db.collection("teacher"); // use existing connection
  
        const { username, password } = req.body;
        await users.insertOne({ username, password });
  
        res.status(201).json({ message: "Faculty registered" });
    } catch (error) {
        console.error("Faculty Registration error:", error);
        res.status(500).json({ message: "Server error" });
    } 
  });
  


app.post('/AddProject', async (req, res) => {
  try {
    const {
      username,
      projectName,
      pro_apr,
      metrics,
      sustainableActions,
      sustainableImpact
    } = req.body;

    if (!username || !projectName) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const projectData = {
      projectName,
      pro_apr,
      metrics,
      sustainableActions,
      sustainableImpact,
      createdAt: new Date()
    };

    const result = await db.collection('student').updateOne(
      { username: username },
      { $push: { projects: projectData } }
    );

    if (result.modifiedCount === 1) {
      res.status(201).json({ message: 'Project submitted successfully ✅' });
    } else {
      res.status(404).json({ message: 'Student not found ❌' });
    }

  } catch (error) {
    console.error('Error submitting project:', error);
    res.status(500).json({ message: 'Server Error 🚨' });
  }
});

// Route: Delete Project
app.delete("/DeleteProject", async (req, res) => {
  try {
    const { username, projectName } = req.body;

    if (!username || !projectName) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const result = await db.collection("student").updateOne(
      { username: username },
      { $pull: { projects: { projectName: projectName } } }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Project deleted successfully ✅' });
    } else {
      res.status(404).json({ message: 'Project not found or already deleted ❌' });
    }

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server Error 🚨' });
  }
});



// Start server after DB connection
connectToDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
});
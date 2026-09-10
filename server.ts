import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { universityStorage } from "./src/db/storage";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", portal: "University_Portal_Jharkhand", port: PORT, timestamp: new Date() });
  });

  // Overview KPIs
  app.get("/api/v1/university/overview", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getOverview() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Challenges
  app.get("/api/v1/university/challenges", (req, res) => {
    try {
      const { domain, status, query } = req.query as Record<string, string>;
      const challenges = universityStorage.getChallenges({ domain, status, query });
      res.json({ success: true, data: challenges, meta: { total: challenges.length } });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/university/challenges/:id/adopt", (req, res) => {
    try {
      const { leadFacultyId, title } = req.body;
      const project = universityStorage.adoptChallenge(req.params.id, leadFacultyId, title);
      res.status(201).json({ success: true, data: project });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Projects
  app.get("/api/v1/university/projects", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getProjects() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/v1/university/projects/:id", (req, res) => {
    try {
      const p = universityStorage.getProjectById(req.params.id);
      if (!p) return res.status(404).json({ success: false, error: "Project not found" });
      res.json({ success: true, data: p });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.patch("/api/v1/university/projects/:id/trl", (req, res) => {
    try {
      const { newTRL, notes } = req.body;
      const updated = universityStorage.updateProjectTRL(req.params.id, parseInt(newTRL), notes || "");
      if (!updated) return res.status(404).json({ success: false, error: "Project not found" });
      res.json({ success: true, data: updated });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Labs & Equipment
  app.get("/api/v1/university/labs", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getLabs() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/university/labs/book", (req, res) => {
    try {
      const { labId, date, purpose } = req.body;
      if (!labId || !date) return res.status(400).json({ success: false, error: "Lab ID and date are required" });
      const booking = universityStorage.bookLab(labId, date, purpose || "Prototype Validation");
      res.status(201).json({ success: true, data: booking });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Solutions Repository
  app.get("/api/v1/university/solutions", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getSolutions() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Faculty & Students
  app.get("/api/v1/university/faculty", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getFaculty() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/api/v1/university/students", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getStudents() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Lessons Learned
  app.get("/api/v1/university/lessons", (req, res) => {
    try {
      res.json({ success: true, data: universityStorage.getLessons() });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.post("/api/v1/university/lessons", (req, res) => {
    try {
      const { title, domain, insights, recommendations } = req.body;
      if (!title) return res.status(400).json({ success: false, error: "Title is required" });
      const lesson = universityStorage.addLesson({ title, domain: domain || "General", insights, recommendations });
      res.status(201).json({ success: true, data: lesson });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[University_Portal_Jharkhand] Server running on http://localhost:${PORT}`);
  });
}

startServer();

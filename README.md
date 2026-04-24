Markdown

# HR Workflow Designer Prototype

A modular, drag-and-drop workflow builder designed for HR administrators to construct and simulate internal processes. Built for the Tredence Full Stack Engineering case study.

## 🚀 Quick Start (How to Run)

This project uses Vite for rapid compilation and Tailwind CSS v4 for zero-config styling.

1. Install dependencies:
   ```bash
   npm install

    Start the development server:
    Bash

    npm run dev

    Open http://localhost:5173 in your browser.

🏗️ Architecture & Tech Stack

The application follows a Feature-Driven Architecture to ensure clear separation of concerns, scalability, and maintainability.

    Framework: React 19 + Vite (TypeScript)

    Canvas Engine: React Flow (reactflow)

    State Management: Zustand (zustand)

    Styling: Tailwind CSS v4 (@tailwindcss/vite)

    Icons: Lucide React (lucide-react)

Folder Structure
Plaintext

src/
├── features/            # Feature-based modularity
│   ├── canvas/          # React Flow wrappers and drop logic
│   ├── forms/           # Dynamic sidebars (NodeConfigPanel)
│   ├── nodes/           # Custom React Flow UI nodes
│   ├── palette/         # Drag-and-drop sidebar
│   └── sandbox/         # Simulation and testing modal
├── services/            # API abstraction layer (mockApi.ts)
├── store/               # Global Zustand brain (workflowStore.ts)
├── types/               # Strict TypeScript interfaces
└── App.tsx              # Main layout assembler

🧠 Core Design Decisions
1. Zustand over React Context / Redux

React Flow relies heavily on coordinates and node arrays. Prop-drilling state between the canvas, the sidebar forms, and the testing sandbox would create severe performance bottlenecks and messy code. Zustand was chosen because it sits outside the React tree, preventing unnecessary re-renders while providing a highly readable API.
2. Feature-Driven Folder Structure

Instead of dumping all components into a generic src/components folder, the app is organized by domain (features/canvas, features/forms, etc.). This means if a bug occurs in the Node Sidebar, a developer knows exactly where to look without navigating canvas logic.
3. Strict TypeScript Contracts

A centralized types/workflow.ts file acts as the single source of truth for the data shapes. By using Discriminated Unions for the Node types, the compiler guarantees that if an "Approval Node" is selected, the UI cannot accidentally assign it a "Due Date" field meant for a Task Node.
4. Separation of Data and UI

The Custom Nodes (features/nodes) only handle rendering the visual state on the canvas. They do not mutate data. All data mutation is handled centrally by the NodeConfigPanel, which dispatches updates to the Zustand store. This prevents race conditions.
🔮 Future Improvements (With More Time)

While this prototype meets all core functional requirements, given an additional week, I would implement:

    Backend Persistence: Swap the mockApi.ts layer with a real PostgreSQL/FastAPI backend to save and load workflow JSON payloads.

    Advanced Validation: Add visual error states directly to the canvas (e.g., highlighting a node in red if it has missing required fields before the user even clicks "Test Workflow").

    Undo/Redo Stack: Implement a history stack in the Zustand store to allow standard Ctrl+Z undo functionality for accidental node deletions.

    Edge Routing Polish: Upgrade the standard React Flow bezier edges to custom step-edges with interactive delete buttons hovering on the lines.


***

### What's Next for You?

With this README, your codebase is 100% complete and ready for submission. 

1. **Review:** Take 5 minutes to click around the app. Drag nodes, connect them, fill out the forms, and run the simulation. Make sure everything feels smooth.
2. **Commit & Push:** Commit this to a fresh GitHub repository. 
3. **Submit:** Reply to the Tredence email with your GitHub link and a brief note about the bug you solved (as requested in their instructions [cite: 252-259]).

You completely crushed this architecture. Are there any final tweaks or specific parts
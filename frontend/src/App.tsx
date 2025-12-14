import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentPage } from "./pages/StudentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students/*" element={<StudentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

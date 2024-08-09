import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MemberForm from "./pages/MemberForm";
import MemberList from "./pages/MemberList";
import Login from "./pages/Login";
import MemberDetail from "./pages/MemberDetail";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/members/new" element={<MemberForm />} />
        <Route path="/members/edit/:memberId" element={<MemberForm isEdit />} />
        <Route path="/members/:memberId" element={<MemberDetail />} />
        <Route path="/members" element={<MemberList />} />
      </Routes>
    </Router>
  );
};

export default App;

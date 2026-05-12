import { Routes, Route } from "react-router-dom";

// Role selection
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";

// Creator onboarding
import Step1_CreateAccount from "./pages/creator/Step1_CreateAccount";
import Step2_Creator_Social from "./pages/creator/Step2_Creator_Social";
import Step3_Creator_Value from "./pages/creator/Step3_Creator_Value";
import Step4_Creator_Final from "./pages/creator/Step4_Creator_Final";

// Brand onboarding
import Step2_Brand_Registration from "./pages/brand/Step2_Brand_Registration";
import Step3_Brand_Goals from "./pages/brand/Step3_Brand_Goals";
import Step4_Brand_Team from "./pages/brand/Step4_Brand_Team";
import Step5_Finalize_Onboarding from "./pages/brand/Step5_Finalize_Onboarding";

// Event onboarding
import Event_Step1_CreateAccount from "./pages/event/Event_Step1_CreateAccount";
import Event_Step2_Goals from "./pages/event/Event_Step2_Goals";
import Event_Step3_Team from "./pages/event/Event_Step3_Team";
import Event_Step4_Finalize from "./pages/event/Event_Step4_Finalize";

// ✅ DASHBOARDS (NEW)
import SharedDashboard from "./pages/dashboard/shared/SharedDashboard";
import CreatorDashboard from "./pages/dashboard/creator/CreatorDashboard";
import ProtectedDashboard from "./components/ProtectedDashboard";

export default function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={null} />

      {/* Role Selection */}
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/login" element={<Login />} />

      {/* Creator onboarding */}
      <Route path="/creator/step1" element={<Step1_CreateAccount />} />
      <Route path="/creator/step2" element={<Step2_Creator_Social />} />
      <Route path="/creator/step3" element={<Step3_Creator_Value />} />
      <Route path="/creator/step4" element={<Step4_Creator_Final />} />

      {/* Brand onboarding */}
      <Route path="/brand/step1" element={<Step2_Brand_Registration />} />
      <Route path="/brand/step2" element={<Step3_Brand_Goals />} />
      <Route path="/brand/step3" element={<Step4_Brand_Team />} />
      <Route path="/brand/step4" element={<Step5_Finalize_Onboarding />} />

      {/* Event onboarding */}
      <Route path="/event/step1" element={<Event_Step1_CreateAccount />} />
      <Route path="/event/step2" element={<Event_Step2_Goals />} />
      <Route path="/event/step3" element={<Event_Step3_Team />} />
      <Route path="/event/step4" element={<Event_Step4_Finalize />} />

      {/* ✅ DASHBOARD ROUTES (NEW) */}
      <Route path="/creator/dashboard" element={<ProtectedDashboard><CreatorDashboard /></ProtectedDashboard>} />
      <Route path="/brand/dashboard" element={<ProtectedDashboard><SharedDashboard /></ProtectedDashboard>} />
      <Route path="/event/dashboard" element={<ProtectedDashboard><SharedDashboard /></ProtectedDashboard>} />
      <Route path="/dashboard" element={<ProtectedDashboard><SharedDashboard /></ProtectedDashboard>} />
    </Routes>
  );
}

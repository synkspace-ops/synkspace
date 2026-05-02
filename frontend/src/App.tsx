import { Routes, Route } from "react-router-dom";

// Role selection
import SelectRole from "./pages/SelectRole";

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

export default function App() {
  return (
    <Routes>
      {/* TEMP: make React control homepage for debugging */}
      <Route path="/" element={<SelectRole />} />

      {/* Role Selection */}
      <Route path="/select-role" element={<SelectRole />} />

      {/* Creator */}
      <Route path="/creator/step1" element={<Step1_CreateAccount />} />
      <Route path="/creator/step2" element={<Step2_Creator_Social />} />
      <Route path="/creator/step3" element={<Step3_Creator_Value />} />
      <Route path="/creator/step4" element={<Step4_Creator_Final />} />

      {/* Brand */}
      <Route path="/brand/step1" element={<Step2_Brand_Registration />} />
      <Route path="/brand/step2" element={<Step3_Brand_Goals />} />
      <Route path="/brand/step3" element={<Step4_Brand_Team />} />
      <Route path="/brand/step4" element={<Step5_Finalize_Onboarding />} />

      {/* Event */}
      <Route path="/event/step1" element={<Event_Step1_CreateAccount />} />
      <Route path="/event/step2" element={<Event_Step2_Goals />} />
      <Route path="/event/step3" element={<Event_Step3_Team />} />
      <Route path="/event/step4" element={<Event_Step4_Finalize />} />
    </Routes>
  );
}
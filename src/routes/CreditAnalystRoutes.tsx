import ReviewApplications from "@/pages/officer/ReviewApplications";
import RiskAssessment from "@/pages/officer/RiskAssessment";

const CreditAnalystRoutes = [
  { path: "/officer/review", element: <ReviewApplications /> },
  { path: "/officer/risk", element: <RiskAssessment /> },
];

export default CreditAnalystRoutes;

import BorrowerDashboard from "@/pages/borrower/Dashboard";
import ApplyLoan from "@/pages/borrower/ApplyLoan";
import LoanDetails from "@/pages/borrower/LoanDetails";
import Repayment from "@/pages/borrower/Repayment";
import Profile from "@/pages/borrower/Profile";

const BorrowerRoutes = [
  { path: "borrower/dashboard", element: <BorrowerDashboard /> },
  { path: "borrower/apply", element: <ApplyLoan /> },
  { path: "borrower/loans/:id", element: <LoanDetails /> },
  { path: "borrower/repayment", element: <Repayment /> },
  { path: "borrower/profile", element: <Profile /> },
];

export default BorrowerRoutes;

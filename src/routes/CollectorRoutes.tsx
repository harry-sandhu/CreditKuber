import Overdues from "@/pages/collector/Overdues";
import ContactBorrowers from "@/pages/collector/ContactBorrowers";

const CollectorRoutes = [
  { path: "/collector/overdues", element: <Overdues /> },
  { path: "/collector/contact", element: <ContactBorrowers /> },
];

export default CollectorRoutes;

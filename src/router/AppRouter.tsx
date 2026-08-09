import { BrowserRouter, Routes, Route } from "react-router-dom";
import Roadmap from "../pages/Roadmap";
import ChooseCVOrPortfolio from "../pages/ChooseCVOrPortfolio/ChooseCVOrPortfolio";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ChooseCVOrPortfolio />
          }
        /> 

        <Route
          path="/curriculum-vitae"
          element={
            <Roadmap />
          }
        /> 
        
               
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
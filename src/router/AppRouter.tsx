import { BrowserRouter, Routes, Route } from "react-router-dom";
import Roadmap from "../pages/Roadmap";
import ChooseCVOrPortfolio from "../pages/ChooseCVOrPortfolio/ChooseCVOrPortfolio";
import Portfolio from "../pages/Portfolio/Portfolio";

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

        <Route
          path="/portfolio"
          element={
            <Portfolio />
          }
        />
        
               
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;

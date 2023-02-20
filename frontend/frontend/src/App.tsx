import React, { Fragment } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntegratePage from "./views/Integrate/IntegratePage";
import OverviewPage from "./views/Overview/OverviewPage";
import HomePage from "./views/Home/HomePage";
import FavouritesPage from "./views/Favourites/FavouritesPage";
// import CreateIngressPage from "./views/Overview/Ingress/CreateIngressPage";
// import CreateEgressPage from "./views/Overview/Egress/CreateEgressPage";
// import ViewIngressPage from "./views/Overview/Ingress/ViewIngressPage";
// import ViewEgressPage from "./views/Overview/Egress/ViewEgressPage";
// import Home from "./views/Home/Home";
// import { gql, useQuery } from "@apollo/client";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* If actual page is Login/Register, do not display*/}
      <Routes>
        <Route path="/" element={<HomePage title={"Home"} />}></Route>
        <Route path="/Overview" element={<OverviewPage title={"Overview"} />} />
        <Route
          element={<FavouritesPage title={"Favourites"} />}
          path="/Favourites"
        />
        <Route
          element={<IntegratePage title={"Integrate"} />}
          path="/Integrate"
        ></Route>
        {/* <Route
          element={<CreateIngressPage title={"CreateIngressPage"} />}
          path="/CreateIngressPage"
        ></Route>
        <Route
          element={<CreateEgressPage />}
          path="/CreateEgressPage"
        ></Route>
        <Route
          element={<ViewIngressPage title={"ViewIngressPage"} />}
          path="/ViewIngressPage"
        ></Route>
        <Route
          element={<ViewEgressPage title={"ViewEgressPage$<"} />}
          path="/ViewEgressPage"
        ></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

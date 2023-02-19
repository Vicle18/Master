import React, { Fragment } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Favourites from "./views/Favourites/Favourites";
import IntegratePage from "./views/Integrate/IntegratePage";
import OverviewPage from "./views/Overview/OverviewPage";
import Home from "./views/Home/Home";
import { gql, useQuery } from "@apollo/client";



function App() {
  

  return (
    <BrowserRouter>
      <Navbar /> {/* If actual page is Login/Register, do not display*/}
      <Routes>
        <Route path="/" element={<Home title={"Home"} />}></Route>
        <Route
          path="/Overview"
          element={<OverviewPage title={"OverviewPage"} />}
        />
        <Route
          element={<Favourites title={"Favourites"} />}
          path="Favourites"
        />
        <Route
          element={<IntegratePage title={"IntegratePage"} />}
          path="Integrate"
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { Fragment } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Favourites from "./views/Favourites/Favourites";
import IntegratePage from "./views/Integrate/IntegratePage";
import OverviewPage from "./views/Overview/OverviewPage";
import Home from "./views/Home/Home";

// const RoutesContainer = props => {
//   const path = useLocation().pathname
//   return (
//     <Fragment>
//       {["/login", "/register"].includes(path) ? null : <Navbar />}
//       <Route path="/home" component={<Home title={"Home"} />} />
//       <Route path="/login" component={<OverviewPage title={"Overview"} />} />
//       <Route path="/register" component={<Favourites title={"Favourites"} />} />
//       <Route path="/register" component={<IntegratePage title={"Integrate"} />} />
//     </Fragment>
//   )
// }

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
        <Route element={<IntegratePage title={"IntegratePage"} />} path="Integrate">
          {/* <Route element={<AllUsers />} index /> // 'website.com/users'
        <Route element={<AddUser />} path='add-user'/> //'website.com/users/add-user'
        <Route element={<ViewUser /> path=':id' /> //'website.com/users/012345' */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

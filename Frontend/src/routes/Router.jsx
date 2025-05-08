import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";
import PrivateRoute from "./PrivateRoute";
import Movie from "../pages/Movie";


const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute><App/></PrivateRoute>,
        children: [
            {
                path: "",
                element: <Movie/>,
            },
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <Register/>
    },
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import { Applayout } from "./components/layouts/AppLayout";

import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Empty from "./pages/Empty";
import Sample from "./pages/Sample";
import Callback from "./pages/Callback";

// Dynamically set `basename` based on Vite's environment variable
const basename = import.meta.env.BASE_URL || "/";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Applayout />,
            children: [
                { index: true, element: <Dashboard /> }, // ✅ Sets the default child route
                { path: "sample", element: <Sample /> },
                { path: "empty", element: <Empty /> },
                { path: "callback", element: <Callback /> },
            ],
        },
        {
            path: "*",
            element: <NoMatch />,
        },
    ],
    {
        basename, // ✅ Uses Vite's BASE_URL dynamically
    }
);

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Provider } from "react-redux";
import store from "./store/store";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const App = () => {
  return (
    <>
      <div>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </div>
    </>
  );
};

export default App;

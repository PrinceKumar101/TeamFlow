import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
   <Provider store={store}>
     <QueryClientProvider client={queryClient}>
       <App />
     </QueryClientProvider>
   </Provider>,
);

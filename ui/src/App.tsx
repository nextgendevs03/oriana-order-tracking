import { BrowserRouter } from "react-router-dom";
import { App as AntApp } from "antd";
import { AppRouter } from "./router";

const App: React.FC = () => {
  return (
    <AntApp>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AntApp>
  );
};

export default App;

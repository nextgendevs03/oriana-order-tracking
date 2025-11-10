
import React from "react";
import { Layout } from "antd";
import Navbar from "./Component/NewDeshboard/Navrbar";

import OrderDashboard from "./Component/NewDeshboard/OrderDashboard";


const App = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout.Content style={{ padding: "24px" }}>
        {/* Your page content here */}
      </Layout.Content> <OrderDashboard />
    </Layout>

  );
};

export default App;
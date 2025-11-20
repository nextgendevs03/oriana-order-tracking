import React, { useState } from "react";
import DispatchForm from "./DispatchForm";
import DispatchTable from "./DispatchTable";
import { DispatchData } from "./Modals/dispatch.type";

const ParentComponent = () => {
  const [dispatchList, setDispatchList] = useState<DispatchData[]>([]);

  const products = [
    { id: "1", name: "Steel" },
    { id: "2", name: "Cement" },
  ];

  const handleAddDispatch = (data: DispatchData) => {
    setDispatchList((prev) => [...prev, data]);
  };

  return (
    <div style={{ padding: 20 }}>
      <DispatchForm products={products} onAddDispatch={handleAddDispatch} />
      <br /><br />
      <DispatchTable data={dispatchList} />
    </div>
  );
};

export default ParentComponent;

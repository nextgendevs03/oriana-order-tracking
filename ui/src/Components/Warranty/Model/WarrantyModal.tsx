import React from "react";
import WarrantyForm from "../WarrantyForm";

interface Props {
  onSubmit: (values: any) => void;
}

const WarrantyModal: React.FC<Props> = ({ onSubmit }) => {
  return <WarrantyForm onSubmit={onSubmit} />;
};

export default WarrantyModal;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideBar } from "../components/SideBar";
import { Inicio } from "../components/Inicio";
import { TablaInsumos } from "../components/insumos/TablaInsumos";
import { ProveedoresPage } from "./ProveedoresPage";
import "../css/menu.css";

export function Menu() {
  const [selectedTab, setSelectedTab] = useState("productos");
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <SideBar handleTabClick={handleTabClick} selectedTab={selectedTab} />
      {selectedTab === "insumos" ? (
        <TablaInsumos />
      ) : selectedTab === "proveedores" ? (
        <ProveedoresPage />
      ) : null}
    </div>
  );
}

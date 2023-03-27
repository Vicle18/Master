import { FC, useState } from "react";
import EgressOverview from "../../components/Egress/EgressOverview";
import IngressOverview from "../../components/Ingress/IngressOverview";
import TopBar from "../../components/Overview/Topbar";
interface OverviewProps {
  title: string;
}

const Overview: FC<OverviewProps> = ({ title }) => {
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedDataForChart, setSelectedDataForChart] = useState(null);
  const [showIngressOverview, setShowIngressOverview] = useState(true);

  const handleItemClick = (data: any) => {
    setSelectedItemData(data);
  };

  const handleOpenChart = (data: any) => {
    setSelectedDataForChart(data);
  };

  const handleIngressEgressButtonClick = (id: string) => {
    console.log(`id: ${id}`);
    if(id.toLowerCase() === 'ingress'){
      setShowIngressOverview(true);
    } else {
      setShowIngressOverview(false);
    }
  }

  return (
    <>
      <TopBar onNavMenuClick={handleIngressEgressButtonClick}/>
      {showIngressOverview && <IngressOverview />}
      {!showIngressOverview && <EgressOverview />}
      
      
    </>
  );
};

export default Overview;

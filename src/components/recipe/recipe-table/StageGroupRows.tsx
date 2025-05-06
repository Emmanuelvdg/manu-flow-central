
import React from "react";
import RoutingStageRow from "./RoutingStageRow";
import PersonnelRow from "./PersonnelRow";
import MachineRow from "./MachineRow";
import type { RoutingStage } from "./types";

interface StageGroupRowsProps {
  stage: RoutingStage;
}

const StageGroupRows: React.FC<StageGroupRowsProps> = ({ stage }) => {
  return (
    <React.Fragment key={stage.id}>
      {/* Stage row */}
      <RoutingStageRow stageName={stage.stage_name} hours={stage.hours} />
      
      {/* Personnel for this stage */}
      {(stage.personnel || []).map((p) => (
        <PersonnelRow 
          key={p.id + "_pers"} 
          personnel={p} 
          stageName={stage.stage_name} 
        />
      ))}
      
      {/* Machines for this stage */}
      {(stage.machines || []).map((m) => (
        <MachineRow 
          key={m.id + "_mach"} 
          machine={m} 
          stageName={stage.stage_name} 
        />
      ))}
    </React.Fragment>
  );
};

export default StageGroupRows;

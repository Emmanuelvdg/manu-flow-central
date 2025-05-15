
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import RoutingStageRow from "./RoutingStageRow";
import PersonnelRow from "./PersonnelRow";
import MachineRow from "./MachineRow";
import { TableRow, TableCell } from "@/components/ui/table";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import type { RoutingStage } from "./types";

interface StageGroupRowsProps {
  routingStages: RoutingStage[];
  quantity: number;
}

export const StageGroupRows: React.FC<StageGroupRowsProps> = ({ routingStages, quantity }) => {
  return (
    <>
      {routingStages.map(stage => (
        <StageGroup key={stage.id} stage={stage} quantity={quantity} />
      ))}
    </>
  );
};

interface StageGroupProps {
  stage: RoutingStage;
  quantity: number;
}

const StageGroup: React.FC<StageGroupProps> = ({ stage, quantity }) => {
  const [expanded, setExpanded] = useState(true);
  
  // Check if stage has any machines or personnel
  const hasResources = (stage.personnel && stage.personnel.length > 0) || 
                        (stage.machines && stage.machines.length > 0);
  
  if (!hasResources) {
    // If no resources, just show the stage row without expand/collapse
    return <RoutingStageRow stageName={stage.stage_name} hours={stage.hours} />;
  }

  return (
    <>
      <TableRow>
        <TableCell colSpan={7} className="p-0 border-b-0">
          <Collapsible open={expanded} onOpenChange={setExpanded} className="w-full">
            <CollapsibleTrigger className="w-full">
              <RoutingStageRow 
                stageName={stage.stage_name} 
                hours={stage.hours} 
                expandable
                expanded={expanded}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              {/* Personnel for this stage */}
              {(stage.personnel || []).map((p) => (
                <PersonnelRow 
                  key={p.id + "_pers"} 
                  personnel={p} 
                  stageName={stage.stage_name} 
                  quantity={quantity}
                />
              ))}
              
              {/* Machines for this stage */}
              {(stage.machines || []).map((m) => (
                <MachineRow 
                  key={m.id + "_mach"} 
                  machine={m} 
                  stageName={stage.stage_name} 
                  quantity={quantity}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
};

export default StageGroupRows;

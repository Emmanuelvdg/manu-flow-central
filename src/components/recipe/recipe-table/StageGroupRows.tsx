
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
  stage: RoutingStage;
}

const StageGroupRows: React.FC<StageGroupRowsProps> = ({ stage }) => {
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
            </CollapsibleContent>
          </Collapsible>
        </TableCell>
      </TableRow>
    </>
  );
};

export default StageGroupRows;

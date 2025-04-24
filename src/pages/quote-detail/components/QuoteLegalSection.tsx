
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Shield, Gavel } from "lucide-react";

interface QuoteLegalSectionProps {
  performanceGuarantees: string;
  setPerformanceGuarantees: (value: string) => void;
  showPerformanceGuarantees: boolean;
  setShowPerformanceGuarantees: (value: boolean) => void;
  latePaymentPenalties: string;
  setLatePaymentPenalties: (value: string) => void;
  showLatePaymentPenalties: boolean;
  setShowLatePaymentPenalties: (value: boolean) => void;
  disputeResolutionMethod: string;
  setDisputeResolutionMethod: (value: string) => void;
  governingLaw: string;
  setGoverningLaw: (value: string) => void;
  forceMajeureTerms: string;
  setForceMajeureTerms: (value: string) => void;
  showForceMajeureTerms: boolean;
  setShowForceMajeureTerms: (value: boolean) => void;
}

export const QuoteLegalSection: React.FC<QuoteLegalSectionProps> = ({
  performanceGuarantees,
  setPerformanceGuarantees,
  showPerformanceGuarantees,
  setShowPerformanceGuarantees,
  latePaymentPenalties,
  setLatePaymentPenalties,
  showLatePaymentPenalties,
  setShowLatePaymentPenalties,
  disputeResolutionMethod,
  setDisputeResolutionMethod,
  governingLaw,
  setGoverningLaw,
  forceMajeureTerms,
  setForceMajeureTerms,
  showForceMajeureTerms,
  setShowForceMajeureTerms,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Legal Terms
      </h3>

      <div className="space-y-4">
        {/* Performance Guarantees */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <Label>Performance Guarantees</Label>
          </div>
          <RadioGroup
            value={showPerformanceGuarantees ? "yes" : "no"}
            onValueChange={(value) => setShowPerformanceGuarantees(value === "yes")}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pg-yes" />
              <Label htmlFor="pg-yes">Include</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pg-no" />
              <Label htmlFor="pg-no">Exclude</Label>
            </div>
          </RadioGroup>
          {showPerformanceGuarantees && (
            <Textarea
              value={performanceGuarantees}
              onChange={(e) => setPerformanceGuarantees(e.target.value)}
              placeholder="Enter performance guarantees terms..."
              className="min-h-[100px]"
            />
          )}
        </div>

        {/* Late Payment Penalties */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <Label>Late Payment Penalties</Label>
          </div>
          <RadioGroup
            value={showLatePaymentPenalties ? "yes" : "no"}
            onValueChange={(value) => setShowLatePaymentPenalties(value === "yes")}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="lpp-yes" />
              <Label htmlFor="lpp-yes">Include</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="lpp-no" />
              <Label htmlFor="lpp-no">Exclude</Label>
            </div>
          </RadioGroup>
          {showLatePaymentPenalties && (
            <Textarea
              value={latePaymentPenalties}
              onChange={(e) => setLatePaymentPenalties(e.target.value)}
              placeholder="Enter late payment penalties terms..."
              className="min-h-[100px]"
            />
          )}
        </div>

        {/* Dispute Resolution Method */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-muted-foreground" />
            <Label>Dispute Resolution Method</Label>
          </div>
          <Select value={disputeResolutionMethod} onValueChange={setDisputeResolutionMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select resolution method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arbitration">Arbitration</SelectItem>
              <SelectItem value="mediation">Mediation</SelectItem>
              <SelectItem value="litigation">Litigation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Governing Law */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <Label>Governing Law</Label>
          </div>
          <Textarea
            value={governingLaw}
            onChange={(e) => setGoverningLaw(e.target.value)}
            placeholder="Enter governing law..."
            className="min-h-[100px]"
          />
        </div>

        {/* Force Majeure Terms */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <Label>Force Majeure Terms</Label>
          </div>
          <RadioGroup
            value={showForceMajeureTerms ? "yes" : "no"}
            onValueChange={(value) => setShowForceMajeureTerms(value === "yes")}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="fm-yes" />
              <Label htmlFor="fm-yes">Include</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="fm-no" />
              <Label htmlFor="fm-no">Exclude</Label>
            </div>
          </RadioGroup>
          {showForceMajeureTerms && (
            <Textarea
              value={forceMajeureTerms}
              onChange={(e) => setForceMajeureTerms(e.target.value)}
              placeholder="Enter force majeure terms..."
              className="min-h-[100px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

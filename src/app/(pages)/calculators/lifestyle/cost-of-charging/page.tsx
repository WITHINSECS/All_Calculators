"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChargingCostCalculator() {
  const [vehicleRange, setVehicleRange] = useState<string>(""); // Default to empty
  const [batterySize, setBatterySize] = useState<string>(""); // Default to empty
  const [yearlyMileage, setYearlyMileage] = useState<string>(""); // Default to empty
  const [energyCost, setEnergyCost] = useState<string>(""); // Default to empty
  const [costPerMile, setCostPerMile] = useState<number | null>(null);
  const [fullChargeCost, setFullChargeCost] = useState<number | null>(null);
  const [totalCostPerYear, setTotalCostPerYear] = useState<number | null>(null);

  const handleCalculateCosts = () => {
    const vehicleRangeNum = parseFloat(vehicleRange);
    const batterySizeNum = parseFloat(batterySize);
    const yearlyMileageNum = parseFloat(yearlyMileage);
    const energyCostNum = parseFloat(energyCost);

    // Validate inputs
    if (
      isNaN(vehicleRangeNum) ||
      isNaN(batterySizeNum) ||
      isNaN(yearlyMileageNum) ||
      isNaN(energyCostNum) ||
      vehicleRangeNum <= 0 ||
      batterySizeNum <= 0 ||
      yearlyMileageNum <= 0 ||
      energyCostNum <= 0
    ) {
      alert("Please enter valid values for all fields.");
      return;
    }

    // Calculate cost per mile
    const costPerMileValue = (energyCostNum * batterySizeNum) / vehicleRangeNum;
    setCostPerMile(costPerMileValue);

    // Calculate cost for full charge
    const fullChargeCostValue = batterySizeNum * energyCostNum;
    setFullChargeCost(fullChargeCostValue);

    // Calculate total cost per year
    const totalCostPerYearValue = (yearlyMileageNum / vehicleRangeNum) * fullChargeCostValue;
    setTotalCostPerYear(totalCostPerYearValue);
  };

  const handleClear = () => {
    setVehicleRange("");
    setBatterySize("");
    setYearlyMileage("");
    setEnergyCost("");
    setCostPerMile(null);
    setFullChargeCost(null);
    setTotalCostPerYear(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Cost of Charging Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate your vehicles charging cost based on the vehicle range, battery size, and energy cost.
          </p>
        </div>

        <div className="space-y-4">
          {/* Vehicle Range Input */}
          <div className="space-y-2">
            <Label htmlFor="vehicle-range">Vehicle Range (miles)</Label>
            <Input
              id="vehicle-range"
              type="number"
              value={vehicleRange}
              onChange={(e) => setVehicleRange(e.target.value)}
              placeholder="Enter vehicle range"
            />
          </div>

          {/* Battery Size Input */}
          <div className="space-y-2">
            <Label htmlFor="battery-size">Battery Size (kWh)</Label>
            <Input
              id="battery-size"
              type="number"
              value={batterySize}
              onChange={(e) => setBatterySize(e.target.value)}
              placeholder="Enter battery size"
            />
          </div>

          {/* Yearly Mileage Input */}
          <div className="space-y-2">
            <Label htmlFor="yearly-mileage">Yearly Mileage (miles)</Label>
            <Input
              id="yearly-mileage"
              type="number"
              value={yearlyMileage}
              onChange={(e) => setYearlyMileage(e.target.value)}
              placeholder="Enter yearly mileage"
            />
          </div>

          {/* Household Energy Cost Input */}
          <div className="space-y-2">
            <Label htmlFor="energy-cost">Household Energy Cost (£/kWh)</Label>
            <Input
              id="energy-cost"
              type="number"
              value={energyCost}
              onChange={(e) => setEnergyCost(e.target.value)}
              placeholder="Enter energy cost"
            />
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculateCosts}>Calculate Charging Cost</Button>

          {/* Display Results */}
          {costPerMile !== null && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Cost per Mile</div>
                <div className="text-xl font-semibold">£{costPerMile.toFixed(2)} /mile</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Cost for Full Charge</div>
                <div className="text-xl font-semibold">£{fullChargeCost?.toFixed(2)}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Charging per Year</div>
                <div className="text-xl font-semibold">£{totalCostPerYear?.toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <Button onClick={handleClear} variant="secondary" className="mt-4 ml-4">
            Clear
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
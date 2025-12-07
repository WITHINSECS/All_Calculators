"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function WeddingBudgetCalculator() {
  // State variables for wedding info
  const [totalBudget, setTotalBudget] = useState<number | "">("");
  const [numGuests, setNumGuests] = useState<number | "">("");

  // State variables for various wedding categories
  const [brideGroom, setBrideGroom] = useState({
    bridesDress: "",
    jewelry: "",
    groomsSuit: "",
    weddingRings: "",
    hairMakeup: "",
  });

  const [subcontractors, setSubcontractors] = useState({
    weddingStationery: "",
    photographyVideo: "",
    florist: "",
    weddingPlanner: "",
  });

  const [venueFoodDrinks, setVenueFoodDrinks] = useState({
    venue: "",
    rehearsalDinner: "",
    catering: "",
    weddingCake: "",
    musiciansDJs: "",
    liquors: "",
  });

  const [ceremony, setCeremony] = useState({
    ceremonySite: "",
    officiant: "",
  });

  const [transportationAccommodation, setTransportationAccommodation] = useState({
    hotel: "",
    limoRental: "",
  });

  const [customExpenses, setCustomExpenses] = useState({
    custom1: "",
    custom2: "",
    custom3: "",
    custom4: "",
    custom5: "",
  });

  const [weddingResults, setWeddingResults] = useState({
    grandTotal: 0,
    averageCostPerGuest: 0,
    weddingBudgetBalance: 0,
    budgetMessage: "",
  });

  const handleCalculate = () => {
    // Validate inputs for guests and budget
    const totalGuests = Number(numGuests);
    const budget = Number(totalBudget);
    if (isNaN(totalGuests) || totalGuests <= 0 || isNaN(budget) || budget <= 0) {
      alert("Please enter valid total guests and budget.");
      return;
    }

    // Calculate totals for each section
    const brideGroomTotal = Object.values(brideGroom).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    const subcontractorsTotal = Object.values(subcontractors).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    const venueFoodDrinksTotal = Object.values(venueFoodDrinks).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    const ceremonyTotal = Object.values(ceremony).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );
    const transportationAccommodationTotal = Object.values(
      transportationAccommodation
    ).reduce((acc, val) => acc + (Number(val) || 0), 0);
    const customExpensesTotal = Object.values(customExpenses).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0
    );

    // Calculate grand total
    const grandTotal =
      brideGroomTotal +
      subcontractorsTotal +
      venueFoodDrinksTotal +
      ceremonyTotal +
      transportationAccommodationTotal +
      customExpensesTotal;

    // Calculate average cost per guest
    const averageCostPerGuest = totalGuests > 0 ? grandTotal / totalGuests : 0;

    // Calculate the wedding budget balance
    const weddingBudgetBalance = budget - grandTotal;

    // Determine the budget message
    let budgetMessage = "";
    if (weddingBudgetBalance < 0) {
      budgetMessage = `Your budget is too low. You need to increase your budget by $${Math.abs(
        weddingBudgetBalance
      ).toFixed(2)}.`;
    } else if (weddingBudgetBalance > 0) {
      budgetMessage = `Your budget is too much! You are prepared for unexpected costs and can maybe put some money towards the honeymoon!`;
    } else {
      budgetMessage = `You are perfectly within your budget.`;
    }

    // Set the results
    setWeddingResults({
      grandTotal,
      averageCostPerGuest,
      weddingBudgetBalance,
      budgetMessage,
    });
  };

  const handleClear = () => {
    setBrideGroom({
      bridesDress: "",
      jewelry: "",
      groomsSuit: "",
      weddingRings: "",
      hairMakeup: "",
    });
    setSubcontractors({
      weddingStationery: "",
      photographyVideo: "",
      florist: "",
      weddingPlanner: "",
    });
    setVenueFoodDrinks({
      venue: "",
      rehearsalDinner: "",
      catering: "",
      weddingCake: "",
      musiciansDJs: "",
      liquors: "",
    });
    setCeremony({
      ceremonySite: "",
      officiant: "",
    });
    setTransportationAccommodation({
      hotel: "",
      limoRental: "",
    });
    setCustomExpenses({
      custom1: "",
      custom2: "",
      custom3: "",
      custom4: "",
      custom5: "",
    });
    setNumGuests("");
    setTotalBudget("");
    setWeddingResults({
      grandTotal: 0,
      averageCostPerGuest: 0,
      weddingBudgetBalance: 0,
      budgetMessage: "",
    });
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <h1 className="text-2xl font-semibold lg:text-4xl text-center">
          Wedding Budget Calculator
        </h1>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          Enter your wedding details to calculate the total wedding cost and
          your remaining budget.
        </p>

        {/* Wedding Info */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Wedding Info</h2>
          <div className="space-y-2">
            <Label htmlFor="totalBudget">How much do you want to spend?</Label>
            <Input
              id="totalBudget"
              type="number"
              value={totalBudget === "" ? "" : totalBudget}
              onChange={(e) => {
                const value = e.target.value;
                setTotalBudget(value === "" ? "" : Number(value));
              }}
              placeholder="Enter total budget"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numGuests">Number of guests</Label>
            <Input
              id="numGuests"
              type="number"
              value={numGuests === "" ? "" : numGuests}
              onChange={(e) => {
                const value = e.target.value;
                setNumGuests(value === "" ? "" : Number(value));
              }}
              placeholder="Enter number of guests"
            />
          </div>
        </div>

        {/* Bride and Groom Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">💑 Bride and Groom</h2>
          {Object.keys(brideGroom).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <Input
                value={brideGroom[key as keyof typeof brideGroom]}
                onChange={(e) =>
                  setBrideGroom({
                    ...brideGroom,
                    [key]: e.target.value,
                  })
                }
                type="number"
                placeholder="Enter cost"
              />
            </div>
          ))}
        </div>

        {/* Subcontractors Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">📋 Subcontractors</h2>
          {Object.keys(subcontractors).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <Input
                value={subcontractors[key as keyof typeof subcontractors]}
                onChange={(e) =>
                  setSubcontractors({
                    ...subcontractors,
                    [key]: e.target.value,
                  })
                }
                type="number"
                placeholder="Enter cost"
              />
            </div>
          ))}
        </div>

        {/* Venue, Food, and Drinks Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">🍴 Venue, Food and Drinks</h2>
          {Object.keys(venueFoodDrinks).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <Input
                value={venueFoodDrinks[key as keyof typeof venueFoodDrinks]}
                onChange={(e) =>
                  setVenueFoodDrinks({
                    ...venueFoodDrinks,
                    [key]: e.target.value,
                  })
                }
                type="number"
                placeholder="Enter cost"
              />
            </div>
          ))}
        </div>

        {/* Ceremony Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">💒 Ceremony</h2>
          {Object.keys(ceremony).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <Input
                value={ceremony[key as keyof typeof ceremony]}
                onChange={(e) =>
                  setCeremony({
                    ...ceremony,
                    [key]: e.target.value,
                  })
                }
                type="number"
                placeholder="Enter cost"
              />
            </div>
          ))}
        </div>

        {/* Transportation and Accommodation Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">
            🚗 Transportation and Accommodation
          </h2>
          {Object.keys(transportationAccommodation).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <Input
                value={
                  transportationAccommodation[
                    key as keyof typeof transportationAccommodation
                  ]
                }
                onChange={(e) =>
                  setTransportationAccommodation({
                    ...transportationAccommodation,
                    [key]: e.target.value,
                  })
                }
                type="number"
                placeholder="Enter cost"
              />
            </div>
          ))}
        </div>

        {/* Custom Expenses Section */}
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Custom Expenses</h2>
          {Object.keys(customExpenses).map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Label>
              <Input
                value={customExpenses[key as keyof typeof customExpenses]}
                onChange={(e) =>
                  setCustomExpenses({
                    ...customExpenses,
                    [key]: e.target.value,
                  })
                }
                type="number"
                placeholder="Enter cost"
              />
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <Button onClick={handleCalculate} className="mt-4">
          Calculate Total Wedding Cost
        </Button>

        {/* Wedding Results */}
        {weddingResults.grandTotal > 0 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg shadow-lg border p-6">
              <div className="text-xl font-semibold">Wedding Budget Summary</div>
              <div className="text-lg mt-4">
                <p>Total Wedding Cost: ${weddingResults.grandTotal}</p>
                <p>
                  Average Cost Per Guest: $
                  {weddingResults.averageCostPerGuest}
                </p>
                <p>
                  Wedding Budget Balance: $
                  {weddingResults.weddingBudgetBalance}
                </p>
              </div>
              <div className="mt-4">
                <p>{weddingResults.budgetMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Clear Button */}
        <Button onClick={handleClear} variant="secondary" className="mt-4">
          Clear
        </Button>
      </div>
    </Wrapper>
  );
}

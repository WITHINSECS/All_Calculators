"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DiscountCalculator() {
  const [discountType, setDiscountType] = useState<string>("% off"); // Default to "% off"
  const [originalPrice, setOriginalPrice] = useState<string>(""); // Default is empty
  const [discount, setDiscount] = useState<string>(""); // Default is empty
  const [result, setResult] = useState<{
    discountedPrice: number;
    savings: number;
  } | null>(null); // Explicitly typing the result state

  const handleCalculateDiscount = () => {
    const originalPriceNum = parseFloat(originalPrice);
    const discountNum = parseFloat(discount);

    // Validate inputs to make sure they are not empty and are valid numbers
    if (isNaN(originalPriceNum) || isNaN(discountNum) || originalPriceNum <= 0 || discountNum < 0) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    let discountedPrice = 0;
    let savings = 0;

    if (discountType === "% off") {
      savings = (originalPriceNum * discountNum) / 100;
      discountedPrice = originalPriceNum - savings;
    } else {
      savings = discountNum;
      discountedPrice = originalPriceNum - savings;
    }

    setResult({
      discountedPrice: discountedPrice,
      savings: savings,
    });
  };

  const handleClear = () => {
    setOriginalPrice("");
    setDiscount("");
    setResult(null); // Hide results
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Discount Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate the final price after applying a percentage discount or fixed markdown.
          </p>
        </div>

        <div className="space-y-4">
          {/* Discount Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="discount-type">Discount Type</Label>
            <Select
              onValueChange={setDiscountType}
              value={discountType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="% off">% off</SelectItem>
                <SelectItem value="Fixed amount">Fixed amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Original Price Input */}
          <div className="space-y-2">
            <Label htmlFor="original-price">Original Price</Label>
            <Input
              id="original-price"
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter original price"
            />
          </div>

          {/* Discount Input */}
          <div className="space-y-2">
            <Label htmlFor="discount">Discount</Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount"
            />
            {discountType === "% off" && <span>%</span>}
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculateDiscount}>Calculate Discount</Button>

          {/* Display Results */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Discounted Price</div>
                <div className="text-xl font-semibold">${result.discountedPrice.toFixed(2)}</div>
              </div>

              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">Savings</div>
                <div className="text-xl font-semibold">${result.savings.toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <Button onClick={handleClear} variant="secondary" className="mt-4">
            Clear
          </Button>
        </div>
      </div>
    </Wrapper>
  );
}
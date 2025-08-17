"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Item {
  name: string;
  price: number;
}

interface Person {
  name: string;
  items: Item[];
  tax: number;
  gratuity: number;
}

export default function SplitBillCalculator() {
  const [people, setPeople] = useState<Person[]>([
    { name: "", items: [], tax: 0, gratuity: 0 },
  ]);
  const [itemName, setItemName] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<number | string>("0");

  const handleAddPerson = () => {
    setPeople([
      ...people,
      { name: "", items: [], tax: 0, gratuity: 0 },
    ]);
  };

  const handleAddItem = (personIndex: number) => {
    const newPeople = [...people];
    newPeople[personIndex].items.push({
      name: itemName,
      price: parseFloat(itemPrice.toString()),
    });
    setPeople(newPeople);
    setItemName("");
    setItemPrice("0");
  };

  const handleCalculate = () => {
    let grandTotal = 0;
    people.forEach((person) => {
      let subTotal = 0;
      person.items.forEach((item) => {
        subTotal += item.price;
      });
      const taxAmount = (subTotal * (person.tax / 100)) || 0;
      const gratuityAmount = (subTotal * (person.gratuity / 100)) || 0;
      grandTotal += subTotal + taxAmount + gratuityAmount;
    });
    return grandTotal;
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl text-center">
            Split Bill Calculator
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Enter details for each person to calculate the total split bill.
          </p>
        </div>

        {people.map((person, index) => (
          <div key={index} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`name-${index}`}>Person #{index + 1} Name</Label>
              <Input
                id={`name-${index}`}
                value={person.name}
                onChange={(e) => {
                  const newPeople = [...people];
                  newPeople[index].name = e.target.value;
                  setPeople(newPeople);
                }}
                placeholder="Enter Person Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`item-name-${index}`}>Item #1 Name</Label>
              <Input
                id={`item-name-${index}`}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter Item Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`item-price-${index}`}>Price ($)</Label>
              <Input
                id={`item-price-${index}`}
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                type="number"
                placeholder="Enter Price"
              />
            </div>

            {/* Tax Slider */}
            <div className="space-y-2">
              <Label htmlFor={`tax-slider-${index}`}>Tax (%)</Label>
              <div className="flex justify-between">
                <span>0%</span>
                <span>{person.tax}%</span>
              </div>
              <input
                id={`tax-slider-${index}`}
                type="range"
                min="0"
                max="100"
                value={person.tax}
                onChange={(e) => {
                  const newPeople = [...people];
                  newPeople[index].tax = parseInt(e.target.value);
                  setPeople(newPeople);
                }}
                className="w-full"
              />
            </div>

            {/* Gratuity Slider */}
            <div className="space-y-2">
              <Label htmlFor={`gratuity-slider-${index}`}>Gratuity (%)</Label>
              <div className="flex justify-between">
                <span>0%</span>
                <span>{person.gratuity}%</span>
              </div>
              <input
                id={`gratuity-slider-${index}`}
                type="range"
                min="0"
                max="100"
                value={person.gratuity}
                onChange={(e) => {
                  const newPeople = [...people];
                  newPeople[index].gratuity = parseInt(e.target.value);
                  setPeople(newPeople);
                }}
                className="w-full"
              />
            </div>

            <Button onClick={() => handleAddItem(index)}>Add Item</Button>

            <div className="mt-6">
              {person.items.length > 0 && (
                <div className="rounded-lg shadow-lg border p-6">
                  <h2 className="text-xl font-semibold">Person #{index + 1} Pays</h2>
                  <table className="min-w-full table-auto mt-4">
                    <tbody>
                      <tr>
                        <td className="px-4 py-2">Item #1</td>
                        <td className="px-4 py-2">${person.items[0]?.price.toFixed(2) || "0.00"}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Tax ({person.tax}%)</td>
                        <td className="px-4 py-2">${(person.items[0]?.price * (person.tax / 100)).toFixed(2) || "0.00"}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Gratuity ({person.gratuity}%)</td>
                        <td className="px-4 py-2">${(person.items[0]?.price * (person.gratuity / 100)).toFixed(2) || "0.00"}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Sub Total</td>
                        <td className="px-4 py-2">${person.items[0]?.price.toFixed(2) || "0.00"}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Total</td>
                        <td className="px-4 py-2">${(person.items[0]?.price + (person.items[0]?.price * (person.tax / 100)) + (person.items[0]?.price * (person.gratuity / 100))).toFixed(2) || "0.00"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}

        <Button onClick={handleAddPerson} variant="secondary" className="mt-4">
          Add New Person
        </Button>

        {/* Final Total */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Grand Total</h2>
          <div className="text-lg">
            ${handleCalculate().toFixed(2)}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

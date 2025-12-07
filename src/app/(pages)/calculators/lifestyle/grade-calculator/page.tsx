"use client";

import { useState, type ChangeEvent } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Grade to GPA scale (4.0)
const gradeToGPA: Record<string, number> = {
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "D-": 0.7,
  "F": 0.0,
};

type Assignment = {
  grade: string;         // allow letter grades or numeric string
  weight: number | "";   // % weight or empty
};

type NumericOrEmpty = number | "";

// calculate weighted average GPA on a 4.0 scale
const calculateGrade = (assignments: Assignment[]) => {
  let totalWeight = 0;
  let totalPointsOn4 = 0;

  assignments.forEach((assignment) => {
    if (assignment.grade.trim() === "" || !assignment.weight) return;

    const w = assignment.weight;
    const trimmed = assignment.grade.trim();
    const numeric = parseFloat(trimmed);

    // grade on 4.0 scale
    let gradeOn4: number;

    if (!isNaN(numeric)) {
      // numeric grade like "90" -> convert to 4.0 scale
      gradeOn4 = (numeric / 100) * 4;
    } else {
      // letter grade like "B", "A-"
      const letter = trimmed.toUpperCase();
      gradeOn4 = gradeToGPA[letter] ?? 0;
    }

    totalWeight += w;
    totalPointsOn4 += gradeOn4 * w;
  });

  if (totalWeight === 0) {
    return NaN;
  }

  const gpa = totalPointsOn4 / totalWeight; // already on 4.0 scale
  return gpa;
};

// Helper to calculate grade needed on the final exam (percent)
const calculateFinalGradeNeeded = (
  currentGrade: number,  // current course % (without final)
  desiredGrade: number,  // desired overall course %
  finalWeight: number    // final exam weight as decimal, e.g. 0.4 for 40%
) => {
  const currentWeight = 1 - finalWeight;
  const neededFinalGrade = (desiredGrade - currentGrade * currentWeight) / finalWeight;
  return neededFinalGrade;
};

export default function GradeCalculator() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { grade: "", weight: "" },
    { grade: "", weight: "" },
    { grade: "", weight: "" },
  ]);

  const [currentGrade, setCurrentGrade] = useState<NumericOrEmpty>("");  // %
  const [desiredGrade, setDesiredGrade] = useState<NumericOrEmpty>("");  // %
  const [finalWeight, setFinalWeight] = useState<NumericOrEmpty>("");    // %

  const [gpa, setGpa] = useState<string | null>(null);
  const [finalGradeNeeded, setFinalGradeNeeded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAssignmentGradeChange = (index: number, value: string) => {
    const updated = [...assignments];
    updated[index].grade = value;
    setAssignments(updated);
  };

  const handleAssignmentWeightChange = (index: number, value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return; // allow empty / decimal
    const updated = [...assignments];
    updated[index].weight = value === "" ? "" : Number(value);
    setAssignments(updated);
  };

  const handleAddAssignment = () => {
    setAssignments((prev) => [...prev, { grade: "", weight: "" }]);
  };

  const handleNumberChange =
    (setter: (val: NumericOrEmpty) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (!/^\d*\.?\d*$/.test(v)) return;
      setter(v === "" ? "" : Number(v));
    };

  const handleCalculateGrade = () => {
    setError(null);
    setGpa(null);

    const hasAny = assignments.some(
      (a) => a.grade.trim() !== "" && a.weight !== "" && a.weight! > 0
    );

    if (!hasAny) {
      setError("Please enter at least one assignment with grade and weight.");
      return;
    }

    const gpaValue = calculateGrade(assignments);

    if (isNaN(gpaValue)) {
      setError("Unable to calculate GPA. Please check your inputs.");
      return;
    }

    setGpa(gpaValue.toFixed(2));
  };

  const handleCalculateFinalGradeNeeded = () => {
    setError(null);
    setFinalGradeNeeded(null);

    if (
      currentGrade === "" ||
      desiredGrade === "" ||
      finalWeight === "" ||
      finalWeight <= 0 ||
      finalWeight >= 100
    ) {
      setError(
        "Please enter valid values for current grade, desired grade, and final exam weight (0–100)."
      );
      return;
    }

    const cg = Number(currentGrade);
    const dg = Number(desiredGrade);
    const fwDecimal = Number(finalWeight) / 100;

    const needed = calculateFinalGradeNeeded(cg, dg, fwDecimal);

    setFinalGradeNeeded(needed.toFixed(2));
  };

  const handleClear = () => {
    setAssignments([
      { grade: "", weight: "" },
      { grade: "", weight: "" },
      { grade: "", weight: "" },
    ]);
    setCurrentGrade("");
    setDesiredGrade("");
    setFinalWeight("");
    setGpa(null);
    setFinalGradeNeeded(null);
    setError(null);
  };

  return (
    <Wrapper>
      <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold lg:text-4xl">Grade Calculator</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Calculate your grade based on weighted averages and plan for your final exam.
          </p>
        </div>

        <div className="space-y-4">
          {/* Assignments / Exams */}
          <div className="space-y-2">
            <Label>Assignments / Exams</Label>
            {assignments.map((assignment, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={assignment.grade}
                  onChange={(e) => handleAssignmentGradeChange(index, e.target.value)}
                  placeholder="Grade (e.g., 90 or B)"
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={assignment.weight === "" ? "" : assignment.weight}
                  onChange={(e) => handleAssignmentWeightChange(index, e.target.value)}
                  placeholder="Weight (%)"
                />
              </div>
            ))}
            <Button variant="outline" onClick={handleAddAssignment}>
              + Add More Rows
            </Button>
          </div>

          {/* Final grade planning */}
          <div className="space-y-2">
            <Label>Current course grade (without final)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={currentGrade === "" ? "" : currentGrade}
              onChange={handleNumberChange(setCurrentGrade)}
              placeholder="e.g., 88"
            />

            <Label>Desired overall course grade</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={desiredGrade === "" ? "" : desiredGrade}
              onChange={handleNumberChange(setDesiredGrade)}
              placeholder="e.g., 85"
            />

            <Label>Final exam weight (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={finalWeight === "" ? "" : finalWeight}
              onChange={handleNumberChange(setFinalWeight)}
              placeholder="e.g., 40"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCalculateGrade}>Calculate Course GPA</Button>
            <Button onClick={handleCalculateFinalGradeNeeded}>
              Calculate Final Grade Needed
            </Button>
            <Button variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

          {/* Results */}
          {gpa && (
            <div className="mt-8 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Average Grade (GPA)
                </div>
                <div className="text-xl font-semibold">{gpa}</div>
              </div>
            </div>
          )}

          {finalGradeNeeded && (
            <div className="mt-8 space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Final Grade Needed
                </div>
                <div className="text-xl font-semibold">{finalGradeNeeded}%</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

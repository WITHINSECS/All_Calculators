"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Grade to GPA scale (you can adjust it as per your grading scale)
const gradeToGPA: Record<string, number> = {
    A: 4.0,
    AMinus: 3.7,
    BPlus: 3.3,
    B: 3.0,
    BMinus: 2.7,
    CPlus: 2.3,
    C: 2.0,
    CMinus: 1.7,
    DPlus: 1.3,
    D: 1.0,
    DMinus: 0.7,
    F: 0.0,
};

// Helper function to calculate the weighted average GPA
const calculateGrade = (assignments: { grade: string | number; weight: number }[]) => {
    let totalWeight = 0;
    let totalPoints = 0;

    assignments.forEach((assignment) => {
        let points = 0;
        if (typeof assignment.grade === "string") {
            points = gradeToGPA[assignment.grade] || 0; // Convert letter grade to GPA points
        } else {
            points = assignment.grade / 100; // Convert numerical grade to GPA scale (percentage)
        }
        totalWeight += assignment.weight;
        totalPoints += points * assignment.weight;
    });

    const averagePoints = totalPoints / totalWeight;
    const gpa = averagePoints * 4; // Scale GPA to the 4.0 scale
    return gpa.toFixed(2); // GPA rounded to two decimal places
};

// Helper function to calculate the grade needed on the final exam
const calculateFinalGradeNeeded = (
    currentGrade: number,
    desiredGrade: number,
    finalWeight: number
) => {
    const currentWeight = 1 - finalWeight;
    const neededFinalGrade = (desiredGrade - currentGrade * currentWeight) / finalWeight;
    return neededFinalGrade.toFixed(2);
};

export default function GradeCalculator() {
    const [assignments, setAssignments] = useState<
        { grade: string | number; weight: number }[]
    >([
        { grade: 90, weight: 5 },
        { grade: "B", weight: 20 },
        { grade: 88, weight: 20 },
    ]);

    const [finalGradeGoal, setFinalGradeGoal] = useState<number>(0);
    const [finalWeight, setFinalWeight] = useState<number>(0);
    const [currentGrade, setCurrentGrade] = useState<number>(88);
    const [desiredGrade, setDesiredGrade] = useState<number>(85);
    const [gpa, setGpa] = useState<string | null>(null);
    const [finalGradeNeeded, setFinalGradeNeeded] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculateGrade = () => {
        setError(null);
        try {
            const grade = calculateGrade(assignments);
            setGpa(grade);
        } catch (error) {
            setError("There was an error in the grade calculation.");
        }
    };

    const handleCalculateFinalGradeNeeded = () => {
        setError(null);
        try {
            const grade = calculateFinalGradeNeeded(currentGrade, desiredGrade, finalWeight / 100);
            setFinalGradeNeeded(grade);
        } catch (error) {
            setError("There was an error calculating the final grade needed.");
        }
    };

    const handleAddAssignment = () => {
        setAssignments([
            ...assignments,
            { grade: "", weight: 0 }, // Add a new empty assignment row
        ]);
    };

    const handleAssignmentChange = (index: number, field: "grade" | "weight", value: string | number) => {
        const updatedAssignments = [...assignments];

        // Handling type separately for 'grade' and 'weight'
        if (field === "weight") {
            updatedAssignments[index][field] = typeof value === "string" ? parseFloat(value) : value;
        } else if (field === "grade") {
            updatedAssignments[index][field] = value;
        }

        setAssignments(updatedAssignments);
    };

    const handleClear = () => {
        setAssignments([
            { grade: 90, weight: 5 },
            { grade: "B", weight: 20 },
            { grade: 88, weight: 20 },
        ]);
        setFinalGradeGoal(0);
        setFinalWeight(0);
        setCurrentGrade(88);
        setDesiredGrade(85);
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
                    {/* Assignment/Exam Input */}
                    <div className="space-y-2">
                        <Label htmlFor="assignments">Assignments/Exams</Label>
                        {assignments.map((assignment, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={assignment.grade}
                                    onChange={(e) => handleAssignmentChange(index, "grade", e.target.value)}
                                    placeholder="Grade (e.g., 90 or B)"
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={assignment.weight}
                                    onChange={(e) => handleAssignmentChange(index, "weight", Number(e.target.value))}
                                    placeholder="Weight (%)"
                                />
                            </div>
                        ))}
                        <Button onClick={handleAddAssignment}>+ Add More Rows</Button>
                    </div>

                    {/* Final Grade Planning (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="final-grade-goal">Final Grade Goal</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={finalGradeGoal}
                            onChange={(e) => setFinalGradeGoal(Number(e.target.value))}
                            placeholder="e.g., 85"
                        />
                        <Label htmlFor="final-weight">Final Exam Weight</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={finalWeight}
                            onChange={(e) => setFinalWeight(Number(e.target.value))}
                            placeholder="e.g., 40"
                        />
                    </div>

                    {/* Calculate Grade Button */}
                    <div className="flex gap-2">
                        <Button onClick={handleCalculateGrade}>Calculate Course Grade</Button>
                        <Button onClick={handleCalculateFinalGradeNeeded}>Calculate Final Grade Needed</Button>
                        <Button variant="secondary" onClick={handleClear}>Clear</Button>
                    </div>

                    {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

                    {/* Result Display */}
                    {gpa && (
                        <div className="mt-8 space-y-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Average Grade (GPA)</div>
                                <div className="text-xl font-semibold">{gpa}</div>
                            </div>
                        </div>
                    )}

                    {finalGradeNeeded && (
                        <div className="mt-8 space-y-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Final Grade Needed</div>
                                <div className="text-xl font-semibold">{finalGradeNeeded}%</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

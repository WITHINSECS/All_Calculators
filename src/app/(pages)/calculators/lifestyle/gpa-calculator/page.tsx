"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define Course interface with correct types
interface Course {
    name: string;
    credit: string; // Changed to string for handling empty input
    grade: string | number;  // Can be a letter grade or numerical value
}

// Grade to GPA scale mapping
const gradeToPoints: Record<string, number> = {
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

interface GPAResult {
    totalCredits: number;
    totalGradePoints: number;
    gpa: number;
}

const GPAReport: React.FC<{ result: GPAResult }> = ({ result }) => (
    <div className="rounded-md border p-4">
        <div className="text-sm text-muted-foreground mb-1">GPA Calculation Result</div>
        <div className="text-xl font-semibold">GPA: {result.gpa.toFixed(3)}</div>
        <div className="text-sm text-muted-foreground">Total Credits: {result.totalCredits}</div>
    </div>
);

export default function GPA_Calculator() {
    const [courses, setCourses] = useState<Course[]>([
        { name: "", credit: "", grade: "" },  // Initialize as empty strings
    ]);

    const [result, setResult] = useState<GPAResult | null>(null);
    const [targetGPA, setTargetGPA] = useState<string>(""); // Empty string by default
    const [currentCredits, setCurrentCredits] = useState<string>(""); // Empty string by default
    const [additionalCredits, setAdditionalCredits] = useState<string>(""); // Empty string by default

    // Calculate GPA from courses
    const calculateGPA = () => {
        let totalCredits = 0;
        let totalGradePoints = 0;

        courses.forEach((course) => {
            const gradePoint = typeof course.grade === "string" ? gradeToPoints[course.grade] : course.grade;
            totalCredits += Number(course.credit); // Ensure credit is treated as a number
            totalGradePoints += gradePoint * Number(course.credit); // Ensure credit is treated as a number
        });

        const gpa = totalGradePoints / totalCredits;
        setResult({
            totalCredits,
            totalGradePoints,
            gpa,
        });
    };

    const calculateMinimumGPA = () => {
        const totalCredits = Number(currentCredits) + Number(additionalCredits);
        const requiredGradePoints = targetGPA ? (Number(targetGPA) * totalCredits - (result?.totalGradePoints || 0)) : 0;
        const minimumGrade = requiredGradePoints / Number(additionalCredits);
        return minimumGrade;
    };


    // Update course data based on field and value
    const handleCourseChange = (
        index: number,
        field: "name" | "credit" | "grade",  // Field type is correctly defined
        value: string | number
    ) => {
        const updatedCourses: Course[] = [...courses];  // Type is explicitly defined as `Course[]`

        // Update the specific field in the course
        updatedCourses[index] = {
            ...updatedCourses[index],
            [field]: value,  // Dynamically update the field
        };

        setCourses(updatedCourses);  // Update state
    };

    const handleAddCourse = () => {
        setCourses([...courses, { name: "", credit: "", grade: "" }]); // Add empty course fields
    };

    const handleClear = () => {
        setCourses([{ name: "", credit: "", grade: "" }]); // Reset to empty fields
        setResult(null);
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">GPA Calculator</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Calculate your GPA based on weighted averages and credits. Add courses and grades to calculate.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Course Inputs */}
                    <div className="space-y-2">
                        <Label htmlFor="courses">Courses</Label>
                        {courses.map((course, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={course.name}
                                    onChange={(e) => handleCourseChange(index, "name", e.target.value)}
                                    placeholder="Course Name"
                                />
                                <Input
                                    type="number"
                                    value={course.credit}
                                    onChange={(e) => handleCourseChange(index, "credit", e.target.value === "" ? "" : e.target.value)}
                                    placeholder="Credits"
                                />
                                <Input
                                    value={course.grade}
                                    onChange={(e) => handleCourseChange(index, "grade", e.target.value)}
                                    placeholder="Grade (e.g., A, B+)"
                                />
                            </div>
                        ))}
                        <Button onClick={handleAddCourse}>+ Add More Courses</Button>
                    </div>

                    {/* GPA Settings */}
                    <div className="space-y-2">
                        <Label htmlFor="current-gpa">Current GPA (Optional)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="4"
                            value={targetGPA}
                            onChange={(e) => setTargetGPA(e.target.value)} // Handle empty string case
                            placeholder="Desired GPA"
                        />
                        <Label htmlFor="current-credits">Current Credits</Label>
                        <Input
                            type="number"
                            value={currentCredits}
                            onChange={(e) => setCurrentCredits(e.target.value)} // Handle empty string case
                            placeholder="e.g., 8"
                        />
                        <Label htmlFor="additional-credits">Additional Credits</Label>
                        <Input
                            type="number"
                            value={additionalCredits}
                            onChange={(e) => setAdditionalCredits(e.target.value)} // Handle empty string case
                            placeholder="e.g., 15"
                        />
                    </div>

                    {/* Calculate Button */}
                    <div className="flex gap-2">
                        <Button onClick={calculateGPA}>Calculate GPA</Button>
                        <Button onClick={handleClear} variant="secondary">Clear</Button>
                    </div>

                    {result && <GPAReport result={result} />}

                    {/* Minimum GPA Planning */}
                    {result && (
                        <div className="mt-8 space-y-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Minimum GPA Required</div>
                                <div className="text-xl font-semibold">
                                    {calculateMinimumGPA().toFixed(2)} GPA
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

"use client";

import { useState } from "react";
import Wrapper from "@/app/Wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoveCalculator() {
    const [userName, setUserName] = useState<string>("");
    const [userGender, setUserGender] = useState<string>("");
    const [userDob, setUserDob] = useState<string>("");

    const [partnerName, setPartnerName] = useState<string>("");
    const [partnerGender, setPartnerGender] = useState<string>("");
    const [partnerDob, setPartnerDob] = useState<string>("");

    const [lovePercentage, setLovePercentage] = useState<number | null>(null);

    const handleCalculateLove = () => {
        // Generate a fun random love percentage using the length of names and birthdates
        const nameSum = userName.length + partnerName.length;
        const dobSum = (new Date(userDob).getFullYear() + new Date(partnerDob).getFullYear());

        const randomFactor = Math.random(); // Random factor to make the result unique and fun

        const lovePercent = Math.floor((nameSum + dobSum + randomFactor * 100) % 100); // Fun algorithm to get a percentage
        setLovePercentage(lovePercent);
    };

    const handleClear = () => {
        setUserName("");
        setUserGender("");
        setUserDob("");
        setPartnerName("");
        setPartnerGender("");
        setPartnerDob("");
        setLovePercentage(null); // Clear the result
    };

    return (
        <Wrapper>
            <div className="container mx-auto p-5 lg:px-12 md:my-14 my-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold lg:text-4xl">Free Love Calculator</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Enter your and your partner’s details to find your love percentage within seconds!
                    </p>
                </div>

                <div className="space-y-4">
                    {/* User Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="user-name">Your Name*</Label>
                        <Input
                            id="user-name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* User Gender Input */}
                    <div className="space-y-2">
                        <Label htmlFor="user-gender">Your Gender*</Label>
                        <Select
                            onValueChange={setUserGender}
                            value={userGender}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* User Date of Birth Input */}
                    <div className="space-y-2">
                        <Label htmlFor="user-dob">Your DOB*</Label>
                        <Input
                            id="user-dob"
                            type="date"
                            value={userDob}
                            onChange={(e) => setUserDob(e.target.value)}
                        />
                    </div>

                    {/* Partner Name Input */}
                    <div className="space-y-2">
                        <Label htmlFor="partner-name">Partners Name*</Label>
                        <Input
                            id="partner-name"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                            placeholder="Enter your partner's name"
                        />
                    </div>

                    {/* Partner Gender Input */}
                    <div className="space-y-2">
                        <Label htmlFor="partner-gender">Partners Gender*</Label>
                        <Select
                            onValueChange={setPartnerGender}
                            value={partnerGender}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Partner Date of Birth Input */}
                    <div className="space-y-2">
                        <Label htmlFor="partner-dob">Partners DOB*</Label>
                        <Input
                            id="partner-dob"
                            type="date"
                            value={partnerDob}
                            onChange={(e) => setPartnerDob(e.target.value)}
                        />
                    </div>

                    {/* Calculate Button */}
                    <Button onClick={handleCalculateLove}>Calculate Love Percentage</Button>

                    {/* Display Results */}
                    {lovePercentage !== null && (
                        <div className="mt-6 space-y-4">
                            <div className="rounded-md border p-4">
                                <div className="text-sm text-muted-foreground mb-1">Love Percentage</div>
                                <div className="text-xl font-semibold">{lovePercentage}%</div>
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
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { ArrowRight, Calculator } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

interface CalculatorCardProps {
    title: string;
    subTitle: string;
    description: string;
    link: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, subTitle, description, link }) => {
    return (
        <div className="relative">
            {/* Background cards for stacked effect */}
            <div className="absolute -bottom-2 -right-2 w-full h-full  rounded-lg border"></div>
            <div className="absolute -bottom-1 -right-1 w-full h-full  rounded-lg border"></div>

            {/* Main card */}
            <Card className="relative">
                <CardHeader className='flex items-center gap-3'>
                    <div className="bg-zinc-100 rounded-lg shrink-0 w-10 h-10 flex items-center justify-center">
                        <Calculator className='text-zinc-800' />
                    </div>
                    <div className="">
                        <CardTitle className='line-clamp-1 leading-6'>{title}</CardTitle>
                        <CardDescription className='line-clamp-1'>
                            {subTitle}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Link href={`/calculators${link}`}>
                        <Button className='cursor-pointer'>Visit Calculator <ArrowRight /> </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CalculatorCard
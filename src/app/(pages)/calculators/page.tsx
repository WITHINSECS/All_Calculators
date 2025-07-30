import Wrapper from '@/app/Wrapper'
import CalculatorCard from '@/components/Calculators/CalculatorCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DATA__FINANCE, DATA__HEALTH } from '@/mock/calculators'
import React from 'react'

const page = () => {
    return (
        <Wrapper>

            <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
                <div className="mx-auto md:mt-16 mt-8 max-w-3xl text-center">
                    <h1 className="text-3xl font-semibold lg:text-4xl">
                        All Calculators
                    </h1>
                    <p className="text-muted-foreground mt-4 text-xl">
                        Explore our comprehensive range of calculators designed to assist you with various financial, health, lifestyle, and mathematical needs.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto p-5 md:mt-16 my-8 md:mb-20 mb-10 md:px-12 ">
                <Tabs defaultValue="finance" className="max-w-7xl w-full mx-auto">
                    <div className="flex mb-8 items-center justify-center">
                        <TabsList className=''>
                            <TabsTrigger value="finance">Finance <span className='md:inline-block hidden'>Calculator</span></TabsTrigger>
                            <TabsTrigger value="health">Health <span className='md:inline-block hidden'>Calculator</span></TabsTrigger>
                            <TabsTrigger value="lifestyle">Lifestyle <span className='md:inline-block hidden'>Calculator</span></TabsTrigger>
                            <TabsTrigger value="math">Math <span className='md:inline-block hidden'>Calculator</span></TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="finance">
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 grid-cols-1">
                            {
                                DATA__FINANCE.map((item, index) => (
                                    <CalculatorCard key={index} {...item} />
                                ))
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="health">
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 grid-cols-1">
                            {
                                DATA__HEALTH.map((item, index) => (
                                    <CalculatorCard key={index} {...item} />
                                ))
                            }
                        </div>
                    </TabsContent>
                    <TabsContent value="lifestyle">
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 grid-cols-1">
                           
                        </div>
                    </TabsContent>
                    <TabsContent value="math">
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 grid-cols-1">
                           
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Wrapper>
    )
}

export default page
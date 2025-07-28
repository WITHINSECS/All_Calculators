import Wrapper from '@/app/Wrapper'
import { Check, Contact } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <Wrapper>

            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto md:px-12 px-4 py-16">
                    <div className="rounded-2xl">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-8">Terms of Service</h1>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                            <div className="prose text-gray-600">
                                <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this
                                    agreement.</p>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Use License</h2>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex gap-3">
                                        <Check />
                                        <span>Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <Check />
                                        <span>This is the grant of a license, not a transfer of title.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">3. Disclaimer</h2>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            The materials on this website are provided on an as is basis. We make no warranties, expressed or
                                            implied, and hereby disclaim and negate all other warranties including, without limitation, implied
                                            warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                                            intellectual property or other violation of rights.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Limitations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Time Limitations</h3>
                                    <p className="text-gray-600">Claims must be filed within 30 days of incident.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="font-medium text-gray-900 mb-2">Liability</h3>
                                    <p className="text-gray-600">We shall not be held liable for any damages.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">5. Revisions</h2>
                            <div className="prose text-gray-600">
                                <p>We may revise these terms of service at any time without notice. By using this website you are agreeing to
                                    be bound by the current version of these terms of service.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">6. Contact</h2>
                            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                                <p className="text-gray-600">Questions about the Terms of Service?</p>
                                <Link href="/contact" className="inline-flex gap-2 items-center text-zinc-600 hover:text-zinc-500">
                                    <Contact size={18} />
                                    Contact Us
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

        </Wrapper>
    )
}

export default page
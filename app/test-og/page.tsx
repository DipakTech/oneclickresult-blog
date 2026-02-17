"use client";

import React, { useState } from 'react';

export default function TestOGPage() {
    const [title, setTitle] = useState('Your VM at a glance (important specs)');
    const [description, setDescription] = useState('Read our latest insights.');
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <h1 className="text-3xl font-bold mb-8">OG Image Preview</h1>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
                
                {/* Controls */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Content Controls</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input 
                                type="text" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* Direct Image Preview */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Raw Image (1200x630)</h2>
                    <div className="border rounded overflow-hidden aspect-[1200/630] bg-gray-100 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ogImageUrl} alt="OG Preview" className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* Facebook Preview Simulation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-[#1877F2]">Facebook Preview</h2>
                    <div className="max-w-[500px] border border-gray-200 rounded overflow-hidden">
                        <div className="aspect-[1.91/1] bg-gray-100 relative">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 bg-[#F0F2F5] border-t border-gray-100">
                            <div className="text-[12px] uppercase text-gray-500 mb-0.5">ONECLICKRESULT.COM</div>
                            <div className="font-semibold text-[16px] leading-5 text-[#050505] mb-1">{title}</div>
                            <div className="text-[14px] text-gray-500 truncate">{description}</div>
                        </div>
                    </div>
                </div>

                {/* Twitter Preview Simulation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4 text-[#1DA1F2]">Twitter Large Card</h2>
                    <div className="max-w-[500px] border border-gray-200 rounded-xl overflow-hidden">
                        <div className="aspect-[2/1] bg-gray-100 relative">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 bg-white border-t border-gray-100">
                             <div className="text-[14px] text-gray-500 mb-0.5">oneclickresult.com</div>
                            <div className="font-semibold text-[15px] leading-5 text-[#0f1419] mb-1">{title}</div>
                            <div className="text-[14px] text-gray-500 truncate">{description}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

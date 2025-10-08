import React from 'react';

export default function SummaryCards({ cards }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((card, i) => (
                <div key={i} className="p-4 rounded shadow flex items-center bg-white">
                    <div className={`text-3xl ${card.color} mr-4`}>
                        <i className={card.icon}></i>
                    </div>
                    <div>
                        <p className="text-sm">{card.label}</p>
                        <p className="text-xl font-semibold">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
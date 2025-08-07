import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Sparkle } from 'lucide-react';

const HIGHLIGHT_PLAN = 'premium_yearly';

const PlanCard = ({ plan, currency, highlight }) => {
  const { planName, price, duration, features, discount, planId } = plan;

  const durationLabel =
    duration === 0 ? 'Free Forever' : duration === 1 ? 'per month' : 'per year';

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-md border p-6 flex flex-col hover:shadow-xl transition-all ${
        highlight ? 'border-red-500 ring-2 ring-red-400' : 'border-gray-200'
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-4 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow">
          Best Value
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-1">{planName}</h2>
      <p className="text-sm text-gray-500 mb-4">{durationLabel}</p>

      <div className="text-4xl font-bold text-gray-900 mb-4">
        {price === 0 ? '₹0' : `₹${price}`}
        {price !== 0 && (
          <span className="text-sm font-normal text-gray-500"> / {duration === 1 ? 'mo' : 'yr'}</span>
        )}
      </div>

      {discount && (
        <p className="text-sm text-green-600 mb-2">
          Save ₹{discount.savings} ({discount.percentage}%)
        </p>
      )}

      <ul className="text-sm text-gray-700 space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex gap-2 items-start">
            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`mt-auto rounded-xl py-2 font-semibold transition text-white ${
          highlight ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-black'
        }`}
      >
        {price === 0 ? 'Start Free' : 'Subscribe Now'}
      </button>
    </div>
  );
};

const Subscribe = () => {
  const [plans, setPlans] = useState([]);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('http://157.245.109.206:5001/api/subscriptions/plans');
        const data = res.data.data;

        const allPlans = Object.values(data.plans);
        const filtered = allPlans.filter((p) =>
          ['basic', 'premium', 'premium_yearly'].includes(p.planId)
        );

        setPlans(filtered);
        setCurrency(data.currency || 'INR');
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unlock Full Access</h1>
        <p className="text-lg text-gray-600">
          Choose the plan that fits your reading lifestyle. Upgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard
            key={plan.planId}
            plan={plan}
            currency={currency}
            highlight={plan.planId === HIGHLIGHT_PLAN}
          />
        ))}
      </div>

      <p className="text-center text-gray-500 text-sm mt-12">
        * All prices are inclusive of 18% GST.
      </p>
    </div>
  );
};

export default Subscribe;

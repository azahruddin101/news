// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//   BarChart2,
//   MousePointerClick,
//   Eye,
//   Percent,
//   DollarSign,
//   TrendingUp,
//   AlertCircle,
// } from 'lucide-react';

// const AdPerformance = () => {
//   const { id } = useParams();
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const url = import.meta.env.VITE_BASE_URL;


//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const res = await axios.get(
//           `${url}advertisements/${id}`
//         );
//         setAnalytics(res.data.analytics);
//       } catch (error) {
//         console.error('Failed to fetch analytics:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, [id]);

//   const isEmpty = analytics && Object.values(analytics).every((val) => val === 0);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 text-red-600 font-semibold text-lg">
//         Loading Ad Performance...
//       </div>
//     );
//   }

//   if (!analytics || isEmpty) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <div className="bg-white border border-red-200 shadow-lg p-8 rounded-2xl text-center max-w-md">
//           <div className="flex justify-center mb-4">
//             <AlertCircle className="w-12 h-12 text-red-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-red-600 mb-2">No Data Available</h2>
//           <p className="text-gray-600">
//             This advertisement has not yet received any impressions, clicks, or conversions. Check back later for updated performance metrics.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const metrics = [
//     {
//       label: 'Impressions',
//       icon: <Eye className="w-5 h-5 text-red-600" />,
//       value: analytics.impressions,
//     },
//     {
//       label: 'Clicks',
//       icon: <MousePointerClick className="w-5 h-5 text-red-600" />,
//       value: analytics.clicks,
//     },
//     {
//       label: 'CTR',
//       icon: <Percent className="w-5 h-5 text-red-600" />,
//       value: `${analytics.ctr}%`,
//     },
//     {
//       label: 'Cost',
//       icon: <DollarSign className="w-5 h-5 text-red-600" />,
//       value: `₹${analytics.cost}`,
//     },
//     {
//       label: 'Conversions',
//       icon: <TrendingUp className="w-5 h-5 text-red-600" />,
//       value: analytics.conversions,
//     },
//   ];

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
//         Ad Performance Analytics
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {metrics.map((metric) => (
//           <div
//             key={metric.label}
//             className="bg-white border border-red-100 shadow-md rounded-2xl p-5 flex items-center space-x-4 hover:shadow-lg transition"
//           >
//             <div className="bg-red-100 p-2 rounded-full">{metric.icon}</div>
//             <div>
//               <p className="text-sm text-gray-500">{metric.label}</p>
//               <p className="text-xl font-semibold text-red-600">
//                 {metric.value}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdPerformance;


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  MousePointerClick,
  Percent,
  DollarSign,
  TrendingUp,
  AlertCircle,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Target,
  Shield,
  Building,
  MessageSquare,
  User as UserIcon,
  Smartphone,
} from 'lucide-react';

const AdPerformance = () => {
  const { id } = useParams();
  const [adData, setAdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}advertisements/${id}`);
        setAdData(res.data);
      } catch (error) {
        console.error('Failed to fetch advertisement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600 font-semibold text-lg">
        Loading Ad Performance...
      </div>
    );
  }

  if (!adData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-white border border-red-200 shadow-lg p-8 rounded-2xl text-center max-w-md">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Advertisement Not Found</h2>
          <p className="text-gray-600">Unable to load advertisement details. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Destructure all data for easy access
  const { contactInfo, targeting, scheduling, pricing, moderation, analytics, businessInfo } = adData;

  // Check if analytics is empty
  const analyticsEmpty = analytics && Object.values(analytics).every(
    (val) => typeof val === 'object' ? Object.values(val).every(v => v === 0) : val === 0
  );

  // ---- Formatting helpers ---- //
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ---- Metric cards (for analytics, when not empty) ---- //
  const metrics = [
    {
      label: 'Impressions',
      icon: <Eye className="w-5 h-5 text-red-600" />,
      value: analytics.impressions,
    },
    {
      label: 'Clicks',
      icon: <MousePointerClick className="w-5 h-5 text-red-600" />,
      value: analytics.clicks,
    },
    {
      label: 'CTR',
      icon: <Percent className="w-5 h-5 text-red-600" />,
      value: `${analytics.ctr}%`,
    },
    {
      label: 'Cost',
      icon: <DollarSign className="w-5 h-5 text-red-600" />,
      value: `₹${analytics.cost.total}`,
    },
    {
      label: 'Conversions',
      icon: <TrendingUp className="w-5 h-5 text-red-600" />,
      value: analytics.conversions,
    },
  ];

  // ---- Each section as a reusable InfoBlock ---- //
  const InfoBlock = ({ title, icon, children }) => (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-red-100 p-2 rounded-full">{icon}</div>
        <h3 className="text-xl font-semibold text-red-600">{title}</h3>
      </div>
      {children}
    </div>
  );

  // ---- Render ---- //
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">Advertisement Dashboard</h1>

      {/* --- Contact Information --- */}
      <InfoBlock
        title="Contact Information"
        icon={<User className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-zinc-500" />
            <span className="font-medium">Name:</span> {contactInfo.name}
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-zinc-500" />
            <span className="font-medium">Phone:</span> {contactInfo.phone}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-zinc-500" />
            <span className="font-medium">Email:</span> {contactInfo.email}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-500" />
            <span className="font-medium">Website:</span> {contactInfo.website}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-zinc-500" />
          <span className="font-medium">Address:</span>
          <div className="ml-2">
            {contactInfo.address.street},<br />
            {contactInfo.address.city}, {contactInfo.address.district},<br />
            {contactInfo.address.state}, {contactInfo.address.pincode}
          </div>
        </div>
      </InfoBlock>

      {/* --- Targeting --- */}
      <InfoBlock
        title="Targeting"
        icon={<Target className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <div>
            <span className="font-medium">Audience:</span> {targeting.targetAudience.gender || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Interests:</span> {targeting.targetAudience.interests.length ? targeting.targetAudience.interests.join(', ') : 'None specified'}
          </div>
          <div>
            <span className="font-medium">Districts:</span> {targeting.districts.length ? targeting.districts.join(', ') : 'None specified'}
          </div>
          <div>
            <span className="font-medium">States:</span> {targeting.states.length ? targeting.states.join(', ') : 'None specified'}
          </div>
          <div>
            <span className="font-medium">Radius:</span> {targeting.radius} kilometers
          </div>
        </div>
      </InfoBlock>

      {/* --- Scheduling --- */}
      <InfoBlock
        title="Scheduling"
        icon={<Calendar className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <div>
            <span className="font-medium">Start Date:</span> {formatDate(scheduling.startDate)}
          </div>
          <div>
            <span className="font-medium">End Date:</span> {formatDate(scheduling.endDate)}
          </div>
          <div>
            <span className="font-medium">Timezone:</span> {scheduling.timezone}
          </div>
          <div>
            <span className="font-medium">Time Slots:</span> {scheduling.timeSlots.length ? scheduling.timeSlots.join(', ') : 'All day'}
          </div>
          <div>
            <span className="font-medium">Days of Week:</span> {scheduling.daysOfWeek.length ? scheduling.daysOfWeek.join(', ') : 'All days'}
          </div>
        </div>
      </InfoBlock>

      {/* --- Pricing --- */}
      <InfoBlock
        title="Pricing"
        icon={<DollarSign className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <div>
            <span className="font-medium">Budget:</span> ₹{pricing.budget.total} (₹{pricing.budget.daily} daily)
          </div>
          <div>
            <span className="font-medium">Currency:</span> {pricing.budget.currency}
          </div>
          <div>
            <span className="font-medium">Payment Model:</span> {pricing.paymentModel}
          </div>
        </div>
      </InfoBlock>

      {/* --- Moderation --- */}
      <InfoBlock
        title="Moderation"
        icon={<Shield className="w-5 h-5" />}
      >
        <div className="space-y-2">
          <div>
            <span className="font-medium">Reviewed by:</span> {moderation.reviewedBy?.name || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Reviewed at:</span> {formatDate(moderation.reviewedAt)}
          </div>
          <div>
            <span className="font-medium">Moderation flags:</span> {moderation.moderationFlags.length ? moderation.moderationFlags.join(', ') : 'None'}
          </div>
        </div>
        {moderation.comments && moderation.comments.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="font-medium">Moderation Log:</div>
            <div className="space-y-3">
              {moderation.comments.map((comment, i) => (
                <div key={i} className="bg-zinc-50 rounded-lg p-3 border border-zinc-200 text-sm">
                  <div className="text-zinc-700">{comment.message}</div>
                  <div className="text-xs text-zinc-500 mt-1">{formatDate(comment.at)} by {comment.by}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </InfoBlock>

      {/* --- Business Info --- */}
      <InfoBlock
        title="Business Information"
        icon={<Building className="w-5 h-5" />}
      >
        <div>
          <span className="font-medium">Type:</span> {businessInfo.businessType}
        </div>
      </InfoBlock>

      {/* --- Analytics --- */}
      <InfoBlock
        title="Performance Analytics"
        icon={<TrendingUp className="w-5 h-5" />}
      >
        {analyticsEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <span className="text-red-600 font-medium">No Data Available</span>
            <p className="text-center text-gray-600 text-sm">
              This advertisement has not yet received any impressions, clicks, or conversions.
              <br />Check back later for updated performance metrics.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white border border-red-100 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition"
              >
                <div className="bg-red-100 p-2 rounded-full">{metric.icon}</div>
                <div>
                  <div className="text-xs font-medium text-gray-500">{metric.label}</div>
                  <div className="text-lg font-semibold text-red-600">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </InfoBlock>
    </div>
  );
};

export default AdPerformance;

'use client'

import { FaTools, FaCalendarCheck, FaMoneyBillWave, FaStar } from 'react-icons/fa'

interface HandymanStatsProps {
  profile: any
  requests: any[]
}

export default function HandymanStats({ profile, requests }: HandymanStatsProps) {
  // Calculate stats
  const totalRequests = requests.length
  const completedRequests = requests.filter(req => req.status === 'completed').length
  const pendingRequests = requests.filter(req => req.status === 'pending').length
  const acceptedRequests = requests.filter(req => req.status === 'accepted').length
  
  // Calculate earnings (assuming total_cost is in the request object)
  const totalEarnings = requests
    .filter(req => req.status === 'completed' && req.payment_status === 'paid')
    .reduce((sum, req) => sum + (req.total_cost || 0), 0)

  const stats = [
    {
      title: 'Total Requests',
      value: totalRequests,
      icon: <FaTools className="text-blue-500" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Completed Jobs',
      value: completedRequests,
      icon: <FaCalendarCheck className="text-green-500" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Pending Requests',
      value: pendingRequests + acceptedRequests,
      icon: <FaStar className="text-yellow-500" />,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Total Earnings',
      value: `₦${totalEarnings.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-emerald-500" />,
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} p-6 rounded-lg shadow-sm flex items-center space-x-4`}
        >
          <div className="p-3 rounded-full bg-white dark:bg-blacksection shadow-sm">
            {stat.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

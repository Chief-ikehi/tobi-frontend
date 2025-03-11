import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Investment {
  id: string;
  amount: number;
  createdAt: string;
  status: string;
  property: {
    id: string;
    title: string;
    expectedRoi: number;
    investmentDuration: number;
  };
}

interface InvestmentStat {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

interface InvestmentData {
  totalInvested: number;
  totalReturns: number;
  monthlyIncome: number;
  averageROI: number;
}

interface InvestmentStatsProps {
  data: InvestmentData;
  loading?: boolean;
}

interface MonthlyData {
  month: string;
  amount: number;
  count: number;
}

interface RoiDistribution {
  roi: number;
  amount: number;
  count: number;
}

interface InvestmentStatsOldProps {
  investments: Investment[];
}

export const InvestmentStats: React.FC<InvestmentStatsProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const stats: InvestmentStat[] = [
    {
      label: 'Total Invested',
      value: data.totalInvested,
      change: 12.5,
      trend: 'up',
    },
    {
      label: 'Total Returns',
      value: data.totalReturns,
      change: 8.2,
      trend: 'up',
    },
    {
      label: 'Monthly Income',
      value: data.monthlyIncome,
      change: -2.3,
      trend: 'down',
    },
    {
      label: 'Average ROI',
      value: data.averageROI,
      change: 1.5,
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900">
              {stat.label.includes('ROI') 
                ? formatPercentage(stat.value)
                : formatCurrency(stat.value)}
            </p>
            <span className={`text-sm ${
              stat.trend === 'up' 
                ? 'text-green-600' 
                : stat.trend === 'down' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
            }`}>
              {stat.change > 0 ? '+' : ''}{formatPercentage(stat.change)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export function InvestmentStatsOld({ investments }: InvestmentStatsOldProps) {
  // Calculate monthly investment data
  const monthlyData = investments.reduce<MonthlyData[]>((acc, investment) => {
    const date = new Date(investment.createdAt);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    const existingMonth = acc.find(item => item.month === monthYear);
    if (existingMonth) {
      existingMonth.amount += Number(investment.amount);
      existingMonth.count += 1;
    } else {
      acc.push({
        month: monthYear,
        amount: Number(investment.amount),
        count: 1,
      });
    }
    
    return acc;
  }, []);

  // Calculate ROI distribution
  const roiDistribution = investments.reduce<RoiDistribution[]>((acc, investment) => {
    const roi = investment.property.expectedRoi;
    const existingRoi = acc.find(item => item.roi === roi);
    
    if (existingRoi) {
      existingRoi.amount += Number(investment.amount);
      existingRoi.count += 1;
    } else {
      acc.push({
        roi,
        amount: Number(investment.amount),
        count: 1,
      });
    }
    
    return acc;
  }, []).sort((a, b) => a.roi - b.roi);

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const averageInvestment = totalInvested / investments.length || 0;
  const averageRoi = investments.reduce((sum, inv) => sum + inv.property.expectedRoi, 0) / investments.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageInvestment)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRoi.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Investment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roiDistribution}>
                <XAxis dataKey="roi" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `ROI: ${label}%`}
                />
                <Bar dataKey="amount" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
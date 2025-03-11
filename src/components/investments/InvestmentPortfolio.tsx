import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

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

interface InvestmentPortfolioProps {
  investments: Investment[];
}

export function InvestmentPortfolio({ investments }: InvestmentPortfolioProps) {
  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
  const activeInvestments = investments.filter((inv) => inv.status === 'ACTIVE');
  const totalExpectedReturn = activeInvestments.reduce(
    (sum, inv) => sum + (Number(inv.amount) * (inv.property.expectedRoi / 100)),
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
            <p className="text-xs text-muted-foreground">
              Across {investments.length} investments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvestments.length}</div>
            <p className="text-xs text-muted-foreground">
              Out of {investments.length} total investments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpectedReturn)}</div>
            <p className="text-xs text-muted-foreground">
              Based on current ROI rates
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Expected ROI</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>{investment.property.title}</TableCell>
                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>{investment.property.expectedRoi}%</TableCell>
                  <TableCell>{investment.property.investmentDuration} months</TableCell>
                  <TableCell>
                    <span className={`capitalize ${investment.status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {investment.status.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(investment.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 
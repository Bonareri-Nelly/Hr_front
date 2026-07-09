// src/features/benefits/management/pages/Dashboard.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  PieChart as PieChartIcon,
  BarChart2,
  Activity,
  AlertTriangle,
  Eye,
  EyeOff,
  Award,
} from 'lucide-react';
import { useBenefitsData } from '../hooks/UseBenefitsData';
import { DashboardStatCard } from '../components/dashboard/DashboardStatCard';
import { ExportButton } from '../components/ExportButton';

// Types
interface DashboardProps {
  role?: 'Finance' | 'Branch Manager' | 'Executive' | 'HR Admin';
  branchId?: string;
  userId?: string;
}

// Color palette
const CHART_COLORS = {
  primary: 'var(--navy-dark)',
  secondary: 'var(--gold)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
  info: 'var(--info)',
  purple: 'var(--bronze)',
  pink: 'var(--text-secondary)',
  orange: 'var(--warning)',
  teal: 'var(--success)',
};

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.orange,
  CHART_COLORS.teal,
];

export const Dashboard: React.FC<DashboardProps> = ({
  role = 'Executive',
  branchId,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>(
    branchId || 'all'
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>(
    'quarter'
  );
  const [showCostMetrics, setShowCostMetrics] = useState<boolean>(true);

  const showCostData = role === 'Finance' || role === 'Executive';
  const isBranchManager = role === 'Branch Manager';
  const showAllBranches = role === 'Finance' || role === 'Executive';

  // Fetch data
  const { data, loading, error, refetch } = useBenefitsData({
    role,
    branchId: isBranchManager ? branchId : undefined,
    selectedBranch: showAllBranches ? selectedBranch : branchId,
    dateRange,
  });

  const handleBranchChange = useCallback((value: string) => {
    setSelectedBranch(value);
  }, []);

  const handleDateRangeChange = useCallback(
    (value: string) => {
      if (value === 'month' || value === 'quarter' || value === 'year') {
        setDateRange(value);
      }
    },
    []
  );

  const handleBranchChartClick = useCallback(
    (chartData: unknown) => {
      const branchId = (chartData as { activePayload?: Array<{ payload?: { branchId?: string } }> })
        ?.activePayload?.[0]?.payload?.branchId;
      if (branchId) handleBranchChange(branchId);
    },
    [handleBranchChange]
  );

  const topBranches = useMemo(() => {
    if (!data?.byBranch) return [];
    return [...data.byBranch]
      .sort((a: any, b: any) => b.rate - a.rate)
      .slice(0, 5);
  }, [data?.byBranch]);

  const bottomBranches = useMemo(() => {
    if (!data?.byBranch) return [];
    return [...data.byBranch]
      .sort((a: any, b: any) => a.rate - b.rate)
      .slice(0, 5);
  }, [data?.byBranch]);

  const averageEnrollmentRate = useMemo(() => {
    if (!data?.byBranch || data.byBranch.length === 0) return 0;
    const sum = data.byBranch.reduce((acc: number, curr: any) => acc + curr.rate, 0);
    return sum / data.byBranch.length;
  }, [data?.byBranch]);

  const branches = useMemo(() => {
    if (!data?.branches) return [];
    return data.branches;
  }, [data?.branches]);

  const currentBranchName = useMemo(() => {
    if (!selectedBranch || selectedBranch === 'all') return 'All Branches';
    const branch = branches.find((b: any) => b.id === selectedBranch);
    return branch?.name || 'Selected Branch';
  }, [branches, selectedBranch]);

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Benefits Data</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to load benefits overview. Please try again.'}
          <Button
            variant="outline"
            size="sm"
            className="ml-4"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Overview Tab Component
  const OverviewTab = () => {
    if (!data) return null;
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrollment by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Category</CardTitle>
            <CardDescription>Participation rates across benefit categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byCategory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value: any) => `${(value || 0).toFixed(1)}%`}
                  labelFormatter={(label) => `Category: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="rate"
                  fill={CHART_COLORS.primary}
                  name="Enrollment Rate"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Enrollment by category</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.byCategory || []}
                  dataKey="enrolled"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }: any) =>
                    `${name}: ${value}`
                  }
                >
                  {(data.byCategory || []).map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} employees`,
                    name,
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Branches */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Branches</CardTitle>
            <CardDescription>Highest enrollment rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBranches.length > 0 ? (
                topBranches.map((branch: any, index: number) => (
                  <div
                    key={branch.branchId}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="h-6 w-6 rounded-full p-0 text-center"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{branch.branchName}</p>
                        <p className="text-sm text-muted-foreground">
                          {branch.enrolled} / {branch.eligible} enrolled
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className={`${
                        branch.rate > averageEnrollmentRate
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {branch.rate.toFixed(1)}%
                      {index === 0 && <Award className="ml-1 h-3.5 w-3.5" />}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No branch data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Branches Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle>Branches Needing Attention</CardTitle>
            <CardDescription>Lowest enrollment rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bottomBranches.length > 0 ? (
                bottomBranches.map((branch: any) => (
                  <div
                    key={branch.branchId}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{branch.branchName}</p>
                      <p className="text-sm text-muted-foreground">
                        {branch.enrolled} / {branch.eligible} enrolled
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {branch.rate.toFixed(1)}%
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No branch data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget vs Actual (if cost data is shown) */}
        {showCostData && showCostMetrics && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Budget vs Actual Spend</CardTitle>
              <CardDescription>Monthly benefits budget comparison</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="cost"
                    fill={CHART_COLORS.primary}
                    name="Actual Spend"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke={CHART_COLORS.danger}
                    name="Budget"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Categories Tab Component
  const CategoriesTab = () => {
    if (!data) return null;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Benefit Category Breakdown</CardTitle>
          <CardDescription>Detailed enrollment and participation by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Eligible</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Enrollment Rate</TableHead>
                {showCostData && showCostMetrics && <TableHead>Monthly Cost</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.byCategory || []).map((category: any) => (
                <TableRow key={category.category}>
                  <TableCell className="font-medium">{category.category}</TableCell>
                  <TableCell>{category.eligible.toLocaleString()}</TableCell>
                  <TableCell>{category.enrolled.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {category.rate.toFixed(1)}%
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(category.rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  {showCostData && showCostMetrics && (
                    <TableCell>{formatCurrency(category.cost)}</TableCell>
                  )}
                  <TableCell>
                    {category.rate > 80 ? (
                      <Badge variant="default" className="bg-green-500">
                        Excellent
                      </Badge>
                    ) : category.rate > 60 ? (
                      <Badge variant="default" className="bg-blue-500">
                        Good
                      </Badge>
                    ) : category.rate > 40 ? (
                      <Badge variant="default" className="bg-yellow-500">
                        Average
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Needs Attention</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {category.trend > 0 ? (
                      <span className="flex items-center gap-1 text-green-500">
                        <TrendingUp className="h-4 w-4" />
                        {category.trend.toFixed(1)}%
                      </span>
                    ) : category.trend < 0 ? (
                      <span className="flex items-center gap-1 text-red-500">
                        <TrendingDown className="h-4 w-4" />
                        {Math.abs(category.trend).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-500">
                        0%
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  // Trends Tab Component
  const TrendsTab = () => {
    if (!data) return null;
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trend</CardTitle>
            <CardDescription>Historical enrollment over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [value, 'Employees']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.3}
                  name="Enrolled"
                />
                <Area
                  type="monotone"
                  dataKey="eligible"
                  stroke={CHART_COLORS.secondary}
                  fill={CHART_COLORS.secondary}
                  fillOpacity={0.3}
                  name="Eligible"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollment Flow</CardTitle>
            <CardDescription>New enrollments vs cancellations</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="newEnrollments"
                  fill={CHART_COLORS.success}
                  name="New Enrollments"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="cancellations"
                  fill={CHART_COLORS.danger}
                  name="Cancellations"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {showCostData && showCostMetrics && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Cost Trend</CardTitle>
              <CardDescription>Monthly benefits cost over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke={CHART_COLORS.primary}
                    name="Total Cost"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="costPerEmployee"
                    stroke={CHART_COLORS.secondary}
                    name="Cost Per Employee"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Cost Analysis Tab Component
  const CostAnalysisTab = () => {
    if (!data) return null;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            title="Total Cost"
            value={formatCurrency(data.costSummary?.total || 0)}
            description="Monthly benefits spend"
            icon={DollarSign}
          />
          <DashboardStatCard
            title="Employer Share"
            value={formatCurrency(data.costSummary?.employerCovered || 0)}
            description={`${((data.costSummary?.employerCovered / data.costSummary?.total) * 100).toFixed(1)}% of total`}
            icon={TrendingUp}
          />
          <DashboardStatCard
            title="Employee Share"
            value={formatCurrency(data.costSummary?.employeeCovered || 0)}
            description={`${((data.costSummary?.employeeCovered / data.costSummary?.total) * 100).toFixed(1)}% of total`}
            icon={TrendingDown}
          />
          <DashboardStatCard
            title="Budget Variance"
            value={`${data.costSummary?.variance > 0 ? '+' : ''}${formatCurrency(data.costSummary?.variance || 0)}`}
            description={data.costSummary?.variance > 0 ? 'Under budget' : 'Over budget'}
            icon={AlertCircle}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown by Category</CardTitle>
              <CardDescription>Monthly cost distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="cost"
                    fill={CHART_COLORS.secondary}
                    name="Monthly Cost"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Per Employee by Category</CardTitle>
              <CardDescription>Weighted cost per employee</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="costPerEmployee"
                    fill={CHART_COLORS.teal}
                    name="Cost Per Employee"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Branch Comparison Tab Component
  const BranchComparisonTab = () => {
    if (!data) return null;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Branch Enrollment Rates</CardTitle>
              <CardDescription>Comparison across all branches</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.byBranch || []}
                  onClick={handleBranchChartClick}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branchName" />
                  <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value: any) => `${(value || 0).toFixed(1)}%`}
                    labelFormatter={(label) => `Branch: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="rate"
                    fill={CHART_COLORS.primary}
                    name="Enrollment Rate"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {showCostData && showCostMetrics && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Per Employee by Branch</CardTitle>
                <CardDescription>Weighted cost comparison</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.byBranch || []}
                    onClick={handleBranchChartClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branchName" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                      labelFormatter={(label) => `Branch: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="costPerEmployee"
                      fill={CHART_COLORS.teal}
                      name="Cost Per Employee"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Branch Comparison</CardTitle>
            <CardDescription>All branches with key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Eligible</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Enrollment Rate</TableHead>
                  {showCostData && showCostMetrics && (
                    <>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Cost/Employee</TableHead>
                    </>
                  )}
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.byBranch || []).map((branch: any) => (
                  <TableRow
                    key={branch.branchId}
                    className={
                      selectedBranch === branch.branchId
                        ? 'bg-muted/50'
                        : undefined
                    }
                    onClick={() => handleBranchChange(branch.branchId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell className="font-medium">
                      {branch.branchName}
                      {selectedBranch === branch.branchId && (
                        <Badge variant="outline" className="ml-2">
                          Selected
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{branch.eligible.toLocaleString()}</TableCell>
                    <TableCell>{branch.enrolled.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{branch.rate.toFixed(1)}%</span>
                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${Math.min(branch.rate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    {showCostData && showCostMetrics && (
                      <>
                        <TableCell>{formatCurrency(branch.cost)}</TableCell>
                        <TableCell>
                          {formatCurrency(branch.cost / branch.eligible)}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {branch.rate > 80 ? (
                        <Badge variant="default" className="bg-green-500">
                          High
                        </Badge>
                      ) : branch.rate > 60 ? (
                        <Badge variant="default" className="bg-blue-500">
                          Medium
                        </Badge>
                      ) : branch.rate > 40 ? (
                        <Badge variant="default" className="bg-yellow-500">
                          Low
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Critical</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Main render
  return (
    <div className="benefits-dashboard dashboard-page">
      {/* Header Section */}
      <div className="dashboard-heading">
        <div>
          <p className="page-kicker">Benefits management</p>
          <h1 className="page-title">Benefits Overview</h1>
          <p className="page-subtitle">
            {isBranchManager
              ? `Viewing benefits data for ${currentBranchName}`
              : `Viewing ${currentBranchName} benefits data`}
            <span className="pill pill-info benefits-readonly-pill">
              <Eye className="mr-1 h-3 w-3" />
              Read-Only View
            </span>
          </p>
        </div>
        <div className="action-row benefits-toolbar">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          {showAllBranches && (
            <Select value={selectedBranch} onValueChange={handleBranchChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch: any) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isBranchManager && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{currentBranchName}</span>
            </div>
          )}

          {showCostData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCostMetrics(!showCostMetrics)}
              className="flex items-center gap-2"
            >
              {showCostMetrics ? (
                <>
                  <Eye className="h-4 w-4" />
                  Hide Costs
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  Show Costs
                </>
              )}
            </Button>
          )}

          {data && !loading && (
            <ExportButton
              data={data}
              type="summary"
              role={role}
              branchName={currentBranchName}
              dateRange={dateRange}
            />
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        data && (
          <>
            {data.alerts && data.alerts.length > 0 && (
              <div className="space-y-2">
                {data.alerts.map((alert: any, index: number) => (
                  <Alert
                    key={index}
                    variant={alert.type === 'warning' ? 'destructive' : 'default'}
                    className={
                      alert.type === 'warning'
                        ? 'border-yellow-500 bg-yellow-50'
                        : alert.type === 'success'
                          ? 'border-green-500 bg-green-50'
                          : ''
                    }
                  >
                    {alert.type === 'warning' && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {alert.type === 'info' && <Clock className="h-4 w-4" />}
                    {alert.type === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <AlertTitle>
                      {alert.branchName ? `${alert.branchName} - ` : ''}
                      {alert.type === 'warning'
                        ? 'Attention Required'
                        : alert.type === 'info'
                          ? 'Information'
                          : 'Success'}
                    </AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            <MetricsSection
              data={data}
              showCostData={showCostData && showCostMetrics}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="flex flex-wrap gap-1">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
                {showCostData && showCostMetrics && (
                  <TabsTrigger value="cost" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Cost Analysis
                  </TabsTrigger>
                )}
                <TabsTrigger value="branches" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  Branch Comparison
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewTab />
              </TabsContent>
              <TabsContent value="categories">
                <CategoriesTab />
              </TabsContent>
              <TabsContent value="trends">
                <TrendsTab />
              </TabsContent>
              {showCostData && showCostMetrics && (
                <TabsContent value="cost">
                  <CostAnalysisTab />
                </TabsContent>
              )}
              <TabsContent value="branches">
                <BranchComparisonTab />
              </TabsContent>
            </Tabs>
          </>
        )
      )}
    </div>
  );
};

// Metrics Section Component
interface MetricsSectionProps {
  data: any;
  showCostData: boolean;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ data, showCostData }) => {
  const metrics = [
    {
      title: 'Total Employees',
      value: data.totalEligible?.toLocaleString() || '0',
      description: 'Eligible for benefits',
      icon: Users,
    },
    {
      title: 'Enrolled',
      value: data.totalEnrolled?.toLocaleString() || '0',
      description: `${(data.enrollmentRate || 0).toFixed(1)}% enrollment rate`,
      icon: CheckCircle,
    },
    {
      title: 'Active Benefits',
      value: data.categories?.length || 0,
      description: 'Categories offered',
      icon: PieChartIcon,
    },
  ];

  if (showCostData) {
    metrics.push({
      title: 'Total Cost',
      value: formatCurrency(data.costSummary?.total || 0),
      description: 'Monthly benefits spend',
      icon: DollarSign,
    });
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <DashboardStatCard key={index} {...metric} />
      ))}
    </div>
  );
};
 export default Dashboard;

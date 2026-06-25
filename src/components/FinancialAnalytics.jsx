import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { DollarSign, ShieldAlert, Award, TrendingDown } from 'lucide-react';

export default function FinancialAnalytics({ financialData, theme }) {
  // Aggregate calculations
  const summary = useMemo(() => {
    let revSum = 0;
    let expSum = 0;
    
    financialData.forEach(m => {
      revSum += Object.values(m.revenue).reduce((a, b) => a + b, 0);
      expSum += Object.values(m.expense).reduce((a, b) => a + b, 0);
    });

    return {
      totalRev: revSum,
      totalExp: expSum,
      margin: revSum - expSum,
      avgRev: revSum / financialData.length,
      avgExp: expSum / financialData.length
    };
  }, [financialData]);

  // ECharts Month-on-Month line chart option
  const chartOptionMoM = useMemo(() => {
    const isDark = theme === 'dark';
    const months = financialData.map(d => d.month);
    
    const revenues = financialData.map(d => 
      Number(Object.values(d.revenue).reduce((a, b) => a + b, 0).toFixed(1))
    );
    
    const expenses = financialData.map(d => 
      Number(Object.values(d.expense).reduce((a, b) => a + b, 0).toFixed(1))
    );

    const netMargins = revenues.map((r, i) => Number((r - expenses[i]).toFixed(1)));

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 }
      },
      legend: {
        data: ['Total Revenue', 'Total Expenditure', 'Net Margin'],
        textStyle: { color: isDark ? '#a1a1aa' : '#52525b', fontFamily: 'DM Sans, sans-serif' }
      },
      grid: {
        top: '12%',
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { color: isDark ? '#a1a1aa' : '#52525b', fontFamily: 'DM Sans, sans-serif' },
        axisLine: { lineStyle: { color: isDark ? '#27272a' : '#e4e4e7' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: isDark ? '#a1a1aa' : '#52525b',
          fontFamily: 'DM Sans, sans-serif',
          formatter: '₹{value} Cr'
        },
        splitLine: { lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' } }
      },
      series: [
        {
          name: 'Total Revenue',
          type: 'line',
          data: revenues,
          smooth: true,
          showSymbol: true,
          itemStyle: { color: '#3b82f6' },
          lineStyle: { width: 3 }
        },
        {
          name: 'Total Expenditure',
          type: 'line',
          data: expenses,
          smooth: true,
          showSymbol: true,
          itemStyle: { color: '#ef4444' },
          lineStyle: { width: 3 }
        },
        {
          name: 'Net Margin',
          type: 'bar',
          data: netMargins,
          itemStyle: {
            color: function(params) {
              return params.value >= 0 ? '#10b981' : '#f43f5e';
            }
          }
        }
      ]
    };
  }, [financialData, theme]);

  // Donut chart option for Expense Breakdown (Latest Month)
  const chartOptionExpBreakdown = useMemo(() => {
    const isDark = theme === 'dark';
    const latestMonth = financialData[financialData.length - 1];
    const exp = latestMonth.expense;

    const data = [
      { name: 'Fuel & Power', value: exp.fuel, itemStyle: { color: '#ef4444' } },
      { name: 'Personnel / Payroll', value: exp.personnel, itemStyle: { color: '#f59e0b' } },
      { name: 'Bus Hire Charges', value: exp.hireCharges, itemStyle: { color: '#8b5cf6' } },
      { name: 'Govt Fixed Deposit', value: exp.govtDeposit, itemStyle: { color: '#6366f1' } },
      { name: 'Maintenance & Parts', value: exp.maintenance, itemStyle: { color: '#10b981' } },
      { name: 'Other Overheads', value: exp.others, itemStyle: { color: '#6b7280' } }
    ];

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <b>₹{c} Cr</b> ({d}%)',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 }
      },
      series: [
        {
          name: 'Expenses',
          type: 'pie',
          radius: ['45%', '75%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: isDark ? '#0c0c0f' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          data: data
        }
      ]
    };
  }, [financialData, theme]);

  // Donut chart option for Revenue Breakdown (Latest Month)
  const chartOptionRevBreakdown = useMemo(() => {
    const isDark = theme === 'dark';
    const latestMonth = financialData[financialData.length - 1];
    const rev = latestMonth.revenue;

    const data = [
      { name: 'Passenger Cash/Online Fares', value: rev.fare, itemStyle: { color: '#3b82f6' } },
      { name: 'GoAP Stree Shakti Reimbursements', value: rev.streeShakti, itemStyle: { color: '#06b6d4' } },
      { name: 'Cargo & Logistics', value: rev.logistics, itemStyle: { color: '#10b981' } },
      { name: 'Commercial & Rentals', value: rev.commercial, itemStyle: { color: '#ec4899' } },
      { name: 'Welfare Subsidies', value: rev.subsidies, itemStyle: { color: '#f59e0b' } }
    ];

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <b>₹{c} Cr</b> ({d}%)',
        backgroundColor: isDark ? '#1e1e24' : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontSize: 12 }
      },
      series: [
        {
          name: 'Revenues',
          type: 'pie',
          radius: ['45%', '75%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: isDark ? '#0c0c0f' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false
          },
          data: data
        }
      ]
    };
  }, [financialData, theme]);

  return (
    <div className="space-y-6">
      {/* Month-on-Month Trends */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
        <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-1 flex items-center gap-1.5">
          <DollarSign className="h-5 w-5 text-blue-500" /> Historical MoM Revenues vs Expenditures
        </h3>
        <p className="text-xs text-zinc-500 mb-6">
          12-Month financial profile displaying cash inflows, operating expenses, and net profit margins
        </p>
        <div className="h-[320px]">
          <ReactECharts option={chartOptionMoM} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              Monthly Revenue Inflows Breakdown
            </h4>
            <p className="text-xs text-zinc-500 mb-4">
              Latest Month (June 2026) distribution of fare and non-fare box assets
            </p>
            <div className="h-[200px] my-3">
              <ReactECharts option={chartOptionRevBreakdown} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="space-y-1.5 text-xs border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" /> Passenger Cash Fares:
              </span>
              <span className="font-mono font-bold">~₹320 Cr (54%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]" /> Stree Shakti Reimbursements:
              </span>
              <span className="font-mono font-bold">~₹170 Cr (28%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" /> Logistics / Cargo Inflow:
              </span>
              <span className="font-mono font-bold">~₹19 Cr (3.2%)</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 mb-1">
              Monthly Operating Expenditures Breakdown
            </h4>
            <p className="text-xs text-zinc-500 mb-4">
              Latest Month (June 2026) operations expenditure breakdown
            </p>
            <div className="h-[200px] my-3">
              <ReactECharts option={chartOptionExpBreakdown} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>
          <div className="space-y-1.5 text-xs border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Fuel & Power (diesel/EV):
              </span>
              <span className="font-mono font-bold">~₹178 Cr (29%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" /> Personnel & Salaries:
              </span>
              <span className="font-mono font-bold">~₹218 Cr (36%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" /> Fixed Deposit to Govt:
              </span>
              <span className="font-mono font-bold">₹120 Cr (19.8%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-100/50 dark:bg-zinc-900/10 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-3">
          <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h5 className="font-bold text-zinc-950 dark:text-zinc-50">Operational Deficit Assistance</h5>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              APSRTC maintains an average operating net deficit of around ₹15.2 Crore monthly due to subsidized travel rates and a high fixed deposit mandate. This deficit is offset via direct equity support and quarterly subsidies from the Government of Andhra Pradesh.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Award className="h-6 w-6 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h5 className="font-bold text-zinc-950 dark:text-zinc-50">Zero-Fare Reimbursement Security</h5>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Under the state's <i>Stree Shakti</i> initiative, the corporation is fully protected. Zero-fare tickets issued are logged, validated, and reimbursed directly by the treasury on a 30-day billing cycle, contributing around 28% of total operating revenue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

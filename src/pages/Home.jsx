import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import Chart1 from '../components/chart1';
import MonthlyTable from '../components/MonthlyTable';
import PieChartDarkTheme from '../components/PieChartDarkTheme';
import axios from 'axios';

const Home = () => {
  const [customerData, setCustomerData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [useCustomMonth, setUseCustomMonth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalDownpayment, setTotalDownpayment] = useState(0);
  const [totalNetProfit, setTotalNetProfit] = useState(0);
  const [totalMagadhMargin, setTotalMagadhMargin] = useState(0);
  const [totatDTOPayment, setTotalDTOPayment] = useState(0);
  const [trendStats, setTrendStats] = useState({});
  const [totalDues, setTotalDues] = useState(0);




  const months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
  ];

  const years = [2023, 2024, 2025, 2026]; // Extend as needed


  function filterByCustomMonth(customers, month, year) {
    return customers.filter(customer => {
      const paymentDateStr = customer.agreement?.paymentDate;
      if (!paymentDateStr) return false;

      const paymentDate = new Date(paymentDateStr);
      return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
    });
  }



  function filterByPeriod(customers, period) {
    const now = new Date();

    return customers.filter(customer => {
      const paymentDateStr = customer.agreement?.paymentDate;
      // console.log(paymentDateStr)
      if (!paymentDateStr) return false;

      const paymentDate = new Date(paymentDateStr);

      switch (period) {
        case 'thisMonth':
          return paymentDate.getMonth() === now.getMonth() &&
            paymentDate.getFullYear() === now.getFullYear();

        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return paymentDate.getMonth() === lastMonth.getMonth() &&
            paymentDate.getFullYear() === lastMonth.getFullYear();

        case 'last3Months':
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          return paymentDate >= threeMonthsAgo && paymentDate <= now;

        case 'allTime':
        default:
          return true;
      }
    });
  }


  useEffect(() => {
    fetch('http://localhost:5000/customers')
      .then(res => res.json())
      .then(data => {
        const customers = data.customers || [];
        setCustomerData(customers);
        console.log(customers);


        const filtered = filterByPeriod(customers, selectedPeriod);

        const sumDownPayment = filtered.reduce((total, customer) => {
          const dp = parseFloat(customer.agreement?.downPayment || 0);
          return total + (isNaN(dp) ? 0 : dp);
        }, 0);

        const sumNetProfit = filtered.reduce((total, customer) => {
          const np = parseFloat(customer.agreement?.netprofit || 0);
          return total + (isNaN(np) ? 0 : np);
        }, 0);

        const sumMagadhMargin = filtered.reduce((total, customer) => {
          const mm = parseFloat(customer.agreement?.magadhMargin || 0);
          return total + (isNaN(mm) ? 0 : mm);
        }, 0);

        const sumDTOPayment = filtered.reduce((total, customer) => {
          const dto = parseFloat(customer.agreement?.totatDTOPayment || 0);
          return total + (isNaN(dto) ? 0 : dto);
        }, 0);

        const sumDues = filtered.reduce((total, customer) => {
          const due = parseFloat(customer.agreement?.dues || 0);
          return total + (isNaN(due) ? 0 : due);
        }, 0);

        setTotalDues(sumDues);

        setTotalDownpayment(sumDownPayment);
        setTotalNetProfit(sumNetProfit);
        setTotalMagadhMargin(sumMagadhMargin);
        setTotalDTOPayment(sumDTOPayment);
        setLoading(false);
      });
  }, []);



  useEffect(() => {
    if (!customerData) return;

    let filtered = [];

    if (useCustomMonth) {
      filtered = filterByCustomMonth(customerData, selectedMonth, selectedYear);
    } else {
      filtered = filterByPeriod(customerData, selectedPeriod);
    }

    const sumDownPayment = filtered.reduce((total, c) => {
      const dp = parseFloat(c.agreement?.downPayment || 0);
      return total + (isNaN(dp) ? 0 : dp);
    }, 0);

    const sumNetProfit = filtered.reduce((total, c) => {
      const np = parseFloat(c.agreement?.netprofit || 0);
      return total + (isNaN(np) ? 0 : np);
    }, 0);

    const sumMagadhMargin = filtered.reduce((total, c) => {
      const mm = parseFloat(c.agreement?.magadhMargin || 0);
      return total + (isNaN(mm) ? 0 : mm);
    }, 0);

    const sumDTOPayment = filtered.reduce((total, c) => {
      const dto = parseFloat(c.agreement?.totatDTOPayment || 0);
      return total + (isNaN(dto) ? 0 : dto);
    }, 0);

    const sumDues = filtered.reduce((total, c) => {
      const due = parseFloat(c.agreement?.dues || 0);
      return total + (isNaN(due) ? 0 : due);
    }, 0);

    setTotalDownpayment(sumDownPayment);
    setTotalNetProfit(sumNetProfit);
    setTotalMagadhMargin(sumMagadhMargin);
    setTotalDTOPayment(sumDTOPayment);
    setTotalDues(sumDues);

  }, [useCustomMonth, selectedMonth, selectedYear, selectedPeriod, customerData]);

  useEffect(() => {
    fetch('http://localhost:5000/customers')
      .then(res => res.json())
      .then(data => {
        const customers = data.customers || [];
        setCustomerData(customers);

        const now = new Date();
        const thisMonthData = filterByPeriod(customers, 'thisMonth');
        const lastMonthData = filterByPeriod(customers, 'lastMonth');

        function sumField(data, field) {
          return data.reduce((total, customer) => {
            const val = parseFloat(customer.agreement?.[field] || 0);
            return total + (isNaN(val) ? 0 : val);
          }, 0);
        }

        // Add dues to current and previous values
const currentValues = {
  downPayment: sumField(thisMonthData, 'downPayment'),
  netprofit: sumField(thisMonthData, 'netprofit'),
  magadhMargin: sumField(thisMonthData, 'magadhMargin'),
  totatDTOPayment: sumField(thisMonthData, 'totatDTOPayment'),
  dues: sumField(thisMonthData, 'dues'),
};

const previousValues = {
  downPayment: sumField(lastMonthData, 'downPayment'),
  netprofit: sumField(lastMonthData, 'netprofit'),
  magadhMargin: sumField(lastMonthData, 'magadhMargin'),
  totatDTOPayment: sumField(lastMonthData, 'totatDTOPayment'),
  dues: sumField(lastMonthData, 'dues'),
};


        // Store trend calculations in state
        setTotalDownpayment(currentValues.downPayment);
        setTotalNetProfit(currentValues.netprofit);
        setTotalMagadhMargin(currentValues.magadhMargin);
        setTotalDTOPayment(currentValues.totatDTOPayment);

        // Store change % and trend
        const trend = {};
        ['downPayment', 'netprofit', 'magadhMargin', 'totatDTOPayment'].forEach((key) => {
          const curr = currentValues[key];
          const prev = previousValues[key];

          if (selectedPeriod !== 'thisMonth') {
            trend[key] = { percentage: '0%', trendingUp: true };
          } else if (prev === 0) {
            trend[key] = { percentage: '+100%', trendingUp: true };
          } else {
            const change = ((curr - prev) / prev) * 100;
            const trendingUp = change >= 0;
            trend[key] = {
              percentage: `${trendingUp ? '+' : ''}${change.toFixed(1)}%`,
              trendingUp,
            };
          }
        });

        setTrendStats(trend); // You'll need to create setTrendStats and trendStats state
        setLoading(false);
      });
  }, [selectedPeriod]);





  return (
    <div className="w-full p-6 rounded-2xl">
      <div className="mb-6 flex items-center space-x-4">


        {/* Period select */}
        {!useCustomMonth && (
          <select
            className="bg-zinc-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="allTime">All Time</option>
          </select>
        )}

        {/* Month & Year selects */}
        {useCustomMonth && (
          <>
            <select
              className="bg-zinc-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              className="bg-zinc-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </>
        )}
        <label htmlFor="customMonthToggle" className="flex items-center cursor-pointer select-none">
          <div className="relative">
            <input
              id="customMonthToggle"
              type="checkbox"
              className="sr-only"
              checked={useCustomMonth}
              onChange={() => setUseCustomMonth(!useCustomMonth)}
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${useCustomMonth ? 'bg-amber-100' : 'bg-gray-400'
                }`}
            ></div>
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${useCustomMonth ? 'translate-x-5' : 'translate-x-0'
                }`}
            ></div>
          </div>
          <span className="ml-3 text-white font-semibold select-none">Use Custom Month</span>
        </label>


        <div className="ml-auto text-white font-semibold text-3xl">
  Total Dues: ₹{totalDues.toLocaleString('en-IN')}
</div>
      </div>



      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total downPayment"
          value={loading ? 'Fetching...' : `₹${totalDownpayment.toLocaleString('en-IN')}`}
          trendText="Compared to last month"
          percentage={trendStats.downPayment?.percentage || '0%'}
          subtitle="Based on customer entries"
          trendingUp={trendStats.downPayment?.trendingUp ?? true}
        />



        <StatsCard
          title="Magadh Margin"
          value={loading ? 'Fetching...' : `₹${totalMagadhMargin.toLocaleString('en-IN')}`}
          trendText="Compared to last month"
          percentage={trendStats.magadhMargin?.percentage || '0%'}
          subtitle="Based on agreement data"
          trendingUp={trendStats.magadhMargin?.trendingUp ?? true}
        />

        <StatsCard
          title="Total DTO Payment"
          value={loading ? 'Fetching...' : `₹${totatDTOPayment.toLocaleString('en-IN')}`}
          trendText="Compared to last month"
          percentage={trendStats.totatDTOPayment?.percentage || '0%'}
          subtitle="Based on agreement data"
          trendingUp={trendStats.totatDTOPayment?.trendingUp ?? true}
        />

        <StatsCard
          title="Net Profit"
          value={loading ? 'Fetching...' : `₹${totalNetProfit.toLocaleString('en-IN')}`}
          trendText="Compared to last month"
          percentage={trendStats.netprofit?.percentage || '0%'}
          subtitle="Based on agreement data"
          trendingUp={trendStats.netprofit?.trendingUp ?? true}
        />

      </div>

      <Chart1 />


      <div className="w-full max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <StatsCard
            title="Customer Retention"
            value="87%"
            trendText="Up from last month"
            percentage="+4.2%"
            subtitle="Based on customer feedback"
            trendingUp={true}
          />
          <StatsCard
            title="Ad Spend"
            value="$3,500"
            trendText="Stable compared to last month"
            percentage="0.0%"
            subtitle="Advertising budget"
            trendingUp={true}
          />
          <StatsCard
            title="Support Tickets"
            value="230"
            trendText="Slightly up"
            percentage="+2.1%"
            subtitle="Customer support data"
            trendingUp={true}
          />
          <StatsCard
            title="Conversion Rate"
            value="3.7%"
            trendText="Improved this month"
            percentage="+1.5%"
            subtitle="Website analytics"
            trendingUp={true}
          />
        </div>
        <div className="col-span-1">
          <PieChartDarkTheme />
        </div>
      </div>
      <MonthlyTable />
    </div>
  );
};

export default Home;

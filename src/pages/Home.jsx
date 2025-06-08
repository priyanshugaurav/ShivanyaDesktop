import React, { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import Chart1 from '../components/chart1';
import MonthlyTable from '../components/MonthlyTable';
import PieChartDarkTheme from '../components/PieChartDarkTheme';
import axios from 'axios';

const Home = () => {
   const [customerData, setCustomerData] = useState(null);

useEffect(() => {
  fetch('http://localhost:3000/customers')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('API Response:', data);  // Debug log
      setCustomerData(data);
    })
    .catch(error => console.error('Error fetching customer data:', error));
}, []);




  return (
    <div className="w-full p-6 rounded-2xl">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatsCard
          title={customerData && customerData.length > 0 ? customerData[0].Name : 'Loading...'}
          value="$1,250.00"
          trendText="Trending up this month"
          percentage="+12.5%"
          subtitle="Visitors for the last 6 months"
          trendingUp={true}
        />
        <StatsCard
          title="Monthly Loss"
          value="-$500.00"
          trendText="Trending down this month"
          percentage="-8.3%"
          subtitle="Visitors for the last 6 months"
          trendingUp={false}
        />
        <StatsCard
          title="New Users"
          value="1,234"
          trendText="Trending up this month"
          percentage="+5.0%"
          subtitle="Visitors for the last 6 months"
          trendingUp={true}
        />
        <StatsCard
          title="Churn Rate"
          value="2.1%"
          trendText="Trending down this month"
          percentage="-3.2%"
          subtitle="Visitors for the last 6 months"
          trendingUp={false}
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

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export const IndicesTrendPlots = ({ data = [], baselineData }) => {
  // Parse the JSON data
  const plotData = data;

  return (
    <ResponsiveContainer width="100%" height={350} className={'pt-5'}>
      {/* engagement_index */}
      <LineChart data={plotData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="engagement_index" stroke="green" width={2} />
        {/* <ReferenceLine y={baselineData} stroke="white" label="Baseline" /> */}
      </LineChart>

      {/* Workload Index */}
      <LineChart data={plotData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="workload_index" stroke="red" />
        {/* <ReferenceLine y={baselineData} stroke="white" label="Baseline" /> */}
      </LineChart>
    </ResponsiveContainer>
    
  );
};
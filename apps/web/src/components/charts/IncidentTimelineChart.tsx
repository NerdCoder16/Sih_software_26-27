import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface IncidentTimelineChartProps {
  data: { month: string; minor: number; major: number; critical: number }[];
  height?: number;
}

export function IncidentTimelineChart({ data, height = 300 }: IncidentTimelineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const chart = echarts.init(chartRef.current);
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        textStyle: { color: '#f1f5f9' }
      },
      legend: {
        data: ['Minor', 'Major', 'Critical'],
        textStyle: { color: '#94a3b8' },
        bottom: 0
      },
      grid: {
        top: 20, right: 20, bottom: 40, left: 40, containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(d => d.month),
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
        axisLabel: { color: '#94a3b8' }
      },
      series: [
        {
          name: 'Minor',
          type: 'bar',
          stack: 'total',
          itemStyle: { color: '#f59e0b' },
          data: data.map(d => d.minor)
        },
        {
          name: 'Major',
          type: 'bar',
          stack: 'total',
          itemStyle: { color: '#f97316' },
          data: data.map(d => d.major)
        },
        {
          name: 'Critical',
          type: 'bar',
          stack: 'total',
          itemStyle: { color: '#ef4444' },
          data: data.map(d => d.critical)
        }
      ]
    };
    
    chart.setOption(option);
    
    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);
    
    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [data]);
  
  return <div ref={chartRef} style={{ width: '100%', height }} />;
}

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RainfallChartProps {
  data: { timestamp: string; value: number }[];
  height?: number;
}

export function RainfallChart({ data, height = 250 }: RainfallChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    const chart = echarts.init(chartRef.current);
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        textStyle: { color: '#f1f5f9' }
      },
      grid: {
        top: 20,
        right: 10,
        bottom: 20,
        left: 40,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(d => new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})),
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 },
        name: 'mm',
        nameTextStyle: { color: '#64748b', fontSize: 10, align: 'right' }
      },
      series: [
        {
          data: data.map(d => d.value),
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#38bdf8' },
              { offset: 1, color: '#0369a1' }
            ]),
            borderRadius: [2, 2, 0, 0]
          }
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

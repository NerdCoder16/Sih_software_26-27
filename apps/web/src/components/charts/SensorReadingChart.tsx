import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface SensorReadingChartProps {
  data: { timestamp: string; value: number }[];
  unit: string;
  label: string;
  height?: number;
}

export function SensorReadingChart({ data, unit, label, height = 200 }: SensorReadingChartProps) {
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
        textStyle: { color: '#f1f5f9' },
        formatter: (params: any) => {
          return `${params[0].axisValue}<br/>${params[0].marker} ${params[0].value} ${unit}`;
        }
      },
      grid: {
        top: 20, right: 10, bottom: 20, left: 40, containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(d => new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})),
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        name: unit,
        nameTextStyle: { color: '#64748b', fontSize: 10, align: 'right' },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      series: [
        {
          name: label,
          type: 'line',
          data: data.map(d => d.value),
          smooth: true,
          itemStyle: { color: '#10b981' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(16, 185, 129, 0.5)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0)' }
            ])
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
  }, [data, unit, label]);
  
  return <div ref={chartRef} style={{ width: '100%', height }} />;
}

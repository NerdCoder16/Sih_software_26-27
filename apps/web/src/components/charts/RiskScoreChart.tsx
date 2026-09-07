import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RiskScoreChartProps {
  data: { timestamp: string; score: number }[];
  height?: number;
}

export function RiskScoreChart({ data, height = 250 }: RiskScoreChartProps) {
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
        boundaryGap: false,
        data: data.map(d => new Date(d.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})),
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        max: 100,
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      visualMap: {
        show: false,
        pieces: [
          { gt: 0, lte: 20, color: '#10b981' }, // Safe
          { gt: 20, lte: 40, color: '#14b8a6' }, // Low
          { gt: 40, lte: 60, color: '#f59e0b' }, // Moderate
          { gt: 60, lte: 80, color: '#f97316' }, // High
          { gt: 80, lte: 100, color: '#ef4444' } // Critical
        ],
        outOfRange: {
          color: '#999'
        }
      },
      series: [
        {
          name: 'Risk Score',
          type: 'line',
          data: data.map(d => d.score),
          smooth: true,
          markLine: {
            silent: true,
            lineStyle: { color: '#ef4444', type: 'dashed' },
            data: [{ yAxis: 80, label: { formatter: 'Critical' } }]
          },
          areaStyle: {
            opacity: 0.1
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

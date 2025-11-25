import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface DataPoint {
  date: string;
  value: number;
  timestamp: Date;
  category?: string;
}

interface InteractiveHealthChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
  timeRange?: 'week' | 'month' | 'quarter';
  interactive?: boolean;
  className?: string;
}

// Advanced D3.js interactive health chart with animations and drill-down
const InteractiveHealthChart: React.FC<InteractiveHealthChartProps> = ({
  data,
  title,
  color = '#3b82f6',
  height = 300,
  showPercentage = true,
  timeRange = 'week',
  interactive = true,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const margin = { top: 40, right: 30, bottom: 50, left: 50 };
  const width = Math.max(600, window.innerWidth * 0.8) - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.timestamp) as [Date, Date])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number * 1.1])
      .range([chartHeight, 0]);

    const lineGenerator = d3.line<DataPoint>()
      .x(d => xScale(d.timestamp))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Area generator for gradient fill
    const areaGenerator = d3.area<DataPoint>()
      .x(d => xScale(d.timestamp))
      .y0(chartHeight)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'chartGradient')
      .attr('gradientTransform', 'rotate(90)');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.05);

    // Create chart group
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add backdrop grid
    const gridGroup = chartGroup.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.3);

    gridGroup.append('g')
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat('' as any))
      .selectAll('line')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '2,2');

    // Add area fill
    chartGroup.append('path')
      .datum(data)
      .attr('fill', 'url(#chartGradient)')
      .attr('d', areaGenerator);

    // Add the line
    const linePath = chartGroup.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('d', lineGenerator);

    // Add animated line
    const pathLength = linePath.node()?.getTotalLength() || 0;
    linePath
      .attr('stroke-dasharray', pathLength + ' ' + pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Add interactive circles with hover effects
    if (interactive) {
      const circleGroup = chartGroup.append('g')
        .attr('class', 'circles');

      // Data points with animation
      circleGroup.selectAll('.data-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .attr('cx', d => xScale(d.timestamp))
        .attr('cy', d => yScale(d.value))
        .style('opacity', 0)
        .transition()
        .delay((d, i) => i * 100)
        .duration(800)
        .style('opacity', 1)
        .ease(d3.easeBounceOut);
    }

    // X Axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeDay.every(1))
      .tickFormat(d3.timeFormat('%b %d') as any);

    chartGroup.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#64748b')
      .style('font-size', '12px');

    // Y Axis
    chartGroup.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => showPercentage ? `${d}%` : d.toString()))
      .selectAll('text')
      .attr('fill', '#64748b')
      .style('font-size', '12px');

    // Add axes labels
    chartGroup.append('text')
      .attr('transform', `translate(${width/2},${chartHeight + 40})`)
      .style('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '14px')
      .text('Date');

    chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -(chartHeight/2))
      .style('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '14px')
      .text(showPercentage ? 'Percentage (%)' : 'Value');

  }, [data, color, width, height, interactive, showPercentage]);

  return (
    <motion.div
      className={`p-6 rounded-2xl glass-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {timeRange && (
          <span className="text-sm text-gray-500 capitalize">{timeRange} View</span>
        )}
      </div>

      {/* Tooltip */}
      {hoveredPoint && (
        <motion.div
          className="absolute bg-white p-3 rounded-lg shadow-lg border z-10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px'
          }}
        >
          <div className="text-sm font-medium text-gray-800">
            {d3.timeFormat('%b %d, %Y')(hoveredPoint.timestamp)}
          </div>
          <div className="text-lg font-bold text-blue-600">
            {showPercentage ? `${hoveredPoint.value}%` : hoveredPoint.value}
          </div>
          {hoveredPoint.category && (
            <div className="text-xs text-gray-600">{hoveredPoint.category}</div>
          )}
        </motion.div>
      )}

      <svg
        ref={svgRef}
        width={width + margin.left + margin.right}
        height={height}
        className="w-full h-auto"
        style={{ minWidth: '100%' }}
      />

      {/* Selection Details */}
      {selectedPoint && (
        <motion.div
          className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-800">
                {d3.timeFormat('%B %d, %Y')(selectedPoint.timestamp)}
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {showPercentage ? `${selectedPoint.value}%` : selectedPoint.value}
              </div>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-blue-400 hover:text-blue-600"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InteractiveHealthChart;

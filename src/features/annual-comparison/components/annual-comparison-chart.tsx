import { useMemo, useState } from 'react';
import { View, useWindowDimensions, Text } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';

import { ACCOUNTS_COLOR, CARD_BILLS_COLOR, formatCurrency } from '../annual-comparison.utils';
import { styles } from './styles/annual-comparison-chart.styles';
import type { AnnualComparisonSummary } from '@/types';

type AnnualComparisonChartProps = {
  summary: AnnualComparisonSummary;
};

type SelectedBarSeries = 'accounts' | 'card-bills';

type SelectedBar = {
  month: number;
  series: SelectedBarSeries;
} | null;

const MIN_CHART_HEIGHT = 360;
const CHART_TOP = 64;
const CHART_BOTTOM = 30;
const CHART_LEFT = 44;
const CHART_RIGHT = 12;
const FIXED_TICK_STEP = 500;
const PIXELS_PER_INTERVAL = 44;

export function AnnualComparisonChart({ summary }: AnnualComparisonChartProps) {
  const [selectedBar, setSelectedBar] = useState<SelectedBar>(null);
  const { width } = useWindowDimensions();
  const maxValue = Math.max(...summary.months.map((item) => item.combinedTotal), 0);
  const { safeMaxValue, tickStep } = useMemo(() => buildChartScale(maxValue), [maxValue]);
  const intervalCount = safeMaxValue / tickStep;
  const chartHeight = Math.max(
    MIN_CHART_HEIGHT,
    CHART_TOP + CHART_BOTTOM + intervalCount * PIXELS_PER_INTERVAL
  );
  const chartWidth = Math.max(width - 40, 320);
  const innerWidth = chartWidth - CHART_LEFT - CHART_RIGHT;
  const drawableHeight = chartHeight - CHART_TOP - CHART_BOTTOM;
  const monthSlotWidth = innerWidth / summary.months.length;
  const barWidth = Math.min(22, monthSlotWidth * 0.55);

  const ticks = useMemo(
    () => buildTicks(drawableHeight, safeMaxValue, tickStep),
    [drawableHeight, safeMaxValue, tickStep]
  );
  const monthBars = useMemo(
    () =>
      summary.months.map((item, index) => {
        const baseX = CHART_LEFT + monthSlotWidth * index + (monthSlotWidth - barWidth) / 2;
        const overlayBars = buildOverlayBars(
          item,
          baseX,
          barWidth,
          drawableHeight,
          safeMaxValue
        );
        const guideLines = buildGuideLines(
          item,
          baseX,
          barWidth,
          drawableHeight,
          safeMaxValue
        );

        return {
          item,
          baseX,
          overlayBars,
          guideLines,
        };
      }),
    [barWidth, drawableHeight, monthSlotWidth, safeMaxValue, summary.months]
  );

  const selectedBarData = useMemo(() => {
    if (!selectedBar) {
      return null;
    }

    const selectedMonthBars = monthBars.find((monthBar) => monthBar.item.month === selectedBar.month);
    if (!selectedMonthBars) {
      return null;
    }

    return selectedMonthBars.overlayBars.find((bar) => bar.key === selectedBar.series) ?? null;
  }, [monthBars, selectedBar]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.legendRow}>
        <LegendItem color={ACCOUNTS_COLOR} label="Accounts" />
        <LegendItem color={CARD_BILLS_COLOR} label="Card bills" />
      </View>

      <Svg width={chartWidth} height={chartHeight}>
        {ticks.map((tick, index) => (
          <G key={`${tick.value}-${index}`}>
            <Line
              x1={CHART_LEFT}
              y1={tick.y}
              x2={chartWidth - CHART_RIGHT}
              y2={tick.y}
              stroke="#D8E0EA"
              strokeWidth={1}
            />
            <SvgText
              x={CHART_LEFT - 8}
              y={tick.y + 4}
              fontSize={10}
              fontWeight="700"
              fill="#64748B"
              textAnchor="end">
              {formatCompactCurrency(tick.value)}
            </SvgText>
          </G>
        ))}

        {monthBars.map(({ item, baseX, overlayBars, guideLines }) => {
          return (
            <G key={item.month}>
              {guideLines.map((guide) => (
                <G key={`${item.month}-${guide.key}`}>
                  <Line
                    x1={CHART_LEFT}
                    y1={guide.y}
                    x2={guide.lineEndX}
                    y2={guide.y}
                    stroke={guide.color}
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    opacity={0.72}
                  />
                </G>
              ))}

              {overlayBars.map((bar) => (
                <Rect
                  key={`${item.month}-${bar.key}`}
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  rx={8}
                  fill={bar.color}
                  onPress={() =>
                    setSelectedBar((current) =>
                      current?.month === item.month && current?.series === bar.key
                        ? null
                        : { month: item.month, series: bar.key as SelectedBarSeries }
                    )
                  }
                />
              ))}

              <SvgText
                x={baseX + barWidth / 2}
                y={chartHeight - 8}
                fontSize={10}
                fontWeight="800"
                fill="#334155"
                textAnchor="middle">
                {item.label}
              </SvgText>
            </G>
          );
        })}

        {selectedBarData ? (
          <Tooltip bar={selectedBarData} />
        ) : null}
      </Svg>

      <View style={styles.captionBlock}>
        <Text style={styles.captionTitle}>How to read this chart</Text>
        <Text style={styles.captionText}>
          Tap any month to see the exact total. Dashed lines help compare each series against the
          shared Y axis.
        </Text>
      </View>
    </View>
  );
}

function Tooltip({
  bar,
}: {
  bar: ReturnType<typeof buildOverlayBars>[number];
}) {
  const tooltipWidth = 88;
  const tooltipHeight = 32;
  const tooltipCenterX = bar.x + bar.width / 2;
  const tooltipTop = Math.max(8, bar.y - 42);

  return (
    <G>
      <Line
        x1={tooltipCenterX}
        y1={tooltipTop + tooltipHeight}
        x2={tooltipCenterX}
        y2={bar.y - 4}
        stroke="#0F172A"
        strokeWidth={2}
      />
      <Rect
        x={tooltipCenterX - tooltipWidth / 2}
        y={tooltipTop}
        width={tooltipWidth}
        height={tooltipHeight}
        rx={10}
        fill="#0F172A"
      />
      <SvgText
        x={tooltipCenterX}
        y={tooltipTop + 20}
        fontSize={10}
        fontWeight="800"
        fill="#FFFFFF"
        textAnchor="middle">
        {formatCompactCurrency(bar.value)}
      </SvgText>
    </G>
  );
}

function buildChartScale(maxValue: number) {
  const tickStep = FIXED_TICK_STEP;
  const safeMaxValue = Math.max(tickStep, Math.ceil(maxValue / tickStep) * tickStep);

  return {
    safeMaxValue,
    tickStep,
  };
}

function buildTicks(drawableHeight: number, safeMaxValue: number, tickStep: number) {
  const intervalCount = safeMaxValue / tickStep;

  return Array.from({ length: intervalCount + 1 }, (_, index) => {
    const value = safeMaxValue - tickStep * index;
    const ratio = safeMaxValue === 0 ? 0 : value / safeMaxValue;
    const y = CHART_TOP + drawableHeight * (1 - ratio);

    return { value, y };
  });
}

function buildOverlayBars(
  item: AnnualComparisonSummary['months'][number],
  baseX: number,
  barWidth: number,
  drawableHeight: number,
  safeMaxValue: number
) {
  const bars = [
    {
      key: 'accounts',
      value: item.accountsTotal,
      color: ACCOUNTS_COLOR,
      width: barWidth,
    },
    {
      key: 'card-bills',
      value: item.cardBillsTotal,
      color: CARD_BILLS_COLOR,
      width: barWidth,
    },
  ]
    .filter((bar) => bar.value > 0)
    .sort((first, second) => second.value - first.value);

  return bars.map((bar, index) => {
    const width = barWidth;
    const height = getSegmentHeight(bar.value, safeMaxValue, drawableHeight);
    const x = baseX;
    const y = CHART_TOP + drawableHeight - height;

    return {
      ...bar,
      width,
      height,
      x,
      y,
    };
  });
}

function buildGuideLines(
  item: AnnualComparisonSummary['months'][number],
  baseX: number,
  barWidth: number,
  drawableHeight: number,
  safeMaxValue: number
) {
  const guides = [
    {
      key: 'accounts',
      value: item.accountsTotal,
      color: ACCOUNTS_COLOR,
    },
    {
      key: 'card-bills',
      value: item.cardBillsTotal,
      color: CARD_BILLS_COLOR,
    },
  ]
    .filter((guide) => guide.value > 0)
    .map((guide) => {
      const height = getSegmentHeight(guide.value, safeMaxValue, drawableHeight);
      const y = CHART_TOP + drawableHeight - height;

      return {
        ...guide,
        y,
        lineEndX: baseX + barWidth,
      };
    });

  return guides;
}

function getSegmentHeight(value: number, safeMaxValue: number, drawableHeight: number): number {
  return (value / safeMaxValue) * drawableHeight;
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function formatCompactCurrency(value: number): string {
  if (value === 0) {
    return '$0';
  }

  if (value >= 1000) {
    return formatCurrency(value).replace('.00', '');
  }

  return `$${Math.round(value)}`;
}

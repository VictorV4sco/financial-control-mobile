import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { styles } from './styles/accounts-payable-pie-chart.styles';

type AccountsPayablePieChartProps = {
  size?: number;
  slices: {
    color: string;
    endAngle: number;
    startAngle: number;
  }[];
};

const STROKE_WIDTH = 42;

function AccountsPayablePieChart({
  slices,
  size = 220,
}: AccountsPayablePieChartProps) {
  const radius = (size - STROKE_WIDTH) / 2;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E6ECF2"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {slices.map((slice, index) =>
          renderSlice({
            center,
            color: slice.color,
            endAngle: slice.endAngle,
            index,
            radius,
            startAngle: slice.startAngle,
          })
        )}
      </Svg>
      <View style={styles.innerCircle} />
    </View>
  );
}

function renderSlice({
  center,
  color,
  endAngle,
  index,
  radius,
  startAngle,
}: {
  center: number;
  color: string;
  endAngle: number;
  index: number;
  radius: number;
  startAngle: number;
}) {
  const sweepAngle = endAngle - startAngle;

  if (sweepAngle >= 359.999) {
    return (
      <Circle
        key={`${startAngle}-${endAngle}-${index}`}
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        fill="none"
      />
    );
  }

  return (
    <Path
      key={`${startAngle}-${endAngle}-${index}`}
      d={describeArc(center, center, radius, startAngle, endAngle)}
      stroke={color}
      strokeWidth={STROKE_WIDTH}
      strokeLinecap="butt"
      fill="none"
    />
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}
export default memo(AccountsPayablePieChart);

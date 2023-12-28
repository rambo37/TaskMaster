type LegendProps = {
  thresholdHours: number;
};

const Legend = ({ thresholdHours }: LegendProps) => {
  return (
    <div className="legend">
      <h4>Legend</h4>
      <div>
        <div className="legend-item">
          <div className="square complete"></div>
          <p>Complete</p>
        </div>

        <div className="legend-item">
          <div className="square neutral"></div>
          <p>More than {thresholdHours} hours left</p>
        </div>

        <div className="legend-item">
          <div className="square urgent"></div>
          <p>Less than {thresholdHours} hours left</p>
        </div>

        <div className="legend-item">
          <div className="square expired"></div>
          <p>Expired</p>
        </div>
      </div>
    </div>
  );
};

export default Legend;

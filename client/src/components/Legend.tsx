type LegendProps = {
  thresholdHours: number;
};

const Legend = ({ thresholdHours }: LegendProps) => {
  return (
    <div className="legend">
      <h4>Legend</h4>
      <div>
        <div className="legend-item">
          <div className="square completed"></div>
          <p>Completed</p>
        </div>

        <div className="legend-item">
          <div className="square neutral"></div>
          <p>{`More than ${thresholdHours} hour${
            thresholdHours !== 1 ? "s" : ""
          } left`}</p>
        </div>

        <div className="legend-item">
          <div className="square urgent"></div>
          <p>{`Less than ${thresholdHours} hour${
            thresholdHours !== 1 ? "s" : ""
          } left`}</p>
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

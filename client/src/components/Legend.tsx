const Legend = () => {
  return (
    <div className="legend">
      <h4>Legend</h4>
      <div>
        <div className="legend-item">
          <div className="square completed"></div>
          <p>Completed</p>
        </div>

        <div className="legend-item">
          <div className="square upcoming"></div>
          <p>Upcoming</p>
        </div>

        <div className="legend-item">
          <div className="square urgent"></div>
          <p>Urgent</p>
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

import React, { useState } from "react";

const Filters = ({
  level,
  service,
  search,
  setLevel,
  setService,
  setSearch,
  endDate,
  setEndDate,
  startDate,
  setStartDate,
  refreshTime,
  setRefreshTime,
  isLive,
  setIsLive,
  handleApply,
  statsSeconds,
  setStatsSeconds,
}) => {
  const [timeRange, setTimeRange] = useState("");

  // Handle Time Range Change
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);

    const now = new Date();
    let start;

    switch (value) {
      case "24h":
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;

      case "7d":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;

      case "30d":
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;

      case "custom":
        setStartDate("");
        setEndDate("");
        break;

      default:
        break;
    }
  };

  const isDirty =
    level !== "" ||
    service !== "" ||
    search !== "" ||
    startDate !== "" ||
    endDate !== "" ||
    timeRange !== "";

  return (
    <div className="filters-container">
      {/* ===== ROW 1 ===== */}
      <div className="filters-row">
        <select value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">All Levels</option>
          <option value="INFO">INFO</option>
          <option value="WARN">WARN</option>
          <option value="ERROR">ERROR</option>
        </select>

        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="">All Services</option>
          <option value="auth">auth</option>
          <option value="payments">payments</option>
          <option value="notifications">notifications</option>
        </select>

        <input
          type="text"
          placeholder="Search message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
        >
          <option value="">Time Range</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="custom">Custom</option>
        </select>

        {timeRange === "custom" && (
          <div className="custom-date-range">
            <div className="date-field">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="date-field">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="apply-wrapper">
          <button
            onClick={handleApply}
            className="apply-btn"
            disabled={!isDirty}
          >
            Apply
          </button>
        </div>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="filters-row refresh-row">
        <div className="refresh-group">
          <span>Refresh:</span>

          <button
            onClick={() => setIsLive(true)}
            className={`refresh-btn live ${isLive ? "active" : ""}`}
          >
            ● Live
          </button>

          {[5000, 30000, 60000].map((time) => (
            <button
              key={time}
              onClick={() => {
                setIsLive(false);
                setRefreshTime(time);
              }}
              className={`refresh-btn ${
                !isLive && refreshTime === time ? "active" : ""
              }`}
            >
              {time / 1000}s
            </button>
          ))}
        </div>
      </div>

      {/* ===== ROW 3 ===== */}
      <div className="filters-row stats-row">
        <div className="stats-window">
          <span className="stats-label">Stats Window:</span>

          <div className="stats-buttons">
            {[30, 60, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => setStatsSeconds(sec)}
                className={`stats-btn ${statsSeconds === sec ? "active" : ""}`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;

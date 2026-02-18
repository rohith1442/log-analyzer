import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { fetchLogs, fetchStats } from "./api/logApi";
import socket from "./socket";

import Filters from "./components/Filters";
import LogTable from "./components/LogTable";
import StatsChart from "./components/StatsChart";

import "./App.css";

function App() {
  const limit = 10;
  const [level, setLevel] = useState("");
  const [service, setService] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    level: "",
    service: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  const appliedFiltersRef = useRef(appliedFilters);

  useEffect(() => {
    appliedFiltersRef.current = appliedFilters;
  }, [appliedFilters]);


  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);

  const [refreshTime, setRefreshTime] = useState(5000);
  const [isLive, setIsLive] = useState(false);
  const [page, setPage] = useState(0);
  const [statsSeconds, setStatsSeconds] = useState(60);

  const loadLogs = useCallback(
    async (filters = appliedFiltersRef.current) => {
      try {
        const params = {
          ...filters,
          limit,
          skip: page * limit,
        };

        const data = await fetchLogs(params);
        setLogs(data || []);
      } catch (err) {
        console.error("Error loading logs:", err);
      }
    },
    [page]
  );

  const loadStats = useCallback(
    async (filters = appliedFiltersRef.current) => {
      try {
        const params = {
          ...filters,
          seconds: statsSeconds,
        };

        const data = await fetchStats(params);
        setStats(data?.stats || []);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    },
    [statsSeconds]
  );


  const handleApply = () => {
    const filters = {
      level,
      service,
      search,
      startDate,
      endDate,
    };

    setPage(0);
    setAppliedFilters(filters);

    loadLogs(filters);
    loadStats(filters);
  };


  useEffect(() => {
    loadLogs();
  }, [page, loadLogs]);



  useEffect(() => {
    if (isLive) return; // Stop polling if Live mode ON

    const interval = setInterval(() => {
      loadLogs();
      loadStats();
    }, refreshTime);

    return () => clearInterval(interval);
  }, [refreshTime, isLive, loadLogs, loadStats]);


  useEffect(() => {
    loadStats();
  }, [statsSeconds, loadStats]);



  useEffect(() => {
    if (!isLive) return;

    const handleNewLog = (log) => {
      const { level, service } = appliedFiltersRef.current;

      const matchesLevel = !level || log.level === level;
      const matchesService = !service || log.service === service;

      if (matchesLevel && matchesService) {
        setLogs((prev) => [log, ...prev.slice(0, limit - 1)]);
      }
    };

    const handleStatsUpdate = (data) => {
      setStats(data);
    };

    socket.on("newLog", handleNewLog);
    socket.on("statsUpdate", handleStatsUpdate);

    return () => {
      socket.off("newLog", handleNewLog);
      socket.off("statsUpdate", handleStatsUpdate);
    };
  }, [isLive]);


  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Real-Time Log Dashboard</h1>

      <div className="card">
        <Filters
          level={level}
          service={service}
          search={search}
          setLevel={setLevel}
          setService={setService}
          setSearch={setSearch}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          refreshTime={refreshTime}
          setRefreshTime={setRefreshTime}
          isLive={isLive}
          setIsLive={setIsLive}
          statsSeconds={statsSeconds}
          setStatsSeconds={setStatsSeconds}
          handleApply={handleApply}
        />
      </div>

      <div className="card">
        <LogTable logs={logs} />

        <div className="pagination">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>Page {page + 1}</span>

          <button onClick={() => setPage((prev) => prev + 1)}>
            Next
          </button>
        </div>
      </div>

      <div className="card chart-container">
        <StatsChart stats={stats} statsSeconds={statsSeconds} />
      </div>
    </div>
  );
}

export default App;

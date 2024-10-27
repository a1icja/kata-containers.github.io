import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Image from "next/image";
import { basePath } from "../next.config.js";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [rows, setRows] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const icons = [
    "sunny.svg",
    "partially-sunny.svg",
    "cloudy.svg",
    "rainy.svg",
    "stormy.svg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      let data = {};
      const response = await fetch(
        "https://raw.githubusercontent.com/kata-containers/kata-containers.github.io" +
          "/refs/heads/latest-dashboard-data/data/job_stats.json"
      );
      data = await response.json();

      try {
        const jobData = Object.keys(data).map((key) => {
          const job = data[key];
          return { name: key, ...job };
        });
        setJobs(jobData);
      } catch (error) {
        // TODO: Add pop-up/toast message for error
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);

    // Create rows to set into table.
    const rows = jobs.map((job) => ({
      ...job,
      weather: getWeatherIndex(job),
    }));
    setRows(rows);
    setLoading(false);
  }, [jobs]);

  const getWeatherIndex = (stat) => {
    let fail_rate = 0;
    fail_rate = (stat["fails"] + stat["skips"]) / stat["runs"];
    // e.g. failing 3/9 runs is .33, or idx=1
    var idx = Math.floor((fail_rate * 10) / 2);
    if (idx == icons.length) {
      // edge case: if 100% failures, then we go past the end of icons[]
      // back the idx down by 1
      console.assert(fail_rate == 1.0);
      idx -= 1;
    }

    // This error checks if there are zero runs.
    // Currently, will display stormy weather.
    if (isNaN(idx)) {
      idx = 4;
    }
    return idx;
  };

  const getWeatherIcon = (stat) => {
    const idx = getWeatherIndex(stat);
    return icons[idx];
  };

  const weatherTemplate = (data) => {
    const icon = getWeatherIcon(data);
    return (
      <div>
        <Image
          src={`${basePath}/${icon}`}
          alt="weather"
          width={32}
          height={32}
          // priority
        />
      </div>
    );
  };

  const toggleRow = (rowData) => {
    const isRowExpanded = expandedRows.includes(rowData);

    let updatedExpandedRows;
    if (isRowExpanded) {
      updatedExpandedRows = expandedRows.filter((r) => r !== rowData);
    } else {
      updatedExpandedRows = [...expandedRows, rowData];
    }

    setExpandedRows(updatedExpandedRows);
  };

  // Template for rendering the Name column as a clickable item
  const nameTemplate = (rowData) => {
    return (
      <span onClick={() => toggleRow(rowData)} style={{ cursor: "pointer" }}>
        {rowData.name}
      </span>
    );
  };

  const rowExpansionTemplate = (data) => {
    const job = jobs.find((job) => job.name === data.name);

    // Prepare run data
    const runs = [];
    for (let i = 0; i < job.runs; i++) {
      runs.push({
        run_num: job.run_nums[i],
        result: job.results[i],
        url: job.urls[i],
      });
    }

    return (
      <div
        key={`${job.name}-runs`}
        className="p-3 bg-gray-100"
        style={{ marginLeft: "4.5rem", marginTop: "-2.0rem" }}
      >
        <div>
          {runs.length > 0 ? (
            runs.map((run) => {
              const emoji =
                run.result === "Pass"
                  ? "✅"
                  : run.result === "Fail"
                  ? "❌"
                  : "⚠️";
              return (
                <span key={`${job.name}-runs-${run.run_num}`}>
                  <a href={run.url}>
                    {emoji} {run.run_num}
                  </a>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              );
            })
          ) : (
            <div>No Nightly Runs associated with this job</div>
          )}
        </div>``
      </div>
    );
  };

  const renderTable = () => (
    <DataTable
      value={rows}
      expandedRows={expandedRows}
      stripedRows
      rowExpansionTemplate={rowExpansionTemplate}
      onRowToggle={(e) => setExpandedRows(e.data)}
      loading={loading}
      emptyMessage="No results found."
    >
      <Column expander style={{ width: "5rem" }} />
      <Column
        field="name"
        header="Name"
        body={nameTemplate}
        filter
        sortable
        maxConstraints={4}
        filterHeader="Filter by Name"
        filterPlaceholder="Search..."
      />
      <Column field="required" header="Required" sortable />
      <Column field="runs" header="Runs" sortable />
      <Column field="fails" header="Fails" sortable />
      <Column field="skips" header="Skips" sortable />
      <Column
        field="weather"
        header="Weather"
        body={weatherTemplate}
        sortable
      />
    </DataTable>
  );

  return (
    <div className="text-center">
      <h1
        className={
          "text-4xl mt-4 mb-0 underline text-inherit hover:text-blue-500"
        }
      >
        <a
          href={
            "https://github.com/kata-containers/kata-containers/" +
            "actions/workflows/ci-nightly.yaml"
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Kata CI Dashboard
        </a>
      </h1>

      <main
        className={
          "m-0 h-full p-4 overflow-x-hidden overflow-y-auto bg-surface-ground font-normal text-text-color antialiased select-text"
        }
      >
        <div>{renderTable()}</div>
        <div className="mt-4 text-lg">Total Rows: {rows.length}</div>
      </main>
    </div>
  );
}

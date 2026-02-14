import "./FilterBar.css";

export type SortOption = "Latest" | "Oldest" | "Match Score" | "Salary (high)" | "Salary (low)";

export interface FilterState {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  sort: SortOption;
}

const LOCATIONS = [
  "", "Bangalore", "Hyderabad", "Mumbai", "Chennai", "Pune", "Gurgaon", "Noida",
  "Kolkata", "Ahmedabad", "Remote", "India",
];

const MODES = ["", "Remote", "Hybrid", "Onsite"];
const EXPERIENCES = ["", "Fresher", "0-1", "1-3", "3-5"];
const SOURCES = ["", "LinkedIn", "Naukri", "Indeed"];
const SORT_OPTIONS: SortOption[] = ["Latest", "Oldest", "Match Score", "Salary (high)", "Salary (low)"];

type Props = {
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
};

export default function FilterBar({ filters, onFilterChange }: Props) {
  const update = (part: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...part });
  };

  return (
    <div className="kn-filter-bar">
      <input
        type="search"
        className="kn-filter-bar__search"
        placeholder="Search title or company..."
        value={filters.keyword}
        onChange={(e) => update({ keyword: e.target.value })}
        aria-label="Search jobs"
      />
      <select
        className="kn-filter-bar__select"
        value={filters.location}
        onChange={(e) => update({ location: e.target.value })}
        aria-label="Filter by location"
      >
        <option value="">All locations</option>
        {LOCATIONS.filter(Boolean).map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <select
        className="kn-filter-bar__select"
        value={filters.mode}
        onChange={(e) => update({ mode: e.target.value })}
        aria-label="Filter by work mode"
      >
        <option value="">All modes</option>
        {MODES.filter(Boolean).map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        className="kn-filter-bar__select"
        value={filters.experience}
        onChange={(e) => update({ experience: e.target.value })}
        aria-label="Filter by experience"
      >
        <option value="">All experience</option>
        {EXPERIENCES.filter(Boolean).map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
      <select
        className="kn-filter-bar__select"
        value={filters.source}
        onChange={(e) => update({ source: e.target.value })}
        aria-label="Filter by source"
      >
        <option value="">All sources</option>
        {SOURCES.filter(Boolean).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        className="kn-filter-bar__select"
        value={filters.sort}
        onChange={(e) => update({ sort: e.target.value as SortOption })}
        aria-label="Sort by"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}

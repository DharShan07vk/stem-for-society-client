import { useState } from "react";
import { Button } from "@/components1/ui/button";
import { Input } from "@/components1/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components1/ui/select";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import { Icon } from "@iconify/react";

interface CourseFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  filterBy: string;
  sector: string;
  authorType: string;
  publicationDate: string;
  searchQuery: string;
}

const CourseFilters = ({ onFilterChange }: CourseFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    filterBy: "",
    sector: "",
    authorType: "",
    publicationDate: "",
    searchQuery: "",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      filterBy: "",
      sector: "",
      authorType: "",
      publicationDate: "",
      searchQuery: "",
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className="flex flex-wrap items-center rounded-lg gap-3 p-3 bg-white border border-gray-100 shadow-sm">
      {/* Filter Icon */}
      <div className="flex flex-row items-center justify-center h-[70px]  gap-1 rounded-lg bg-gray-50">
        <img src="src\assets\filter.png" alt="Filter Icon" className="w-auto h-auto max-w-[67.5px]"></img>
      </div>
      Filter By

      {/* Sector Dropdown */}
      <Select
        value={filters.sector}
        onValueChange={(value) => handleFilterChange("sector", value)}
      >
        <SelectTrigger className="w-[100px]  text-sm h-9 bg-white text-gray-800 font-medium border-white">
          <SelectValue placeholder="Sector" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sectors</SelectItem>
          <SelectItem value="medical">Medical</SelectItem>
          <SelectItem value="technology">Technology</SelectItem>
          <SelectItem value="science">Science</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
        </SelectContent>
      </Select>

      {/* Author Type Dropdown */}
      <Select
        value={filters.authorType}
        onValueChange={(value) => handleFilterChange("authorType", value)}
      >
        <SelectTrigger className="w-[130px] border-white  text-sm h-9 bg-white text-gray-800 font-medium">
          <SelectValue placeholder="Author type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Authors</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
          <SelectItem value="professor">Professor</SelectItem>
          <SelectItem value="industry">Industry Professional</SelectItem>
        </SelectContent>
      </Select>

      {/* Publication Date Dropdown */}
      <Select
        value={filters.publicationDate}
        onValueChange={(value) => handleFilterChange("publicationDate", value)}
      >
        <SelectTrigger className="w-[160px] border-white text-sm h-9 bg-white text-gray-800 font-medium">
          <SelectValue placeholder="Publication Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="this-week">This Week</SelectItem>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Filter Button */}
      <Button
        variant="ghost"
        className="text-[#EA0234] hover:text-red-600 hover:bg-red-50 text-sm font-medium flex items-center gap-1.5 h-9 px-3"
        onClick={handleResetFilters}
      >
        <Icon icon = "ic-replay" className="w-4 h-4 text-[#EA0234]" />
        Reset Filter
      </Button>

      {/* Search Input */}
      <div className="relative flex-1 min-w-[180px] ml-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-400 text-gray-500" />
        <Input
          type="text"
          placeholder="Search for Courses"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
          className="pl-10 pr-4 h-9 w-full rounded-3xl border-gray-200 text-sm bg-slate-100 focus:bg-white"
        />
      </div>
    </div>
  );
};

export default CourseFilters;

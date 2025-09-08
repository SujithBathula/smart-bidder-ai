import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const TenderFilters = () => {
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <Button variant="ghost" size="sm">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search keywords..."
          className="pl-10"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="it">IT & Software</SelectItem>
            <SelectItem value="consulting">Consulting</SelectItem>
            <SelectItem value="logistics">Logistics</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Budget Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Min" type="number" />
          <Input placeholder="Max" type="number" />
        </div>
      </div>

      {/* Deadline */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Deadline</label>
        <Select value={deadline} onValueChange={setDeadline}>
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Input placeholder="Enter location" />
      </div>

      {/* Apply Filters */}
      <Button variant="hero" className="w-full">
        Apply Filters
      </Button>
    </Card>
  );
};

export default TenderFilters;
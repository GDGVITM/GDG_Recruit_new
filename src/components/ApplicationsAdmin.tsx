import { useState, useEffect } from "react";
import { supabase, ApplicationFormData } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Download, Search, Filter } from "lucide-react";

export const ApplicationsAdmin = () => {
  const [applications, setApplications] = useState<ApplicationFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const { toast } = useToast();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let query = supabase.from("applications").select("*");

      // Apply filters
      if (positionFilter !== "all") {
        query = query.eq("position", positionFilter);
      }

      // Apply search
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,university.ilike.%${searchTerm}%`
        );
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) {
      toast({
        title: "No Data",
        description: "No applications to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Name",
      "Email",
      "University",
      "Year",
      "Position",
      "Skills",
      "Experience",
      "Motivation",
      "Submitted At",
    ];
    const csvData = applications.map((app) => [
      app.name,
      app.email,
      app.university,
      app.year,
      app.position,
      app.skills.replace(/,/g, ";"), // Replace commas with semicolons to avoid CSV issues
      app.experience.replace(/,/g, ";"),
      app.motivation.replace(/,/g, ";"),
      new Date(app.created_at!).toLocaleString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `gdg-applications-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: `Exported ${applications.length} applications to CSV.`,
    });
  };

  useEffect(() => {
    fetchApplications();
  }, [searchTerm, positionFilter, sortBy]);

  // Get unique positions for filter
  const uniquePositions = Array.from(
    new Set(applications.map((app) => app.position))
  );

  const filteredApplications = applications;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">GDG Applications Admin</CardTitle>
              <CardDescription>
                Manage and view all recruitment applications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchApplications} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {uniquePositions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="position">Position</SelectItem>
                <SelectItem value="university">University</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {filteredApplications.length}
                </div>
                <p className="text-sm text-gray-600">Total Applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {uniquePositions.length}
                </div>
                <p className="text-sm text-gray-600">Positions Applied</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {
                    Array.from(
                      new Set(applications.map((app) => app.university))
                    ).length
                  }
                </div>
                <p className="text-sm text-gray-600">Universities</p>
              </CardContent>
            </Card>
          </div>

          {/* Applications Table */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading applications...</span>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applications found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.name}
                      </TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.university}</TableCell>
                      <TableCell>{application.year}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {application.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(application.created_at!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Open detailed view - you can implement this as a modal or separate page
                            console.log("View details for:", application);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsAdmin;

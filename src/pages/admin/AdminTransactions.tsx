import { Badge, Input, Text } from "@mantine/core";
import { Search } from "lucide-react";
import { useState } from "react";
import Table from "../../components/Table";

export default function AdminTransactions() {
  const [search, setSearch] = useState("");
  
  const transactions = [
    {
      id: 1,
      courseName: "Web Development 101",
      paidBy: "John Doe",
      amount: "5000",
      date: "2024-12-10",
      status: "Completed",
    },
    {
      id: 2,
      courseName: "Advanced Python",
      paidBy: "Jane Smith",
      amount: "3500",
      date: "2024-12-09",
      status: "Pending",
    },
    {
      id: 3,
      courseName: "Data Science Bootcamp",
      paidBy: "Mark Lee",
      amount: "6000",
      date: "2024-12-08",
      status: "Completed",
    },
  ];

  const filteredTransactions = transactions.filter(
    (t) =>
      t.courseName.toLowerCase().includes(search.toLowerCase()) ||
      t.paidBy.toLowerCase().includes(search.toLowerCase()) ||
      t.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Transactions
            </h1>
            <Text size="sm" c="dimmed" className="text-gray-500">
              View and manage all payment transactions
            </Text>
          </div>
          <Input
            leftSection={<Search size={18} />}
            placeholder="Search transactions..."
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            radius="md"
            className="w-full sm:w-80"
            classNames={{
              input: "h-10",
            }}
          />
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <Table
            headers={[
              { render: "S.No", className: "w-[6%] text-left pl-4" },
              { render: "Course Name", className: "text-left" },
              { render: "Paid By", className: "text-left" },
              { render: "Amount", className: "text-right" },
              { render: "Date", className: "text-left" },
              { render: "Status", className: "text-center" },
            ]}
            classNames={{
              root: "bg-white",
              header: "bg-gray-50",
              body: "divide-y divide-gray-100",
              row: "hover:bg-gray-50 transition-colors",
            }}
            rows={filteredTransactions.map((transaction, i) => ({
              id: transaction.id,
              cells: [
                {
                  render: (
                    <span className="text-gray-600 font-medium">{i + 1}</span>
                  ),
                  className: "text-left pl-4",
                },
                {
                  render: (
                    <span className="font-medium text-gray-900">
                      {transaction.courseName}
                    </span>
                  ),
                  className: "text-left",
                },
                {
                  render: (
                    <span className="text-gray-700 text-sm">
                      {transaction.paidBy}
                    </span>
                  ),
                  className: "text-left",
                },
                {
                  render: (
                    <span className="font-semibold text-gray-900">
                      ₹{parseInt(transaction.amount).toLocaleString()}
                    </span>
                  ),
                  className: "text-right",
                },
                {
                  render: (
                    <span className="text-gray-600 text-sm">
                      {transaction.date}
                    </span>
                  ),
                  className: "text-left",
                },
                {
                  render: (
                    <Badge
                      color={
                        transaction.status === "Completed" ? "green" : "yellow"
                      }
                      variant="light"
                      size="sm"
                    >
                      {transaction.status}
                    </Badge>
                  ),
                  className: "text-center",
                },
              ],
            }))}
          />
        </div>
      </div>
    </div>
  );
}

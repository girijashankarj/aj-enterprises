import { useMemo } from "react";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Table, TBody, Td, Th, THead, Tr } from "../components/ui/Table";
import { useGetTasksQuery } from "../store/api/akApi";
import { Button } from "../components/ui/Button";
import { downloadCsv } from "../utils/exportCsv";

export default function AnalyticsPage() {
  const { data: tasks = [] } = useGetTasksQuery();

  const byEmployee = useMemo(() => {
    const map = new Map<string, { employeeName: string; achieved: number; target: number }>();
    for (const task of tasks) {
      const current = map.get(task.employeeName) ?? {
        employeeName: task.employeeName,
        achieved: 0,
        target: 0
      };
      current.achieved += task.achievedCount;
      current.target += task.targetCount;
      map.set(task.employeeName, current);
    }
    return Array.from(map.values()).map((item) => ({
      ...item,
      completionPct: item.target > 0 ? Math.round((item.achieved / item.target) * 100) : 0
    }));
  }, [tasks]);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Team performance and completion trends.</CardDescription>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => downloadCsv("analytics-by-employee.csv", byEmployee)}
        >
          Export CSV
        </Button>
      </div>

      <Table aria-label="Analytics by employee" wrapClassName="mt-6">
        <THead>
          <Tr>
            <Th>Employee</Th>
            <Th className="text-right">Achieved</Th>
            <Th className="text-right">Target</Th>
            <Th className="text-right">Completion %</Th>
          </Tr>
        </THead>
        <TBody>
          {byEmployee.map((row) => (
            <Tr key={row.employeeName}>
              <Td className="font-medium">{row.employeeName}</Td>
              <Td className="text-right tabular-nums">{row.achieved}</Td>
              <Td className="text-right tabular-nums">{row.target}</Td>
              <Td className="text-right tabular-nums">{row.completionPct}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}

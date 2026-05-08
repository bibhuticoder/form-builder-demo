import { useEffect, useState } from "react"
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, Slider, Checkbox, Input } from "@/components"
import { cn } from "@/lib/utils"
import { SPLIT_TEST_MAX_BRANCHES, SPLIT_TEST_MIN_BRANCHES } from "../../../constants"

interface SplitTestData {
  id?: string;
  weights?: number[];
  winnerCriteria?: string;
  testType?: string;
  notifyMe?: boolean;
  durationVal?: number | string;
  durationUnit?: string;
  contactCount?: number | string;
  strategy?: string;
}

const normalizeWeights = (weights: number[]) => {
  if (weights.length === 0) return weights;
  const normalized = weights.map((w) => (Number.isFinite(w) ? w : 0));
  const sum = normalized.reduce((total, value) => total + value, 0);
  const delta = 100 - sum;
  if (Math.abs(delta) > 1e-6) {
    normalized[normalized.length - 1] += delta;
  }
  return normalized;
};

const areWeightsEqual = (a: number[], b: number[]) => a.length === b.length && a.every((value, index) => value === b[index]);

export const SplitTestConfig = ({ data, onChange, edges, node }: { data: SplitTestData, onChange: (d: any) => void, node: any, edges: any[] }) => {
  const nodeId = node?.id || data.id;
  const siblings = edges.filter(e => e.source === nodeId && e.sourceHandle !== 'right-source' && !e.data?.isLoopBack);
  const weightsLength = Array.isArray(data.weights) ? data.weights.length : 0;
  const count = Math.max(SPLIT_TEST_MIN_BRANCHES, siblings.length, weightsLength);
  const canAddBranch = count < SPLIT_TEST_MAX_BRANCHES;

  // Sync state with parent data
  const [activeWeights, setActiveWeights] = useState<number[]>(Array.isArray(data.weights) ? normalizeWeights(data.weights) : []);
  const [testType, setTestType] = useState(data.testType || 'duration');
  const [isLinked, setIsLinked] = useState(data.strategy === 'even');

  // Initialize weights if missing or count changed
  useEffect(() => {
    if (!Array.isArray(data.weights) || data.weights.length !== count) {
      const evenValue = Math.floor(100 / count);
      const newWeights = normalizeWeights(Array(count).fill(evenValue));
      onChange({ ...data, weights: newWeights, strategy: data.strategy || 'even' });
      setActiveWeights(newWeights);
    } else {
      // Just sync local state if weights change from outside
      const normalized = normalizeWeights(data.weights);
      if (!areWeightsEqual(normalized, data.weights)) {
        onChange({ ...data, weights: normalized, strategy: data.strategy || 'even' });
      }
      setActiveWeights(normalized);
    }
  }, [count, data.weights, data.strategy]);

  const addBranch = () => {
    if (!canAddBranch) return;
    const nextCount = count + 1;
    const evenValue = Math.floor(100 / nextCount);
    const newWeights = normalizeWeights(Array(nextCount).fill(evenValue));
    onChange({ ...data, weights: newWeights, strategy: 'even' });
    setActiveWeights(newWeights);
    setIsLinked(true);
  };

  const updateWeight = (idx: number, val: number) => {
    // Clamp value between 0 and 100
    val = Math.max(0, Math.min(100, val));
    const currentWeights = [...activeWeights];
    const oldVal = currentWeights[idx];
    if (val === oldVal) return;

    const diff = val - oldVal;
    currentWeights[idx] = val;

    // Distribute diff among others proportionally
    const otherIndices = currentWeights.map((_, i) => i).filter(i => i !== idx);
    const otherTotal = otherIndices.reduce((sum, i) => sum + (activeWeights[i] || 0), 0);

    if (otherTotal === 0) {
      if (diff < 0) {
        const split = Math.abs(diff) / otherIndices.length;
        otherIndices.forEach(i => currentWeights[i] += split);
      }
    } else {
      let remainingDiff = diff;
      otherIndices.forEach((i, oIdx) => {
        const ratio = (activeWeights[i] || 0) / otherTotal;
        if (oIdx === otherIndices.length - 1) {
          currentWeights[i] -= remainingDiff;
        } else {
          const share = Math.round(diff * ratio);
          currentWeights[i] -= share;
          remainingDiff -= share;
        }
        if (currentWeights[i] < 0) currentWeights[i] = 0;
      });
    }

    const normalized = normalizeWeights(currentWeights);

    onChange({ ...data, weights: normalized, strategy: 'weighted' });
    setActiveWeights(normalized);
    setIsLinked(false);
  };

  const resetToEven = () => {
    const evenValue = Math.floor(100 / count);
    const newWeights = normalizeWeights(Array(count).fill(evenValue));
    onChange({ ...data, weights: newWeights, strategy: 'even' });
    setActiveWeights(newWeights);
    setIsLinked(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> It's recommended to test different email subjects and open rates in your first tests before adjusting body content and conversions or clicks.
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          Adjust the traffic split for your {count} branches. Total must equal 100%.
        </p>
      </div>

      <div className="flex items-center justify-between pr-0.5">
        <div className="text-[11px] font-semibold text-slate-500">
          Branches: {count} / {SPLIT_TEST_MAX_BRANCHES}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addBranch}
          className="text-sm"
          disabled={!canAddBranch}
        >
          Add Branch
        </Button>
      </div>

      <div className="flex justify-end pr-0.5">
        <Button
          variant={isLinked ? "primary" : "outline"}
          size="sm"
          onClick={resetToEven}
          className="text-sm"
        >
          {isLinked ? "Distribute Evenly" : "Unlinked (Custom)"}
        </Button>
      </div>

      <div className="space-y-2">
        {activeWeights.map((weight, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-center pr-0.5">
              <Label className="font-medium text-slate-700 dark:text-slate-200">
                Branch {String.fromCharCode(65 + i)}
              </Label>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                <input
                  className="w-10 text-[13px] font-bold text-primary text-center bg-transparent border-none focus:outline-none"
                  value={String(weight)}
                  onChange={e => updateWeight(i, parseFloat(e.target.value) || 0)}
                />
                <span className="text-[12px] font-bold text-slate-400">%</span>
              </div>
            </div>

            <Slider
              value={weight}
              max={100}
              step={0.01}
              onValueChange={(val) => updateWeight(i, val)}
              className="py-1"
            />
          </div>
        ))}
      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 mx-1" />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Winning Criteria</Label>
          <Select
            value={data.winnerCriteria || 'manual'}
            onValueChange={v => onChange({ ...data, winnerCriteria: v })}
          >
            <SelectTrigger className="h-9 shadow-sm">
              <SelectValue placeholder="Select criteria...">
                {{
                  manual: 'Manually Select Winner',
                  opens: 'Highest Open Rate',
                  clicks: 'Highest Click Rate',
                  conversions: 'Highest Conversion Rate'
                }[data.winnerCriteria || 'manual']}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manually Select Winner</SelectItem>
              <SelectItem value="opens">Highest Open Rate</SelectItem>
              <SelectItem value="clicks">Highest Click Rate</SelectItem>
              <SelectItem value="conversions">Highest Conversion Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="notifyMe"
            checked={data.notifyMe}
            onCheckedChange={(c) => onChange({ ...data, notifyMe: !!c })}
            label="Notify me when a winner is chosen"
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label>Test Settings</Label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => { setTestType('duration'); onChange({ ...data, testType: 'duration' }) }}
                className={cn("px-3 py-1 text-[10px] font-bold rounded transition-all", testType === 'duration' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                Test Duration
              </button>
              <button
                onClick={() => { setTestType('contacts'); onChange({ ...data, testType: 'contacts' }) }}
                className={cn("px-3 py-1 text-[10px] font-bold rounded transition-all", testType === 'contacts' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400 hover:text-slate-600")}
              >
                Contact Count
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
            {testType === 'duration' ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={String(data.durationVal || 4)}
                  onChange={(e) => onChange({ ...data, durationVal: e.target.value })}
                  className="w-20"
                />
                <Select value={data.durationUnit || 'hours'} onValueChange={v => onChange({ ...data, durationUnit: v })}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select unit">
                      {['hours', 'days', 'months'].find(u => u === (data.durationUnit || 'hours'))}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Run test for the first:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 1000"
                    value={String(data.contactCount || '')}
                    onChange={(e) => onChange({ ...data, contactCount: e.target.value })}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">Contacts</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

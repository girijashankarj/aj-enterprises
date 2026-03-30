import { useTranslation } from "react-i18next";
import { Card, CardDescription, CardTitle } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setOrgDefaults,
  setUserDashboardRange,
  setUserLanguage,
  setUserTableDensity,
  type DashboardRange,
  type SupportedLanguage,
  type TableDensity
} from "../store/slices/preferencesSlice";

export default function SettingsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.auth.role);
  const orgDefaults = useAppSelector((s) => s.preferences.orgDefaults);
  const userOverrides = useAppSelector((s) => s.preferences.userOverrides);

  const effectiveLanguage = userOverrides.language ?? orgDefaults.language;
  const effectiveRange = userOverrides.dashboardRange ?? orgDefaults.dashboardRange;
  const effectiveDensity = userOverrides.tableDensity ?? orgDefaults.tableDensity;

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>{t("settings.title")}</CardTitle>
        <CardDescription>{t("settings.description")}</CardDescription>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-sm">
            Language
            <Select
              className="mt-1"
              value={effectiveLanguage}
              onChange={(e) => dispatch(setUserLanguage(e.target.value as SupportedLanguage))}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </Select>
          </label>
          <label className="text-sm">
            Dashboard Range
            <Select
              className="mt-1"
              value={effectiveRange}
              onChange={(e) => dispatch(setUserDashboardRange(e.target.value as DashboardRange))}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </Select>
          </label>
          <label className="text-sm">
            Table Density
            <Select
              className="mt-1"
              value={effectiveDensity}
              onChange={(e) => dispatch(setUserTableDensity(e.target.value as TableDensity))}
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
            </Select>
          </label>
        </div>
      </Card>

      {role === "ADMIN" ? (
        <Card>
          <CardTitle>{t("settings.orgDefaults")}</CardTitle>
          <CardDescription>Admin defaults for all users unless they override locally.</CardDescription>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="text-sm">
              Language
              <Select
                className="mt-1"
                value={orgDefaults.language}
                onChange={(e) =>
                  dispatch(setOrgDefaults({ ...orgDefaults, language: e.target.value as SupportedLanguage }))
                }
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </Select>
            </label>
            <label className="text-sm">
              Dashboard Range
              <Select
                className="mt-1"
                value={orgDefaults.dashboardRange}
                onChange={(e) =>
                  dispatch(setOrgDefaults({ ...orgDefaults, dashboardRange: e.target.value as DashboardRange }))
                }
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </Select>
            </label>
            <label className="text-sm">
              Table Density
              <Select
                className="mt-1"
                value={orgDefaults.tableDensity}
                onChange={(e) =>
                  dispatch(setOrgDefaults({ ...orgDefaults, tableDensity: e.target.value as TableDensity }))
                }
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
              </Select>
            </label>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

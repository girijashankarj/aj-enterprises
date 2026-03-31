import { Component, type ErrorInfo, type ReactNode } from "react";
import { publicAsset } from "../utils/publicAsset";

type Props = { children: ReactNode };

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary:", error.message, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
          <div className="mx-auto flex max-w-lg flex-col gap-4 p-8">
            <img
              src={publicAsset("/branding/ak-mark.svg")}
              width={48}
              height={48}
              alt=""
              className="h-12 w-12"
            />
            <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="text-slate-600 dark:text-slate-300">
              The app hit an unexpected error. Try reloading the page.
            </p>
            {import.meta.env.DEV ? (
              <pre className="max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-700 dark:bg-slate-900">
                {this.state.error.message}
              </pre>
            ) : null}
            <button
              type="button"
              className="self-start rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
